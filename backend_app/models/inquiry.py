from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class InquiryCreate(BaseModel):
    name: str = Field(..., min_length=2)
    email: str = Field(...)
    phone: str = Field(..., min_length=10, max_length=15)
    property_id: str = Field(...)
    inquiry_type: str = Field(default="contact", description="contact or email")


class InquiryResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    property_id: str
    property_title: str = ""
    property_city: str = ""
    inquiry_type: str = "contact"
    created_at: Optional[str] = None
    # Owner details revealed after submission
    owner_contact_email: Optional[str] = None
    owner_contact_phone: Optional[str] = None
