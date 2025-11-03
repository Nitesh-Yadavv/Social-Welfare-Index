from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

# Dummy credentials (replace with DB later)
USERS = [
    {"email": "student@example.com", "password": "12345"},
    {"email": "nitesh@example.com", "password": "abcde"},
]

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    for user in USERS:
        if email == user["email"] and password == user["password"]:
            return jsonify({"message": "Login successful", "status": "success"}), 200

    return jsonify({"message": "Invalid credentials", "status": "error"}), 401