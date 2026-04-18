import os
import random
import mimetypes
from datetime import datetime, timezone, timedelta
from pymongo import MongoClient
import gridfs
from bson import ObjectId

# Directories
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))
OUTSIDE_DIR = os.path.join(FRONTEND_DIR, 'Outside')
INSIDE_DIR = os.path.join(FRONTEND_DIR, 'Inside')

# MongoDB Connection
MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "freshbooking"
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
fs = gridfs.GridFS(db)
properties_coll = db["properties"]
users_coll = db["users"]

from app.utils.auth import hash_password

def get_or_create_user():
    user = users_coll.find_one({"email": "admin@freshbooking.in"})
    if not user:
        user_id = users_coll.insert_one({
            "name": "Admin User",
            "email": "admin@freshbooking.in",
            "phone": "9876543210",
            "hashed_password": hash_password("admin123"),
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        }).inserted_id
        return str(user_id)
    
    # Update existing admin to ensure password is correct
    users_coll.update_one(
        {"email": "admin@freshbooking.in"},
        {"$set": {"hashed_password": hash_password("admin123")}}
    )
    return str(user["_id"])

def upload_image(filepath):
    if not os.path.exists(filepath):
        print(f"Warning: File not found {filepath}")
        return None
    with open(filepath, 'rb') as f:
        file_data = f.read()
    content_type, _ = mimetypes.guess_type(filepath)
    if not content_type:
        content_type = 'image/jpeg'
    filename = os.path.basename(filepath)
    file_id = fs.put(file_data, filename=filename, content_type=content_type)
    return str(file_id)

