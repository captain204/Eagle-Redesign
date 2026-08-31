import sqlite3

def drop_index(db_path, index_name):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute(f'DROP INDEX IF EXISTS "{index_name}";')
        conn.commit()
        print(f"✅ Dropped index {index_name}")
    except Exception as e:
        print(f"❌ Error dropping {index_name}: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    db_file = "payload.db"
    drop_index(db_file, "referral_earnings_referrer_idx")
    drop_index(db_file, "referral_earnings_order_idx")
    drop_index(db_file, "users_referral_code_idx")
