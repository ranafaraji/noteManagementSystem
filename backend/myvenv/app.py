from flask import Flask, jsonify, request, redirect, url_for, flash, render_template, session
from flask_cors import CORS
from flask_mail import Mail, Message
import sqlite3
import random
import string
import os

app = Flask(__name__)
SECRET_KEY = os.urandom(24)
CORS(app, supports_credentials=True)  # Set supports_credentials to True
app.secret_key = SECRET_KEY
db_path = 'my_database.db'  # Change this path if you want the database file in a different location


# Create Email Templates:
# Design email templates for the reset password
#     email and any related messages. You can use HTML
# templates to make the emails more visually appealing.

# Configure Flask-Mail:
# To send emails, you'll need to configure Flask-Mail with your
# email provider's SMTP settings.

app.config['MAIL_SERVER'] = 'smtp-mail.outlook.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'fyp_test2023@outlook.com'
app.config['MAIL_PASSWORD'] = '123/56-PO89'

mail = Mail(app)



# Function to create the SQLite database table
def create_table():
    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                username TEXT NOT NULL,
                password TEXT NOT NULL
            )
             ''')
        cursor.execute(''' CREATE TABLE IF NOT EXISTS notes(
                notesid INTEGER PRIMARY KEY AUTOINCREMENT,
                notes   TEXT, 
                notestist INTEGER, username TEXT NOT NULL,
                FOREIGN KEY(notestist) REFERENCES users(id)
            )
         ''')
        conn.commit()


create_table()  # Call the function to create the table when the app starts


def generate_reset_token(length=32):
    characters = string.ascii_letters + string.digits
    generated_token = ''.join(random.choice(characters) for _ in range(length))
    return generated_token


# Endpoint for user registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('mail')
    password = data.get('pass')
    if not username or not password:
        return jsonify({'error': 'Invalid data'}), 400

    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()

        # Check if the username already exists in the database
        cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({'error': 'EMAIL ALREADY EXIST'}), 409
        else:
            # Insert the new user into the database
            cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        conn.commit()

    return jsonify({'message': 'User registered successfully'}), 201


# Endpoint for user authentication (login)
@app.route('/auth', methods=['GET', 'POST'])
def login():
    data = request.get_json()
    username = data.get('user')
    password = data.get('pwd')
    if not username or not password:
        return jsonify({'error': 'Missing Username or Password'}), 400

    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        # Check if the username and password match a user in the database
        cursor.execute("SELECT id FROM users WHERE username = ? AND password = ?", (username, password))
        authenticated_user = cursor.fetchone()
        session['loggedin'] = True
        session['user_name'] = username
        session['email'] = username
        if not authenticated_user:
            return jsonify({'error': 'Unauthorized'}), 401

    return jsonify({'message': 'Login Successful'}, {'username': session['user_name']}), 200


@app.route('/get_username', methods=['GET'])
def get_username():
    username = session['user_name']
    return jsonify({'username': username})


# Endpoint for reset passssword
@app.route('/ResetPassword', methods=['POST'])
def ResetPassword():
    data = request.get_json()
    username = data.get('mail')
    password = data.get('pass')
    if not username or not password:
        return jsonify({'error': 'Invalid data'}), 400

    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        update_query = "UPDATE users set password = ? WHERE username = ?"
        cursor.execute(update_query, (password, username))
        conn.commit()

    return jsonify({'message': 'Password Successfully reset'}), 201


@app.route('/Get_Token', methods=['GET'])
def generate_reset_token(length=32):
    characters = string.ascii_letters + string.digits
    generated_token = ''.join(random.choice(characters) for _ in range(length))
    return generated_token


@app.route('/Create_Notes', methods=['POST'])
def Create_Notes():
    data = request.get_json()
    username = data.get('email')
    notes = data.get('notes')
    if not username:
        return jsonify({'error': 'Users Does Not Exist'}), 400

    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        # update_query = "INSERT INTO notes (notes, username) VALUES (?, ?)"
        update_query = "INSERT INTO notes (notes, username) VALUES ( ?, (SELECT id from users  WHERE username=?));"
        cursor.execute(update_query, (notes, username))
        conn.commit()

    return jsonify({'message': 'Notes Saved Successfully'}), 201


# updating notes

@app.route('/UpdateNotes', methods=['POST'])
def update_notes():
    data = request.get_json()
    # username = data.get('email')
    notes = data.get('notes')
    notesid = data.get('notes_id')
    if not notesid:
        return jsonify({'error': 'notes Does Not Exist'}), 400

    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        update_query = "UPDATE notes set notes = ? WHERE notesid = ?"
        cursor.execute(update_query, (notes, notesid))
        conn.commit()

    return jsonify({'message': 'Notes Saved Successfully'}), 201


# delete notes
@app.route('/DeleteNotes', methods=['POST'])
def delete_notes():
    data = request.get_json()
    # username = data.get('email')
    notesid = data.get('notes_id')
    if not notesid:
        return jsonify({'error': 'notes Does Not Exist'}), 400

    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        update_query = "DELETE from notes WHERE notesid = ?"
        cursor.execute(update_query, notesid)
        conn.commit()

    return jsonify({'message': 'Notes Delete Successfully'}), 201


# Delete notes content
@app.route('/DeleteNotesContent', methods=['DELETE'])
def delete_notes_content():
    notes = request.json.get('notes')
    if not notes:
        return jsonify({'error': 'notes Does Not Exist'}), 400
    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        delete_note_query = "DELETE from notes WHERE notes = ?"
        cursor.execute(delete_note_query, (notes,))
        conn.commit()

    return jsonify({'message': 'Notes Delete Successfully'}), 201


# generating random password
def generate_new_password(length=12):
    characters = string.ascii_letters + string.digits + string.punctuation
    new_password = ''.join(random.choice(characters) for _ in range(length))
    # send_reset_email(email, reset_token)
    return new_password


@app.route('/ForgotPass', methods=['POST'])
def forgot_password():
    data = request.get_json()
    username = data.get('mail')
    new_password = generate_new_password()
    with sqlite3.connect(db_path) as conn:  # Connect to the database
        cursor = conn.cursor()
        # Check if the username (email) exists in the database
        cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
        existing_user = cursor.fetchone()

        if existing_user:
            with sqlite3.connect(db_path) as connn:
                cursor = connn.cursor()
                update_query = "UPDATE users set password = ? WHERE username = ?"
                cursor.execute(update_query, (new_password, username))
                connn.commit()
                send_reset_email()
            return jsonify({'message': 'Your random Password Generated and sent to your email.'}), 200
        else:
            return jsonify({'message': 'Email not registered. Please enter valid email.'}), 404


#  Query to get data from a table, username input and return anything in database
@app.route('/get_Notes', methods=['GET'])
def get_Notes():
    data = request.get_json()
    username = data.get('email')
    if not username:
        return jsonify({'error': 'Users Does Not Exist'}), 400

    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        #    "INSERT INTO notes (notes, username) VALUES ( ?, (SELECT id from users  WHERE username=?));"
        get_query = "SELECT notes, notesid FROM notes WHERE username = (SELECT id FROM users WHERE username = ?);"
        cursor.execute(get_query, (username,))
        all_notes = cursor.fetchall()
        conn.commit()
        # notes_list = [{'notes': note[0]} for note in all_notes]
        return jsonify(all_notes)


# Create a Route for Requesting Password Reset:
# Create a route where users can request a password reset by providing
# their email address.
# This route will generate a reset token and send a reset password email.
@app.route('/reset-password', methods=['GET', 'POST'])
def reset_password_request():
    if request.method == 'POST':
        email = request.form.get('email')

        # Check if email exists in the database
        # Generate a reset token and save it in the database

        # Send reset password email
        reset_token = generate_reset_token()
        # Send the reset token to the user's email address using a library like Flask-Mail

        flash('An email with instructions to reset your password has been sent.')
        return redirect(url_for('login'))

    return render_template('reset_password_request.html')


# Create a Route for Password Reset Link:
# When users receive the reset password email, they'll click a link that contains
# the reset token.
# Create a route to handle this link and allow users to reset their passwords.
@app.route('/reset-password/<reset_token>', methods=['GET', 'POST'])
def reset_password(reset_token):
    if request.method == 'POST':
        new_password = request.form.get('new_password')
        confirm_password = request.form.get('confirm_password')

        if new_password == confirm_password:
            # Update the user's password in the database
            # Delete or invalidate the reset token

            flash('Your password has been reset successfully.')
            return redirect(url_for('login'))
        else:
            flash('Passwords do not match.')

    # Check if the reset token is valid
    # Retrieve user information based on the reset token from the database

    return render_template('reset_password.html', reset_token=reset_token)


# Send Reset Password Email:
# When generating the reset token, you'll also send an email to the user
# with the reset instructions. You'll need to craft
# and send the email using Flask-Mail.

@app.route('/sentEmail', methods=['POST'])
def send_reset_email():
    data = request.get_json()
    user_email = data.get('mail')
    with sqlite3.connect(db_path) as conn:  # Connect to the database
        cursor = conn.cursor()
        # Check if the username (email) exists in the database
        cursor.execute("SELECT password FROM users WHERE username = ?", (user_email,))
        existing_password = cursor.fetchone()
        new_password = existing_password
    reset_token = generate_reset_token(length=32)
    subject = 'Password Reset Request'
    sender = 'fyp_test2023@outlook.com'
    recipients = [user_email]
    reset_link = url_for('reset_password', reset_token=reset_token, _external=True)
    body = f'Click the following link to reset your password: {reset_link}, your new password: {new_password}'
    message = Message(subject=subject, sender=sender, recipients=recipients)
    message.body = body
    mail.send(message)
    return jsonify({'message': ' successfully sent email'}), 201


# @app.route('/logout')
# def logout():
#     session.pop('username',None)
#     return jsonify({'message': ' successfully logout'}), 201


if __name__ == '__main__':
    app.run(debug=True)