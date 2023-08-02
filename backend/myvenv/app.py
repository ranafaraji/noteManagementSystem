from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Set supports_credentials to True

db_path = 'my_database.db'  # Change this path if you want the database file in a different location

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
            return jsonify({'error': 'Username Taken'}), 409

        # Insert the new user into the database
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        conn.commit()

    return jsonify({'message': 'User registered successfully'}), 201

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

# Add more routes and functionalities as needed

if __name__ == '__main__':
    app.run(debug=True)
