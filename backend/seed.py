# seed.py
from app import app, db
from models import Student, Activity
from werkzeug.security import generate_password_hash # ✅ NEW: Import for hashing

with app.app_context():
    db.create_all()

    # Create a student with a HASHED password
    hashed_password = generate_password_hash("12345")
    s1 = Student(name="John Doe", email="student@example.com", password=hashed_password)
    db.session.add(s1)
    db.session.commit()

    # Add sample activities
    activities = [
        Activity(name="Coding Club", status="Active", points=50, student_id=s1.id),
        Activity(name="Football Team", status="Completed", points=30, student_id=s1.id),
        Activity(name="Debate Society", status="Active", points=40, student_id=s1.id),
    ]
    db.session.add_all(activities)
    db.session.commit()

print("✅ Database seeded successfully!")