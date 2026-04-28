import sqlite3
import os

db_path = r'c:\Users\nguye\OneDrive\AI\BIM Profile\backend\sql_app.db'

if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT username, password_hash FROM users WHERE username='admin'")
        user = cursor.fetchone()
        if user:
            print(f"Username: {user[0]}")
            print(f"Password Hash: {user[1]}")
        else:
            print("Admin user not found")
    except sqlite3.OperationalError as e:
        print(f"Error: {e}")
    finally:
        conn.close()
