import sqlite3

def add_column(db_path, table_name, column_name, column_type):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type};")
        conn.commit()
        print(f"✅ Added {column_name} to {table_name}")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            print(f"⚠️ Column {column_name} already exists in {table_name}")
        else:
            print(f"❌ Error adding {column_name} to {table_name}: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    db_file = "payload.db"
    print("Fixing SQLite schema relations...")
    
    # Missing columns in payload_locked_documents_rels
    add_column(db_file, "payload_locked_documents_rels", "referral_earnings_id", "INTEGER")
    add_column(db_file, "payload_locked_documents_rels", "contact_submissions_id", "INTEGER")
    
    # Just in case Drizzle push completely failed for the referral_earnings table
    # We will create it so the app can boot successfully.
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS "referral_earnings" (
            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
            "user_id" integer,
            "order_id" integer,
            "amount" real,
            "status" text,
            "updated_at" text,
            "created_at" text
        );
        """)
        conn.commit()
        print("✅ Checked/Created referral_earnings table")
        conn.close()
    except Exception as e:
        print(f"❌ Error creating table: {e}")

    # Missing columns for Users payout details
    add_column(db_file, "users", "payout_details_phone", "text")
    add_column(db_file, "users", "payout_details_bank_name", "text")
    add_column(db_file, "users", "payout_details_account_name", "text")
    add_column(db_file, "users", "payout_details_account_number", "text")

    print("Database relations fix completed! Restart the app to apply.")
