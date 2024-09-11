from werkzeug.exceptions import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from src import main_app
from src.env import server_mode
from src.utils import api_response
from flask import send_from_directory, redirect
import os


app = main_app()


@app.route("/", defaults={"filename": ""})
@app.route("/<path:filename>")
def hello(filename):
    if server_mode == "production":
        frontend_folder = os.path.join(os.getcwd(), "dist")
        if not filename:
            filename = "index.html"
        return send_from_directory(frontend_folder, filename)
    else:
        style = "style='font-family:sans-serif'"
        function = hello.__name__.capitalize()
        message = "Stranger, Welcome to Flask!"
        return f"<p {style}>{function} {message}</p>"


@app.errorhandler(404)
@app.route("/<path:path>")
def not_found(path):
    print(f"Redirecting undefined path to root route!")
    return redirect("/")


@app.errorhandler(Exception)
def handle_generic_exception(error):
    return api_response(f"Error: {error}", 400)


@app.errorhandler(HTTPException)
def handle_error_exceptions(error):
    return api_response(f"{error.description}", error.code or 500)


@app.errorhandler(SQLAlchemyError)
def sqlalchemy_error(error):
    return api_response(f"SQLAlchemy Error: {error}!", 500)
