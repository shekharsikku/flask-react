from functools import wraps
from datetime import datetime, timedelta
from flask import Blueprint, request, session, g
from flask_jwt_extended import (create_access_token, set_access_cookies, unset_jwt_cookies, 
                                get_jwt_identity, jwt_required, get_jwt)
from . import db, jwt, token_expiry
from .model import User, Post
from .utils import api_response, generate_hashed, check_hashed
from .schema import user_schema, users_schema, login_user_schema


user = Blueprint("user", __name__, url_prefix="/api/user")


def global_session_user():
    session_keys = ["username", "email"]
    g.user = next((session[key] for key in session_keys if key in session), None)


@user.before_request
def before_request():
    global_session_user()


@user.after_request
def after_request(response):
    global_session_user()
    if g.user is not None:
        print(f"Existing session user: {g.user}")
    return response


# Api route for register user - http://localhost:8070/api/user/register
@user.route("/register", methods=["POST"])
def register_user():
    user_data = request.get_json()

    if not user_data:
        return api_response("User data required!", 400)

    required_fields = ["fullname", "username", "email", "password"]
    missing_fields = [field for field in required_fields if field not in user_data]

    if len(missing_fields) > 0:
        message_string = f"Missing required field {', '.join(missing_fields)}!"
        return api_response(message_string, 400)
    
    if len(user_data["password"]) < 6:
        return api_response("Password at least 6 characters!", 400)
    
    fullname = user_data["fullname"]
    username = user_data["username"]
    email = user_data["email"]
    password = generate_hashed(user_data["password"])

    existing_user = User.query.filter((User.username == username) | (User.email == email)).first()

    existing_field = None

    if existing_user:
        if existing_user.username == username:
            existing_field = "Username"
        elif existing_user.email == email:
            existing_field = "Email"
        return api_response(f"{existing_field} already registered!", 409)

    new_user = User(fullname, username, email, password)
    db.session.add(new_user)
    db.session.commit()
    response = user_schema.dump(new_user)
    return api_response("User registered successfully!", 201, response)


def clear_session_access_cookies() -> object:
    session_keys = ["username", "email"]
    session_key = next((key for key in session_keys if key in session), None)
    session_value = session.pop(session_key, None)
    return session_value


# Api route for login user - http://localhost:8070/api/user/login
@user.route("/login",  methods=["POST"])
def login_user():
    user_data = request.get_json()

    if not user_data:
        return api_response("User credentials required!", 400)

    username = user_data.get("username")
    email = user_data.get("email")

    if not any([username, email]):
        return api_response("Username or Email required!", 400)
    
    if "password" not in user_data:
        return api_response("Password required!", 400)
    
    password = user_data["password"]

    exists_user = None
    session_key = None

    fields = {'username': username, 'email': email}

    for key, value in fields.items():
        if value:
            session_key = key

            if session_key in session and (username or email) == session[session_key]:
                return api_response("Welcome, You are already logged in!", 302)
            else:
                clear_session_access_cookies()
    
            exists_user = User.query.filter_by(**{key: value}).first()

            if exists_user:
                break
        
    if not exists_user:
        clear_session_access_cookies()
        return api_response("User not registered!", 404)

    check_login_user = login_user_schema.dump(exists_user)
    verify_password = check_hashed(password, check_login_user["password"])

    if verify_password:
        session[session_key] = check_login_user[session_key]
        user_data = user_schema.dump(check_login_user)
        response = api_response("User login successfully!", 200, user_data)
        access_token = create_access_token(identity=user_data["id"])
        set_access_cookies(response, access_token)
        return response
    return api_response("Incorrect password!", 403)


# Api route for logout user - http://localhost:8070/api/user/logout
@user.route("/logout", methods=["DELETE"])
def logout_user():
    session_value = clear_session_access_cookies()

    if session_value is not None:
        response = api_response("User logout successfully!", 200)
        unset_jwt_cookies(response)
        return response
    return api_response("No logged in user found!", 401)


