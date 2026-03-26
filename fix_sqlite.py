import sqlite3

db = sqlite3.connect('payload.db')
cursor = db.cursor()

collections = [
    "users_id", "media_id", "categories_id", "tags_id", "products_id", "pages_id", 
    "posts_id", "comments_id", "orders_id", "coupons_id", "product_reviews_id", 
    "abandoned_carts_id", "audit_logs_id", "menus_id", "ambassadors_id", 
    "distributors_id", "submissions_id", "sliders_id", "qr_codes_id"
]

for col in collections:
    try:
        cursor.execute(f'ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "{col}" integer;')
        print(f"Added {col} to payload_locked_documents_rels")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            pass # Column already exists
        else:
            print(f"Error adding {col} to payload_locked_documents_rels: {e}")

db.commit()
db.close()
print("Done locking rels fix!")
