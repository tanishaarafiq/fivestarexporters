const Order = require('../models/Order');
const User = require('../models/User');
const { createLog } = require('../utils/auditHelper');
const { sendOrderConfirmation } = require('../utils/emailService');

// @desc    Place a new order (checkout)
// @route   POST /api/orders
const placeOrder = async (req, res) => {
    try {
        const { items, shippingAddress, totalAmount, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            totalAmount,
            paymentMethod: paymentMethod || 'COD',
        });

        // Send confirmation email
        sendOrderConfirmation(req.user.email, order).catch(console.error);

        // Audit Log
        await createLog(req, req.user.email, `Placed Order #${order._id.toString().slice(-8).toUpperCase()} (₹${totalAmount})`, 'order');

        // Clear user's cart after placing order
        const user = await User.findById(req.user._id);
        user.cart = [];
        await user.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product');

        if (order && order.user.toString() === req.user._id.toString()) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { placeOrder, getMyOrders, getOrderById };
