from fastapi import APIRouter, HTTPException, Depends, Query
from bson import ObjectId
from typing import List
from app.database import users_collection, properties_collection
from app.models.user import UserResponse
from app.models.property import PropertyResponse
from app.utils.deps import get_current_admin
from app.routers.properties import property_doc_to_response

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/properties", response_model=List[PropertyResponse])
def admin_list_properties(
    skip: int = Query(0, ge=0),
    limit: int = Query(1000, ge=1, le=5000),
    current_user: dict = Depends(get_current_admin),
):
    cursor = properties_collection.find().sort("created_at", -1).skip(skip).limit(limit)
    return [property_doc_to_response(doc) for doc in cursor]


@router.get("/users", response_model=List[UserResponse])
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: dict = Depends(get_current_admin),
):
    cursor = users_collection.find().skip(skip).limit(limit)
    return [
        UserResponse(
            id=str(u["_id"]),
            name=u["name"],
            email=u["email"],
            phone=u["phone"],
            role=u["role"],
            created_at=u.get("created_at"),
        )
        for u in cursor
    ]


@router.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: str, current_user: dict = Depends(get_current_admin)):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    if user_id == current_user["id"]:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")

    result = users_collection.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    # Also delete all properties by this user
    properties_collection.delete_many({"user_id": user_id})


@router.put("/properties/{property_id}/feature")
def toggle_feature(property_id: str, current_user: dict = Depends(get_current_admin)):
    if not ObjectId.is_valid(property_id):
        raise HTTPException(status_code=400, detail="Invalid property ID")

    doc = properties_collection.find_one({"_id": ObjectId(property_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Property not found")

    new_val = not doc.get("is_featured", False)
    properties_collection.update_one(
        {"_id": ObjectId(property_id)}, {"$set": {"is_featured": new_val}}
    )
    return {"is_featured": new_val}


@router.put("/properties/{property_id}/verify")
def toggle_verify(property_id: str, current_user: dict = Depends(get_current_admin)):
    if not ObjectId.is_valid(property_id):
        raise HTTPException(status_code=400, detail="Invalid property ID")

    doc = properties_collection.find_one({"_id": ObjectId(property_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Property not found")

    new_val = not doc.get("is_verified", False)
    properties_collection.update_one(
        {"_id": ObjectId(property_id)}, {"$set": {"is_verified": new_val}}
    )
    return {"is_verified": new_val}


@router.put("/properties/{property_id}/new-launch")
def toggle_new_launch(property_id: str, current_user: dict = Depends(get_current_admin)):
    if not ObjectId.is_valid(property_id):
        raise HTTPException(status_code=400, detail="Invalid property ID")

    doc = properties_collection.find_one({"_id": ObjectId(property_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Property not found")

    new_val = not doc.get("is_new_launch", False)
    properties_collection.update_one(
        {"_id": ObjectId(property_id)}, {"$set": {"is_new_launch": new_val}}
    )
    return {"is_new_launch": new_val}


@router.put("/properties/{property_id}/trending")
def toggle_trending(property_id: str, current_user: dict = Depends(get_current_admin)):
    if not ObjectId.is_valid(property_id):
        raise HTTPException(status_code=400, detail="Invalid property ID")

    doc = properties_collection.find_one({"_id": ObjectId(property_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Property not found")

    new_val = not doc.get("is_trending", False)
    properties_collection.update_one(
        {"_id": ObjectId(property_id)}, {"$set": {"is_trending": new_val}}
    )
    return {"is_trending": new_val}


@router.delete("/properties/{property_id}", status_code=204)
def admin_delete_property(
    property_id: str, current_user: dict = Depends(get_current_admin)
):
    if not ObjectId.is_valid(property_id):
        raise HTTPException(status_code=400, detail="Invalid property ID")

    result = properties_collection.delete_one({"_id": ObjectId(property_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
