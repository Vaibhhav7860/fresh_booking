from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class BannerCreate(BaseModel):
    image_id: str = Field(..., description="GridFS image ID for the banner")
    property_id: str = Field(..., description="ID of the linked property")
    title: Optional[str] = Field(default="", description="Optional banner title/label")
    order: int = Field(default=0, description="Display order (lower = first)")
    is_active: bool = Field(default=True, description="Whether the banner is visible")


class BannerUpdate(BaseModel):
    image_id: Optional[str] = None
    property_id: Optional[str] = None
    title: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class BannerResponse(BaseModel):
    id: str
    image_id: str
    property_id: str
    title: str = ""
    order: int = 0
    is_active: bool = True
    created_at: Optional[str] = None
    # Resolved property info
    property_title: str = ""
    property_city: str = ""
    property_price: Optional[float] = None
