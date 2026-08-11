import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader } from 'lucide-react'
import { useAppStore } from '../services/store'
import { sendChatMessage } from '../services/api'
import './ChatWidget.css'

const ChatWidget = () => {
  const { isChatOpen, toggleChat, closeChat, chatHistory, addChatMessage, chatContext } = useAppStore()
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isChatOpen])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      role: 'user',
      content: inputMessage,
    }

    addChatMessage(userMessage)
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await sendChatMessage(
        inputMessage,
        chatContext,
        chatHistory
      )

      console.log('✅ Chat API Response:', response)

      if (!response || !response.response) {
        throw new Error('Invalid response from API')
      }

      const assistantMessage = {
        role: 'assistant',
        content: response.response,
      }

      addChatMessage(assistantMessage)
    } catch (error) {
      console.error('❌ Chat error:', error)
      console.error('Error details:', error.message, error.stack)
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.'
      
      // Check for quota exceeded error
      if (error.response?.status === 429 || error.message?.includes('quota')) {
        errorMessage = '⚠️ Daily AI quota exceeded (20 requests/day limit). The chat will be available again tomorrow. You can still explore the map and country data!'
      } else if (error.message?.includes('timeout')) {
        errorMessage = '⏱️ Request timed out. The AI service is taking too long to respond. Please try again.'
      }
      
      addChatMessage({
        role: 'assistant',
        content: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isChatOpen && (
        <button className="chat-toggle-btn" onClick={toggleChat}>
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div className="chat-widget slide-in">
          <div className="chat-header">
            <div className="chat-header-content">
              <MessageCircle size={20} />
              <h3>AI Political Navigator</h3>
            </div>
            <button className="chat-close-btn" onClick={closeChat}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-messages">
            {chatHistory.length === 0 ? (
              <div className="chat-welcome">
                <MessageCircle size={48} style={{ opacity: 0.3 }} />
                <p>Ask me anything about politics, world events, or historical figures!</p>
                <div className="chat-suggestions">
                  <button onClick={() => setInputMessage("What are the main political events in the US in 2024?")}>
                    US Politics 2024
                  </button>
                  <button onClick={() => setInputMessage("Explain the Israel-Palestine conflict")}>
                    Israel-Palestine
                  </button>
                  <button onClick={() => setInputMessage("What is NATO?")}>
                    What is NATO?
                  </button>
                </div>
              </div>
            ) : (
              <>
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`chat-message ${msg.role}`}>
                    <div className="message-content">
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="chat-message assistant">
                    <div className="message-content">
                      <Loader size={16} className="spinner" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="chat-input-container">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Ask about political events, countries, or figures..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
            />
            <button
              className="chat-send-btn"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatWidget
