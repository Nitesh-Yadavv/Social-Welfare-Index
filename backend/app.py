# backend/app.py
from flask import Flask, send_from_directory
from flask_cors import CORS
import os
from extensions import db  # import from extensions

# ✅ NEW: Define path for uploads
UPLOAD_FOLDER = 'uploads'

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)

    # Ensure instance folder exists
    os.makedirs(app.instance_path, exist_ok=True)

    # Database config (points to instance/database.db)
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(app.instance_path, 'database.db')}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ✅ NEW: Configure the upload folder (will be backend/instance/uploads)
    app.config["UPLOAD_FOLDER"] = os.path.join(app.instance_path, UPLOAD_FOLDER)
    # ✅ NEW: Ensure the upload folder exists
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Initialize extensions
    db.init_app(app)

    # Import models here to register them
    from models import Student, Activity

    # Register routes
    from routes.auth_routes import auth_bp
    from routes.activity_routes import activity_bp
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(activity_bp, url_prefix="/api")

    # ✅ NEW: Add a route to serve uploaded files
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    return app

# ✅ FIX: Create the app instance here so it can be imported by seed.py
app = create_app()

if __name__ == "__main__":
    # The run block only handles startup logic
    with app.app_context():
        db.create_all()
    app.run(debug=True)