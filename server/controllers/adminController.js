const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Enquiry = require('../models/Enquiry');
const AuditLog = require('../models/AuditLog');
const { createLog } = require('../utils/auditHelper');

// @desc    Get system audit logs (admin)
// @route   GET /api/admin/audit-logs
const getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'customer' });
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalEnquiries = await Enquiry.countDocuments();

        // Calculate total revenue
        const orders = await Order.find();
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Recent orders (last 5)
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        // Orders by status
        const processingOrders = await Order.countDocuments({ status: 'Processing' });
        const shippedOrders = await Order.countDocuments({ status: 'Shipped' });
        const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });

        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalEnquiries,
            totalRevenue,
            recentOrders,
            ordersByStatus: {
                processing: processingOrders,
                shipped: shippedOrders,
                delivered: deliveredOrders,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status (admin)
// @route   PUT /api/admin/orders/:id
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();

            // Audit Log
            await createLog(req, req.user.email, `Updated Order #${order._id.toString().slice(-8).toUpperCase()} status to: ${order.status}`, 'admin');

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStats, getAllUsers, getAllOrders, updateOrderStatus, getAuditLogs };
