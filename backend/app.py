# backend/app.py
from flask import Flask
from flask_cors import CORS
import os
from extensions import db  # ✅ import from extensions

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)

    # Ensure instance folder exists
    os.makedirs(app.instance_path, exist_ok=True)

    # Database config (points to instance/database.db)
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(app.instance_path, 'database.db')}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize extensions
    db.init_app(app)

    # Import models here to register them
    from models import Student, Activity

    # Register routes
    from routes.auth_routes import auth_bp
    from routes.activity_routes import activity_bp
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(activity_bp, url_prefix="/api")

    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)
