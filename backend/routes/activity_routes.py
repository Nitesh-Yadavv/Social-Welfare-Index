# backend/routes/activity_routes.py
from flask import Blueprint, jsonify
from models import Activity

activity_bp = Blueprint("activity_bp", __name__)

@activity_bp.route("/activities", methods=["GET"])
def get_activities():
    activities = Activity.query.all()
    data = [
        {"id": a.id, "name": a.name, "status": a.status, "points": a.points}
        for a in activities
    ]
    return jsonify(data)
