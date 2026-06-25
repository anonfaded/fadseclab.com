import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';

const mapMarkers: { name: string; coordinates: [number, number] }[] = [
  { name: 'United States', coordinates: [-98.5, 39.5] },
  { name: 'Russia', coordinates: [90.0, 62.0] },
  { name: 'United Kingdom', coordinates: [-3.4, 55.4] },
  { name: 'France', coordinates: [2.2, 46.6] },
  { name: 'Italy', coordinates: [12.6, 41.9] },
  { name: 'Spain', coordinates: [-3.7, 40.2] },
  { name: 'Saudi Arabia', coordinates: [45.0, 24.0] },
  { name: 'Pakistan', coordinates: [69.3, 30.4] },
  { name: 'India', coordinates: [78.9, 20.6] },
  { name: 'Indonesia', coordinates: [113.9, -0.8] },
  { name: 'China', coordinates: [104.2, 35.9] },
  { name: 'Turkey', coordinates: [35.2, 39.0] },
  { name: 'Poland', coordinates: [19.2, 52.1] },
  { name: 'Germany', coordinates: [10.4, 51.2] },
  { name: 'Sweden', coordinates: [15.0, 62.0] },
  { name: 'Switzerland', coordinates: [7.8, 46.8] },
  { name: 'Greece', coordinates: [22.0, 39.0] },
  { name: 'Malaysia', coordinates: [102.0, 4.0] },
  { name: 'Iraq', coordinates: [44.0, 33.0] },
  { name: 'Bangladesh', coordinates: [90.4, 23.7] },
  { name: 'Vietnam', coordinates: [106.0, 16.0] },
  { name: 'Philippines', coordinates: [122.0, 12.0] },
  { name: 'Bosnia and Herzegovina', coordinates: [17.8, 44.0] },
  { name: 'Nepal', coordinates: [84.0, 28.0] },
  { name: 'Nigeria', coordinates: [8.7, 9.1] },
  { name: 'Brazil', coordinates: [-51.9, -14.2] },
  { name: 'Ireland', coordinates: [-8.2, 53.4] },
  { name: 'Serbia', coordinates: [20.8, 44.0] },
  { name: 'United Arab Emirates', coordinates: [54.0, 24.0] },
  { name: 'Iran', coordinates: [54.0, 32.0] },
  { name: 'Bulgaria', coordinates: [25.0, 42.7] },
  { name: 'Hong Kong SAR China', coordinates: [114.2, 22.3] },
  { name: 'Egypt', coordinates: [30.0, 26.0] },
  { name: 'Japan', coordinates: [138.3, 36.5] },
  { name: 'Singapore', coordinates: [103.8, 1.4] },
  { name: 'Kazakhstan', coordinates: [66.0, 48.0] },
  { name: 'Peru', coordinates: [-75.0, -9.2] },
  { name: 'Slovakia', coordinates: [19.5, 48.7] },
  { name: 'South Africa', coordinates: [25.1, -29.0] },
  { name: 'Trinidad & Tobago', coordinates: [-61.2, 10.5] },
  { name: 'Czech Republic', coordinates: [15.4, 49.8] },
  { name: 'Mexico', coordinates: [-100.0, 23.6] },
  { name: 'Canada', coordinates: [-96.8, 56.1] },
  { name: 'Colombia', coordinates: [-73.0, 4.0] },
  { name: 'Hungary', coordinates: [19.0, 47.0] },
  { name: 'Laos', coordinates: [103.0, 18.0] },
  { name: 'South Korea', coordinates: [127.5, 36.5] },
  { name: 'Morocco', coordinates: [-6.0, 32.0] },
  { name: 'Taiwan', coordinates: [121.0, 24.0] },
  { name: 'Argentina', coordinates: [-63.6, -38.4] },
  { name: 'Austria', coordinates: [13.2, 47.5] },
  { name: 'Sri Lanka', coordinates: [80.8, 7.9] },
  { name: 'Australia', coordinates: [133.8, -25.3] },
  { name: 'Romania', coordinates: [25.0, 45.9] },
  { name: 'Ghana', coordinates: [-1.0, 7.9] },
  { name: 'Burundi', coordinates: [29.9, -3.4] },
  { name: 'Bolivia', coordinates: [-63.6, -16.3] },
  { name: 'Armenia', coordinates: [45.0, 40.0] },
  { name: 'Algeria', coordinates: [2.6, 28.0] },
  { name: 'Georgia', coordinates: [43.4, 42.3] },
  { name: 'Portugal', coordinates: [-8.0, 39.4] },
  { name: 'Thailand', coordinates: [100.5, 15.9] },
  { name: 'Costa Rica', coordinates: [-84.0, 9.9] },
];

export default function GlobalFootprintMap() {
  const [mapCenter, setMapCenter] = useState<[number, number]>([12, 6]);
  const [mapZoom, setMapZoom] = useState(1);
  const [activeCountry, setActiveCountry] = useState('');

  return (
    <div className="world-map-frame" id="world-map-frame">
      <ComposableMap projection="geoNaturalEarth1" projectionConfig={{ scale: 145, center: [12, 6] }}>
        <ZoomableGroup
          center={mapCenter}
          zoom={mapZoom}
          minZoom={1}
          maxZoom={6}
          onMoveEnd={({ coordinates, zoom }) => {
            setMapCenter(coordinates as [number, number]);
            setMapZoom(zoom);
          }}
        >
          <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: 'var(--map-land)', stroke: 'var(--map-border)', strokeWidth: 0.45, outline: 'none' },
                    hover: { fill: 'var(--map-land-hover)', outline: 'none' },
                    pressed: { fill: 'var(--map-land-hover)', outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>
          {mapMarkers.map(({ name, coordinates }) => (
            <Marker key={name} coordinates={coordinates}>
              <g transform={`scale(${(1 / mapZoom).toFixed(4)})`}>
                <circle
                  r={3.5}
                  fill="var(--accent-brand)"
                  stroke="var(--background)"
                  strokeWidth={1.2}
                  className="map-dot"
                  onMouseEnter={() => setActiveCountry(name)}
                  onMouseLeave={() => setActiveCountry('')}
                  onFocus={() => setActiveCountry(name)}
                  onBlur={() => setActiveCountry('')}
                  aria-label={name}
                  tabIndex={0}
                />
                <circle r={8} fill="var(--accent-brand)" opacity={0.14} className="map-dot-ring" />
              </g>
            </Marker>
          ))}
          {(() => {
            const active = mapMarkers.find((m) => m.name === activeCountry);
            if (!active) return null;
            return (
              <Marker coordinates={active.coordinates}>
                <g transform={`scale(${(1 / mapZoom).toFixed(4)})`}>
                  <foreignObject x={-44} y={-30} width={88} height={22} style={{ overflow: 'visible', pointerEvents: 'none' }}>
                    <span className="map-tooltip">{activeCountry}</span>
                  </foreignObject>
                </g>
              </Marker>
            );
          })()}
        </ZoomableGroup>
      </ComposableMap>
      <div className="map-zoom-controls">
        <button
          type="button"
          className="map-zoom-btn"
          aria-label="Zoom in"
          onClick={() => setMapZoom((z) => Math.min(6, z + 0.8))}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <button
          type="button"
          className="map-zoom-btn"
          aria-label="Zoom out"
          onClick={() => setMapZoom((z) => Math.max(1, z - 0.8))}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <button
          type="button"
          className="map-zoom-btn"
          aria-label="Reset map"
          onClick={() => { setMapZoom(1); setMapCenter([12, 6]); }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
        </button>
      </div>
    </div>
  );
}
