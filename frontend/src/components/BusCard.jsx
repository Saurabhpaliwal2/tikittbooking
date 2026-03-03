import React from 'react';
import { Clock, Info, ShieldCheck, Zap } from 'lucide-react';

const BusCard = ({ schedule, onSelect }) => {
    const { bus, route, departureTime, arrivalTime, fare, availableSeats } = schedule;

    return (
        <div className="bus-card card animate-fade-in">
            <div className="bus-info-section">
                <div className="operator-info">
                    <h3>{bus.operatorName}</h3>
                    <p className="bus-type">{bus.busType.replace(/_/g, ' ')}</p>
                    <div className="amenities">
                        {bus.amenities.split(',').map((item, idx) => (
                            <span key={idx} className="amenity-tag">{item.trim()}</span>
                        ))}
                    </div>
                </div>

                <div className="time-route-info">
                    <div className="time-point">
                        <span className="time">{typeof departureTime === 'string' ? departureTime.slice(0, 5) : 'N/A'}</span>
                        <span className="station">{route.source}</span>
                    </div>
                    <div className="duration-line">
                        <div className="line"></div>
                        <span className="duration">{route.estimatedDuration || route.duration || 'N/A'}</span>
                        <div className="line"></div>
                    </div>
                    <div className="time-point">
                        <span className="time">{typeof arrivalTime === 'string' ? arrivalTime.slice(0, 5) : 'N/A'}</span>
                        <span className="station">{route.destination}</span>
                    </div>
                </div>

                <div className="price-booking-section">
                    <div className="price-info">
                        <span className="price-label">Starts from</span>
                        <span className="price-value">₹{fare}</span>
                    </div>
                    <div className="seats-info">
                        <span className={availableSeats < 5 ? 'low-seats' : ''}>
                            {availableSeats} Seats left
                        </span>
                    </div>
                    <button className="btn-primary book-btn" onClick={() => onSelect(schedule)}>
                        SELECT SEATS
                    </button>
                </div>
            </div>

            <div className="bus-card-footer">
                <div className="trust-badges">
                    <span><ShieldCheck size={14} /> Safe Journey</span>
                    <span><Zap size={14} /> Instant Booking</span>
                </div>
                <button className="btn-text"><Info size={14} /> Amenities & Photos</button>
            </div>
        </div>
    );
};

export default BusCard;
