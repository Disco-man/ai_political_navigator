import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Calendar, 
  Globe, 
  AlertCircle, 
  ChevronUp, 
  ChevronDown,
  MapPin,
  Users,
  TrendingUp,
  Shield,
  Briefcase,
  Building,
  Zap,
  X,
  ChevronRight,
  BookOpen
} from 'lucide-react'
import { getCountry, listCountries, listFigures } from '../services/api'
import { useAppStore } from '../services/store'
import { getGroupKey, getGroupMembers } from '../data/countryGroups'
import HighlightedText from '../components/HighlightedText'
import './EventPage.css'

const CATEGORY_ICONS = {
  foreign_policy: <Globe size={20} />,
  domestic_policy: <Building size={20} />,
  economy: <TrendingUp size={20} />,
  military: <Shield size={20} />,
  social: <Users size={20} />
}

const CATEGORY_LABELS = {
  foreign_policy: 'Foreign Policy',
  domestic_policy: 'Domestic Policy',
  economy: 'Economy',
  military: 'Military',
  social: 'Social'
}

const SEVERITY_COLORS = {
  low: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  medium: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  high: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
}

const EventPage = () => {
  const { countryId, eventId } = useParams()
  const navigate = useNavigate()
  const { countries: storeCountries, setCountries } = useAppStore()
  const [country, setCountry] = useState(null)
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  const [figures, setFigures] = useState([])
  const [groupModal, setGroupModal] = useState(null) // { title, members }
  const [sectionsOpen, setSectionsOpen] = useState({
    overview: true,
    fullHistory: true,
    impact: true,
    background: true,
    developments: true
  })

  const toggleSection = (key) => {
    setSectionsOpen((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const countries = useMemo(() => {
    if (storeCountries && storeCountries.length > 0) return storeCountries
    return []
  }, [storeCountries])

  useEffect(() => {
    loadEvent()
  }, [countryId, eventId])

  useEffect(() => {
    if (countries.length === 0) {
      listCountries().then((data) => {
        if (data?.countries?.length) setCountries(data.countries)
      }).catch(() => {})
    }
  }, [])

  useEffect(() => {
    listFigures().then((data) => {
      if (data?.figures?.length) setFigures(data.figures)
    }).catch(() => {})
  }, [])

  const nameToCountryId = useMemo(() => {
    const map = {}
    countries.forEach((c) => {
      map[c.name] = c.id
      if (c.name === 'United States of America') map['United States'] = c.id
    })
    return map
  }, [countries])

  const figureNameToId = useMemo(() => {
    const map = {}
    figures.forEach((f) => { map[f.name] = f.id })
    return map
  }, [figures])

  const loadEvent = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await getCountry(countryId)
      setCountry(data)
      
      const foundEvent = data.current_events?.find(e => e.id === eventId)
      if (foundEvent) {
        setEvent(foundEvent)
      } else {
        setError('Event not found')
      }
    } catch (err) {
      console.error('Failed to load event:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="event-page loading-state">
        <div className="spinner"></div>
        <p>Loading event...</p>
      </div>
    )
  }

  if (error || !event || !country) {
    return (
      <div className="event-page error-state">
        <div className="error-card">
          <AlertCircle size={48} />
          <h2>Event Not Found</h2>
          <p>This event could not be loaded. It may have been removed or the link is incorrect.</p>
          <div className="error-actions">
            <button onClick={() => navigate(`/country/${countryId}`)} className="btn-primary">
              <ArrowLeft size={16} />
              Back to Country
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary">
              <Globe size={16} />
              Back to Map
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="event-page">
      <header className={`event-header ${isHeaderCollapsed ? 'collapsed' : ''}`}>
        {!isHeaderCollapsed ? (
          <>
            <div className="header-nav">
              <button className="back-btn" onClick={() => navigate(`/country/${countryId}`)}>
                <ArrowLeft size={20} />
                Back to {country.name}
              </button>
            </div>

            <div className="event-title-section">
              <div className="event-badges">
                <div className="event-category-badge">
                  {CATEGORY_ICONS[event.category]}
                  {CATEGORY_LABELS[event.category]}
                </div>
                <div 
                  className="event-severity-badge"
                  style={{ background: SEVERITY_COLORS[event.severity] }}
                >
                  {event.severity.toUpperCase()} PRIORITY
                </div>
              </div>

              <h1>{event.title}</h1>

              <div className="event-meta-info">
                <div className="meta-item">
                  <Calendar size={18} />
                  <span>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="meta-item">
                  <MapPin size={18} />
                  <span>{country.name}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="header-collapsed-content">
            <button className="back-btn-small" onClick={() => navigate(`/country/${countryId}`)}>
              <ArrowLeft size={16} />
            </button>
            <span>{event.title}</span>
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

      <div className="event-content">
        <div className="event-main">
          <section className={`event-section event-section-collapsible ${!sectionsOpen.overview ? 'collapsed' : ''}`}>
            <button
              type="button"
              className="event-section-header-btn"
              onClick={() => toggleSection('overview')}
              aria-expanded={sectionsOpen.overview}
            >
              <h2>Overview</h2>
              {sectionsOpen.overview ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
            {sectionsOpen.overview && (
              <div className="event-description-full">
                <HighlightedText 
                  text={event.description}
                  countryContext={country.name}
                />
              </div>
            )}
          </section>

          {event.full_history && (
            <section className={`event-section event-section-collapsible ${!sectionsOpen.fullHistory ? 'collapsed' : ''}`}>
              <button
                type="button"
                className="event-section-header-btn"
                onClick={() => toggleSection('fullHistory')}
                aria-expanded={sectionsOpen.fullHistory}
              >
                <h2>
                  <BookOpen size={24} />
                  Full History
                </h2>
                {sectionsOpen.fullHistory ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
              {sectionsOpen.fullHistory && (
                <div className="event-description-full full-history-content">
                  {(event.full_history || '')
                    .split(/\n\n+/)
                    .filter((p) => p.trim())
                    .map((paragraph, i) => (
                      <p key={i}>
                        <HighlightedText
                          text={paragraph.trim()}
                          countryContext={country.name}
                        />
                      </p>
                    ))}
                </div>
              )}
            </section>
          )}

          {event.impact && (
            <section className={`event-section event-section-collapsible ${!sectionsOpen.impact ? 'collapsed' : ''}`}>
              <button
                type="button"
                className="event-section-header-btn"
                onClick={() => toggleSection('impact')}
                aria-expanded={sectionsOpen.impact}
              >
                <h2>
                  <Zap size={24} />
                  Impact & Significance
                </h2>
                {sectionsOpen.impact ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
              {sectionsOpen.impact && (
                <div className="impact-content">
                  <HighlightedText 
                    text={event.impact}
                    countryContext={country.name}
                  />
                </div>
              )}
            </section>
          )}

          {event.background && (
            <section className={`event-section event-section-collapsible ${!sectionsOpen.background ? 'collapsed' : ''}`}>
              <button
                type="button"
                className="event-section-header-btn"
                onClick={() => toggleSection('background')}
                aria-expanded={sectionsOpen.background}
              >
                <h2>Background</h2>
                {sectionsOpen.background ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
              {sectionsOpen.background && (
                <div className="background-content">
                  <HighlightedText 
                    text={event.background}
                    countryContext={country.name}
                  />
                </div>
              )}
            </section>
          )}

          {event.developments && event.developments.length > 0 && (
            <section className={`event-section event-section-collapsible ${!sectionsOpen.developments ? 'collapsed' : ''}`}>
              <button
                type="button"
                className="event-section-header-btn"
                onClick={() => toggleSection('developments')}
                aria-expanded={sectionsOpen.developments}
              >
                <h2>Key Developments</h2>
                {sectionsOpen.developments ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
              {sectionsOpen.developments && (
                <div className="timeline">
                  {event.developments.map((dev, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <div className="timeline-date">
                          <Calendar size={16} />
                          {new Date(dev.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <h3>{dev.title}</h3>
                        <p>{dev.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        <aside className="event-sidebar">
          {event.related_countries && event.related_countries.length > 0 && (
            <div className="sidebar-section">
              <h3>
                <Globe size={20} />
                Related Countries
              </h3>
              <div className="related-items">
                {event.related_countries.map((name, idx) => {
                  const groupKey = getGroupKey(name)
                  const countryId = nameToCountryId[name] || nameToCountryId[name.trim()]
                  if (groupKey) {
                    return (
                      <button
                        key={idx}
                        type="button"
                        className="related-item country-item related-item-clickable"
                        onClick={() => setGroupModal({ title: groupKey, members: getGroupMembers(groupKey) })}
                      >
                        {name}
                        <ChevronRight size={16} />
                      </button>
                    )
                  }
                  if (countryId) {
                    return (
                      <Link
                        key={idx}
                        to={`/country/${countryId}`}
                        className="related-item country-item related-item-link"
                      >
                        {name}
                        <ChevronRight size={16} />
                      </Link>
                    )
                  }
                  return (
                    <div key={idx} className="related-item country-item related-item-disabled">
                      {name}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {event.related_figures && event.related_figures.length > 0 && (
            <div className="sidebar-section">
              <h3>
                <Users size={20} />
                Key Figures
              </h3>
              <div className="related-items">
                {event.related_figures.map((figureName, idx) => {
                  const figureId = figureNameToId[figureName]
                  if (figureId) {
                    return (
                      <Link
                        key={idx}
                        to={`/figure/${figureId}`}
                        className="related-item figure-item related-item-link"
                      >
                        {figureName}
                        <ChevronRight size={16} />
                      </Link>
                    )
                  }
                  return (
                    <div key={idx} className="related-item figure-item related-item-disabled">
                      {figureName}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="sidebar-section">
            <h3>
              <Briefcase size={20} />
              Event Details
            </h3>
            <div className="event-details-list">
              <div className="detail-row">
                <span className="detail-label">Category</span>
                <span className="detail-value">{CATEGORY_LABELS[event.category]}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Severity</span>
                <span className="detail-value severity" style={{ color: event.severity === 'high' ? '#ef4444' : event.severity === 'medium' ? '#f59e0b' : '#10b981' }}>
                  {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date</span>
                <span className="detail-value">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {country.current_events && country.current_events.length > 1 && (
            <div className="sidebar-section">
              <h3>More Events from {country.name}</h3>
              <div className="related-events">
                {country.current_events
                  .filter(e => e.id !== event.id)
                  .slice(0, 3)
                  .map(relatedEvent => (
                    <a
                      key={relatedEvent.id}
                      href={`/country/${countryId}/event/${relatedEvent.id}`}
                      className="related-event-link"
                    >
                      <div className="related-event-icon">
                        {CATEGORY_ICONS[relatedEvent.category]}
                      </div>
                      <div className="related-event-info">
                        <div className="related-event-title">{relatedEvent.title}</div>
                        <div className="related-event-date">
                          {new Date(relatedEvent.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short'
                          })}
                        </div>
                      </div>
                    </a>
                  ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {groupModal && (
        <div
          className="event-group-modal-overlay"
          onClick={() => setGroupModal(null)}
          role="presentation"
        >
          <div
            className="event-group-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="event-group-modal-header">
              <h3>{groupModal.title}</h3>
              <button
                type="button"
                className="event-group-modal-close"
                onClick={() => setGroupModal(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <p className="event-group-modal-hint">Select a country to open (only countries with data are clickable):</p>
            <div className="event-group-modal-list">
              {groupModal.members.map((memberName) => {
                const id = nameToCountryId[memberName]
                if (id) {
                  return (
                    <Link
                      key={memberName}
                      to={`/country/${id}`}
                      className="event-group-modal-item event-group-modal-item-link"
                      onClick={() => setGroupModal(null)}
                    >
                      <Globe size={18} />
                      {memberName}
                      <ChevronRight size={16} />
                    </Link>
                  )
                }
                return (
                  <div
                    key={memberName}
                    className="event-group-modal-item event-group-modal-item-disabled"
                    title="No data in app"
                  >
                    <Globe size={18} />
                    {memberName}
                    <span className="event-group-modal-badge">No data</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventPage
