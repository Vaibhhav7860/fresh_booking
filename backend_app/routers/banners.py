from fastapi import APIRouter
from typing import List
from bson import ObjectId
from backend_app.database import banners_collection, properties_collection
from backend_app.models.banner import BannerResponse

router = APIRouter(prefix="/api/banners", tags=["Banners"])


def banner_doc_to_response(doc: dict) -> BannerResponse:
    """Convert a banner MongoDB document to a BannerResponse, resolving property info."""
    property_title = ""
    property_city = ""
    property_price = None

    prop_id = doc.get("property_id", "")
    if prop_id and ObjectId.is_valid(prop_id):
        prop = properties_collection.find_one({"_id": ObjectId(prop_id)})
        if prop:
            property_title = prop.get("project_name") or prop.get("property_type", "")
            property_city = prop.get("city", "")
            property_price = prop.get("expected_price")

    return BannerResponse(
        id=str(doc["_id"]),
        image_id=doc.get("image_id", ""),
        property_id=prop_id,
        title=doc.get("title", ""),
        order=doc.get("order", 0),
        is_active=doc.get("is_active", True),
        created_at=doc.get("created_at", ""),
        property_title=property_title,
        property_city=property_city,
        property_price=property_price,
    )


@router.get("", response_model=List[BannerResponse])
def get_active_banners():
    """Public endpoint: returns all active banners sorted by order."""
    cursor = banners_collection.find({"is_active": True}).sort("order", 1)
    return [banner_doc_to_response(doc) for doc in cursor]
