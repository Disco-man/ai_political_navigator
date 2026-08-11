import json
import os
import re
from typing import List, Optional, Dict, Any
from datetime import datetime

import requests
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Political Navigator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GEMINI AI CONFIGURATION ---
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"

# --- MODELS ---
class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None  # Country/event context
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    response: str
    timestamp: str

class EventDevelopment(BaseModel):
    date: str
    title: str
    description: str

class CountryEvent(BaseModel):
    id: str
    title: str
    date: str
    category: str  # "foreign_policy", "domestic_policy", "economy", etc.
    description: str
    severity: str  # "low", "medium", "high"
    related_countries: List[str] = []
    related_figures: List[str] = []
    impact: Optional[str] = None
    background: Optional[str] = None
    full_history: Optional[str] = None  # Detailed narrative / full story
    developments: Optional[List[EventDevelopment]] = None

class HistoricalFigure(BaseModel):
    id: str
    name: str
    role: str
    birth_year: Optional[int]
    death_year: Optional[int]
    biography: str
    achievements: List[str]
    related_countries: List[str]

class Country(BaseModel):
    id: str
    name: str
    code: str  # ISO 3166-1 alpha-3
    capital: str
    population: int
    gdp: Optional[float]
    government_type: str
    current_events: List[CountryEvent]
    historical_figures: List[HistoricalFigure]

class AnalyzeTextRequest(BaseModel):
    text: str
    country_context: Optional[str] = None

class HighlightedEntity(BaseModel):
    text: str
    type: str  # "country" or "figure"
    id: str
    start: int
    end: int

class AnalyzeTextResponse(BaseModel):
    entities: List[HighlightedEntity]
    enhanced_text: str

class GeneratedQuizQuestion(BaseModel):
    question: str
    options: List[str] = Field(..., min_length=4, max_length=4)
    correctIndex: int = Field(..., ge=0, le=3)

# --- DATABASE (In-memory for demo) ---
COUNTRIES_DB: Dict[str, Country] = {}
FIGURES_DB: Dict[str, HistoricalFigure] = {}

def load_initial_data():
    """Load pre-filled political data from JSON file"""
    data_file = os.path.join(os.path.dirname(__file__), 'political_data.json')
    
    if not os.path.exists(data_file):
        print("⚠️ No political_data.json found - database will be empty")
        return
    
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for country_data in data.get('countries', []):
            # Sort events from newest to oldest
            events = country_data.get('current_events', [])
            events.sort(key=lambda e: e.get('date', ''), reverse=True)
            country_data['current_events'] = events
            
            country = Country(**country_data)
            COUNTRIES_DB[country.id] = country
            
            # Also store figures separately
            for figure in country.historical_figures:
                FIGURES_DB[figure.id] = figure
        
        print(f"✅ Loaded {len(COUNTRIES_DB)} countries from database")
        print(f"✅ Loaded {len(FIGURES_DB)} historical figures")
    except Exception as e:
        print(f"❌ Error loading political data: {e}")

