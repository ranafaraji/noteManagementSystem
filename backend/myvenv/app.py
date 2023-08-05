from flask import Flask, jsonify, request, redirect, url_for, flash,render_template
from flask_cors import CORS
from flask_mail import Mail, Message
import sqlite3
import hashlib
import random
import string
import os

app = Flask(__name__)
SECRET_KEY = os.urandom(24)
CORS(app, supports_credentials=True)  # Set supports_credentials to True

db_path = 'my_database.db'  # Change this path if you want the database file in a different location

def generate_reset_token(length=32):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))


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
def send_reset_email(user_email, reset_token):
    subject = 'Password Reset Request'
    sender = 'fyp_test2023@outlook.com'
    recipients = [user_email]
    
    reset_link = url_for('reset_password', reset_token=reset_token, _external=True)
    body = f'Click the following link to reset your password: {reset_link}'
    
    message = Message(subject=subject, sender=sender, recipients=recipients)
    message.body = body
    
    mail.send(message)
# send_reset_email(email, reset_token)
    return jsonify({'message': ' successfully sent email'}), 201
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
        conn.commit()

create_table()  # Call the function to create the table when the app starts

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

# @app.route('/check_user/<email>', methods=['GET'])
# def check_user(email):
#     with sqlite3.connect(db_path) as conn:
#         cursor = conn.cursor()
#         cursor = conn.execute("SELECT id FROM users WHERE username = ?", (email,))
#         user = cursor.fetchone()
#         if user:
#             return jsonify({"exists": True})
#         else:
#             return jsonify({"exists": False})
        

# Endpoint for user authentication (login)
@app.route('/auth', methods=['POST'])
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
        if not authenticated_user:
            return jsonify({'error': 'Unauthorized'}), 401

    return jsonify({'message': 'Login Successful'}), 200





# Function to generate a random string for the password reset token
def generate_token():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=30))

# Route to request password reset
# @app.route('/request_reset', methods=['GET', 'POST'])
# def request_reset():
#     if request.method == 'POST':
#         email = request.form['email']  # You can use the email to identify the user in the database
#         token = generate_token()
#         # Save the token in the database associated with the user's email
#         # Here, you can update the 'users' table to store the token for a user
#         # Example: con.execute("UPDATE users SET reset_token = ? WHERE email = ?", (token, email))
#         # Send the reset token to the user's email (you'll need to implement this part)

#     return render_template('request_reset.html')



# # Route to reset password with the token
# @app.route('/ForgotPass/<token>', methods=['GET', 'POST'])
# def ForgotPass(token):
#     if request.method == 'POST':
#         password = request.form['password']
#         # Verify the token and user's email from the database
#         # Here, you need to fetch the user by the token and check if the token is valid and hasn't expired
#         # If the token is valid, update the user's password in the database with the new password

#     return render_template('reset_password.html')

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
        update_query="UPDATE users set password = ? WHERE username = ?"
        cursor.execute(update_query,(password, username))
        conn.commit()        

    return jsonify({'message': 'Password Successfuly reset'}), 201


#forgot pass

@app.route('/ForgotPass', methods=['POST'])
def generate_new_password(length=12):
    characters = string.ascii_letters + string.digits + string.punctuation
    new_password = ''.join(random.choice(characters) for _ in range(length))
    # send_reset_email(email, reset_token)
    return new_password

# def forgot_password():
#     data = request.get_json()
#     username = data.get('mail')
#     new_password = generate_new_password()
    
#     with sqlite3.connect(db_path) as conn:  # Connect to the database
#         cursor = conn.cursor()

#         # Check if the username (email) exists in the database
#         cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
#         existing_user = cursor.fetchone()

#         if existing_user:
#             cursor.execute("UPDATE users SET password = ? WHERE username = ?", (new_password, username))
#             conn.commit()
#             return jsonify({'message': 'Password reset allowed.'}), 200
#         else:
#             return jsonify({'message': 'Email not registered. Please enter another email.'}), 404


# Add more routes and functionalities as needed

if __name__ == '__main__':
    app.run(debug=True)
