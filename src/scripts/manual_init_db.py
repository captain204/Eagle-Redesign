import sqlite3
import os

db_path = 'payload.db'

def create_table():
    # Ensure the file exists (it should be 0 bytes right now)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Create users table based on the failed query schema
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS "users" (
                "id" INTEGER PRIMARY KEY AUTOINCREMENT,
                "name" TEXT,
                "role" TEXT,
                "avatar_id" INTEGER,
                "deactivated" INTEGER DEFAULT 0,
                "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
                "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
                "email" TEXT UNIQUE NOT NULL,
                "reset_password_token" TEXT,
                "reset_password_expiration" DATETIME,
                "salt" TEXT,
                "hash" TEXT,
                "login_attempts" INTEGER DEFAULT 0,
                "lock_until" DATETIME
            )
        ''')

        # Create users_sessions table based on the subquery
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS "users_sessions" (
                "_order" INTEGER,
                "id" TEXT PRIMARY KEY,
                "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
                "expires_at" DATETIME,
                "_parent_id" INTEGER,
                FOREIGN KEY("_parent_id") REFERENCES "users"("id")
            )
        ''')

        # Create other essential tables if we can guess them
        # (Media, Categories, etc.) but let's start with these two as they are in the error
        
        conn.commit()
        print("Successfully created 'users' and 'users_sessions' tables.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    create_table()
