import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, AlertCircle, TrendingUp, Users, Globe, ChevronUp, ChevronDown } from 'lucide-react'
import ChatWidget from '../components/ChatWidget'
import HighlightedText from '../components/HighlightedText'
import { useAppStore } from '../services/store'
import { getCountry } from '../services/api'
import './CountryPage.css'

const CATEGORY_ICONS = {
  foreign_policy: <Globe size={20} />,
  domestic_policy: <Users size={20} />,
  economy: <TrendingUp size={20} />,
  social: <Users size={20} />,
  military: <AlertCircle size={20} />,
  environment: <Globe size={20} />,
}

const CATEGORY_LABELS = {
  foreign_policy: 'Foreign Policy',
  domestic_policy: 'Domestic Policy',
  economy: 'Economy',
  social: 'Social Issues',
  military: 'Military & Security',
  environment: 'Environment',
}

const SEVERITY_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
}

const CountryPage = () => {
  const { countryId } = useParams()
  const navigate = useNavigate()
  const { setCurrentCountry, setChatContext } = useAppStore()
  
  const [country, setCountry] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [error, setError] = useState(null)
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)

  useEffect(() => {
    loadCountryData()
  }, [countryId])

  const loadCountryData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getCountry(countryId)
      setCountry(data)
      setCurrentCountry(data)
      setChatContext({ country: data.name })
    } catch (err) {
      console.error('Failed to load country:', err)
      setError('Country data not found')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredEvents = country?.current_events?.filter(event => 
    selectedCategory === 'all' || event.category === selectedCategory
  ) || []

  const categories = country?.current_events
    ? [...new Set(country.current_events.map(e => e.category))]
    : []

  if (isLoading) {
    return (
      <div className="country-page loading-state">
        <div className="loader"></div>
        <p>Loading country data...</p>
      </div>
    )
  }

  if (error && !country) {
    return (
      <div className="country-page error-state">
        <div className="error-card">
          <AlertCircle size={48} />
          <h2>Country Not Found</h2>
          <p>This country doesn't have data available yet. Try exploring other countries on the map!</p>
          <div className="error-actions">
            <button onClick={() => navigate('/')} className="btn-primary">
              <ArrowLeft size={16} />
              Back to Map
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!country) return null

  return (
    <div className="country-page">
      <header className={`country-header ${isHeaderCollapsed ? 'collapsed' : ''}`}>
        {!isHeaderCollapsed ? (
          <>
            <button className="back-btn" onClick={() => navigate('/')}>
              <ArrowLeft size={20} />
              Back to Map
            </button>

            <div className="country-title">
              <h1>{country.name}</h1>
              <div className="country-meta">
                <span>Capital: {country.capital}</span>
                <span>•</span>
                <span>Population: {country.population.toLocaleString()}</span>
                <span>•</span>
                <span>{country.government_type}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="header-collapsed-content">
            <button className="back-btn-small" onClick={() => navigate('/')}>
              <ArrowLeft size={16} />
            </button>
            <span>{country.name}</span>
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

      <div className="country-content">
        <aside className="category-sidebar">
          <h3>Categories</h3>
          <button
            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <Globe size={20} />
            All Events ({country.current_events?.length || 0})
          </button>
          
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {CATEGORY_ICONS[cat]}
              {CATEGORY_LABELS[cat]}
              <span className="count">
                {country.current_events.filter(e => e.category === cat).length}
              </span>
            </button>
          ))}

          <div className="sidebar-divider"></div>
          
          <h3>Key Figures</h3>
          <div className="figures-list">
            {country.historical_figures?.slice(0, 5).map(figure => (
              <a
                key={figure.id}
                href={`/figure/${figure.id}`}
                className="figure-link"
              >
                {figure.name}
                <span className="figure-role">{figure.role}</span>
              </a>
            ))}
          </div>
        </aside>

        <main className="events-content">
          <div className="events-header">
            <h2>
              {selectedCategory === 'all' 
                ? 'All Events' 
                : CATEGORY_LABELS[selectedCategory]
              }
            </h2>
            <span className="event-count">{filteredEvents.length} events</span>
          </div>

          <div className="events-grid">
            {filteredEvents.map(event => (
              <a 
                key={event.id} 
                href={`/country/${countryId}/event/${event.id}`}
                className="event-card fade-in"
              >
                <div className="event-header">
                  <div className="event-category">
                    {CATEGORY_ICONS[event.category]}
                    {CATEGORY_LABELS[event.category]}
                  </div>
                  <div 
                    className="event-severity"
                    style={{ background: SEVERITY_COLORS[event.severity] }}
                  >
                    {event.severity}
                  </div>
                </div>

                <h3 className="event-title">{event.title}</h3>
                
                <div className="event-meta">
                  <Calendar size={16} />
                  {new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>

                <div className="event-description">
                  <HighlightedText 
                    text={event.description}
                    countryContext={country.name}
                  />
                </div>

                {event.related_countries?.length > 0 && (
                  <div className="event-relations">
                    <strong>Related Countries:</strong>
                    <div className="relation-tags">
                      {event.related_countries.map((rc, idx) => (
                        <span key={idx} className="relation-tag country-tag">
                          {rc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {event.related_figures?.length > 0 && (
                  <div className="event-relations">
                    <strong>Key Figures:</strong>
                    <div className="relation-tags">
                      {event.related_figures.map((rf, idx) => (
                        <span key={idx} className="relation-tag figure-tag">
                          {rf}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </a>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="empty-state">
              <AlertCircle size={48} />
              <p>No events found in this category</p>
            </div>
          )}
        </main>
      </div>

      <ChatWidget />
    </div>
  )
}

export default CountryPage
