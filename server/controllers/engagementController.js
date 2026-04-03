const ProductEngagement = require('../models/ProductEngagement');

// @desc   Record a product view or like/unlike action
// @route  POST /api/engagement
const recordEngagement = async (req, res) => {
    try {
        const { productName, partCode, action } = req.body;
        if (!productName || !partCode || !action) {
            return res.status(400).json({ message: 'productName, partCode, and action are required' });
        }

        const engagement = await ProductEngagement.create({
            user: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            productName,
            partCode,
            action,
        });

        res.status(201).json(engagement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get recent engagement events (admin)
// @route  GET /api/admin/engagement
const getEngagement = async (req, res) => {
    try {
        const events = await ProductEngagement.find({ action: { $in: ['viewed', 'liked'] } })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { recordEngagement, getEngagement };
