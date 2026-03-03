import React from 'react';

function PaymentLogo() {
    return (
        <div className="text-center mt-4 payment-logo-container">
            <h5 className="text-muted mb-2" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Pay Securely With</h5>
            <div className="logo-wrapper glass" style={{ display: 'inline-block', padding: '0.5rem 1.5rem', borderRadius: '12px' }}>
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/55/Paytm_logo.png"
                    alt="Paytm"
                    width="100"
                />
            </div>
        </div>
    );
}

export default PaymentLogo;
