const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    firstName: {
        type: String,
        required: [true, 'Please add your first name'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Please add your last name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please add your email'],
        trim: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: [true, 'Please add your message'],
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    adminReply: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['Pending', 'Replied'],
        default: 'Pending',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Enquiry', enquirySchema);
