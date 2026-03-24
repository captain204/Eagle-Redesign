import sqlite3

try:
    conn = sqlite3.connect('./payload.db')
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(users)")
    columns = cursor.fetchall()
    print("USERS COLUMNS:", columns)
    
    cursor.execute("PRAGMA index_list(users)")
    indices = cursor.fetchall()
    print("USERS INDICES:", indices)
    
except Exception as e:
    print(e)
finally:
    if 'conn' in locals():
        conn.close()
