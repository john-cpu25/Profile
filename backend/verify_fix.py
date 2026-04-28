import requests
import json

API_URL = "http://127.0.0.1:8000"

def test_public_profile():
    try:
        response = requests.get(f"{API_URL}/api/users/admin")
        if response.status_code == 200:
            data = response.json()
            profile = data.get("profile", {})
            projects = data.get("projects", [])
            
            print(f"Full Name: {data.get('full_name')}")
            print(f"Last Updated: {profile.get('updated_at')}")
            print(f"Project Count: {len(projects)}")
            
            if projects:
                print("\nLatest 3 projects:")
                for p in projects[:3]:
                    print(f"- {p.get('title')}")
        else:
            print(f"Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Connection failed: {e}. Is the backend running?")

if __name__ == "__main__":
    test_public_profile()
