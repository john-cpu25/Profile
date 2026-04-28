import sqlite3
import os

db_path = r'c:\Users\nguye\OneDrive\AI\BIM Profile\backend\sql_app.db'

if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Get the IDs of the latest 10 projects
        cursor.execute("SELECT id FROM projects ORDER BY created_at DESC LIMIT 10")
        keep_ids = [row[0] for row in cursor.fetchall()]
        
        if keep_ids:
            placeholders = ','.join(['?'] * len(keep_ids))
            cursor.execute(f"DELETE FROM projects WHERE id NOT IN ({placeholders})", keep_ids)
            print(f"Deleted {cursor.rowcount} projects. Kept the 10 most recent ones.")
            
            # Clean up media orphans
            cursor.execute("DELETE FROM project_media WHERE project_id NOT IN (SELECT id FROM projects)")
            print(f"Cleaned up {cursor.rowcount} orphaned media entries.")
        else:
            print("No projects found to keep.")
            
        conn.commit()
    except Exception as e:
        print(f"Error during cleanup: {e}")
        conn.rollback()
    finally:
        conn.close()
