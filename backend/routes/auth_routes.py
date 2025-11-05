# backend/routes/auth_routes.py
import cloudinary
import cloudinary.uploader
from flask import Blueprint, request, jsonify, current_app
from extensions import db
from models import Student
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from flask_cors import cross_origin
import os

auth_bp = Blueprint('auth', __name__)

# --- LOGIN ROUTE (Unchanged) ---
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
            "user": {"id": student.id, "name": student.name, "email": student.email}
        })
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

# --- ✅ NEW: SIGNUP ROUTE ---
@auth_bp.route('/signup', methods=['POST'])
@cross_origin()
def signup():
    # This is not JSON data, it's 'multipart/form-data'
    # Access form fields using request.form
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')
    roll_no = request.form.get('roll_no')
    mobile_no = request.form.get('mobile_no')
    
    # 1. --- Validation ---
    if not all([name, email, password, roll_no]):
        return jsonify({"success": False, "message": "Missing required fields."}), 400
    
    # 2. --- Email Domain Validation ---
    if not email.endswith('@rtu.ac.in'):
        return jsonify({"success": False, "message": "Only @rtu.ac.in emails are allowed."}), 400

    # 3. --- Check for existing user ---
    if Student.query.filter_by(email=email).first() or Student.query.filter_by(roll_no=roll_no).first():
        return jsonify({"success": False, "message": "Email or Roll No. already exists."}), 400

    # 4. --- File Handling ---
    # --- ADD THIS NEW CODE ---
    if 'student_id_pic' not in request.files:
        return jsonify({"success": False, "message": "Student ID picture is required."}), 400

    file_to_upload = request.files['student_id_pic']

    # Upload the file to Cloudinary
    try:
        upload_result = cloudinary.uploader.upload(file_to_upload)
    except Exception as e:
        # Handle potential upload errors
        return jsonify({"success": False, "message": f"Error uploading file: {str(e)}"}), 500

    # Get the secure URL from the upload result
    file_url = upload_result.get('secure_url')

    if not file_url:
        return jsonify({"success": False, "message": "Error getting file URL from Cloudinary."}), 500
# --- END OF NEW CODE ---

    # 5. --- Create New Student ---
    hashed_password = generate_password_hash(password)
    
    new_student = Student(
        name=name,
        email=email,
        password=hashed_password,
        roll_no=roll_no,
        mobile_no=mobile_no,
        student_id_pic_url=file_url  # Store just the filename
    )
    
    try:
        db.session.add(new_student)
        db.session.commit()
        return jsonify({"success": True, "message": "Account created successfully!"}), 201
    except Exception as e:
        # If DB commit fails, try to delete the orphaned file
        if os.path.exists(save_path):
            os.remove(save_path)
        return jsonify({"success": False, "message": f"Database error: {str(e)}"}), 500