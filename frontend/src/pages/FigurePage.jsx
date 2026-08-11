import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Calendar, Award, Globe, ChevronUp, ChevronDown } from 'lucide-react'
import ChatWidget from '../components/ChatWidget'
import HighlightedText from '../components/HighlightedText'
import { useAppStore } from '../services/store'
import { getFigure } from '../services/api'
import './FigurePage.css'

const FigurePage = () => {
  const { figureId } = useParams()
  const navigate = useNavigate()
  const { setChatContext } = useAppStore()
  
  const [figure, setFigure] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)

  useEffect(() => {
    loadFigureData()
  }, [figureId])

  const loadFigureData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getFigure(figureId)
      setFigure(data)
      setChatContext({ figure: data.name })
    } catch (err) {
      console.error('Failed to load figure:', err)
      setError('Figure data not found')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="figure-page loading-state">
        <div className="loader"></div>
        <p>Loading figure data...</p>
      </div>
    )
  }

  if (error || !figure) {
    return (
      <div className="figure-page error-state">
        <div className="error-card">
          <User size={48} />
          <h2>Figure Not Found</h2>
          <p>This historical figure's data is not available.</p>
          <button onClick={() => navigate(-1)} className="btn-secondary">
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const lifespan = figure.birth_year && figure.death_year
    ? `${figure.birth_year} - ${figure.death_year}`
    : figure.birth_year
    ? `Born ${figure.birth_year}`
    : 'Contemporary'

  return (
    <div className="figure-page">
      <header className={`figure-header ${isHeaderCollapsed ? 'collapsed' : ''}`}>
        {!isHeaderCollapsed ? (
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Back
          </button>
        ) : (
          <div className="header-collapsed-content">
            <button className="back-btn-small" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
            </button>
            <span>Historical Figure</span>
          </div>
        )}
        
        <button 
          className="header-toggle-btn" 
          onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
          title={isHeaderCollapsed ? "Expand header" : "Collapse header"}
        >
          {isHeaderCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </header>

      <div className="figure-content">
        <div className="figure-hero">
          <div className="figure-avatar">
            <User size={64} />
          </div>
          
          <div className="figure-info">
            <h1>{figure.name}</h1>
            <p className="figure-role">{figure.role}</p>
            
            <div className="figure-meta">
              <div className="meta-item">
                <Calendar size={16} />
                <span>{lifespan}</span>
              </div>
              
              {figure.related_countries?.length > 0 && (
                <div className="meta-item">
                  <Globe size={16} />
                  <span>{figure.related_countries.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="figure-details">
          <section className="biography-section">
            <h2>Biography</h2>
            <div className="biography-text">
              <HighlightedText text={figure.biography} />
            </div>
          </section>

          {figure.achievements?.length > 0 && (
            <section className="achievements-section">
              <h2>
                <Award size={24} />
                Key Achievements
              </h2>
              <ul className="achievements-list">
                {figure.achievements.map((achievement, idx) => (
                  <li key={idx} className="achievement-item fade-in">
                    <div className="achievement-bullet"></div>
                    <HighlightedText text={achievement} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {figure.related_countries?.length > 0 && (
            <section className="related-section">
              <h2>Related Countries</h2>
              <div className="country-links">
                {figure.related_countries.map((countryName, idx) => {
                  const countryId = countryName.toLowerCase().replace(/\s+/g, '_')
                  return (
                    <a
                      key={idx}
                      href={`/country/${countryId}`}
                      className="country-link-card"
                    >
                      <Globe size={20} />
                      {countryName}
                    </a>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </div>

      <ChatWidget />
    </div>
  )
}

export default FigurePage
