from fastapi import APIRouter, HTTPException, status, Depends, Query
from datetime import datetime, timezone
from bson import ObjectId
from typing import Optional, List
from app.database import properties_collection, users_collection
from app.models.property import PropertyCreate, PropertyUpdate, PropertyResponse
from app.utils.deps import get_current_user

router = APIRouter(prefix="/api/properties", tags=["Properties"])


def property_doc_to_response(doc: dict) -> PropertyResponse:
    user = users_collection.find_one({"_id": ObjectId(doc.get("user_id", ""))})
    user_name = user["name"] if user else "Unknown"
    return PropertyResponse(
        id=str(doc["_id"]),
        listing_type=doc.get("listing_type", ""),
        property_type=doc.get("property_type", ""),
        city=doc.get("city", ""),
        locality=doc.get("locality", ""),
        project_name=doc.get("project_name", ""),
        bhk_type=doc.get("bhk_type"),
        built_up_area=doc.get("built_up_area"),
        carpet_area=doc.get("carpet_area"),
        bathrooms=doc.get("bathrooms"),
        balconies=doc.get("balconies"),
        floor_no=doc.get("floor_no"),
        total_floors=doc.get("total_floors"),
        furnishing=doc.get("furnishing"),
        description=doc.get("description", ""),
        amenities=doc.get("amenities", []),
        posted_by=doc.get("posted_by", "Owner"),
        age_of_property=doc.get("age_of_property", "New Construction"),
        facing=doc.get("facing"),
        contact_email=doc.get("contact_email"),
        contact_phone=doc.get("contact_phone"),
        image_ids=doc.get("image_ids", []),
        expected_price=doc.get("expected_price"),
        maintenance=doc.get("maintenance"),
        user_id=doc.get("user_id", ""),
        user_name=user_name,
        created_at=doc.get("created_at"),
        is_featured=doc.get("is_featured", False),
        is_verified=doc.get("is_verified", False),
        is_new_launch=doc.get("is_new_launch", False),
        is_trending=doc.get("is_trending", False),
        views_count=doc.get("views_count", 0),
    )


@router.post("", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
def create_property(
    property_data: PropertyCreate,
    current_user: dict = Depends(get_current_user),
):
    prop_doc = {
        **property_data.model_dump(),
        "user_id": current_user["id"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_featured": False,
        "is_verified": False,
        "views_count": 0,
    }

    result = properties_collection.insert_one(prop_doc)
    prop_doc["_id"] = result.inserted_id
    return property_doc_to_response(prop_doc)


@router.get("", response_model=List[PropertyResponse])
def list_properties(
    city: Optional[str] = Query(None),
    listing_type: Optional[str] = Query(None),
    property_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    min_budget: Optional[float] = Query(None),
    max_budget: Optional[float] = Query(None),
    bhk_type: Optional[str] = Query(None),
    property_types: Optional[str] = Query(None),
    amenities: Optional[str] = Query(None),
    furnishing: Optional[str] = Query(None),
    posted_by: Optional[str] = Query(None),
    age_of_property: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    query = {}
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    if listing_type:
        query["listing_type"] = listing_type
        
    if property_types:
        query["property_type"] = {"$in": property_types.split(",")}
    elif property_type:
        query["property_type"] = property_type

    if min_budget is not None or max_budget is not None:
        query["expected_price"] = {}
        if min_budget is not None: query["expected_price"]["$gte"] = min_budget
        if max_budget is not None: query["expected_price"]["$lte"] = max_budget

    if bhk_type:
        query["bhk_type"] = {"$in": bhk_type.split(",")}
    if amenities:
        query["amenities"] = {"$in": amenities.split(",")}
    if furnishing:
        query["furnishing"] = {"$in": furnishing.split(",")}
    if posted_by:
        query["posted_by"] = {"$in": posted_by.split(",")}
    if age_of_property:
        query["age_of_property"] = {"$in": age_of_property.split(",")}

    if search:
        query["$or"] = [
            {"city": {"$regex": search, "$options": "i"}},
            {"locality": {"$regex": search, "$options": "i"}},
            {"project_name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]

    cursor = properties_collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
    return [property_doc_to_response(doc) for doc in cursor]


@router.get("/my", response_model=List[PropertyResponse])
def list_my_properties(
    current_user: dict = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
):
    query = {} if current_user.get("role") == "admin" else {"user_id": current_user["id"]}
    cursor = (
        properties_collection.find(query)
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )
    return [property_doc_to_response(doc) for doc in cursor]


@router.get("/featured", response_model=List[PropertyResponse])
def list_featured_properties(limit: int = Query(50, ge=1, le=50)):
    cursor = (
        properties_collection.find({"is_featured": True})
        .sort("created_at", -1)
        .limit(limit)
    )
    return [property_doc_to_response(doc) for doc in cursor]


@router.get("/new-launches", response_model=List[PropertyResponse])
def list_new_launches(limit: int = Query(50, ge=1, le=50)):
    cursor = (
        properties_collection.find({"is_new_launch": True})
        .sort("created_at", -1)
        .limit(limit)
    )
    return [property_doc_to_response(doc) for doc in cursor]


@router.get("/trending", response_model=List[PropertyResponse])
def list_trending(limit: int = Query(50, ge=1, le=50)):
    cursor = (
        properties_collection.find({"is_trending": True})
        .sort("views_count", -1)
        .limit(limit)
    )
    return [property_doc_to_response(doc) for doc in cursor]


@router.get("/{property_id}", response_model=PropertyResponse)
def get_property(property_id: str):
    if not ObjectId.is_valid(property_id):
        raise HTTPException(status_code=400, detail="Invalid property ID")

    doc = properties_collection.find_one({"_id": ObjectId(property_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Property not found")

    # Increment view count
    properties_collection.update_one(
        {"_id": ObjectId(property_id)}, {"$inc": {"views_count": 1}}
    )

    return property_doc_to_response(doc)


@router.put("/{property_id}", response_model=PropertyResponse)
def update_property(
    property_id: str,
    update_data: PropertyUpdate,
    current_user: dict = Depends(get_current_user),
):
    if not ObjectId.is_valid(property_id):
        raise HTTPException(status_code=400, detail="Invalid property ID")

    doc = properties_collection.find_one({"_id": ObjectId(property_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Property not found")

    if doc["user_id"] != current_user["id"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    update_fields = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if update_fields:
        properties_collection.update_one(
            {"_id": ObjectId(property_id)}, {"$set": update_fields}
        )

    updated_doc = properties_collection.find_one({"_id": ObjectId(property_id)})
    return property_doc_to_response(updated_doc)


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_property(
    property_id: str,
    current_user: dict = Depends(get_current_user),
):
    if not ObjectId.is_valid(property_id):
        raise HTTPException(status_code=400, detail="Invalid property ID")

    doc = properties_collection.find_one({"_id": ObjectId(property_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Property not found")

    if doc["user_id"] != current_user["id"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    properties_collection.delete_one({"_id": ObjectId(property_id)})