# Login required decorator function for fetch user data and add posts by session user
def login_required(func):
    @wraps(func)
    def secure_function(*args, **kwargs):
        if any(key in session for key in ["username", "email"]):
            session_key = next((key for key in ["username", "email"] if key in session), None)
            session_user = User.query.filter_by(**{session_key: session[session_key]}).first()
            if session_key and session_user:
                return func(session_user, *args, **kwargs)
            return func(*args, **kwargs)
        else:
            return api_response("Please, login to get access!", 401)
    return secure_function


# Refreshing access token if user use existing token before expiration time
def refresh_expiring_jwt(func):
    @wraps(func)
    def refresh_access_token(*args, **kwargs):
        try:
            exp_timestamp = get_jwt()["exp"]
            cur_timestamp = datetime.now()
            tar_timestamp = datetime.timestamp(cur_timestamp + timedelta(minutes=token_expiry))

            print(f"Exp_time: {datetime.fromtimestamp(exp_timestamp).strftime('%Y-%m-%d %H:%M:%S')} UTC")
            print(f"Cur_time: {cur_timestamp.strftime('%Y-%m-%d %H:%M:%S')} UTC")
            print(f"Tar_time: {datetime.fromtimestamp(tar_timestamp).strftime('%Y-%m-%d %H:%M:%S')} UTC")

            if tar_timestamp > exp_timestamp:
                access_token = create_access_token(identity=get_jwt_identity())
                response = func(*args, **kwargs)
                set_access_cookies(response, access_token)
                return response
            return func(*args, **kwargs)
        except (RuntimeError, KeyError):
            return api_response("Something went wrong!", 400)
    return refresh_access_token                
    

# Api route for check session user - http://localhost:8070/api/user/session
@user.route("/session", methods=["GET"])
@login_required
@jwt_required()
@refresh_expiring_jwt
def session_user(session_user, *args, **kwargs):
    data = user_schema.dump(session_user)
    
    uid = get_jwt_identity()
    sid = data['id']

    if g.user and sid == uid:
        return api_response("Current session user data!", 200, data)
    return api_response("Unauthorized session user!", 401)


# Api route for fetch all user - http://localhost:8070/api/user/fetch
@user.route("/fetch", methods=["GET"])
@login_required
@jwt_required()
def fetch_users(session_user, *args, **kwargs):
    # all_user = User.query.all()

    logged_in_user = user_schema.dump(session_user)['id']
    all_user = User.query.filter(User.id != logged_in_user).all()

    if not all_user:
        return api_response("No any user found!", 404)

    response_data = users_schema.dump(all_user)
    return api_response("Users data fetched!", 200, response_data)

    # uid_set = {item['uid'] for item in post_details}
    # all_user = User.query.filter(User.id.in_(uid_set)).all()
    # user_details = user_schema.dump(all_user)


# Api route for fetch user by id - http://localhost:8070/api/user/fetch/<id>
@user.route("/fetch/<id>", methods=["GET"])
@login_required
@jwt_required()
def fetch_user(session_user, *args, **kwargs):
    existed_user = User.query.get({**kwargs})

    if not existed_user:
        return api_response("User not found!", 404)

    response_data = user_schema.dump(existed_user)
    return api_response("User data fetched!", 200, response_data)


# Api route for fetch user by query parameter - http://localhost:8070/api/user/fetch/user?query=parameter
@user.route("/fetch/user", methods=["GET"])
@login_required
@jwt_required()
def fetch_user_by(session_user, *args, **kwargs):
    user_data = request.args.to_dict()

    if not user_data:
        return api_response("Please, query user details!", 400)

    existed_user = User.query.filter_by(**user_data).first()

    if not existed_user:
        return api_response("User not found!", 404)

    response_data = user_schema.dump(existed_user)
    return api_response("User data fetched!", 200, response_data)


# Session user verification for modification and deletion for user data 
def verify_session(func):
    @wraps(func)
    def secure_function(*args, **kwargs):
        existed_user = User.query.filter_by(**kwargs).first()

        if not existed_user:
            return api_response("User not found!", 404)

        response = user_schema.dump(existed_user)
        session_key = next((key for key in ["username", "email"] if key in session), None)

        if session_key and response[session_key] == session[session_key]:
            return func(existed_user, response, *args, **kwargs)
        else:
            return api_response("Invalid session user!", 403)
    return secure_function


