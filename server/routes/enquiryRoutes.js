const express = require('express');
const router = express.Router();
const { submitEnquiry, getEnquiries, getMyEnquiries } = require('../controllers/enquiryController');
const { protect, isAdmin } = require('../middleware/auth');

// Public route but can take optional user ID from token if present
router.post('/', (req, res, next) => {
    // We use a custom middleware to extract user but not strictly block if not logged in
    const authHeaders = req.headers.authorization;
    if (authHeaders && authHeaders.startsWith('Bearer')) {
        return protect(req, res, next);
    }
    next();
}, submitEnquiry);

// User specific routes
router.get('/mine', protect, getMyEnquiries);

// Admin routes (moved to adminRoutes.js but keeping here for legacy or specific access)
router.get('/', protect, isAdmin, getEnquiries);

module.exports = router;
