const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        name: String,
        quantity: {
            type: Number,
            required: true,
        },
        price: String,
    }],
    shippingAddress: {
        fullName: String,
        address: String,
        city: String,
        state: String,
        zip: String,
        country: { type: String, default: 'India' },
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing',
    },
    paymentMethod: {
        type: String,
        default: 'COD',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
