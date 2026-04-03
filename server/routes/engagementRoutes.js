const express = require('express');
const router = express.Router();
const { recordEngagement } = require('../controllers/engagementController');
const { protect } = require('../middleware/auth');

// POST /api/engagement — logged-in users record a view or like
router.post('/', protect, recordEngagement);

module.exports = router;
