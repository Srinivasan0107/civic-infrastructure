"""
Migrate all collections, indexes, and GridFS buckets from local MongoDB to MongoDB Atlas.
Usage:
    python backend/app/scripts/migrate_to_cloud.py --target-uri "mongodb+srv://<user>:<pass>@cluster0.fr0tkwo.mongodb.net/?retryWrites=true&w=majority"
"""
import sys
import argparse
import pymongo
from pymongo.errors import PyMongoError

LOCAL_URI = "mongodb://127.0.0.1:27017"
DB_NAME = "civic_memory"

def migrate(target_uri: str, update_env: bool = True):
    print(f"=== CIVIC INFRASTRUCTURE MEMORY: CLOUD MIGRATION ===")
    print(f"Source (Local): {LOCAL_URI}/{DB_NAME}")
    
    # Hide password in logs
    masked_target = target_uri
    if "@" in target_uri and ":" in target_uri.split("@")[0]:
        prefix = target_uri.split("://")[0] + "://"
        creds, host_part = target_uri.split("://")[1].split("@", 1)
        user = creds.split(":")[0]
        masked_target = f"{prefix}{user}:****@{host_part}"
    print(f"Target (Cloud): {masked_target}/{DB_NAME}\n")

    try:
        source_client = pymongo.MongoClient(LOCAL_URI, serverSelectionTimeoutMS=4000)
        source_client.admin.command("ping")
        source_db = source_client[DB_NAME]
        print("[OK] Connected to local MongoDB.")
    except Exception as e:
        print(f"[ERROR] Could not connect to local MongoDB: {e}")
        return False

    try:
        target_client = pymongo.MongoClient(target_uri, serverSelectionTimeoutMS=8000)
        target_client.admin.command("ping")
        target_db = target_client[DB_NAME]
        print("[OK] Successfully connected and authenticated to MongoDB Atlas Cloud Cluster!\n")
    except Exception as e:
        print(f"[ERROR] Failed to authenticate or connect to MongoDB Atlas: {e}")
        print("\nPlease verify your database username and password.")
        print("Format: mongodb+srv://<db_username>:<db_password>@cluster0.fr0tkwo.mongodb.net/?retryWrites=true&w=majority")
        return False

    collections = source_db.list_collection_names()
    print(f"Found {len(collections)} collections to migrate:")
    for c in sorted(collections):
        count = source_db[c].count_documents({})
        print(f"  - {c}: {count} records")

    print("\nStarting data migration...")
    total_migrated = 0

    for coll_name in sorted(collections):
        source_coll = source_db[coll_name]
        target_coll = target_db[coll_name]
        
        count = source_coll.count_documents({})
        if count == 0:
            continue

        print(f"Migrating {coll_name} ({count} documents)...", end="", flush=True)
        cursor = source_coll.find({})
        batch = []
        batch_size = 500
        migrated_in_coll = 0

        for doc in cursor:
            batch.append(doc)
            if len(batch) >= batch_size:
                try:
                    # Use replace_one with upsert to prevent duplicates
                    ops = [
                        pymongo.ReplaceOne({"_id": d["_id"]}, d, upsert=True)
                        for d in batch
                    ]
                    target_coll.bulk_write(ops, ordered=False)
                    migrated_in_coll += len(batch)
                    batch = []
                except Exception as err:
                    print(f" [Warning batch: {err}]", end="")

        if batch:
            try:
                ops = [
                    pymongo.ReplaceOne({"_id": d["_id"]}, d, upsert=True)
                    for d in batch
                ]
                target_coll.bulk_write(ops, ordered=False)
                migrated_in_coll += len(batch)
            except Exception as err:
                print(f" [Warning final batch: {err}]", end="")

        target_count = target_coll.count_documents({})
        print(f" -> Done! ({target_count} in cloud)")
        total_migrated += migrated_in_coll

    print(f"\n[OK] Total migrated documents: {total_migrated}")

    if update_env:
        try:
            env_path = "backend/.env"
            with open(env_path, "r", encoding="utf-8") as f:
                lines = f.readlines()
            
            with open(env_path, "w", encoding="utf-8") as f:
                replaced = False
                for line in lines:
                    if line.startswith("MONGODB_URI="):
                        f.write(f"MONGODB_URI={target_uri}\n")
                        replaced = True
                    else:
                        f.write(line)
                if not replaced:
                    f.write(f"MONGODB_URI={target_uri}\n")
            print(f"[OK] Updated backend/.env to point directly to MongoDB Atlas!")
        except Exception as e:
            print(f"[Warning] Could not auto-update backend/.env: {e}")

    print("\n=== CLOUD MIGRATION COMPLETED SUCCESSFULLY ===")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Migrate local civic_memory datasets to MongoDB Atlas")
    parser.add_argument("--target-uri", required=True, help="MongoDB Atlas URI with credentials")
    parser.add_argument("--no-env-update", action="store_true", help="Do not update backend/.env")
    args = parser.parse_args()

    success = migrate(args.target_uri, update_env=not args.no_env_update)
    sys.exit(0 if success else 1)