# Api route for update user details by id - http://localhost:8070/api/user/update/details/<id>
@user.route("/update/details/<id>", methods=["PUT", "PATCH"])
@verify_session
def update_user(existed_user, response, *args, **kwargs):
    user_data = request.get_json()
    
    required_fields = ["fullname", "username", "email"]
    if not user_data or not any(key in user_data for key in required_fields):
        return api_response("User data required!", 400)

    for field in ["username", "email"]:
        if field in user_data and User.query.filter_by(**{field: user_data[field]}).first():
            if user_data[field] != response[field]:
                return api_response(f"{field.capitalize()} already exists!", 409)

    fullname = user_data.get("fullname", None)
    username = user_data.get("username", None)
    email = user_data.get("email", None)
    
    if existed_user and user_data:
        existed_user.fullname = fullname if fullname is not None else existed_user.fullname
        existed_user.username = username if username is not None else existed_user.username
        existed_user.email = email if email is not None else existed_user.email

        db.session.commit()

        response = api_response("User details updated!", 202)
        clear_session_access_cookies()
        unset_jwt_cookies(response)
        return response
    return api_response("User details not updated!", 304)


# Api route for update user password by id - http://localhost:8070/api/user/update/password/<id>
@user.route("/update/password/<id>", methods=["PUT", "PATCH"])
@verify_session
def update_password(existed_user, *args, **kwargs):
    user_data = request.get_json()

    required_fields = ["old_password", "new_password", "confirm_password"]
    missing_fields = [field for field in required_fields if field not in user_data]
    
    if missing_fields:
        message_string = f"Missing required field {', '.join(missing_fields)}!"
        return api_response(message_string, 400) 
    
    old_password = user_data["old_password"]
    new_password = user_data["new_password"]
    confirm_password = user_data["confirm_password"]

    check_existed_user = login_user_schema.dump(existed_user)
    verify_old_password = check_hashed(old_password, check_existed_user["password"])
    verify_new_password = check_hashed(new_password, check_existed_user["password"])

    if not verify_old_password:
        return api_response("Incorrect old password!", 406)
    
    if verify_new_password:
        return api_response("New password is same!", 409)
    
    if new_password == confirm_password:
        existed_user.password = generate_hashed(new_password)
        db.session.commit()
        response = api_response("Password updated!", 202)
        clear_session_access_cookies()
        unset_jwt_cookies(response)
        return response
    return api_response("Password not matching!", 406)


# Api route for delete user by id - http://localhost:8070/api/user/delete/user/<id>
@user.route("/delete/user/<id>", methods=["DELETE", "POST"])
@verify_session
def delete_user(existed_user, *args, **kwargs):
    user_data = request.get_json()

    required_fields = ["user_password", "confirm_user_password"]
    missing_fields = [field for field in required_fields if field not in user_data]
    
    if missing_fields:
        message_string = f"Missing required field {', '.join(missing_fields)}!"
        return api_response(message_string, 400) 

    user_password = user_data["user_password"]
    confirm_user_password = user_data["confirm_user_password"]

    check_existed_user = login_user_schema.dump(existed_user)
    verify_user_password = check_hashed(user_password, check_existed_user["password"])

    if not verify_user_password:
        return api_response("Invalid user password!", 403)

    if user_password != confirm_user_password:
        return api_response("Invalid confirm password!", 406)

    session_value = clear_session_access_cookies()

    if verify_user_password and session_value is not None:
        user_posts = Post.query.filter_by(uid=existed_user.id).all()
        
        for user_post in user_posts:
            db.session.delete(user_post)

        db.session.delete(existed_user)
        db.session.commit()
        response = api_response("User deleted successfully!", 301)
        unset_jwt_cookies(response)
        return response
    return api_response("Something went wrong!", 400)


# Logout user automatically when token is expired
@jwt.expired_token_loader
def my_expired_token_callback(expired_token, unverified_claims):
    expiry_time = datetime.fromtimestamp(unverified_claims["exp"])
    current_time = datetime.now()

    if current_time > expiry_time:
        print("Logging out user because access has been expired!")
        return logout_user()
