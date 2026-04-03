// Central API helper for Five Star Exporters
// All API calls go through this file

const API_BASE = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : '/api';

// Get the JWT token from localStorage
const getToken = () => localStorage.getItem('fivestar_token');

// Main API call function
const api = async (endpoint, options = {}) => {
    const token = getToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
        ...options,
    };

    // Don't stringify body if it's already a string
    if (config.body && typeof config.body !== 'string') {
        config.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config);

    let data = {};
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        try {
            data = await response.json();
        } catch (e) {
            console.error('Failed to parse JSON:', e);
        }
    }

    if (!response.ok) {
        console.error(`API Error on ${endpoint}:`, response.status, data);
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

// Auth APIs
export const authAPI = {
    register: (userData) => api('/auth/register', { method: 'POST', body: userData }),
    login: (credentials) => api('/auth/login', { method: 'POST', body: credentials }),
    getMe: () => api('/auth/me'),
    updateProfile: (data) => api('/auth/profile', { method: 'PUT', body: data }),
    forgotPassword: (email) => api('/auth/forgot-password', { method: 'POST', body: { email } }),
    resetPassword: (token, password) => api(`/auth/reset-password/${token}`, { method: 'POST', body: { password } }),
};

// Product APIs
export const productAPI = {
    getAll: (search = '', category = '') => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category && category !== 'All') params.append('category', category);
        return api(`/products?${params.toString()}`);
    },
    getByPartCode: (partCode) => api(`/products/${partCode}`),
};

// Cart APIs
export const cartAPI = {
    get: () => api('/cart'),
    add: (productId, quantity = 1) => api('/cart', { method: 'POST', body: { productId, quantity } }),
    update: (productId, quantity) => api(`/cart/${productId}`, { method: 'PUT', body: { quantity } }),
    remove: (productId) => api(`/cart/${productId}`, { method: 'DELETE' }),
    clear: () => api('/cart', { method: 'DELETE' }),
};

// Order APIs
export const orderAPI = {
    place: (orderData) => api('/orders', { method: 'POST', body: orderData }),
    getMyOrders: () => api('/orders'),
    getById: (id) => api(`/orders/${id}`),
};

// Enquiry APIs
export const enquiryAPI = {
    submit: (data) => api('/enquiries', { method: 'POST', body: data }),
    getMyEnquiries: () => api('/enquiries/mine'),
};

// Engagement tracking APIs (logged-in users)
export const engagementAPI = {
    record: (productName, partCode, action) =>
        api('/engagement', { method: 'POST', body: { productName, partCode, action } }),
};

// Admin APIs
export const adminAPI = {
    getStats: () => api('/admin/stats'),
    getUsers: () => api('/admin/users'),
    getOrders: () => api('/admin/orders'),
    updateOrderStatus: (id, status) => api(`/admin/orders/${id}`, { method: 'PUT', body: { status } }),
    // Products management
    createProduct: (productData) => api('/admin/products', { method: 'POST', body: productData }),
    updateProduct: (id, productData) => api(`/admin/products/${id}`, { method: 'PUT', body: productData }),
    deleteProduct: (id) => api(`/admin/products/${id}`, { method: 'DELETE' }),
    // Enquiry management
    getEnquiries: () => api('/admin/enquiries'),
    replyToEnquiry: (id, reply) => api(`/admin/enquiries/${id}/reply`, { method: 'PUT', body: { reply } }),
    // Audit Logs
    getAuditLogs: () => api('/admin/audit-logs'),
    // Product Engagement
    getEngagement: () => api('/admin/engagement'),
};

export default api;

