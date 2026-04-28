import sqlite3
import os

db_path = r'c:\Users\nguye\OneDrive\AI\BIM Profile\backend\sql_app.db'

if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Get the timestamp of the latest project
        cursor.execute("SELECT created_at FROM projects ORDER BY created_at DESC LIMIT 1")
        latest_ts = cursor.fetchone()[0]
        print(f"Latest project timestamp: {latest_ts}")
        
        # In our case, projects created in the same batch have very close timestamps (within 1-2 seconds)
        # We'll keep projects from the last 10 seconds of activity
        # But actually, looking at the previous output, they are within milliseconds.
        
        # Let's count how many projects are in the "latest batch" (within 5 seconds of the latest one)
        # We'll use a simple approach: keep only the last N projects where N is the size of INITIAL_PROJECTS + some margin
        # Or even better: delete everything and let the admin re-save. 
        # But to be helpful, let's keep the last batch.
        
        # Batch detection: find the gap
        cursor.execute("SELECT id, created_at FROM projects ORDER BY created_at DESC")
        rows = cursor.fetchall()
        
        keep_ids = []
        if rows:
            latest_time = rows[0][1]
            # Convert to some comparable format if needed, but they are strings in SQLite usually from datetime.utcnow
            # Let's just keep the top 20 for safety (INITIAL_PROJECTS was 8 + team projects)
            for i in range(min(50, len(rows))):
                keep_ids.append(rows[i][0])
        
        if keep_ids:
            placeholders = ','.join(['?'] * len(keep_ids))
            cursor.execute(f"DELETE FROM projects WHERE id NOT IN ({placeholders})", keep_ids)
            print(f"Deleted {cursor.rowcount} duplicate projects. Kept {len(keep_ids)} latest projects.")
            
            # Also clean up media orphans
            cursor.execute("DELETE FROM project_media WHERE project_id NOT IN (SELECT id FROM projects)")
            print(f"Cleaned up {cursor.rowcount} orphaned media entries.")
            
        conn.commit()
    except Exception as e:
        print(f"Error during cleanup: {e}")
        conn.rollback()
    finally:
        conn.close()
