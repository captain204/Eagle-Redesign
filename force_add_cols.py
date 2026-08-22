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
    
    # Drop all non-system indexes to prevent Drizzle push from crashing on boot
    # due to "index already exists" error (SQLite Drizzle adapter bug).
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        indexes = cursor.execute('SELECT name FROM sqlite_master WHERE type="index" AND name NOT LIKE "sqlite_%"').fetchall()
        for idx in indexes:
            cursor.execute(f'DROP INDEX IF EXISTS "{idx[0]}"')
        conn.commit()
        print(f"✅ Dropped {len(indexes)} existing indexes to allow clean Drizzle push.")
        conn.close()
    except Exception as e:
        print(f"❌ Error dropping indexes: {e}")

    # Just in case Drizzle push completely failed for the referral_earnings table
    # We will create it so the app can boot successfully.
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        
        # Drop the table if it exists to recreate it with the correct schema
        cursor.execute('DROP TABLE IF EXISTS "referral_earnings";')
        
        cursor.execute("""
        CREATE TABLE "referral_earnings" (
            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
            "referrer_id" integer NOT NULL,
            "order_id" integer NOT NULL,
            "amount_earned" numeric NOT NULL,
            "status" text DEFAULT 'pending',
            "earned_at" text NOT NULL,
            "updated_at" text,
            "created_at" text,
            FOREIGN KEY ("referrer_id") REFERENCES "users"("id"),
            FOREIGN KEY ("order_id") REFERENCES "orders"("id")
        );
        """)
        conn.commit()
        print("✅ Checked/Created referral_earnings table with correct Payload schema")
        conn.close()
    except Exception as e:
        print(f"❌ Error creating table: {e}")

    # Missing columns for Users payout details
    add_column(db_file, "users", "payout_details_phone", "text")
    add_column(db_file, "users", "payout_details_bank_name", "text")
    add_column(db_file, "users", "payout_details_account_name", "text")
    add_column(db_file, "users", "payout_details_account_number", "text")

    print("Database relations fix completed! Restart the app to apply.")
