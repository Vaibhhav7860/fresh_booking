from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime, timezone
from bson import ObjectId
from app.database import users_collection
from app.models.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.utils.auth import hash_password, verify_password, create_access_token
from app.utils.deps import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse)
def register(user: UserCreate):
    existing = users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user_doc = {
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "hashed_password": hash_password(user.password),
        "role": user.role if user.role in ["user", "admin"] else "user",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    result = users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)
    access_token = create_access_token({"sub": user_id})

    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user_id,
            name=user.name,
            email=user.email,
            phone=user.phone,
            role=user_doc["role"],
            created_at=user_doc["created_at"],
        ),
    )


@router.post("/login", response_model=TokenResponse)
def login(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    user_id = str(db_user["_id"])
    access_token = create_access_token({"sub": user_id})

    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user_id,
            name=db_user["name"],
            email=db_user["email"],
            phone=db_user["phone"],
            role=db_user["role"],
            created_at=db_user.get("created_at"),
        ),
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        phone=current_user["phone"],
        role=current_user["role"],
    )
