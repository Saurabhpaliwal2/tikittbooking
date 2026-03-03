import React, { useState } from 'react';
import { User, Mail, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

const PassengerForm = ({ schedule, selectedSeats, onConfirm, onBack }) => {
    const [formData, setFormData] = useState({
        passengerName: '',
        passengerEmail: '',
        passengerPhone: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(formData);
    };

    const totalPrice = selectedSeats.length * schedule.fare;

    return (
        <div className="passenger-form-container animate-fade-in">
            <div className="booking-layout-grid">
                <div className="form-section card glass">
                    <div className="section-header">
                        <User size={24} className="text-primary" />
                        <div>
                            <h3>Passenger Details</h3>
                            <p>Please enter the details for the primary passenger</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="passenger-form">
                        <div className="input-group">
                            <label><User size={14} /> Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter passenger name"
                                value={formData.passengerName}
                                onChange={(e) => setFormData({ ...formData, passengerName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="input-row">
                            <div className="input-group">
                                <label><Mail size={14} /> Email Address</label>
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    value={formData.passengerEmail}
                                    onChange={(e) => setFormData({ ...formData, passengerEmail: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label><Phone size={14} /> Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="Enter 10 digit mobile"
                                    value={formData.passengerPhone}
                                    onChange={(e) => setFormData({ ...formData, passengerPhone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-text" onClick={onBack}>
                                Back to Seats
                            </button>
                            <button type="submit" className="btn-primary">
                                Confirm Booking <ArrowRight size={18} />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="summary-section card glass">
                    <h3>Journey Summary</h3>
                    <div className="summary-card-info">
                        <div className="info-item">
                            <span className="label">Route</span>
                            <span className="value">{schedule.route.source} to {schedule.route.destination}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Date & Time</span>
                            <span className="value">{schedule.travelDate} at {typeof schedule.departureTime === 'string' ? schedule.departureTime.slice(0, 5) : 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Bus Type</span>
                            <span className="value">{schedule.bus.operatorName} ({schedule.bus.busType.replace(/_/g, ' ')})</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Selected Seats</span>
                            <span className="value">{selectedSeats.join(', ')}</span>
                        </div>
                    </div>

                    <div className="price-breakdown">
                        <div className="price-row">
                            <span>Ticket Price ({selectedSeats.length} x ₹{schedule.fare})</span>
                            <span>₹{totalPrice}</span>
                        </div>
                        <div className="price-row">
                            <span>Service Fee</span>
                            <span>₹0</span>
                        </div>
                        <div className="total-row">
                            <span>Total Amount</span>
                            <span>₹{totalPrice}</span>
                        </div>
                    </div>

                    <div className="trust-footer">
                        <ShieldCheck size={16} />
                        <span>Secure payment gateway</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassengerForm;
