# backend/models.py
from extensions import db

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    activities = db.relationship("Activity", backref="student", lazy=True)

class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    status = db.Column(db.String(50))
    points = db.Column(db.Integer)
    student_id = db.Column(db.Integer, db.ForeignKey("student.id"), nullable=False)
