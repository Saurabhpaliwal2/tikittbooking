import React from 'react';

function PaymentLogo() {
    return (
        <div className="accepted-payments-section">
            <p className="accepted-payments-label">Accepted Payments</p>
            <div className="accepted-payments-icons">
                <div className="payment-icon-item" title="Visa">
                    <svg viewBox="0 0 48 32" width="44" height="28" fill="none">
                        <rect width="48" height="32" rx="4" fill="#1A1F71" />
                        <path d="M19.5 21h-3l1.9-11.5h3L19.5 21zm12.3-11.2c-.6-.2-1.5-.5-2.7-.5-3 0-5.1 1.5-5.1 3.7 0 1.6 1.5 2.5 2.7 3.1 1.2.5 1.6.9 1.6 1.4 0 .7-.9 1.1-1.8 1.1-1.2 0-1.9-.2-2.9-.6l-.4-.2-.4 2.5c.7.3 2.1.6 3.5.6 3.2 0 5.2-1.5 5.2-3.8 0-1.3-.8-2.2-2.5-3-1-.5-1.7-.9-1.7-1.4 0-.5.5-1 1.7-1 1 0 1.7.2 2.2.4l.3.1.3-2.4zm7.9-.3h-2.3c-.7 0-1.3.2-1.6 1l-4.5 10.5h3.2l.6-1.7h3.9l.4 1.7H42l-2.3-11.5zm-3.7 7.4l1.6-4.3.5 2.1.6 2.2h-2.7zM16.3 9.5l-2.8 7.8-.3-1.5c-.5-1.7-2.2-3.6-4-4.5l2.7 10.2h3.2l4.8-12h-3.6z" fill="#fff" />
                        <path d="M11 9.5H6.1l-.1.3c3.8.9 6.3 3.2 7.3 5.9l-1.1-5.2c-.2-.8-.7-1-1.2-1z" fill="#F7B600" />
                    </svg>
                </div>
                <div className="payment-icon-item" title="Mastercard">
                    <svg viewBox="0 0 48 32" width="44" height="28" fill="none">
                        <rect width="48" height="32" rx="4" fill="#252525" />
                        <circle cx="19" cy="16" r="8" fill="#EB001B" />
                        <circle cx="29" cy="16" r="8" fill="#F79E1B" />
                        <path d="M24 10.3a8 8 0 0 1 0 11.4 8 8 0 0 1 0-11.4z" fill="#FF5F00" />
                    </svg>
                </div>
                <div className="payment-icon-item" title="UPI">
                    <svg viewBox="0 0 48 32" width="44" height="28" fill="none">
                        <rect width="48" height="32" rx="4" fill="#fff" stroke="#ddd" strokeWidth="1" />
                        <text x="24" y="19" textAnchor="middle" fontSize="11" fontWeight="700" fill="#00897B" fontFamily="Arial, sans-serif">UPI</text>
                    </svg>
                </div>
                <div className="payment-icon-item" title="Net Banking">
                    <svg viewBox="0 0 48 32" width="44" height="28" fill="none">
                        <rect width="48" height="32" rx="4" fill="#fff" stroke="#ddd" strokeWidth="1" />
                        <path d="M14 22h20M24 8l10 6H14l10-6z" stroke="#4f46e5" strokeWidth="1.5" fill="none" />
                        <rect x="17" y="14" width="3" height="7" rx="0.5" fill="#4f46e5" opacity="0.7" />
                        <rect x="22.5" y="14" width="3" height="7" rx="0.5" fill="#4f46e5" opacity="0.7" />
                        <rect x="28" y="14" width="3" height="7" rx="0.5" fill="#4f46e5" opacity="0.7" />
                    </svg>
                </div>
                <div className="payment-icon-item" title="RuPay">
                    <svg viewBox="0 0 48 32" width="44" height="28" fill="none">
                        <rect width="48" height="32" rx="4" fill="#fff" stroke="#ddd" strokeWidth="1" />
                        <text x="24" y="19" textAnchor="middle" fontSize="9" fontWeight="700" fill="#097A44" fontFamily="Arial, sans-serif">RuPay</text>
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default PaymentLogo;
