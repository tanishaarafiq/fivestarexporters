const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, getAllOrders, updateOrderStatus, getAuditLogs } = require('../controllers/adminController');
const { createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { getEnquiries, replyToEnquiry } = require('../controllers/enquiryController');
const { protect, isAdmin } = require('../middleware/auth');

// All admin routes require login + admin role
router.use(protect, isAdmin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.get('/audit-logs', getAuditLogs);
router.put('/orders/:id', updateOrderStatus);

// Product management
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Enquiry management
router.get('/enquiries', getEnquiries);
router.put('/enquiries/:id/reply', replyToEnquiry);

module.exports = router;
