from app import app, db
from models import Student, Activity, Admin # ✅ NEW: Import Admin
from werkzeug.security import generate_password_hash

with app.app_context():
    # Clear existing data
    db.session.query(Activity).delete()
    db.session.query(Student).delete()
    db.session.query(Admin).delete() # ✅ NEW: Clear admins
    db.session.commit()

    # --- Create a default Admin User ---
    # Username: admin
    # Password: password
    admin_user = Admin(username="admin")
    admin_user.set_password("password") # Hashes the password
    db.session.add(admin_user)
    db.session.commit()
    
    print("✅ Default admin (admin/password) created.")

    # --- Create a test Student ---
    hashed_password = generate_password_hash("12345")
    s1 = Student(
        name="Test Student", 
        email="test@rtu.ac.in",
        password=hashed_password,
        roll_no="TEST001",
    )
    db.session.add(s1)
    db.session.commit()

    print("✅ Test student created.")