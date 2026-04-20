import os
from pymongo import MongoClient

LOCAL_URI = "mongodb://localhost:27017"
REMOTE_URI = "mongodb+srv://officialfreshbooking_db_user:vmj8h9aAXBw1gj50@fresh-bookings.1rykywv.mongodb.net/"
DB_NAME = "freshbooking"

print("Connecting to local MongoDB...")
local_client = MongoClient(LOCAL_URI)
local_db = local_client[DB_NAME]

print("Connecting to remote MongoDB Atlas...")
remote_client = MongoClient(REMOTE_URI, tlsAllowInvalidCertificates=True)
remote_db = remote_client[DB_NAME]

collections = ["users", "properties", "fs.files", "fs.chunks"]

for coll_name in collections:
    print(f"\nProcessing collection: {coll_name}")
    
    local_coll = local_db[coll_name]
    remote_coll = remote_db[coll_name]
    
    total_docs = local_coll.count_documents({})
    print(f"Found {total_docs} documents in local database.")
    
    if total_docs > 0:
        print(f"Clearing remote collection '{coll_name}'...")
        remote_coll.delete_many({})
        
        print(f"Migrating documents in batches...")
        batch_size = 100
        cursor = local_coll.find()
        
        batch = []
        migrated = 0
        for doc in cursor:
            batch.append(doc)
            if len(batch) >= batch_size:
                remote_coll.insert_many(batch)
                migrated += len(batch)
                print(f"Migrated {migrated}/{total_docs}...")
                batch = []
                
        if batch:
            remote_coll.insert_many(batch)
            migrated += len(batch)
            print(f"Migrated {migrated}/{total_docs}...")
            
        print(f"Successfully migrated collection {coll_name}.")
    else:
        print("No documents found to migrate.")

print("\nMigration completed successfully!")
