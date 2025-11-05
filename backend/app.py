# backend/app.py
import cloudinary
from dotenv import load_dotenv
load_dotenv()
from flask import Flask, send_from_directory
from flask_cors import CORS
import os
from extensions import db


UPLOAD_FOLDER = 'uploads'


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)
    
    # ... (all your config remains the same) ...
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get('DATABASE_URL')
    app.config["UPLOAD_FOLDER"] = os.path.join(app.instance_path, UPLOAD_FOLDER)
    cloudinary.config(
    cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key = os.environ.get('CLOUDINARY_API_KEY'),
    api_secret = os.environ.get('CLOUDINARY_API_SECRET')
    )
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    
    db.init_app(app)

    # Import models here to register them
    from models import Student, Activity, Admin # ✅ NEW: Import Admin

    # Register blueprints
    from routes.auth_routes import auth_bp
    from routes.activity_routes import activity_bp
    
    # ✅ --- NEW: Register Admin Blueprint ---
    from routes.admin_routes import admin_bp 
    
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(activity_bp, url_prefix="/api")
    
    # ✅ --- NEW: Register Admin Blueprint ---
    app.register_blueprint(admin_bp, url_prefix="/api")
    @app.route('/')
    def health_check():
        """A simple health check route for Render."""
        return jsonify({"status": "ok", "message": "Backend is running!"}), 200
    # --- END OF NEW BLOCK ---

   

    return app

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)