import sqlite3

db = sqlite3.connect('payload.db')
cursor = db.cursor()

columns = [
    ("target_url", "text"),
    ("old_q_r_code_image_id", "integer"),
    ("redirect_type", "text")
]

for col, ctype in columns:
    try:
        cursor.execute(f'ALTER TABLE "qr_codes" ADD COLUMN "{col}" {ctype};')
        print(f"Added {col} to qr_codes")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            pass # Column already exists
        else:
            print(f"Error adding {col} to qr_codes: {e}")

db.commit()
db.close()
print("Done fixing qr_codes table!")
