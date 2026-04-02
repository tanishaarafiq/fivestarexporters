const Enquiry = require('../models/Enquiry');

// @desc    Submit a new enquiry
// @route   POST /api/enquiries
const submitEnquiry = async (req, res) => {
    try {
        const { firstName, lastName, email, subject, message } = req.body;

        const enquiry = new Enquiry({
            user: req.user ? req.user._id : null, // Associate with user if logged in
            firstName,
            lastName,
            email,
            subject,
            message,
        });

        const createdEnquiry = await enquiry.save();
        res.status(201).json(createdEnquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's own enquiries
// @route   GET /api/enquiries/mine
const getMyEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all enquiries (Admin)
// @route   GET /api/enquiries
const getEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reply to an enquiry (Admin)
// @route   PUT /api/admin/enquiries/:id/reply
const replyToEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id);
        if (enquiry) {
            enquiry.adminReply = req.body.reply;
            enquiry.status = 'Replied';
            enquiry.isRead = true;
            const updatedEnquiry = await enquiry.save();
            res.json(updatedEnquiry);
        } else {
            res.status(404).json({ message: 'Enquiry not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { submitEnquiry, getEnquiries, replyToEnquiry, getMyEnquiries };
