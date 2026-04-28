import sqlite3
import os

db_path = r'c:\Users\nguye\OneDrive\AI\BIM Profile\backend\sql_app.db'

if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT id, username, email, full_name FROM users")
        users = cursor.fetchall()
        print("Users in database:")
        for user in users:
            print(f"ID: {user[0]}, Username: {user[1]}, Email: {user[2]}, Full Name: {user[3]}")
    except sqlite3.OperationalError as e:
        print(f"Error: {e}")
    finally:
        conn.close()
