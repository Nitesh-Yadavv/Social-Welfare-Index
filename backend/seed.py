from app import app, db
from models import Student, Activity

with app.app_context():   # ✅ use the app directly, not db.app
    db.create_all()

    # create a student
    s1 = Student(name="John Doe", email="student@example.com", password="12345")
    db.session.add(s1)
    db.session.commit()

    # add sample activities
    activities = [
        Activity(name="Coding Club", status="Active", points=50, student_id=s1.id),
        Activity(name="Football Team", status="Completed", points=30, student_id=s1.id),
        Activity(name="Debate Society", status="Active", points=40, student_id=s1.id),
    ]
    db.session.add_all(activities)
    db.session.commit()

print("✅ Database seeded successfully!")
