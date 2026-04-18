from fastapi import APIRouter, HTTPException, status, Query
from datetime import datetime, timezone
from bson import ObjectId
from typing import List
from app.database import inquiries_collection, properties_collection, users_collection
from app.models.inquiry import InquiryCreate, InquiryResponse

router = APIRouter(prefix="/api/inquiries", tags=["Inquiries"])


@router.post("", response_model=InquiryResponse, status_code=status.HTTP_201_CREATED)
def create_inquiry(data: InquiryCreate):
    # Validate property exists
    prop = properties_collection.find_one({"_id": ObjectId(data.property_id)})
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")

    # Build property title for admin display
    config = prop.get("bhk_type", "").upper() if prop.get("bhk_type") else ""
    pt_map = {
        "flat": "Apartment", "independent_house": "Independent House",
        "villa": "Villa", "plot": "Plot/Land", "office": "Office", "shop": "Shop"
    }
    p_type = pt_map.get(prop.get("property_type", ""), "Property")
    property_title = prop.get("project_name") or f"{config} {p_type}"
    if prop.get("locality"):
        property_title += f" in {prop['locality']}"

    inquiry_doc = {
        "name": data.name,
        "email": data.email,
        "phone": data.phone,
        "property_id": data.property_id,
        "property_title": property_title,
        "property_city": prop.get("city", ""),
        "inquiry_type": data.inquiry_type,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    result = inquiries_collection.insert_one(inquiry_doc)
    inquiry_doc["_id"] = result.inserted_id

    # Return owner contact details after successful inquiry
    owner_email = prop.get("contact_email")
    owner_phone = prop.get("contact_phone")

    # Fallback: if no contact fields on property, try the user record
    if not owner_email or not owner_phone:
        user = users_collection.find_one({"_id": ObjectId(prop.get("user_id", ""))})
        if user:
            if not owner_email:
                owner_email = user.get("email")
            if not owner_phone:
                owner_phone = user.get("phone")

    return InquiryResponse(
        id=str(inquiry_doc["_id"]),
        name=inquiry_doc["name"],
        email=inquiry_doc["email"],
        phone=inquiry_doc["phone"],
        property_id=inquiry_doc["property_id"],
        property_title=inquiry_doc["property_title"],
        property_city=inquiry_doc["property_city"],
        inquiry_type=inquiry_doc["inquiry_type"],
        created_at=inquiry_doc["created_at"],
        owner_contact_email=owner_email,
        owner_contact_phone=owner_phone,
    )


@router.get("", response_model=List[InquiryResponse])
def list_inquiries(skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=100)):
    """Admin endpoint to view all inquiries/leads."""
    cursor = inquiries_collection.find().sort("created_at", -1).skip(skip).limit(limit)
    results = []
    for doc in cursor:
        results.append(InquiryResponse(
            id=str(doc["_id"]),
            name=doc.get("name", ""),
            email=doc.get("email", ""),
            phone=doc.get("phone", ""),
            property_id=doc.get("property_id", ""),
            property_title=doc.get("property_title", ""),
            property_city=doc.get("property_city", ""),
            inquiry_type=doc.get("inquiry_type", "contact"),
            created_at=doc.get("created_at"),
        ))
    return results
