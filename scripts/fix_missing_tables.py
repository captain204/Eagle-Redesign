import sqlite3
import os

db_path = 'payload.db'
if not os.path.exists(db_path):
    print(f"Database {db_path} does not exist yet. Letting Next.js/Payload create it natively.")
    exit(0)

db = sqlite3.connect(db_path)
cursor = db.cursor()

# Create sliders table
try:
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS "sliders" (
        "id" integer PRIMARY KEY AUTOINCREMENT,
        "title" text NOT NULL,
        "subtitle" text,
        "image_id" integer NOT NULL,
        "link" text,
        "active" numeric DEFAULT 1,
        "order" numeric,
        "updated_at" text,
        "created_at" text,
        FOREIGN KEY("image_id") REFERENCES "media"("id")
    );
    ''')
    print("Checked/Created table: sliders")
except Exception as e:
    print(f"Error checking sliders: {e}")

# Try to add active and order columns in case the table already existed but without them
try:
    cursor.execute('ALTER TABLE "sliders" ADD COLUMN "active" numeric DEFAULT 1;')
    print("Added 'active' column to sliders")
except sqlite3.OperationalError:
    pass # Column exists

try:
    cursor.execute('ALTER TABLE "sliders" ADD COLUMN "order" numeric;')
    print("Added 'order' column to sliders")
except sqlite3.OperationalError:
    pass # Column exists

# Add missing columns to users table
user_columns_to_add = [
    ("login_attempts", "numeric DEFAULT 0"),
    ("lock_until", "text"),
    ("avatar_id", "integer"),
    ("deactivated", "integer DEFAULT 0"),
    ("reset_password_token", "text"),
    ("reset_password_expiration", "text"),
    ("salt", "text"),
    ("hash", "text"),
    ("role", "text DEFAULT 'viewer'")
]

for col_name, col_type in user_columns_to_add:
    try:
        cursor.execute(f'ALTER TABLE "users" ADD COLUMN "{col_name}" {col_type};')
        print(f"Added '{col_name}' column to users")
    except sqlite3.OperationalError:
        pass # Column exists

# Create qr_codes table
try:
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS "qr_codes" (
        "id" integer PRIMARY KEY AUTOINCREMENT,
        "name" text NOT NULL,
        "slug" text NOT NULL,
        "targetUrl" text DEFAULT 'https://www.1steagle.com.ng' NOT NULL,
        "oldQRCodeImage_id" integer,
        "redirectType" text DEFAULT '307',
        "description" text,
        "updated_at" text,
        "created_at" text,
        FOREIGN KEY("oldQRCodeImage_id") REFERENCES "media"("id")
    );
    ''')
    print("Checked/Created table: qr_codes")
    
    # Also add unique index for slug
    cursor.execute('CREATE UNIQUE INDEX IF NOT EXISTS "qr_codes_slug_idx" ON "qr_codes" ("slug");')
    print("Checked/Created index: qr_codes_slug_idx")

except Exception as e:
    print(f"Error checking qr_codes: {e}")

db.commit()

# Also run fix_sqlite for payload_locked_documents_rels just in case
collections = ["sliders_id", "qr_codes_id"]
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
print("Success: Checked DB structure for missing tables!")
