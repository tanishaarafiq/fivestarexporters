const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.product');
        res.json(user.cart || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = await User.findById(req.user._id);

        // Check if product exists
        const product = await Product.findOne({ partCode: productId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if item already in cart
        const existingItem = user.cart.find(
            (item) => item.product.toString() === product._id.toString()
        );

        if (existingItem) {
            existingItem.quantity += (quantity || 1);
        } else {
            user.cart.push({ product: product._id, quantity: quantity || 1 });
        }

        await user.save();
        const updatedUser = await User.findById(req.user._id).populate('cart.product');
        res.json(updatedUser.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const user = await User.findById(req.user._id);

        const product = await Product.findOne({ partCode: req.params.productId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const cartItem = user.cart.find(
            (item) => item.product.toString() === product._id.toString()
        );

        if (cartItem) {
            cartItem.quantity = quantity;
            await user.save();
            const updatedUser = await User.findById(req.user._id).populate('cart.product');
            res.json(updatedUser.cart);
        } else {
            res.status(404).json({ message: 'Item not in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
const removeFromCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const product = await Product.findOne({ partCode: req.params.productId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        user.cart = user.cart.filter(
            (item) => item.product.toString() !== product._id.toString()
        );

        await user.save();
        const updatedUser = await User.findById(req.user._id).populate('cart.product');
        res.json(updatedUser.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
const clearCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.cart = [];
        await user.save();
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
