from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from datetime import timedelta
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from .env import database_uri, secret_key, jwt_secret, token_exp, cors_origin
import sys


db = SQLAlchemy()
jwt = JWTManager()
token_expiry = int(token_exp)


def main_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = database_uri
    app.config["SQLALCHEMY_TRACK_MODIFICATION"] = False
    app.config["SQLALCHEMY_ECHO"] = False
    app.config["SECRET_KEY"] = secret_key
    app.config["SESSION_TYPE"] = "filesystem"
    app.config["SESSION_PERMANENT"] = False
    app.config["SESSION_USE_SIGNER"] = True
    app.config["JWT_COOKIE_SECURE"] = True
    app.config["JWT_COOKIE_CSRF_PROTECT"] = True
    app.config["JWT_SECRET_KEY"] = jwt_secret
    app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=token_expiry)

    origins = cors_origin.split()
    CORS(app, resources={r"/api/*": {"origins": origins}})

    db.init_app(app)
    jwt.init_app(app) 

    from .user import user
    from .post import post

    app.register_blueprint(user)
    app.register_blueprint(post)

    with app.app_context():
        from .model import User, Post
    
        try:
            with app.app_context():
                db.create_all()
        except SQLAlchemyError as e:
            print(f"Database connection error! \n{e}")
            sys.exit(1)
        else:
            db.session.execute(text("SELECT 1"))
            print("Database connection success!")
            return app   
