import requests
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"

print(f"Testing Gemini API...")
print(f"Model: {GEMINI_MODEL}")
print(f"URL: {GEMINI_URL[:80]}...")

try:
    response = requests.post(
        GEMINI_URL,
        json={
            "contents": [{
                "parts": [{"text": "Hello, can you hear me?"}]
            }]
        },
        headers={"Content-Type": "application/json"},
        timeout=10
    )
    
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {response.text[:500]}")
    
    if response.status_code == 200:
        print("\n✅ Gemini API works!")
        data = response.json()
        print(f"AI Response: {data['candidates'][0]['content']['parts'][0]['text']}")
    else:
        print(f"\n❌ Gemini API Error!")
        
except Exception as e:
    print(f"\n❌ Exception: {e}")
