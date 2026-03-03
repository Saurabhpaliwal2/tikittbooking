import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { paymentService } from '../services/api';
import PaymentLogo from './PaymentLogo';

const PaymentScreen = ({ booking, onPaymentSuccess, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initPayment = async () => {
            setLoading(true);
            try {
                const response = await paymentService.createOrder(booking.id);
                setOrder(response.data);
            } catch (err) {
                console.error('Failed to create payment order:', err);
                setError('Failed to initialize payment. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (booking?.id) {
            initPayment();
        }
    }, [booking?.id]);

    const handlePayNow = async () => {
        setLoading(true);
        setError(null);
        try {
            // Simulating a dummy "SUCCESS" payment verification
            const response = await paymentService.verifyPayment({
                orderId: order.orderId,
                status: 'SUCCESS'
            });
            onPaymentSuccess(response.data);
        } catch (err) {
            console.error('Payment verification failed:', err);
            setError('Payment verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !order) {
        return (
            <div className="loading-state card glass">
                <Loader2 className="animate-spin" size={48} color="#4f46e5" />
                <p>Initializing secure payment gateway...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card glass animate-fade-in" style={{ textAlign: 'center', padding: '3rem' }}>
                <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
                <h3>Payment Error</h3>
                <p>{error}</p>
                <button className="btn-primary" onClick={onBack} style={{ marginTop: '1.5rem' }}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="payment-screen-container animate-fade-in">
            <div className="card glass">
                <div className="section-header">
                    <CreditCard size={24} className="text-primary" />
                    <div>
                        <h3>Complete Your Payment</h3>
                        <p>Securely pay for your bus ticket</p>
                    </div>
                </div>

                <div className="payment-summary">
                    <div className="summary-item">
                        <span>PNR Reference:</span>
                        <strong>{booking.pnr}</strong>
                    </div>
                    <div className="summary-item">
                        <span>Booking Status:</span>
                        <span className="badge pending">PENDING PAYMENT</span>
                    </div>
                    <hr className="divider" />
                    <div className="total-fare">
                        <span>Total Fare:</span>
                        <span className="price">₹{booking.totalAmount}</span>
                    </div>
                </div>

                <div className="payment-methods">
                    <p className="sub-label">Select Payment Method</p>
                    <div className="method-option active">
                        <div className="method-info">
                            <CheckCircle size={18} className="text-primary" />
                            <span>Simulated Payment (Dummy)</span>
                        </div>
                        <span className="badge">Instant</span>
                    </div>

                    <div className="method-option disabled" title="Coming soon with Razorpay">
                        <div className="method-info">
                            <div className="dot" />
                            <span>Debit / Credit Card</span>
                        </div>
                        <span className="badge secondary">Razorpay</span>
                    </div>
                </div>

                <div className="payment-actions">
                    <button className="btn-text" onClick={onBack} disabled={loading}>
                        Cancel
                    </button>
                    <button className="btn-primary" onClick={handlePayNow} disabled={loading}>
                        {loading ? <><Loader2 className="animate-spin" size={18} /> Processing...</> : 'Pay Now'}
                    </button>
                </div>

                <div className="trust-footer">
                    <ShieldCheck size={16} />
                    <span>Your transaction is encrypted and secure</span>
                </div>

                <PaymentLogo />
            </div>
        </div>
    );
};

export default PaymentScreen;