def get_random_images():
    outside_files = []
    if os.path.exists(OUTSIDE_DIR):
        outside_files = [os.path.join(OUTSIDE_DIR, f) for f in os.listdir(OUTSIDE_DIR) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
    
    inside_files = []
    if os.path.exists(INSIDE_DIR):
        inside_files = [os.path.join(INSIDE_DIR, f) for f in os.listdir(INSIDE_DIR) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]

    # Rule: First image from Outside (for homepage), remaining from Inside (for slider)
    chosen_files = []
    if outside_files:
        chosen_files.append(random.choice(outside_files))
    
    if inside_files:
        num_inside = random.randint(5,7)
        # Unique samples if enough inside files
        if len(inside_files) >= num_inside:
            chosen_files.extend(random.sample(inside_files, num_inside))
        else:
            chosen_files.extend(inside_files)

    image_ids = []
    for f in chosen_files:
        file_id = upload_image(f)
        if file_id:
            image_ids.append(file_id)
            
    return image_ids

# Data Pools
AMENITIES = ['Swimming Pool', 'Gym', 'Parking', 'Garden', '24x7 Security', 'Power Backup', 'Lift', 'Clubhouse', 'Playground', 'Intercom', 'Fire Safety', 'Water Supply']

CITIES_DATA = {
    "Kanpur": [
        {"locality": "Swaroop Nagar", "project_name": "Swaroop Heights", "types": ["flat", "independent_house", "office"]},
        {"locality": "Kakadeo", "project_name": "Kakadeo Plaza", "types": ["flat", "shop"]},
        {"locality": "Civil Lines", "project_name": "Civil Estate", "types": ["villa", "independent_house", "office"]},
        {"locality": "Kalyanpur", "project_name": "Kalyanpur Greens", "types": ["flat", "plot"]},
        {"locality": "Shyam Nagar", "project_name": "Shyam Residency", "types": ["flat", "independent_house"]},
    ],
    "Noida": [
        {"locality": "Sector 150", "project_name": "ATS Pious Orchards", "types": ["flat", "villa"]},
        {"locality": "Sector 62", "project_name": "Logix Cyber Park", "types": ["office", "shop"]},
        {"locality": "Sector 137", "project_name": "Paras Tierea", "types": ["flat"]},
        {"locality": "Sector 93A", "project_name": "Supertech Emerald Court", "types": ["flat", "office"]},
        {"locality": "Sector 18", "project_name": "DLF Mall Area", "types": ["shop", "office"]},
    ],
    "Mumbai": [
        {"locality": "Andheri West", "project_name": "Lokhandwala Complex", "types": ["flat", "office"]},
        {"locality": "Bandra West", "project_name": "Pali Hill Estates", "types": ["villa", "flat"]},
        {"locality": "Powai", "project_name": "Hiranandani Gardens", "types": ["flat", "office", "shop"]},
        {"locality": "Juhu", "project_name": "Juhu Scheme Flats", "types": ["flat", "villa"]},
        {"locality": "Malad West", "project_name": "Infinity Residency", "types": ["flat"]},
    ],
    "Bangalore": [
        {"locality": "Whitefield", "project_name": "Prestige Shantiniketan", "types": ["flat", "office", "villa"]},
        {"locality": "Koramangala", "project_name": "Raheja Residency", "types": ["flat", "independent_house"]},
        {"locality": "Indiranagar", "project_name": "Indiranagar 100ft Road", "types": ["shop", "office", "independent_house"]},
        {"locality": "Electronic City", "project_name": "Infosys Township", "types": ["flat"]},
        {"locality": "HSR Layout", "project_name": "HSR Sector 2 Apartments", "types": ["flat", "plot"]},
    ],
    "Hyderabad": [
        {"locality": "Banjara Hills", "project_name": "Banjara Skyline", "types": ["villa", "flat"]},
        {"locality": "HITEC City", "project_name": "Cyber Towers Horizon", "types": ["flat", "office"]},
        {"locality": "Gachibowli", "project_name": "Golf Edge", "types": ["flat", "office"]},
        {"locality": "Jubilee Hills", "project_name": "Jubilee Villas", "types": ["villa", "plot"]},
        {"locality": "Kondapur", "project_name": "Aparna Serene", "types": ["flat"]},
    ],
    "Pune": [
        {"locality": "Koregaon Park", "project_name": "Osho Ashram Gardens", "types": ["flat", "villa"]},
        {"locality": "Viman Nagar", "project_name": "Phoenix Marketcity Residencies", "types": ["flat", "shop"]},
        {"locality": "Hinjewadi", "project_name": "Blue Ridge", "types": ["flat", "office"]},
        {"locality": "Baner", "project_name": "Panchshil Balmoral", "types": ["flat"]},
        {"locality": "Kalyani Nagar", "project_name": "Cerebrum IT Park Area", "types": ["flat", "office"]},
    ]
}

def generate_properties():
    print("Starting generation...")

    # Clean existing data
    print("Clearing existing properties...")
    properties_coll.delete_many({})
    print("Clearing existing GridFS images...")
    for grid_file in fs.find():
        fs.delete(grid_file._id)
    print("Clearing existing inquiries...")
    db["inquiries"].delete_many({})
    print("Cleanup complete!\n")

    user_id = get_or_create_user()
    
    total_inserted = 0

    for city, locations in CITIES_DATA.items():
        for i, loc in enumerate(locations):
            # We want to vary listing types and property types nicely
            prop_type = random.choice(loc["types"])
            
            if prop_type in ["office", "shop"]:
                listing_type = random.choice(["sell", "rent"])
                bhk_type = None
                furnishing = random.choice(["fully_furnished", "unfurnished"])
                expected_price = random.randint(10000000, 50000000) if listing_type == "sell" else random.randint(50000, 500000)
            elif prop_type == "plot":
                listing_type = "sell"
                bhk_type = None
                furnishing = None
                expected_price = random.randint(5000000, 20000000)
            else:
                listing_type = random.choice(["sell", "rent"])
                bhk_type = random.choice(["1bhk", "2bhk", "3bhk", "4bhk", "5+bhk"])
                furnishing = random.choice(["fully_furnished", "semi_furnished", "unfurnished"])
                if listing_type == "sell":
                    expected_price = random.randint(5000000, 40000000)
                else:
                    expected_price = random.randint(15000, 150000)

            built_up = float(random.randint(500, 4000))
            carpet = built_up * 0.8
            
            # Select images
            image_ids = get_random_images()
            
            # Date offset so they appear sorted differently
            days_ago = random.randint(0, 30)
            created_at = (datetime.now(timezone.utc) - timedelta(days=days_ago)).isoformat()
            
            doc = {
                "listing_type": listing_type,
                "property_type": prop_type,
                "city": city,
                "locality": loc["locality"],
                "project_name": loc["project_name"],
                "bhk_type": bhk_type,
                "built_up_area": built_up,
                "carpet_area": carpet,
                "bathrooms": random.randint(1, 5) if prop_type not in ["plot"] else None,
                "balconies": random.randint(0, 3) if prop_type not in ["plot"] else None,
                "floor_no": random.randint(1, 15) if prop_type in ["flat", "office", "shop"] else None,
                "total_floors": random.randint(5, 30) if prop_type in ["flat", "office", "shop"] else None,
                "furnishing": furnishing,
                "description": f"A wonderful {prop_type} available for {listing_type} in {loc['locality']}, {city}. Located securely in {loc['project_name']}, providing amazing views and robust connectivity. Get in touch for more details.",
                "amenities": random.sample(AMENITIES, random.randint(3, 8)),
                "posted_by": random.choice(["Owner", "Agent", "Builder"]),
                "age_of_property": random.choice(["New Construction", "0-5 Years", "5-10 Years", "10+ Years"]),
                "facing": random.choice(["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"]),
                "contact_email": f"{loc['locality'].lower().replace(' ', '')}@freshbooking.in",
                "contact_phone": f"98{random.randint(10000000, 99999999)}",
                "image_ids": image_ids,
                "expected_price": float(expected_price),
                "maintenance": float(random.randint(1000, 10000)),
                "user_id": user_id,
                "created_at": created_at,
                "is_featured": random.choice([True, False, False]), # 1/3 probability
                "is_verified": random.choice([True, False]),
                "is_new_launch": random.choice([True, False, False]), # 1/3 probability
                "is_trending": random.choice([True, False, False]), # 1/3 probability
                "views_count": random.randint(0, 500)
            }
            
            properties_coll.insert_one(doc)
            total_inserted += 1
            print(f"Inserted property {total_inserted}/30 ({city})")

    print(f"Done! Successfully inserted {total_inserted} properties.")

if __name__ == "__main__":
    generate_properties()
