from waitress import serve
from app import app


if __name__ == "__main__":
    serve(app=app)
