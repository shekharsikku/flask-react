from dotenv import load_dotenv, find_dotenv
from os import getenv

load_dotenv(find_dotenv())

database_uri = getenv("DATABASE_URI")
secret_key = getenv("SECRET_KEY")
jwt_secret = getenv("JWT_SECRET")
cors_origin = getenv("CORS_ORIGIN")
token_exp = getenv("TOKEN_EXP")
server_mode = getenv("SERVER_MODE")
