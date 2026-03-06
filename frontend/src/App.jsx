import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { History, User, LogIn, LogOut, Bus as BusIcon, Loader2, MapPin } from 'lucide-react';
import { busService, bookingService } from './services/api';
import BusSearch from './components/BusSearch';
import BusCard from './components/BusCard';
import SeatSelection from './components/SeatSelection';
import PassengerForm from './components/PassengerForm';
import PaymentScreen from './components/PaymentScreen';
import BookingHistory from './components/BookingHistory';
import LiveTracking from './components/LiveTracking';
import BusFilters from './components/BusFilters';
import LoginRegistry from './components/LoginRegistry';
import './App.css';
import { useToast } from './context/ToastContext';

const Home = ({ user, onShowLogin }) => {
  const { showToast } = useToast();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingStep, setBookingStep] = useState('results'); // results, seats, passenger, payment, confirmation
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingRef, setBookingRef] = useState(null);

  const [filters, setFilters] = useState({
    price: 'all',
    busTypes: [],
    departureTimes: [],
    operators: [],
    sortBy: 'time_asc'
  });

  // Extract unique bus operators from all loaded schedules
  const availableOperators = [...new Set(schedules.map(s => s.bus.operatorName))].sort();

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
      let response;
      if (params.showAll) {
        response = await busService.getAllSchedules();
      } else {
        response = await busService.searchBuses({
          from: params.from,
          to: params.to,
          date: params.date
        });
      }
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

      if (user.name === 'Demo User') {
        const mockResponse = {
          data: {
            id: 'mock-' + Date.now(),
            pnr: 'TK' + Math.floor(Math.random() * 900000 + 100000),
            status: 'PENDING_PAYMENT',
            passengerName: passengerData.passengerName,
            passengerPhone: passengerData.passengerPhone,
            totalAmount: selectedSeats.length * selectedSchedule.fare,
            seatNumbers: selectedSeats.join(', '),
            schedule: selectedSchedule
          }
        };
        setCurrentBooking(mockResponse.data);
      } else {
        const response = await bookingService.createBooking({
          scheduleId: selectedSchedule.id,
          seatNumbers: selectedSeats,
          ...passengerData
        });
        setCurrentBooking(response.data);
      }
      setBookingStep('payment');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentRecord) => {
    if (user && user.name === 'Demo User' && currentBooking) {
      const demoBookings = JSON.parse(localStorage.getItem('demo_bookings') || '[]');
      const updatedBooking = { ...currentBooking, status: 'CONFIRMED' };
      demoBookings.unshift(updatedBooking); // Add new booking to the top
      localStorage.setItem('demo_bookings', JSON.stringify(demoBookings));
      console.log('[Demo] Booking persisted to localStorage:', updatedBooking.pnr);
    }

    setBookingRef(currentBooking.pnr);
    setBookingStep('confirmation');
    showToast(`Booking Confirmed! PNR: ${currentBooking.pnr}`, "success");
  };

  const filteredSchedules = schedules.filter(schedule => {
    // 1. Price Filter
    if (filters.price !== 'all') {
      if (filters.price === 'under500' && schedule.fare >= 500) return false;
      if (filters.price === '500to1000' && (schedule.fare < 500 || schedule.fare > 1000)) return false;
      if (filters.price === 'over1000' && schedule.fare <= 1000) return false;
    }

    // 2. Bus Type Filter
    if (filters.busTypes.length > 0) {
      const isAc = !schedule.bus.busType.includes('NON_AC');
      if (filters.busTypes.includes('AC') && !isAc) {
        if (!filters.busTypes.includes('NON_AC')) return false;
      }
      if (filters.busTypes.includes('NON_AC') && isAc) {
        if (!filters.busTypes.includes('AC')) return false;
      }
    }

    // 3. Departure Time Filter
    if (filters.departureTimes.length > 0) {
      if (typeof schedule.departureTime === 'string') {
        const hour = parseInt(schedule.departureTime.split(':')[0], 10);
        const isMorning = hour >= 6 && hour < 12;
        const isAfternoon = hour >= 12 && hour < 18;
        const isEvening = hour >= 18 && hour < 24;
        const isNight = hour >= 0 && hour < 6;

        const timeMatch = (filters.departureTimes.includes('morning') && isMorning) ||
          (filters.departureTimes.includes('afternoon') && isAfternoon) ||
          (filters.departureTimes.includes('evening') && isEvening) ||
          (filters.departureTimes.includes('night') && isNight);

        if (!timeMatch) return false;
      }
    }

    // 4. Operator Filter
    if (filters.operators.length > 0) {
      if (!filters.operators.includes(schedule.bus.operatorName)) {
        return false;
      }
    }

    return true;
  });

  const sortedAndFilteredSchedules = [...filteredSchedules].sort((a, b) => {
    switch (filters.sortBy) {
      case 'time_desc':
        return b.departureTime.localeCompare(a.departureTime);
      case 'price_asc':
        return a.fare - b.fare;
      case 'price_desc':
        return b.fare - a.fare;
      case 'time_asc':
      default:
        return a.departureTime.localeCompare(b.departureTime);
    }
  });

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
              <div className={`results-wrapper ${searched && schedules.length > 0 ? 'has-filters' : ''}`}>

                {searched && schedules.length > 0 && (
                  <BusFilters
                    filters={filters}
                    setFilters={setFilters}
                    availableOperators={availableOperators}
                  />
                )}

                <div className="results-list">
                  {sortedAndFilteredSchedules.length > 0 ? (
                    sortedAndFilteredSchedules.map((schedule) => (
                      <BusCard
                        key={schedule.id}
                        schedule={schedule}
                        onSelect={handleSelectSeats}
                      />
                    ))
                  ) : (
                    searched && !loading && (
                      <div className="no-results card">
                        <h3>No buses found</h3>
                        <p>Try adjusting your search filters</p>
                        {Object.values(filters).some(f => f.length > 0 && f !== 'all') && (
                          <button
                            className="btn-text"
                            style={{ marginTop: '1rem' }}
                            onClick={() => setFilters({ price: 'all', busTypes: [], departureTimes: [], operators: [] })}
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                    )
                  )}
                  {searched && schedules.length === 0 && !loading && (
                    <div className="no-results card">
                      <h3>No buses found for this route</h3>
                      <p>Try searching for different cities or dates</p>
                    </div>
                  )}
                </div>
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
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
              <Link to="/tracking" className="nav-item"><MapPin size={16} /> Track</Link>
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
            <Route path="/tracking" element={<LiveTracking />} />
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
