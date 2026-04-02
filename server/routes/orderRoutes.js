const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/', protect, placeOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;
