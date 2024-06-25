from . import db
from sqlalchemy.sql import func
import uuid


class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    fullname = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    date = db.Column(db.DateTime(timezone=True), default=func.now())
    posts = db.relationship('Post')
    
    def __init__(self, fullname, username, email, password):
        self.fullname = fullname
        self.username = username
        self.email = email
        self.password = password

    def __repr__(self):
        return "<User id: %s>" % self.id


class Post(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid1()))
    title = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text(), nullable=False)
    tag = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(300), nullable=False)
    date = db.Column(db.DateTime(timezone=True), default=func.now())
    uid = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)

    def __init__(self, title, description, tag, location, uid):
        self.title = title
        self.description = description
        self.tag = tag
        self.location = location
        self.uid = uid

    def __repr__(self):
        return "<Post id: %s>" % self.id
    