import cloudinary
import cloudinary.uploader
from flask import Blueprint, request, jsonify
from extensions import db
from models import Activity, Student
from flask_cors import cross_origin
from sqlalchemy import func

activity_bp = Blueprint('activity', __name__)

# --- GET Activities (Unchanged) ---
@activity_bp.route('/activities', methods=['GET'])
@cross_origin()
def get_activities():
    # ... (code to get student and activities) ...
    student_id = request.args.get('student_id')
    student = Student.query.get(student_id)
    if not student:
        return jsonify({"success": False, "message": "Student not found."}), 404

    activities = student.activities
    output = []
    for activity in activities:
        output.append({
            "id": activity.id,
            "name": activity.name,
            "category": activity.category,
            "club_name": activity.club_name,
            "status": activity.status,
            "points": activity.points,
            "date": activity.date.strftime('%Y-%m-%d')
        })

    return jsonify({"success": True, "activities": output})


# --- ADD Activity (✅ --- UPDATED --- ✅) ---
@activity_bp.route('/activities/add', methods=['POST'])
@cross_origin()
def add_activity():
    # --- 1. Get Data ---
    student_id = request.form.get('student_id')
    name = request.form.get('name')
    category = request.form.get('category')
    club_name = request.form.get('club_name') or "N/A"

    # --- 2. Validation ---
    if not all([student_id, name, category]):
        return jsonify({"success": False, "message": "Missing required fields."}), 400
    if 'proof' not in request.files:
        return jsonify({"success": False, "message": "Proof file is required."}), 400
    
    file_to_upload = request.files['proof']
    if file_to_upload.filename == '':
        return jsonify({"success": False, "message": "No selected file."}), 400

    # --- 3. Upload File to Cloudinary (✅ --- CHANGED --- ✅) ---
    try:
        # Upload the file object directly to Cloudinary
        upload_result = cloudinary.uploader.upload(file_to_upload)
    except Exception as e:
        # Handle potential upload errors
        return jsonify({"success": False, "message": f"Error uploading file: {str(e)}"}), 500

    # Get the secure URL from the upload result
    file_url = upload_result.get('secure_url')
    if not file_url:
        return jsonify({"success": False, "message": "Error getting file URL from Cloudinary."}), 500

    # --- 4. Create DB Entry (✅ --- CHANGED --- ✅) ---
    new_activity = Activity(
        name=name,
        category=category,
        student_id=student_id,
        proof_url=file_url,  # <-- Save the new Cloudinary URL
        status="Pending",
        points=0,
        club_name=club_name
    )

    try:
        db.session.add(new_activity)
        db.session.commit()
        
        # --- Return (Updated) ---
        return jsonify({
            "success": True, 
            "message": "Activity submitted for approval!",
            "activity": {
                "id": new_activity.id,
                "name": new_activity.name,
                "category": new_activity.category,
                "club_name": new_activity.club_name,
                "status": new_activity.status,
                "points": new_activity.points,
                "date": new_activity.date.strftime('%Y-%m-%d')
            }
        }), 201

    except Exception as e:
        # (✅ --- CHANGED --- ✅)
        # No local file to delete, just roll back the DB
        db.session.rollback()
        return jsonify({"success": False, "message": f"Database error: {str(e)}"}), 500

# --- Dashboard Stats (Unchanged, but fixed syntax) ---
@activity_bp.route('/dashboard-stats', methods=['GET'])
@cross_origin()
def get_dashboard_stats():
    student_id = request.args.get('student_id')
    if not student_id:
        return jsonify({"success": False, "message": "Student ID is required."}), 400

    student = Student.query.get(student_id)
    if not student:
        return jsonify({"success": False, "message": "Student not found."}), 404

    # --- 1. Calculate Points (Ps, Pt) ---
    Ps = db.session.query(func.sum(Activity.points)).filter_by(
        student_id=student_id, 
        status='Completed', 
        category='social'
    ).scalar() or 0
    
    Pt = db.session.query(func.sum(Activity.points)).filter_by(
        student_id=student_id, 
        status='Completed'
    ).scalar() or 0

    # --- 2. Calculate Activity Counts (Ns, Nt, Vs) ---
    Ns = Activity.query.filter_by(
        student_id=student_id, 
        category='social'
    ).count()

    Nt = Activity.query.filter_by(student_id=student_id).count()

    Vs = Activity.query.filter_by(
        student_id=student_id, 
        category='social', 
        status='Completed'
    ).count()

    # --- 3. Calculate Diversity (D) ---
    unique_categories_query = db.session.query(
        Activity.category
    ).filter_by(
        student_id=student_id,
        status='Completed'
    ).distinct().all()
    
    unique_categories_count = len(unique_categories_query)
    total_possible_categories = 5.0  # (Social, Technical, Sports, Cultural, NCC)
    D = (unique_categories_count / total_possible_categories) if total_possible_categories > 0 else 0

    # --- 4. Calculate Ranking ---
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
    total_points_for_ranking = 0 # Need this to check for 0-point students
    
    for i, (id, points) in enumerate(all_student_points):
        total_points_for_ranking = points if id == int(student_id) else total_points_for_ranking
        if id == int(student_id):
            ranking = i + 1 # Rank is 1-based index
            break
            
    if ranking == 0 and total_points_for_ranking == 0:
        total_students = Student.query.count()
        ranking = total_students # Or set to "N/A" or total_students

    # --- 5. Return all variables ---
    return jsonify({
        "success": True,
        "stats": {
            "Ps": Ps,
            "Pt": Pt,
            "Ns": Ns,
            "Nt": Nt,
            "Vs": Vs,
            "D": D,
            "total_points": Pt, # Duplicated for frontend ProfileDropdown
            "social_points": Ps, # Duplicated for frontend nav bar
            "total_activities": Nt,
            "social_activities": Ns,
            "ranking": ranking
        }
    })
    
