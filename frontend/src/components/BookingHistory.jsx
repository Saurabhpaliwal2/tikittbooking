import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/api';
import { Calendar, MapPin, Clock, CreditCard, ChevronRight, AlertCircle, Loader2, Bus } from 'lucide-react';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [printingBooking, setPrintingBooking] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await bookingService.getMyBookings();
                setBookings(response.data);
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('Failed to load your bookings. Please make sure you are logged in.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleDownloadTicket = (booking) => {
        setPrintingBooking(booking);
        // Wait for state update and re-render then print
        setTimeout(() => {
            window.print();
            setPrintingBooking(null);
        }, 500);
    };

    if (loading) {
        return (
            <div className="loading-state container">
                <Loader2 className="animate-spin" size={48} color="#4f46e5" />
                <p>Loading your journeys...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container animate-fade-in">
                <div className="error-card card glass">
                    <AlertCircle size={48} className="text-error" />
                    <h3>Oops! Something went wrong</h3>
                    <p>{error}</p>
                    <button className="btn-primary" onClick={() => window.location.reload()}>Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container booking-history-container animate-fade-in">
            <div className="page-header">
                <h2>My Bookings</h2>
                <p>Track your upcoming and past journeys</p>
            </div>

            {bookings.length === 0 ? (
                <div className="no-results card glass">
                    <Bus size={64} className="text-muted" />
                    <h3>No bookings found</h3>
                    <p>You haven't booked any trips yet. Time to start exploring!</p>
                    <a href="/" className="btn-primary" style={{ marginTop: '1rem', textDecoration: 'none', display: 'inline-block' }}>
                        Browse Buses
                    </a>
                </div>
            ) : (
                <div className="bookings-list">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="booking-item-card card glass">
                            <div className="booking-header">
                                <div className="pnr-tag">PNR: {booking.pnr}</div>
                                <div className={`status-badge ${booking.status.toLowerCase()}`}>
                                    {booking.status}
                                </div>
                            </div>

                            <div className="booking-main">
                                <div className="route-display">
                                    <div className="city-box">
                                        <span className="city">{booking.schedule.route.source}</span>
                                        <span className="station">Main Station</span>
                                    </div>
                                    <div className="path-arrow">
                                        <div className="line"></div>
                                        <ChevronRight size={16} />
                                    </div>
                                    <div className="city-box">
                                        <span className="city">{booking.schedule.route.destination}</span>
                                        <span className="station">Central Terminal</span>
                                    </div>
                                </div>

                                <div className="booking-details-grid">
                                    <div className="detail-item">
                                        <Calendar size={16} />
                                        <span>{booking.schedule.travelDate}</span>
                                    </div>
                                    <div className="detail-item">
                                        <Clock size={16} />
                                        <span>{booking.schedule.departureTime.slice(0, 5)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <CreditCard size={16} />
                                        <span>₹{booking.totalAmount}</span>
                                    </div>
                                    <div className="detail-item">
                                        <Bus size={16} />
                                        <span>Seat: {booking.seatNumbers}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="booking-footer">
                                <div className="passenger-info">
                                    <strong>{booking.passengerName}</strong>
                                    <span>{booking.passengerPhone}</span>
                                </div>
                                {booking.status === 'CONFIRMED' && (
                                    <button
                                        className="btn-outline btn-sm"
                                        onClick={() => handleDownloadTicket(booking)}
                                    >
                                        Download Ticket
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Hidden Printable Ticket */}
            {printingBooking && (
                <div className="printable-ticket-container">
                    <div className="printable-ticket">
                        <div className="ticket-header">
                            <div className="ticket-logo">
                                <Bus size={32} />
                                <span>Tikitt</span>
                            </div>
                            <div className="ticket-pnr">
                                <span>Booking PNR</span>
                                <strong>{printingBooking.pnr}</strong>
                            </div>
                        </div>

                        <div className="ticket-body">
                            <div className="ticket-route">
                                <div className="route-point">
                                    <p>FROM</p>
                                    <h4>{printingBooking.schedule.route.source}</h4>
                                </div>
                                <div className="route-arrow"></div>
                                <div className="route-point">
                                    <p>TO</p>
                                    <h4>{printingBooking.schedule.route.destination}</h4>
                                </div>
                            </div>

                            <div className="ticket-info">
                                <div className="ticket-section-title">Passenger Details</div>
                                <div className="passenger-details-grid">
                                    <div className="ticket-info-item">
                                        <label>PASSENGER NAME</label>
                                        <span>{printingBooking.passengerName}</span>
                                    </div>
                                    <div className="ticket-info-item">
                                        <label>SEAT NUMBERS</label>
                                        <span>{printingBooking.seatNumbers}</span>
                                    </div>
                                    <div className="ticket-info-item">
                                        <label>CONTACT</label>
                                        <span>{printingBooking.passengerPhone}</span>
                                    </div>
                                    <div className="ticket-info-item">
                                        <label>TOTAL FARE</label>
                                        <span>₹{printingBooking.totalAmount}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="ticket-journey-info">
                                <div className="ticket-section-title">Journey Info</div>
                                <div className="passenger-details-grid">
                                    <div className="ticket-info-item">
                                        <label>TRAVEL DATE</label>
                                        <span>{printingBooking.schedule.travelDate}</span>
                                    </div>
                                    <div className="ticket-info-item">
                                        <label>DEPARTURE</label>
                                        <span>{printingBooking.schedule.departureTime.slice(0, 5)}</span>
                                    </div>
                                    <div className="ticket-info-item">
                                        <label>BUS DETAILS</label>
                                        <span>{printingBooking.schedule.bus.busName} ({printingBooking.schedule.bus.busNumber})</span>
                                    </div>
                                    <div className="ticket-info-item">
                                        <label>BUS TYPE</label>
                                        <span>{printingBooking.schedule.bus.busType.replace(/_/g, ' ')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ticket-footer">
                            <div className="terms">
                                <p style={{ fontSize: '0.6rem', color: '#64748b', margin: 0 }}>
                                    * Please carry a valid ID proof during travel.<br />
                                    * Reach terminal 30 mins before departure.
                                </p>
                            </div>
                            <div className="ticket-qr-dummy">
                                TIKITT-SECURE-ID<br />{printingBooking.pnr}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingHistory;
