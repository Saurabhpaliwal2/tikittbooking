import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { History, User, LogIn, LogOut, Bus as BusIcon, Loader2 } from 'lucide-react';
import { busService, bookingService } from './services/api';
import BusSearch from './components/BusSearch';
import BusCard from './components/BusCard';
import SeatSelection from './components/SeatSelection';
import PassengerForm from './components/PassengerForm';
import PaymentScreen from './components/PaymentScreen';
import BookingHistory from './components/BookingHistory';
import LoginRegistry from './components/LoginRegistry';
import './App.css';

const Home = ({ user, onShowLogin }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingStep, setBookingStep] = useState('results'); // results, seats, passenger, payment, confirmation
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingRef, setBookingRef] = useState(null);

  useEffect(() => {
    const fetchInitialSchedules = async () => {
      if (searched) return;
      setLoading(true);
      try {
        const response = await busService.getAllSchedules();
        setSchedules(response.data);
      } catch (error) {
        console.error('Error fetching initial schedules:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialSchedules();
  }, [searched]);

  const handleSearch = async (params) => {
    setLoading(true);
    setSearched(true);
    setSelectedSchedule(null);
    setBookingStep('results');
    try {
      const response = await busService.searchBuses({
        from: params.from,
        to: params.to,
        date: params.date
      });
      setSchedules(response.data);
    } catch (error) {
      console.error('Error searching buses:', error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSeats = (schedule) => {
    setSelectedSchedule(schedule);
    setBookingStep('seats');
  };

  const handleContinueToPassenger = (seats) => {
    setSelectedSeats(seats);
    if (!user) {
      onShowLogin();
    } else {
      setBookingStep('passenger');
    }
  };

  const handleConfirmBooking = async (passengerData) => {
    if (!user) {
      onShowLogin();
      return;
    }
    setLoading(true);
    try {
      console.log('Sending booking request with data:', {
        scheduleId: selectedSchedule.id,
        seatNumbers: selectedSeats,
        ...passengerData
      });
      console.log('Current token in localStorage:', localStorage.getItem('token'));

      const response = await bookingService.createBooking({
        scheduleId: selectedSchedule.id,
        seatNumbers: selectedSeats,
        ...passengerData
      });
      setCurrentBooking(response.data);
      setBookingStep('payment');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentRecord) => {
    setBookingRef(currentBooking.pnr);
    setBookingStep('confirmation');
  };

  if (bookingStep === 'confirmation') {
    return (
      <div className="container confirmation-view animate-fade-in card glass">
        <div className="success-icon">
          <BusIcon size={48} />
        </div>
        <h2>Booking Confirmed!</h2>
        <p>Your journey from <strong>{selectedSchedule.route.source}</strong> to <strong>{selectedSchedule.route.destination}</strong> is booked.</p>
        <div className="booking-ref">PNR: {bookingRef}</div>
        <div style={{ marginTop: '1.5rem' }}>
          <button className="btn-primary" onClick={() => {
            setBookingStep('results');
            setSelectedSchedule(null);
            setSearched(false);
          }}>
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {bookingStep === 'results' && (
        <>
          <div className="hero animate-fade-in">
            <h1>{searched ? 'Search Results' : 'Explore All Available Routes'}</h1>
            <p>{searched ? 'Found the best options for your journey' : 'Premium bus tickets at the best prices'}</p>
            <div className="search-container">
              <BusSearch onSearch={handleSearch} />
            </div>
          </div>

          <div className="results-container container">
            {loading ? (
              <div className="loading-state">
                <Loader2 className="animate-spin" size={48} color="#4f46e5" />
                <p>Finding the best buses for you...</p>
              </div>
            ) : (
              <div className="results-list">
                {schedules.map((schedule) => (
                  <BusCard
                    key={schedule.id}
                    schedule={schedule}
                    onSelect={handleSelectSeats}
                  />
                ))}
                {searched && schedules.length === 0 && !loading && (
                  <div className="no-results card">
                    <h3>No buses found</h3>
                    <p>Try searching for different cities or dates</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {bookingStep === 'seats' && (
        <div className="container">
          <button className="btn-text back-btn" onClick={() => setBookingStep('results')}>
            &larr; Back to Results
          </button>
          <SeatSelection
            schedule={selectedSchedule}
            onContinue={handleContinueToPassenger}
          />
        </div>
      )}

      {bookingStep === 'passenger' && (
        <div className="container">
          <button className="btn-text back-btn" onClick={() => setBookingStep('seats')}>
            &larr; Back to Seat Selection
          </button>
          <PassengerForm
            schedule={selectedSchedule}
            selectedSeats={selectedSeats}
            onConfirm={handleConfirmBooking}
            onBack={() => setBookingStep('seats')}
          />
        </div>
      )}

      {bookingStep === 'payment' && (
        <div className="container">
          <button className="btn-text back-btn" onClick={() => setBookingStep('passenger')}>
            &larr; Back to Passenger Details
          </button>
          <PaymentScreen
            booking={currentBooking}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={() => setBookingStep('passenger')}
          />
        </div>
      )}
    </div>
  );
};


const Profile = () => (
  <div className="animate-fade-in container">
    <div className="card glass" style={{ padding: '3rem', textAlign: 'center' }}>
      <div className="icon-badge" style={{ marginBottom: '1.5rem' }}>
        <User size={32} />
      </div>
      <h2>User Profile</h2>
      <p>Management options coming soon.</p>
    </div>
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoginOpen(false);
  };

  return (
    <Router>
      <div className="app-layout dark-theme">
        <nav className="navbar glass">
          <div className="container nav-content">
            <Link to="/" className="logo">
              <BusIcon size={32} color="#4f46e5" />
              <span className="logo-text">Tikitt</span>
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-item">Search</Link>
              <Link to="/bookings" className="nav-item">Bookings</Link>
              <Link to="/profile" className="nav-item">Profile</Link>
              {user ? (
                <div className="user-badge">
                  <User size={14} />
                  <span>{user.name}</span>
                  <button className="btn-logout" onClick={handleLogout} title="Logout">
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <button className="btn-login" onClick={() => setIsLoginOpen(true)}>
                  <LogIn size={18} /> Login
                </button>
              )}
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home user={user} onShowLogin={() => setIsLoginOpen(true)} />} />
            <Route path="/bookings" element={<BookingHistory />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>

        <LoginRegistry
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        <footer className="footer">
          <div className="container">
            <p>&copy; 2026 Tikitt Booking. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
