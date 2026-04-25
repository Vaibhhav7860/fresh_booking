from pymongo import MongoClient
import gridfs
from backend_app.config import MONGODB_URL, DB_NAME

client = MongoClient(MONGODB_URL)
db = client[DB_NAME]
fs = gridfs.GridFS(db)

# Collections
users_collection = db["users"]
properties_collection = db["properties"]
inquiries_collection = db["inquiries"]
banners_collection = db["banners"]

# Create indexes
users_collection.create_index("email", unique=True)
properties_collection.create_index("user_id")
properties_collection.create_index("city")
properties_collection.create_index("listing_type")
properties_collection.create_index("property_type")
properties_collection.create_index("created_at")
properties_collection.create_index("views_count")


def get_database():
    return db


def get_gridfs():
    return fs
