from extensions import db
from datetime import datetime # ✅ NEW: Import datetime
from werkzeug.security import generate_password_hash, check_password_hash
class Student(db.Model):
    # ... (Student model is unchanged)
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    roll_no = db.Column(db.String(50), unique=True, nullable=False)
    mobile_no = db.Column(db.String(20))
    student_id_pic_url = db.Column(db.String(255))
    password = db.Column(db.String(255), nullable=False)
    activities = db.relationship("Activity", backref="student", lazy=True)

class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    status = db.Column(db.String(50))
    points = db.Column(db.Integer)
    student_id = db.Column(db.Integer, db.ForeignKey("student.id"), nullable=False)
    
    # ✅ --- NEW FIELDS ---
    category = db.Column(db.String(50), nullable=False)
    proof_url = db.Column(db.String(255), nullable=True) # URL to the uploaded proof
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    club_name = db.Column(db.String(100), nullable=False, default="N/A")

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)