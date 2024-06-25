from flask import Blueprint, request
from . import db
from .model import Post
from .schema import post_schema, posts_schema
from .utils import api_response
from .user import login_required


post = Blueprint("post", __name__, url_prefix="/api/post")


@post.route("/add", methods=["POST"])
@login_required
def add_post(session_user):
    post_data = request.get_json()

    if not post_data:
        return api_response("Post data required!", 400)

    required_fields = ["title", "description", "tag", "location"]
    missing_fields = [field for field in required_fields if field not in post_data]

    if missing_fields:
        message_string = f"Missing required field {', '.join(missing_fields)}!" 
        return api_response(message_string, 400)
    
    if session_user:
        title = post_data["title"]
        description = post_data["description"]
        tag = post_data["tag"]
        location = post_data["location"]
        uid = session_user.id

        new_post = Post(title, description, tag, location, uid)
        db.session.add(new_post)
        db.session.commit()

        response_data = post_schema.dump(new_post)
        return api_response("Post added successfully!", 201, response_data)
    return api_response("Something went wrong!", 400)


@post.route("/fetch", methods=["GET"])
def fetch_posts():
    all_post = Post.query.all()

    if not all_post:
        return api_response("No any post available!", 404)
    
    response_data = posts_schema.dump(all_post)
    return api_response("Posts fetched successfully!", 200, response_data)


@post.route("/fetch/<id>", methods=["GET"])
def fetch_post(id):
    post = Post.query.get(id)

    if not post:
        return api_response("Posts not available!", 404)
    
    response_data = post_schema.dump(post)
    return api_response("Post fetched successfully!", 200, response_data)


@post.route("/fetch/post", methods=["GET"])
def fetch_post_by():
    post_details = request.args.to_dict()

    if not post_details:
        return api_response("Please, query post details!", 400)

    all_post = Post.query.filter_by(**post_details).all()

    if not all_post:
        return api_response("No any post available!", 404)

    response_data = posts_schema.dump(all_post)
    return api_response("Posts fetched successfully!", 200, response_data)


@post.route("/edit/post/<id>", methods=["PUT", "PATCH"])
@login_required
def edit_post(session_user, **kwargs):
    post_data = request.get_json()

    existing_post = Post.query.get({**kwargs})

    if not existing_post:
        return api_response("Post not available!", 404)
    
    if session_user.id != existing_post.uid:
        return api_response("You can't edit this post!", 403)

    if not post_data or not any(key in post_data for key in ["title", "description", "tag", "location"]):
        return api_response("Post details required!", 400)
    
    title = post_data.get("title", None)
    description = post_data.get("description", None)
    tag = post_data.get("tag", None)
    location = post_data.get("location", None)
    
    existing_post.title = title if title is not None else existing_post.title
    existing_post.description = description if description is not None else existing_post.description
    existing_post.tag = tag if tag is not None else existing_post.tag
    existing_post.location = location if location is not None else existing_post.location

    db.session.commit()
    updated_post = Post.query.filter_by(**kwargs).first()
    response_data = post_schema.dump(updated_post)
    return api_response("Post updated successfully!", 200, response_data)


@post.route("/delete/post/<id>", methods=["DELETE"])
@login_required
def delete_post(session_user, **kwargs):
    existing_post = Post.query.get({**kwargs})

    if not existing_post:
        return api_response("Post not available!", 404)

    if session_user.id != existing_post.uid:
        return api_response("You can't delete this post!", 403)
    
    db.session.delete(existing_post)
    db.session.commit()
    return api_response("Post deleted successfully!", 200)
