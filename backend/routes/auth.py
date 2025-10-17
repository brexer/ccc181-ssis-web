from flask import Blueprint, jsonify, request
from database_client import get_connection
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

auth_bp = Blueprint("auth", __name__)
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")

        if not all([username, password, email]):
            return jsonify({"error": "All fields required"}), 400

        if len(password) < 6:
            return jsonify({"error": "Password must be 6+ characters"}), 400

        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT 1 FROM users WHERE username = %s", (username,))
                if cursor.fetchone():
                    return jsonify({"error": "Username exists"}), 400

                cursor.execute("SELECT 1 FROM users WHERE email = %s", (email,))
                if cursor.fetchone():
                    return jsonify({"error": "Email exists"}), 400

                hashed = generate_password_hash(password)

                cursor.execute(
                    """INSERT INTO users (username, password, email, created_at)
                       VALUES (%s, %s, %s, NOW())
                       RETURNING id, username, email""",
                    (username, hashed, email)
                )
                user = cursor.fetchone()
            conn.commit()

        return jsonify({"message": "Registered", "user": user}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# login
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        if not all([username, password]):
            return jsonify({"error": "Username and password required"}), 400

        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    "SELECT id, username, password, email FROM users WHERE username = %s",
                    (username,)
                )
                user = cursor.fetchone()

        if not user or not check_password_hash(user['password'], password):
            return jsonify({"error": "Invalid credentials"}), 401

        # create JWT token that epxires in 24 hours
        token = jwt.encode({
            'user_id': user['id'],
            'username': user['username'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user['id'],
                "username": user['username'],
                "email": user['email']
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# token verifier
@auth_bp.route("/verify", methods=["POST"])
def verify_token():
    try:
        auth_header = request.headers.get('Authorization', '')
        token = auth_header.replace('Bearer ', '')

        if not token:
            return jsonify({"error": "Token missing"}), 401

        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return jsonify({"valid": True, "user_id": decoded['user_id']}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

def token_required(f):
    from functools import wraps
    
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        token = auth_header.replace('Bearer ', '')

        if not token:
            return jsonify({"error": "Token missing"}), 401

        try:
            decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            request.user_id = decoded['user_id']
            request.username = decoded['username']
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)
    
    return decorated