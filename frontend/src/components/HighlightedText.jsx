import React from 'react'
import './HighlightedText.css'

const HighlightedText = ({ text, countryContext = null }) => {
  // Simple component - just display text without AI analysis
  // This makes the app stable and fast

  return <div className="highlighted-text">{text}</div>
}

export default HighlightedText
