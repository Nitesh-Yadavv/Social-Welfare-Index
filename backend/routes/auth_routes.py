from flask import Blueprint, request, jsonify
from extensions import db
from models import Student
from werkzeug.security import check_password_hash
from flask_cors import cross_origin

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
@cross_origin()
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    student = Student.query.filter_by(email=email).first()
    if student and check_password_hash(student.password, password):
        return jsonify({
            "success": True,
            # ✅ FIX: Include ID and necessary user data
            "user": {"id": student.id, "name": student.name, "email": student.email}
        })
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401