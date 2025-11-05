from flask import Blueprint, request, jsonify, current_app
from extensions import db
from models import Activity, Student # ✅ NEW: Import Student
from werkzeug.utils import secure_filename
from flask_cors import cross_origin
import os
from sqlalchemy import func

activity_bp = Blueprint('activity', __name__)

# ✅ NEW: Route to GET all activities for the logged-in student
@activity_bp.route('/activities', methods=['GET'])
@cross_origin()
def get_activities():
    # Get student_id from query param
    student_id = request.args.get('student_id')
    if not student_id:
        return jsonify({"success": False, "message": "Student ID is required."}), 400

    student = Student.query.get(student_id)
    if not student:
        return jsonify({"success": False, "message": "Student not found."}), 404

    activities = student.activities
    
    # Convert activity objects to dictionaries
    output = []
    for activity in activities:
        output.append({
            "id": activity.id,
            "name": activity.name,
            "category": activity.category,
            "status": activity.status,
            "points": activity.points,
            "date": activity.date.strftime('%Y-%m-%d') # Format the date
        })

    return jsonify({"success": True, "activities": output})


# ✅ NEW: Route to ADD a new activity
@activity_bp.route('/activities/add', methods=['POST'])
@cross_origin()
def add_activity():
    # --- 1. Get Data ---
    # Data comes as multipart/form-data
    student_id = request.form.get('student_id')
    name = request.form.get('name')
    category = request.form.get('category')

    # --- 2. Validation ---
    if not all([student_id, name, category]):
        return jsonify({"success": False, "message": "Missing required fields."}), 400

    if 'proof' not in request.files:
        return jsonify({"success": False, "message": "Proof file is required."}), 400

    file = request.files['proof']
    if file.filename == '':
        return jsonify({"success": False, "message": "No selected file."}), 400

    # --- 3. Save File ---
    filename = ""
    if file:
        # Create a unique filename to avoid overwrites
        # e.g., "1_Social_Volunteering.pdf"
        filename = secure_filename(f"{student_id}_{category}_{file.filename}")
        save_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        
        try:
            file.save(save_path)
        except Exception as e:
            return jsonify({"success": False, "message": f"Error saving file: {str(e)}"}), 500

    # --- 4. Create DB Entry ---
    new_activity = Activity(
        name=name,
        category=category,
        student_id=student_id,
        proof_url=filename, # Save the filename
        status="Pending",  # Auto-set status
        points=0           # Default points to 0, admin can update later
    )

    try:
        db.session.add(new_activity)
        db.session.commit()
        
        # Return the new activity object
        return jsonify({
            "success": True, 
            "message": "Activity submitted for approval!",
            "activity": {
                "id": new_activity.id,
                "name": new_activity.name,
                "category": new_activity.category,
                "status": new_activity.status,
                "points": new_activity.points,
                "date": new_activity.date.strftime('%Y-%m-%d')
            }
        }), 201

    except Exception as e:
        # If DB commit fails, delete the orphaned file
        if os.path.exists(save_path):
            os.remove(save_path)
        return jsonify({"success": False, "message": f"Database error: {str(e)}"}), 500
    
@activity_bp.route('/dashboard-stats', methods=['GET'])
@cross_origin()
def get_dashboard_stats():
    student_id = request.args.get('student_id')
    if not student_id:
        return jsonify({"success": False, "message": "Student ID is required."}), 400

    student = Student.query.get(student_id)
    if not student:
        return jsonify({"success": False, "message": "Student not found."}), 404

    # 1. Calculate Points
    total_points = db.session.query(func.sum(Activity.points)).filter_by(
        student_id=student_id, 
        status='Completed'
    ).scalar() or 0
    
    social_points = db.session.query(func.sum(Activity.points)).filter_by(
        student_id=student_id, 
        status='Completed', 
        category='social'
    ).scalar() or 0

    # 2. Calculate Activity Counts
    total_activities = Activity.query.filter_by(student_id=student_id).count()
    social_activities = Activity.query.filter_by(
        student_id=student_id, 
        category='social'
    ).count()

    # 3. Calculate Ranking
    # This query gets a list of (student_id, total_points) for all students,
    # ordered from highest to lowest points.
    all_student_points = db.session.query(
        Student.id,
        func.sum(Activity.points).label('total_points')
    ).join(Activity, Student.activities).filter(
        Activity.status == 'Completed'
    ).group_by(
        Student.id
    ).order_by(
        func.sum(Activity.points).desc()
    ).all()

    ranking = 0
    for i, (id, points) in enumerate(all_student_points):
        # We cast student_id to int because it comes from a URL param
        if id == int(student_id):
            ranking = i + 1 # Rank is 1-based index
            break
            
    # If student has 0 points, they might not be in the list, so they are unranked
    if ranking == 0 and total_points == 0:
        total_students = Student.query.count()
        ranking = total_students # Or set to "N/A"

    return jsonify({
        "success": True,
        "stats": {
            "total_points": total_points,
            "social_points": social_points,
            "total_activities": total_activities,
            "social_activities": social_activities,
            "ranking": ranking
        }
    })