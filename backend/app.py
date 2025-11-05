# backend/app.py
from flask import Flask, send_from_directory
from flask_cors import CORS
import os
from extensions import db

UPLOAD_FOLDER = 'uploads'

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)
    
    # ... (all your config remains the same) ...
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(app.instance_path, 'database.db')}"
    app.config["UPLOAD_FOLDER"] = os.path.join(app.instance_path, UPLOAD_FOLDER)
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

    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    return app

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)