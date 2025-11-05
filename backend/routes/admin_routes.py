from flask import Blueprint, request, jsonify
from extensions import db
from models import Admin, Activity, Student
from flask_cors import cross_origin

admin_bp = Blueprint('admin', __name__)

# --- 1. Your Automatic Point System ---
POINT_MAP = {
    "social": 10,
    "technical": 8,
    "cultural": 5,
    "sports": 5,
    "ncc": 12
}

# --- 2. Admin Login Route ---
@admin_bp.route('/admin/login', methods=['POST'])
@cross_origin()
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    admin = Admin.query.filter_by(username=username).first()

    if admin and admin.check_password(password):
        return jsonify({
            "success": True, 
            "message": "Admin login successful!",
            "admin": {"id": admin.id, "username": admin.username}
        })
    else:
        return jsonify({"success": False, "message": "Invalid admin credentials"}), 401


# --- 3. Get All Pending Activities Route ---
@admin_bp.route('/admin/pending-activities', methods=['GET'])
@cross_origin()
def get_pending_activities():
    # Query all activities from all students, where status is "Pending"
    # We join with Student to get the student's name
    pending_activities = db.session.query(
        Activity, Student.name
    ).join(
        Student, Activity.student_id == Student.id
    ).filter(
        Activity.status == 'Pending'
    ).order_by(
        Activity.date.desc()
    ).all()

    output = []
    for activity, student_name in pending_activities:
        output.append({
            "id": activity.id,
            "student_name": student_name,
            "name": activity.name,
            "category": activity.category,
            "club_name": activity.club_name,
            "date": activity.date.strftime('%Y-%m-%d'),
            "proof_url": activity.proof_url # URL to the proof image
        })

    return jsonify({"success": True, "activities": output})


# --- 4. Approve Activity Route (The "AI") ---
@admin_bp.route('/admin/approve/<int:activity_id>', methods=['POST'])
@cross_origin()
def approve_activity(activity_id):
    activity = Activity.query.get(activity_id)
    if not activity:
        return jsonify({"success": False, "message": "Activity not found"}), 404

    # --- HERE IS YOUR LOGIC ---
    category = activity.category.lower()
    points_to_add = POINT_MAP.get(category, 0) # Get points, default to 0 if unknown

    activity.status = "Completed"
    activity.points = points_to_add
    
    try:
        db.session.commit()
        return jsonify({"success": True, "message": f"Activity approved! {points_to_add} points added."})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": f"Error: {str(e)}"}), 500


# --- 5. Reject Activity Route ---
@admin_bp.route('/admin/reject/<int:activity_id>', methods=['POST'])
@cross_origin()
def reject_activity(activity_id):
    activity = Activity.query.get(activity_id)
    if not activity:
        return jsonify({"success": False, "message": "Activity not found"}), 404

    activity.status = "Rejected"
    activity.points = 0 # Ensure points are 0
    
    try:
        db.session.commit()
        return jsonify({"success": True, "message": "Activity rejected."})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": f"Error: {str(e)}"}), 500