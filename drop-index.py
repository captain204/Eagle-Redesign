import sqlite3

try:
    conn = sqlite3.connect('./payload.db')
    cursor = conn.cursor()
    cursor.execute("DROP INDEX IF EXISTS users_avatar_idx")
    conn.commit()
    print("Index dropped.")
except Exception as e:
    print(e)
finally:
    if 'conn' in locals():
        conn.close()
