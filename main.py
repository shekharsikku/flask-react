from logging import basicConfig, DEBUG
from waitress import serve
from src.env import server_mode
from app import app


def main():
    try:
        if server_mode == "development":
            basicConfig(level=DEBUG)
            app.run(debug=True, host="localhost", port=8070)
        elif server_mode == "deployment":
            print("Visit for site preview: http://localhost:8080")
            serve(app=app)
        else:
            raise Exception("Unable to run Flask Application!")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    main()


# source .venv/Scripts/activate
