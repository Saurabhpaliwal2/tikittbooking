import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Info } from 'lucide-react';

const faqData = {
    "How to book a ticket?": "Booking a ticket is easy! Use the search bar on our home page to enter your source, destination, and travel date. Select a bus and proceed to seat selection and payment.",
    "Accepted Payment Methods": "We accept all major Credit/Debit Cards, UPI, Net Banking, and popular wallets like Paytm and PhonePe.",
    "Cancellation Policy": "You can cancel from 'My Bookings' up to 4 hours before departure for a partial refund. Full refund is provided for cancellations made 24+ hours prior.",
    "Luggage Allowance": "Each passenger is allowed one cabin bag (up to 7kg) and one checked bag (up to 15kg). Extra luggage may incur additional charges.",
    "Contact Support": "Reach our 24/7 support team at support@tikitt.com or call toll-free 1800-123-4567.",
    "How to choose a seat?": "After selecting a bus, click 'Book Now' to view the seat map. Green seats are available, red are booked. Click any green seat to select it.",
    "Are buses AC or Non-AC?": "We offer both AC and Non-AC buses. You can filter by bus type on the search results page using the Filters panel on the left side.",
    "Track my PNR?": "Go to 'My Bookings' from the navigation bar. Your PNR number is shown on each booking card. You can also use it to track your bus live from the 'Track' page.",
    "Is my journey safe?": "Yes! All our partner buses are GPS-tracked, regularly serviced, and driven by verified, licensed drivers. We also offer 24/7 customer support for emergencies.",
    "Group Booking Discounts?": "We offer special discounts for groups of 10 or more passengers. Please contact our support team at support@tikitt.com to get a custom quote.",
    "Can I reschedule my ticket?": "Rescheduling is currently not supported directly from the app. Please cancel your current booking and re-book for the new date. Cancellation charges may apply.",
    "What if my bus is late?": "In case of delays, our support team is available 24/7. Significant delays (2+ hours) may qualify for partial compensation — please contact support with your PNR.",
    "Why can't I see any buses?": "This could be due to a poor connection or no buses available for your chosen route/date. Try clearing filters or searching for a different date.",
    "Payment failed but money deducted?": "Don't worry! Usually, it's a temporary hold. If a ticket isn't generated, the amount is automatically refunded within 5-7 business days. Contact support with your transaction ID.",
    "Ticket not received in email?": "Check your 'My Bookings' section first. All confirmed tickets are stored there. If it's missing, contact our support team immediately.",
    "How to report feedback for a bus?": "After your journey, you can rate the bus and leave feedback directly from the 'My Bookings' page for that specific trip."
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);

    const initialOptions = Object.keys(faqData);

    const initialMessage = {
        text: "Hi! I'm the Tikitt FAQ Assistant. How can I help you today?",
        isBot: true,
        options: initialOptions
    };

    const [messages, setMessages] = useState([initialMessage]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const addMessage = (text, isBot = false, options = undefined) => {
        setMessages(prev => [...prev, { text, isBot, options }]);
    };

    const removeLastOptions = () => {
        setMessages(prev => {
            const newMsgs = [...prev];
            if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].isBot) {
                newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], options: undefined };
            }
            return newMsgs;
        });
    };

    const handleOptionClick = (optionText) => {
        removeLastOptions();
        addMessage(optionText, false);

        setTimeout(() => {
            if (faqData[optionText]) {
                addMessage(faqData[optionText], true, ["Ask another question"]);
            } else if (optionText === "Ask another question") {
                addMessage("What else would you like to know?", true, initialOptions);
            } else {
                addMessage("I'm sorry, I don't have an answer for that right now.", true, ["Ask another question"]);
            }
        }, 600);
    };

    const toggleChat = () => setIsOpen(!isOpen);

    return (
        <div className="chatbot-wrapper">
            {!isOpen && (
                <button className="chatbot-toggle-btn" onClick={toggleChat}>
                    <MessageSquare size={24} />
                </button>
            )}

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-title">
                            <Info size={20} />
                            <span>Tikitt Help Center</span>
                        </div>
                        <button className="chatbot-close" onClick={toggleChat}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chatbot-messages" style={{ paddingBottom: '2rem' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isBot ? 'flex-start' : 'flex-end' }}>
                                <div className={`chat-bubble ${msg.isBot ? 'bot' : 'user'}`}>
                                    {msg.text.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            {i !== msg.text.split('\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </div>
                                {msg.options && msg.options.length > 0 && (
                                    <div className="chat-options" style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignSelf: 'flex-end', justifyContent: 'flex-end' }}>
                                        {msg.options.map((opt, optIdx) => (
                                            <button
                                                key={optIdx}
                                                className="chat-option-btn"
                                                onClick={() => handleOptionClick(opt)}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
