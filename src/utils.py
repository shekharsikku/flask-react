from bcrypt import checkpw, gensalt, hashpw
from flask import make_response, jsonify
from datetime import datetime


def generate_hashed(plain_password):
    return hashpw(plain_password.encode("utf-8"), gensalt()).decode()


def check_hashed(plain_password, hashed_password):
    return checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def api_response(message: str, code: int, data: any = None):
    success = True if code < 400 else False
    timestamp = datetime.now()
    
    if data is not None:
        return make_response(jsonify({
            "message": message, 
            "success": success, 
            "timestamp": timestamp, 
            "data": data
        }), code)
    return make_response(jsonify({
        "message": message, 
        "success": success, 
        "timestamp": timestamp
    }), code)
