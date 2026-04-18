from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class PropertyCreate(BaseModel):
    # Step 1: Basic Info
    listing_type: str = Field(..., description="sell, rent, or pg")
    property_type: str = Field(..., description="flat, independent_house, villa, plot, office, shop")
    city: str = Field(..., min_length=2)
    locality: str = Field(default="")
    project_name: str = Field(default="")

    # Step 2: Property Details
    bhk_type: Optional[str] = Field(default=None, description="1bhk, 2bhk, 3bhk, 4bhk, 5+bhk")
    built_up_area: Optional[float] = None
    carpet_area: Optional[float] = None
    bathrooms: Optional[int] = None
    balconies: Optional[int] = None
    floor_no: Optional[int] = None
    total_floors: Optional[int] = None
    furnishing: Optional[str] = Field(default=None, description="fully_furnished, semi_furnished, unfurnished")
    description: Optional[str] = Field(default="")
    amenities: List[str] = Field(default=[])
    posted_by: str = Field(default="Owner")
    age_of_property: str = Field(default="New Construction")
    facing: Optional[str] = Field(default=None, description="East, West, North, South, etc.")
    contact_email: Optional[str] = Field(default=None)
    contact_phone: Optional[str] = Field(default=None)

    # Step 3: Photos & Price
    image_ids: List[str] = Field(default=[])
    expected_price: Optional[float] = None
    maintenance: Optional[float] = None


class PropertyUpdate(BaseModel):
    listing_type: Optional[str] = None
    property_type: Optional[str] = None
    city: Optional[str] = None
    locality: Optional[str] = None
    project_name: Optional[str] = None
    bhk_type: Optional[str] = None
    built_up_area: Optional[float] = None
    carpet_area: Optional[float] = None
    bathrooms: Optional[int] = None
    balconies: Optional[int] = None
    floor_no: Optional[int] = None
    total_floors: Optional[int] = None
    furnishing: Optional[str] = None
    description: Optional[str] = None
    amenities: Optional[List[str]] = None
    posted_by: Optional[str] = None
    age_of_property: Optional[str] = None
    facing: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    image_ids: Optional[List[str]] = None
    expected_price: Optional[float] = None
    maintenance: Optional[float] = None


class PropertyResponse(BaseModel):
    id: str
    listing_type: str
    property_type: str
    city: str
    locality: str = ""
    project_name: str = ""
    bhk_type: Optional[str] = None
    built_up_area: Optional[float] = None
    carpet_area: Optional[float] = None
    bathrooms: Optional[int] = None
    balconies: Optional[int] = None
    floor_no: Optional[int] = None
    total_floors: Optional[int] = None
    furnishing: Optional[str] = None
    description: str = ""
    amenities: List[str] = []
    posted_by: str = "Owner"
    age_of_property: str = "New Construction"
    facing: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    image_ids: List[str] = []
    expected_price: Optional[float] = None
    maintenance: Optional[float] = None
    user_id: str = ""
    user_name: str = ""
    created_at: Optional[str] = None
    is_featured: bool = False
    is_verified: bool = False
    is_new_launch: bool = False
    is_trending: bool = False
    views_count: int = 0
