const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    partCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        trim: true,
    },
    price: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    stock: {
        type: Number,
        default: 100,
    },
    inStock: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
