import React, { useState, useEffect } from 'react';
import { Loader2, Armchair, ChevronRight } from 'lucide-react';
import { busService } from '../services/api';
import { useToast } from '../context/ToastContext';

const SeatSelection = ({ schedule, onContinue }) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [availability, setAvailability] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        const fetchSeats = async () => {
            setLoading(true);
            try {
                const response = await busService.getSeatAvailability(schedule.id);
                setAvailability(response.data);
            } catch (error) {
                console.error('Error fetching seats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSeats();
    }, [schedule.id]);

    const toggleSeat = (seatId) => {
        if (availability?.bookedSeats.includes(seatId.toString())) return;

        setSelectedSeats(prev => {
            const isSelected = prev.includes(seatId);
            if (!isSelected) {
                if (prev.length >= 6) {
                    showToast("You can select up to 6 seats only", "warning");
                    return prev;
                }
                showToast(`Seat ${seatId} selected`, "success");
                return [...prev, seatId];
            } else {
                return prev.filter(s => s !== seatId);
            }
        });
    };

    if (loading) return (
        <div className="loading-state">
            <Loader2 className="animate-spin" size={32} color="#4f46e5" />
            <p>Loading seat map...</p>
        </div>
    );

    const totalSeats = availability?.totalSeats || 40;
    const bookedSeats = availability?.bookedSeats || [];

    // Arrange seats in rows of 4 (2+2 layout)
    const rows = [];
    for (let i = 1; i <= totalSeats; i += 4) {
        rows.push([i, i + 1, i + 2, i + 3]);
    }

    return (
        <div className="seat-selection-container animate-fade-in card">
            <div className="selection-header">
                <h2>Select Your Seats</h2>
                <p>{schedule.bus.operatorName} - {schedule.bus.busType.replace(/_/g, ' ')}</p>
            </div>

            <div className="seat-layout-legend">
                <div className="legend-item"><div className="seat-icon available"><Armchair size={16} /></div> <span>Available</span></div>
                <div className="legend-item"><div className="seat-icon selected"><Armchair size={16} /></div> <span>Selected</span></div>
                <div className="legend-item"><div className="seat-icon booked"><Armchair size={16} /></div> <span>Booked</span></div>
            </div>

            <div className="bus-internal-layout">
                <div className="steering-wheel"><div className="wheel-inner" /></div>
                <div className="seats-grid">
                    {rows.map((row, rowIdx) => (
                        <div key={rowIdx} className="seat-row">
                            <div className="seat-pair">
                                {row.slice(0, 2).map(seatId => (
                                    <div
                                        key={seatId}
                                        className={`seat ${bookedSeats.includes(seatId.toString()) ? 'booked' : selectedSeats.includes(seatId) ? 'selected' : 'available'}`}
                                        onClick={() => toggleSeat(seatId)}
                                        title={`Seat ${seatId}`}
                                    >
                                        <Armchair size={18} />
                                        <span className="seat-number">{seatId}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="bus-aisle" />
                            <div className="seat-pair">
                                {row.slice(2, 4).map(seatId => (
                                    <div
                                        key={seatId}
                                        className={`seat ${bookedSeats.includes(seatId.toString()) ? 'booked' : selectedSeats.includes(seatId) ? 'selected' : 'available'}`}
                                        onClick={() => toggleSeat(seatId)}
                                        title={`Seat ${seatId}`}
                                    >
                                        <Armchair size={18} />
                                        <span className="seat-number">{seatId}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="selection-summary">
                <div className="summary-details">
                    <div className="summary-item">
                        <span className="label">Selected Seats:</span>
                        <span className="value">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Total Price:</span>
                        <span className="value price">₹{selectedSeats.length * schedule.fare}</span>
                    </div>
                </div>
                <button
                    className="btn-primary"
                    disabled={selectedSeats.length === 0}
                    onClick={() => onContinue(selectedSeats)}
                >
                    CONTINUE <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default SeatSelection;
