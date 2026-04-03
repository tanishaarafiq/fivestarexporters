const mongoose = require('mongoose');

const productEngagementSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userName: { type: String, required: true },
    userEmail: { type: String },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    productName: { type: String, required: true },
    partCode: { type: String, required: true },
    action: {
        type: String,
        enum: ['viewed', 'liked', 'unliked'],
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('ProductEngagement', productEngagementSchema);
