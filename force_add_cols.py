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
    print("Fixing SQLite schema...")
    
    # Users collection
    add_column(db_file, "users", "referral_code", "TEXT")
    add_column(db_file, "users", "referred_by_id", "INTEGER")
    
    # Products collection
    add_column(db_file, "products", "referral_percentage", "REAL")
    
    # Orders collection
    add_column(db_file, "orders", "applied_referral_code", "TEXT")
    
    # Posts collection
    add_column(db_file, "posts", "estimated_reading_time", "REAL")
    add_column(db_file, "posts", "meta_title", "TEXT")
    add_column(db_file, "posts", "meta_description", "TEXT")
    add_column(db_file, "posts", "focus_keyword", "TEXT")
    add_column(db_file, "posts", "open_graph_image_id", "INTEGER")
    
    print("Database fix completed! Restart the app to apply.")
