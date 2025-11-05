# backend/models.py
from extensions import db

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    
    # ✅ NEW: Add roll_no, must be unique
    roll_no = db.Column(db.String(50), unique=True, nullable=False)
    
    # ✅ NEW: Add mobile_no
    mobile_no = db.Column(db.String(20))
    
    # ✅ NEW: Store the filename of the uploaded ID pic
    student_id_pic_url = db.Column(db.String(255))
    
    # FIX: Increased size to accommodate password hash
    password = db.Column(db.String(255), nullable=False)
    
    activities = db.relationship("Activity", backref="student", lazy=True)

class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    status = db.Column(db.String(50))
    points = db.Column(db.Integer)
    student_id = db.Column(db.Integer, db.ForeignKey("student.id"), nullable=False)