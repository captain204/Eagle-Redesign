import sqlite3

db = sqlite3.connect('payload.db')
cursor = db.cursor()

# Get all indexes that are not auto-created by sqlite
cursor.execute("SELECT name FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%'")
indexes = cursor.fetchall()

for (index_name,) in indexes:
    try:
        cursor.execute(f"DROP INDEX IF EXISTS {index_name}")
        print(f"Dropped index {index_name}")
    except Exception as e:
        print(f"Failed to drop {index_name}: {e}")

db.commit()
db.close()
print("Finished dropping custom indexes.")
