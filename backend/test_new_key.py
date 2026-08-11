import requests

API_KEY = "AIzaSyA3vYW4RwWU5rQU_CzFaZSiL1Vu-G6JSkE"
MODEL = "gemini-2.5-flash"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

print(f"Testing new API key...")
print(f"Model: {MODEL}")

try:
    response = requests.post(
        URL,
        json={
            "contents": [{
                "parts": [{"text": "Hello, this is a test. Reply with OK."}]
            }]
        },
        timeout=10
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ NEW API KEY WORKS!")
        print(f"Response: {response.json()['candidates'][0]['content']['parts'][0]['text']}")
    else:
        print(f"❌ Error: {response.text}")
        
except Exception as e:
    print(f"❌ Exception: {e}")
