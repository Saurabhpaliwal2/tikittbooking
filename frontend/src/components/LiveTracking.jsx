import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bus, Clock, MapPin, Navigation, Gauge, Signal } from 'lucide-react';
import { useToast } from '../context/ToastContext';

// Fix Leaflet default icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;

// Jaipur Highway route points (simulated path)
const ROUTE_POINTS = [
    [26.7606, 75.8648],  // Start — South Jaipur
    [26.7850, 75.8520],
    [26.8100, 75.8400],
    [26.8350, 75.8350],
    [26.8600, 75.8280],
    [26.8850, 75.8200],
    [26.9050, 75.8100],
    [26.9200, 75.7950],
    [26.9350, 75.7850],
    [26.9500, 75.7800],  // End — North Jaipur
];

// Custom bus icon
const busIcon = new L.DivIcon({
    className: 'bus-marker-icon',
    html: `<div class="bus-marker-pulse"></div><div class="bus-marker-dot">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/>
            <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
            <circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>
        </svg>
    </div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
});

// Destination flag icon
const destIcon = new L.DivIcon({
    className: 'dest-marker-icon',
    html: `<div class="dest-marker-dot">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#10b981" stroke="#fff" stroke-width="2">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
        </svg>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
});

// Interpolate between two points
function interpolate(p1, p2, t) {
    return [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
}

// Component to recenter map on bus
function MapFollower({ position }) {
    const map = useMap();
    useEffect(() => {
        map.panTo(position, { animate: true, duration: 1 });
    }, [position, map]);
    return null;
}

const LiveTracking = () => {
    const { showToast } = useToast();
    const [busPosition, setBusPosition] = useState(ROUTE_POINTS[0]);
    const [progress, setProgress] = useState(0); // 0 to 1
    const [etaMinutes, setEtaMinutes] = useState(45);
    const [speed, setSpeed] = useState(62);
    const totalEta = 45;

    // Simulate bus movement
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + 0.003;
                if (next >= 1) {
                    clearInterval(interval);
                    return 1;
                }
                return next;
            });
        }, 200);
        return () => clearInterval(interval);
    }, []);

    // Simulate random delay alert
    useEffect(() => {
        const timer = setTimeout(() => {
            showToast("Traffic alert: 10 mins delay expected on Jaipur Highway", "warning");
        }, 5000);
        return () => clearTimeout(timer);
    }, [showToast]);

    // Update bus position based on progress
    useEffect(() => {
        const totalSegments = ROUTE_POINTS.length - 1;
        const segFloat = progress * totalSegments;
        const segIndex = Math.min(Math.floor(segFloat), totalSegments - 1);
        const segProgress = segFloat - segIndex;
        const pos = interpolate(ROUTE_POINTS[segIndex], ROUTE_POINTS[segIndex + 1], segProgress);
        setBusPosition(pos);
        setEtaMinutes(Math.max(0, Math.round(totalEta * (1 - progress))));
        setSpeed(55 + Math.round(Math.random() * 20));
    }, [progress]);

    const locationName = progress < 0.3 ? 'South Jaipur Highway' :
        progress < 0.6 ? 'Jaipur Highway' :
            progress < 0.85 ? 'North Jaipur Highway' : 'Approaching Destination';

    return (
        <div className="live-tracking-page animate-fade-in">
            {/* Info Panel */}
            <div className="tracking-info-panel glass">
                <div className="tracking-header">
                    <div className="tracking-bus-icon">
                        <Bus size={24} />
                    </div>
                    <div>
                        <h3>Express Bus</h3>
                        <span className="tracking-status-badge live">
                            <Signal size={12} /> LIVE
                        </span>
                    </div>
                </div>

                <div className="tracking-details">
                    <div className="tracking-detail-item">
                        <MapPin size={16} className="tracking-icon" />
                        <div>
                            <span className="detail-label">Current Location</span>
                            <span className="detail-value">{locationName}</span>
                        </div>
                    </div>
                    <div className="tracking-detail-item">
                        <Clock size={16} className="tracking-icon" />
                        <div>
                            <span className="detail-label">Estimated Arrival</span>
                            <span className="detail-value highlight">{etaMinutes} Minutes</span>
                        </div>
                    </div>
                    <div className="tracking-detail-item">
                        <Gauge size={16} className="tracking-icon" />
                        <div>
                            <span className="detail-label">Speed</span>
                            <span className="detail-value">{speed} km/h</span>
                        </div>
                    </div>
                    <div className="tracking-detail-item">
                        <Navigation size={16} className="tracking-icon" />
                        <div>
                            <span className="detail-label">Route</span>
                            <span className="detail-value">Jaipur Highway</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="tracking-progress">
                    <div className="progress-label">
                        <span>Journey Progress</span>
                        <span>{Math.round(progress * 100)}%</span>
                    </div>
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
                    </div>
                    <div className="progress-endpoints">
                        <span>South Jaipur</span>
                        <span>North Jaipur</span>
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className="tracking-map-container">
                <MapContainer
                    center={[26.85, 75.83]}
                    zoom={12}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Route line */}
                    <Polyline
                        positions={ROUTE_POINTS}
                        pathOptions={{
                            color: '#4f46e5',
                            weight: 4,
                            opacity: 0.7,
                            dashArray: '10, 8',
                        }}
                    />

                    {/* Travelled path */}
                    <Polyline
                        positions={ROUTE_POINTS.slice(0, Math.ceil(progress * ROUTE_POINTS.length) + 1)}
                        pathOptions={{
                            color: '#4f46e5',
                            weight: 5,
                            opacity: 1,
                        }}
                    />

                    {/* Bus marker */}
                    <Marker position={busPosition} icon={busIcon}>
                        <Popup>
                            <strong>🚌 Express Bus</strong><br />
                            ETA: {etaMinutes} min<br />
                            Speed: {speed} km/h
                        </Popup>
                    </Marker>

                    {/* Destination marker */}
                    <Marker position={ROUTE_POINTS[ROUTE_POINTS.length - 1]} icon={destIcon}>
                        <Popup>📍 Destination — North Jaipur</Popup>
                    </Marker>

                    <MapFollower position={busPosition} />
                </MapContainer>
            </div>
        </div>
    );
};

export default LiveTracking;
