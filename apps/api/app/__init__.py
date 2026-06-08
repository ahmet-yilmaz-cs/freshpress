"""FreshPress mock backend — Flask app factory.

Handles auth (register/login/me/refresh) with SQLite persistence + JWT, plus a
couple of mock device/recipe endpoints so the mobile app has consistent data.
"""
import os

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .db import db
from .errors import register_error_handlers


def create_app() -> Flask:
    load_dotenv()
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.environ.get(
        "FLASK_SECRET_KEY", "dev-secret-change-me-0123456789abcdef"
    )
    app.config["JWT_SECRET_KEY"] = os.environ.get(
        "JWT_SECRET_KEY", "dev-jwt-secret-change-me-0123456789abcdef"
    )
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL", "sqlite:///freshpress.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    # Access tokens live 1h, refresh tokens 30 days (mock-friendly).
    from datetime import timedelta

    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

    db.init_app(app)
    JWTManager(app)
    CORS(app, resources={r"/*": {"origins": "*"}})

    register_error_handlers(app)

    from .auth import bp as auth_bp
    from .devices import bp as devices_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(devices_bp, url_prefix="/api")

    @app.get("/health")
    def health():
        return jsonify({"status": "ok", "service": "freshpress-api"})

    with app.app_context():
        db.create_all()

    return app
