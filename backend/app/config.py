import os

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "freshbooking")

JWT_SECRET = os.getenv("JWT_SECRET", "freshbooking-super-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