def clean_json_string(text: str) -> str:
    """Clean AI response from markdown and comments"""
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```', '', text)
    match = re.search(r'(\{.*\}|\[.*\])', text, re.DOTALL)
    if match:
        return match.group(1)
    return text

def call_gemini(prompt: str, temperature: float = 0.7) -> str:
    """Call Gemini API with given prompt"""
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": temperature,
            "topP": 0.8,
            "topK": 40
        }
    }
    
    try:
        print(f"🤖 Calling Gemini API...")
        print(f"   Model: {GEMINI_MODEL}")
        print(f"   Prompt length: {len(prompt)} chars")
        
        resp = requests.post(
            GEMINI_URL, 
            json=payload, 
            headers={"Content-Type": "application/json"}, 
            timeout=120  # Increased to 120 seconds (2 minutes)
        )
        
        print(f"   Status: {resp.status_code}")
        
        if resp.status_code != 200:
            print(f"❌ API Error: {resp.text[:300]}")
            
            # Handle quota exceeded error
            if resp.status_code == 429:
                error_data = resp.json()
                if 'quota' in resp.text.lower():
                    raise HTTPException(
                        status_code=429, 
                        detail="Daily API quota exceeded. The free tier allows 20 requests per day. Please try again tomorrow or upgrade your API plan."
                    )
            
            raise HTTPException(status_code=500, detail=f"AI Error: {resp.text}")
            
        raw_text = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
        print(f"✅ Got response: {len(raw_text)} chars")
        return raw_text
    except requests.exceptions.Timeout:
        print(f"❌ Gemini API Timeout after 30s!")
        raise HTTPException(status_code=504, detail="AI service timeout")
    except Exception as e:
        print(f"❌ Gemini API Error: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

# --- ENDPOINTS ---

@app.get("/")
async def root():
    return {
        "app": "AI Political Navigator",
        "version": "1.0.0",
        "status": "running"
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """
    Chat endpoint for users to ask political questions.
    Context-aware based on current country/event being viewed.
    """
    
    # TEMPORARY: Use mock responses if Gemini API is unavailable
    USE_MOCK = False  # Set to False when Gemini API is working
    
    if USE_MOCK:
        # Simple mock response based on keywords
        message_lower = request.message.lower()
        
        if any(word in message_lower for word in ['hello', 'hi', 'hey']):
            response_text = "Hello! I'm the AI Political Navigator. I can help you understand political events, countries, and historical figures. What would you like to know?"
        elif 'israel' in message_lower and 'palestine' in message_lower:
            response_text = "The Israel-Palestine conflict is one of the world's most enduring conflicts. It involves complex historical, territorial, and political issues dating back over a century. Key events include the 1948 establishment of Israel, the Six-Day War (1967), Oslo Accords (1993), and ongoing tensions over settlements, borders, and the status of Jerusalem. The conflict affects regional stability and international relations."
        elif any(word in message_lower for word in ['ukraine', 'russia']):
            response_text = "The Russia-Ukraine conflict escalated in February 2022 when Russia launched a full-scale invasion. The conflict has roots in Ukraine's post-Soviet independence, the 2014 annexation of Crimea, and tensions over NATO expansion. It has led to significant humanitarian crisis, economic sanctions on Russia, and shifts in European security policy."
        elif 'usa' in message_lower or 'america' in message_lower or 'united states' in message_lower:
            response_text = "The United States plays a central role in global politics as a major economic and military power. Key current issues include political polarization, economic policy debates, immigration reform, and foreign policy challenges including relations with China and involvement in international conflicts."
        elif 'china' in message_lower:
            response_text = "China has emerged as a major global power with significant economic influence. Key political developments include economic reforms, tensions with Taiwan, the Belt and Road Initiative, technological advancement, and evolving U.S.-China relations. Domestically, China focuses on economic development while maintaining one-party governance."
        else:
            response_text = f"Thank you for your question about '{request.message}'. I'm currently in demo mode with limited responses. For detailed information, please explore the interactive map to learn about specific countries and their political events. You can click on any highlighted country to see detailed information about recent events, policies, and key figures."
        
        return ChatResponse(
            response=response_text,
            timestamp=datetime.now().isoformat()
        )
    
    # Real Gemini API call
    context_info = ""
    if request.context:
        if "country" in request.context:
            context_info += f"\nUser is currently viewing: {request.context['country']}"
        if "event" in request.context:
            context_info += f"\nRelated event: {request.context['event']}"
    
    history_text = ""
    if request.history:
        for msg in request.history[-5:]:
            history_text += f"\n{msg.role.upper()}: {msg.content}"
    
    prompt = f"""
You are an expert AI Political Navigator assistant helping users understand 21st century politics.
You provide clear, balanced, factual information about political events, policies, and figures.

{context_info}

Previous conversation:
{history_text}

User question: {request.message}

Provide a clear, informative response. Be objective and cite relevant historical context when helpful.
Keep your response concise (2-3 paragraphs maximum).
"""
    
    response_text = call_gemini(prompt, temperature=0.7)
    
    return ChatResponse(
        response=response_text,
        timestamp=datetime.now().isoformat()
    )

@app.post("/api/analyze-text", response_model=AnalyzeTextResponse)
async def analyze_text(request: AnalyzeTextRequest):
    """
    Analyze text to identify countries and historical figures for highlighting.
    Returns entity positions and types for frontend highlighting.
    """
    
    prompt = f"""
Analyze this political text and identify ALL mentions of:
1. Countries (full names or common references)
2. Historical/political figures (leaders, politicians, activists)

TEXT: "{request.text}"

Return a JSON array of entities with this structure:
[
  {{
    "text": "exact text from original",
    "type": "country" or "figure",
    "id": "suggested_id_snake_case",
    "start": character_position_start,
    "end": character_position_end
  }}
]

IMPORTANT: 
- Return ONLY valid JSON array
- Use exact character positions from the original text
- Include all relevant entities
- Use snake_case for IDs
"""
    
    raw_response = call_gemini(prompt, temperature=0.3)
    json_str = clean_json_string(raw_response)
    
    try:
        entities_data = json.loads(json_str)
        entities = [HighlightedEntity(**entity) for entity in entities_data]
        
        return AnalyzeTextResponse(
            entities=entities,
            enhanced_text=request.text
        )
    except Exception as e:
        print(f"❌ Failed to parse entities: {e}")
        return AnalyzeTextResponse(entities=[], enhanced_text=request.text)

def _build_quiz_context() -> str:
    """Build a compact summary of political data for Gemini to generate quiz questions."""
    parts = []
    for c in list(COUNTRIES_DB.values())[:40]:  # limit to avoid token overflow
        country_line = f"- {c.name} (capital: {c.capital}, government: {c.government_type})"
        events_line = "  Events: " + "; ".join(
            f"{e.title} ({e.date})" for e in (c.current_events or [])[:5]
        ) if c.current_events else "  Events: (none)"
        figures_line = "  Figures: " + "; ".join(
            f"{f.name} ({f.role})" for f in (c.historical_figures or [])[:5]
        ) if c.historical_figures else "  Figures: (none)"
        parts.append(country_line + "\n" + events_line + "\n" + figures_line)
    return "\n".join(parts) if parts else "No country data available."

@app.post("/api/quiz/generate-question", response_model=GeneratedQuizQuestion)
async def generate_quiz_question():
    """
    Generate one multiple-choice quiz question using Gemini, based on app political data.
    Returns question, 4 options, and correctIndex (0-3).
    """
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=503, detail="Gemini API key not configured")
    context = _build_quiz_context()
    prompt = f"""You are a quiz generator for a political education app. Using ONLY the facts below, generate exactly ONE multiple-choice question (in English) that can be answered from this data.

POLITICAL DATA (use only this information):
{context}

Rules:
- Question must be answerable from the data above only.
- Return exactly 4 options; one must be correct.
- correctIndex is 0-based (0, 1, 2, or 3).
- Output ONLY valid JSON, no markdown or extra text:
{{"question": "Your question here?", "options": ["Option A", "Option B", "Option C", "Option D"], "correctIndex": 0}}
"""
    raw = call_gemini(prompt, temperature=0.8)
    json_str = clean_json_string(raw)
    try:
        data = json.loads(json_str)
        # Normalize key if model returns correct_index
        if "correct_index" in data and "correctIndex" not in data:
            data["correctIndex"] = data["correct_index"]
        return GeneratedQuizQuestion(**data)
    except (json.JSONDecodeError, Exception) as e:
        print(f"❌ Failed to parse generated question: {e}\nRaw: {raw[:500]}")
        raise HTTPException(status_code=500, detail="Failed to parse AI-generated question")

@app.get("/api/countries")
async def list_countries():
    """Get list of all countries with basic info"""
    return {"countries": list(COUNTRIES_DB.values())}

@app.get("/api/countries/{country_id}", response_model=Country)
async def get_country(country_id: str):
    """Get detailed information about a specific country"""
    if country_id not in COUNTRIES_DB:
        raise HTTPException(status_code=404, detail="Country not found")
    return COUNTRIES_DB[country_id]

@app.get("/api/figures")
async def list_figures():
    """Get list of all figures with id and name (for linking)"""
    return {
        "figures": [{"id": f.id, "name": f.name} for f in FIGURES_DB.values()]
    }

@app.get("/api/figures/{figure_id}", response_model=HistoricalFigure)
async def get_figure(figure_id: str):
    """Get information about a historical/political figure"""
    if figure_id not in FIGURES_DB:
        raise HTTPException(status_code=404, detail="Figure not found")
    return FIGURES_DB[figure_id]

@app.post("/api/generate-country-info/{country_name}")
async def generate_country_info(country_name: str):
    """
    Generate comprehensive political information for a country using AI.
    This populates the database with AI-generated content.
    """
    
    # Safety check - don't crash if generation fails
    try:
        prompt = f"""
Generate comprehensive political information for {country_name} in the 21st century.

Return ONLY valid JSON with this exact structure:
{{
  "id": "country_code_lowercase",
  "name": "{country_name}",
  "code": "ISO 3166 alpha-3 code",
  "capital": "capital city",
  "population": population_number,
  "gdp": gdp_in_billions_usd,
  "government_type": "type of government",
  "current_events": [
    {{
      "id": "event_id",
      "title": "Event title",
      "date": "YYYY-MM-DD",
      "category": "foreign_policy|domestic_policy|economy|social|military|environment",
      "description": "Detailed description (2-3 sentences)",
      "severity": "low|medium|high",
      "related_countries": ["country1", "country2"],
      "related_figures": ["figure1", "figure2"]
    }}
  ],
  "historical_figures": [
    {{
      "id": "figure_id",
      "name": "Full name",
      "role": "Position/role",
      "birth_year": year_or_null,
      "death_year": year_or_null,
      "biography": "Brief biography (2-3 sentences)",
      "achievements": ["achievement1", "achievement2"],
      "related_countries": ["{country_name}"]
    }}
  ]
}}

Include 8-12 major events from 2000-2026 covering different categories.
Include 5-8 key political figures from the 21st century.
"""
        
        raw_response = call_gemini(prompt, temperature=0.5)
        json_str = clean_json_string(raw_response)
        
        country_data = json.loads(json_str)
        country = Country(**country_data)
        
        # Store in database
        COUNTRIES_DB[country.id] = country
        
        # Store figures separately
        for figure in country.historical_figures:
            FIGURES_DB[figure.id] = figure
        
        return {"status": "success", "country": country}
    except Exception as e:
        print(f"❌ Failed to generate country info for {country_name}: {e}")
        # Don't crash - just return error without affecting existing data
        raise HTTPException(
            status_code=500, 
            detail=f"Could not generate data for {country_name}. Please try again later or check API key."
        )

# --- WEBSOCKET FOR REAL-TIME UPDATES ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo for keepalive
            await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Load initial data when app starts
@app.on_event("startup")
async def startup_event():
    load_initial_data()

if __name__ == "__main__":
    import uvicorn
    # Load data before starting server
    load_initial_data()
    uvicorn.run(app, host="0.0.0.0", port=8000)
