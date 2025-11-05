# seed.py
from app import app, db
from models import Student, Activity
from werkzeug.security import generate_password_hash 

with app.app_context():
    # Clear existing data
    db.session.query(Activity).delete()
    db.session.query(Student).delete()
    db.session.commit()

    # Create a student with a HASHED password and NEW fields
    hashed_password = generate_password_hash("12345")
    s1 = Student(
        name="Test Student", 
        email="test@rtu.ac.in", # Must end with @rtu.ac.in
        password=hashed_password,
        roll_no="TEST001", # Must be unique
        mobile_no="1234567890",
        student_id_pic_url="test_pic.jpg" # Dummy filename
    )
    db.session.add(s1)
    db.session.commit()

    # Add sample activities
    activities = [
        Activity(name="Coding Club", status="Active", points=50, student_id=s1.id),
        Activity(name="Football Team", status="Completed", points=30, student_id=s1.id),
    ]
    db.session.add_all(activities)
    db.session.commit()

print("✅ Database seeded successfully with new Student model!")