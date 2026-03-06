import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add JWT token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    // Auth routes and search routes don't necessarily need a token
    const isPublicRoute = config.url.includes('/auth/') ||
        ['/cities', '/schedules', '/buses/search'].some(path => config.url.includes(path));

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    } else if (!isPublicRoute) {
        // Only warn for protected routes that are missing a token
        console.warn(`[API Request] ${config.method.toUpperCase()} ${config.url} - Authentication token missing`);
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add response interceptor to handle auth errors
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/'; // Optional: force redirect or just let app re-render
    }
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
