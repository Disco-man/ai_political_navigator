import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 150000, // Increased to 150 seconds (2.5 minutes)
  headers: {
    'Content-Type': 'application/json',
  },
})

// Chat API
export const sendChatMessage = async (message, context = null, history = []) => {
  const response = await api.post('/api/chat', {
    message,
    context,
    history,
  })
  return response.data
}

// Text Analysis API
export const analyzeText = async (text, countryContext = null) => {
  const response = await api.post('/api/analyze-text', {
    text,
    country_context: countryContext,
  })
  return response.data
}

// Countries API
export const listCountries = async () => {
  const response = await api.get('/api/countries')
  return response.data
}

export const getCountry = async (countryId) => {
  const response = await api.get(`/api/countries/${countryId}`)
  return response.data
}

export const generateCountryInfo = async (countryName) => {
  const response = await api.post(`/api/generate-country-info/${countryName}`)
  return response.data
}

// Figures API
export const listFigures = async () => {
  const response = await api.get('/api/figures')
  return response.data
}

export const getFigure = async (figureId) => {
  const response = await api.get(`/api/figures/${figureId}`)
  return response.data
}

// Quiz: AI-generated extra question
export const generateQuizQuestion = async () => {
  const response = await api.post('/api/quiz/generate-question')
  return response.data
}

// WebSocket connection
export const connectWebSocket = (onMessage) => {
  const wsUrl = API_BASE.replace('http', 'ws') + '/ws'
  const ws = new WebSocket(wsUrl)
  
  ws.onopen = () => {
    console.log('✅ WebSocket connected')
  }
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    onMessage(data)
  }
  
  ws.onerror = (error) => {
    console.error('❌ WebSocket error:', error)
  }
  
  ws.onclose = () => {
    console.log('WebSocket disconnected')
  }
  
  return ws
}

export default api
