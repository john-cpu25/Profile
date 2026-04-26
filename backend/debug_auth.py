import database, models, auth
db = database.SessionLocal()
user = db.query(models.User).filter(models.User.username == 'admin').first()
if user:
    print(f"User: {user.username}")
    print(f"Hash: {user.password_hash}")
    try:
        is_valid = auth.verify_password('admin123', user.password_hash)
        print(f"Verify 'admin123': {is_valid}")
    except Exception as e:
        print(f"Error: {e}")
else:
    print("User not found")
db.close()
