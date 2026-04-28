import sqlite3
import os

db_path = r'c:\Users\nguye\OneDrive\AI\BIM Profile\backend\sql_app.db'

if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if the column already exists
        cursor.execute("PRAGMA table_info(profiles)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'updated_at' not in columns:
            print("Adding updated_at column to profiles table...")
            cursor.execute("ALTER TABLE profiles ADD COLUMN updated_at DATETIME")
            # Set a default value for existing rows
            from datetime import datetime
            now = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
            cursor.execute(f"UPDATE profiles SET updated_at = '{now}' WHERE updated_at IS NULL")
            print("Column added successfully.")
        else:
            print("Column updated_at already exists.")
            
        conn.commit()
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        conn.close()
