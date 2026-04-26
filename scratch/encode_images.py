import base64
import os
import json

img_dir = 'IMG TEST'
images = [f for f in os.listdir(img_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

results = []
for img in images[:5]: # Take 5 images
    with open(os.path.join(img_dir, img), 'rb') as f:
        b64 = base64.b64encode(f.read()).decode('utf-8')
        results.append(f"data:image/png;base64,{b64}")

with open('scratch/test_images.json', 'w') as f:
    json.dump(results, f)

print(f"Encoded {len(results)} images to scratch/test_images.json")
