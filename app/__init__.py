"""
ASEM Global Platform
Application Factory
"""

from pathlib import Path

from flask import Flask, send_from_directory
from flask_cors import CORS

from app.extensions import db, migrate, jwt


def create_app():

    app = Flask(__name__)

    app.config.from_object("config.Config")

    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
    )

    db.init_app(app)

    migrate.init_app(app, db)

    jwt.init_app(app)

    # Load models so SQLAlchemy knows all models.
    from app import models  # noqa: F401

    # Application blueprints.
    from app.auth.routes import auth_bp
    from app.api.routes import api_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(api_bp)

    # ---------------------------------------------------------
    # Frontend
    # ---------------------------------------------------------

    project_root = Path(app.root_path).parent

    @app.route("/", methods=["GET"])
    def index():
        return send_from_directory(
            project_root,
            "index.html"
        )

    @app.route("/<path:filename>", methods=["GET"])
    def frontend_assets(filename):
        requested = project_root / filename

        if requested.is_file():
            return send_from_directory(
                project_root,
                filename
            )

        return "", 404

    return app
