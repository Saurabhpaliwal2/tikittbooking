import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add JWT token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log(`[API Request] ${config.method.toUpperCase()} ${config.url} - Token attached`);
    } else {
        console.warn(`[API Request] ${config.method.toUpperCase()} ${config.url} - NO token found`);
    }
    return config;
}, (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
});

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

export const busService = {
    searchBuses: (params) => api.get('/buses/search', { params }),
    getBuses: () => api.get('/buses'),
    getCities: () => api.get('/cities'),
    getRoutes: () => api.get('/routes'),
    getAllSchedules: () => api.get('/schedules'),
    getSchedules: (routeId, date) => api.get(`/schedules/route/${routeId}`, { params: { date } }),
    getSeatAvailability: (id) => api.get(`/schedules/${id}/seats`),
};

export const bookingService = {
    createBooking: (bookingData) => api.post('/bookings', bookingData),
    getMyBookings: () => api.get('/bookings/my'),
    cancelBooking: (id) => api.delete(`/bookings/${id}`),
};

export const paymentService = {
    createOrder: (bookingId) => api.post(`/payments/order/${bookingId}`),
    verifyPayment: (paymentData) => api.post('/payments/verify', paymentData),
};

export default api;
