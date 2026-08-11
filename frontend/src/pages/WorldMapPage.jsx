import React, { useEffect, useState } from 'react'
import { Globe, Search, ChevronUp, ChevronDown, Trophy } from 'lucide-react'
import WorldMap from '../components/WorldMap'
import ChatWidget from '../components/ChatWidget'
import { useAppStore } from '../services/store'
import { listCountries } from '../services/api'
import './WorldMapPage.css'

const WorldMapPage = () => {
  const { countries, setCountries, openQuiz } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  const searchRef = React.useRef(null)

  useEffect(() => {
    loadCountries()
  }, [])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchQuery('')
      }
    }

    if (searchQuery) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchQuery])

  const loadCountries = async () => {
    try {
      const data = await listCountries()
      if (data.countries && data.countries.length > 0) {
        setCountries(data.countries)
      }
    } catch (error) {
      console.error('Failed to load countries:', error)
    }
  }

  const highlightedCountries = countries.map(c => c.name)

  // Filter countries based on search query
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.capital.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const showSearchResults = searchQuery.trim().length > 0

  return (
    <div className="world-map-page">
      <header className={`page-header ${isHeaderCollapsed ? 'collapsed' : ''}`}>
        {!isHeaderCollapsed ? (
          <>
            <div className="header-content">
              <div className="logo">
                <Globe size={32} />
                <h1>AI Political Navigator</h1>
              </div>
              <p className="subtitle">Navigate the complex world of 21st century politics</p>
            </div>

            <div className="header-actions">
              <button
                type="button"
                className="header-quiz-btn"
                onClick={openQuiz}
                title="Quiz"
              >
                <Trophy size={20} />
                <span>Quiz</span>
              </button>
              <div className="search-container" ref={searchRef}>
                <div className="search-bar">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search countries, capital cities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {showSearchResults && (
                  <div className="search-results">
                    {filteredCountries.length > 0 ? (
                      <>
                        {filteredCountries.map(country => (
                          <a
                            key={country.id}
                            href={`/country/${country.id}`}
                            className="search-result-item"
                            onClick={() => setSearchQuery('')}
                          >
                            <Globe size={16} />
                            <div className="result-info">
                              <span className="result-name">{country.name}</span>
                              <span className="result-detail">{country.capital}</span>
                            </div>
                          </a>
                        ))}
                      </>
                    ) : (
                      <div className="search-no-results">
                        <Search size={20} opacity={0.3} />
                        <span>No countries found</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="header-collapsed-content">
            <Globe size={24} />
            <span>AI Political Navigator</span>
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

      <main className="map-content">
        <WorldMap highlightedCountries={highlightedCountries} />
            
            <div className="map-legend">
              <div className="legend-item">
                <div className="legend-color highlighted"></div>
                <span>Countries with data</span>
              </div>
              <div className="legend-item">
                <div className="legend-color default"></div>
                <span>Click any country to explore</span>
              </div>
              <div className="legend-divider"></div>
              <div className="legend-shortcuts">
                <strong>Controls:</strong>
                <span>+/- Zoom • R Rotate • ESC Reset</span>
                <span>Drag to pan • Scroll to zoom</span>
              </div>
            </div>
      </main>

      <ChatWidget />
    </div>
  )
}

export default WorldMapPage
