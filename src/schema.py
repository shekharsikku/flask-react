from flask_marshmallow import Marshmallow


ma = Marshmallow()


class UserSchema(ma.Schema):
    class Meta:
        fields = ("id", "fullname", "username", "email", "date")


user_schema = UserSchema()
users_schema = UserSchema(many=True)


class LoginUserSchema(ma.Schema):
    class Meta:
        fields = ("id", "fullname", "username", "email", "password", "date")


login_user_schema = LoginUserSchema()


class PostSchema(ma.Schema):
    class Meta:
        fields = ("id", "title", "description", "tag", "location", "date", "uid")


post_schema = PostSchema()
posts_schema = PostSchema(many=True)
