import sqlite3
import os

db_path = r'c:\Users\nguye\OneDrive\AI\BIM Profile\backend\sql_app.db'

if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT COUNT(*) FROM projects")
        count = cursor.fetchone()[0]
        print(f"Total projects: {count}")
        
        cursor.execute("SELECT title, created_at FROM projects ORDER BY created_at DESC LIMIT 10")
        projects = cursor.fetchall()
        print("\nLatest 10 projects:")
        for p in projects:
            print(f"Title: {p[0]}, Created At: {p[1]}")
            
    except sqlite3.OperationalError as e:
        print(f"Error: {e}")
    finally:
        conn.close()
