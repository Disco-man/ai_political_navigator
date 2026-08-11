import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'
import { ZoomIn, ZoomOut, RotateCw, Maximize2 } from 'lucide-react'
import { getCountryId } from '../data/countries-geo'
import './WorldMap.css'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const WorldMap = ({ highlightedCountries = [] }) => {
  const navigate = useNavigate()
  const [tooltipContent, setTooltipContent] = useState('')
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState([0, 0, 0])
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 })

  const handleCountryClick = (geo) => {
    const countryName = geo.properties.name
    const countryId = getCountryId(countryName)
    navigate(`/country/${countryId}`)
  }

  const handleMouseEnter = (geo, event) => {
    const countryName = geo.properties.name
    setTooltipContent(countryName)
    setTooltipPosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseLeave = () => {
    setTooltipContent('')
  }

  const handleMouseMove = (event) => {
    if (tooltipContent) {
      setTooltipPosition({ x: event.clientX, y: event.clientY })
    }
  }

  const isHighlighted = (geoName) => {
    return highlightedCountries.some(
      (country) => country.toLowerCase() === geoName.toLowerCase()
    )
  }

  const handleZoomIn = () => {
    setPosition((prev) => ({ 
      ...prev, 
      zoom: Math.min(prev.zoom + 0.5, 8) 
    }))
  }

  const handleZoomOut = () => {
    setPosition((prev) => ({ 
      ...prev, 
      zoom: Math.max(prev.zoom - 0.5, 1) 
    }))
  }

  const handleRotate = () => {
    setRotation((prev) => [prev[0], prev[1], (prev[2] + 30) % 360])
  }

  const handleReset = () => {
    setPosition({ coordinates: [0, 20], zoom: 1 })
    setRotation([0, 0, 0])
  }

  const handleMoveEnd = (newPosition) => {
    setPosition(newPosition)
  }

  // Keyboard shortcuts and prevent page scroll on wheel
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't trigger shortcuts if user is typing in an input field
      const target = e.target
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }

      if (e.key === '+' || e.key === '=') {
        handleZoomIn()
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut()
      } else if (e.key === 'r' || e.key === 'R') {
        handleRotate()
      } else if (e.key === 'Escape') {
        handleReset()
      }
    }

    const preventScroll = (e) => {
      // Prevent page scroll when mouse is over the map
      const mapContainer = document.querySelector('.world-map-container')
      if (mapContainer && mapContainer.contains(e.target)) {
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('wheel', preventScroll, { passive: false })
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('wheel', preventScroll)
    }
  }, [])

  return (
    <div className="world-map-container" onMouseMove={handleMouseMove}>
      {/* Map Controls */}
      <div className="map-controls">
        <button className="map-control-btn" onClick={handleZoomIn} title="Zoom In (+)">
          <ZoomIn size={20} />
        </button>
        <button className="map-control-btn" onClick={handleZoomOut} title="Zoom Out (-)">
          <ZoomOut size={20} />
        </button>
        <button className="map-control-btn" onClick={handleRotate} title="Rotate Map (R)">
          <RotateCw size={20} />
        </button>
        <button className="map-control-btn" onClick={handleReset} title="Reset View (ESC)">
          <Maximize2 size={20} />
        </button>
        <div className="zoom-indicator">
          {Math.round(position.zoom * 100)}%
        </div>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 147,
          rotate: rotation,
        }}
      >
        <ZoomableGroup 
          center={position.coordinates}
          zoom={position.zoom} 
          minZoom={1} 
          maxZoom={8}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const highlighted = isHighlighted(geo.properties.name)
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    onMouseEnter={(e) => handleMouseEnter(geo, e)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: {
                        fill: highlighted ? '#3b82f6' : '#334155',
                        stroke: '#1e293b',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      hover: {
                        fill: highlighted ? '#2563eb' : '#475569',
                        stroke: '#60a5fa',
                        strokeWidth: 1,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: '#1e40af',
                        stroke: '#60a5fa',
                        strokeWidth: 1,
                        outline: 'none',
                      },
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {tooltipContent && (
        <div
          className="map-tooltip"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y + 10,
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  )
}

export default WorldMap
