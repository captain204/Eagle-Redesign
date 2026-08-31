import sqlite3

def drop_all_indexes(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all indexes that are not auto-created by SQLite
    indexes = cursor.execute('SELECT name FROM sqlite_master WHERE type="index" AND name NOT LIKE "sqlite_%"').fetchall()
    
    count = 0
    for idx in indexes:
        index_name = idx[0]
        try:
            cursor.execute(f'DROP INDEX IF EXISTS "{index_name}"')
            count += 1
        except Exception as e:
            print(f"Failed to drop {index_name}: {e}")
            
    conn.commit()
    conn.close()
    print(f"Dropped {count} indexes.")

if __name__ == "__main__":
    drop_all_indexes("payload.db")
