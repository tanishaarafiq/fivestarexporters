const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/engagement', require('./routes/engagementRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Five Star Exporters API is running!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at ${process.env.BACKEND_URL || `http://localhost:${PORT}`}/api`);
});
