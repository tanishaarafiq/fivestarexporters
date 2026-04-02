const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createLog } = require('../utils/auditHelper');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password, company } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            company: company || '',
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            company: user.company,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);

        // Find user by email
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            console.log(`Password match for: ${email}`);
            // Update last login (use updateOne to avoid triggering save middleware/password hashing)
            await User.updateOne({ _id: user._id }, { lastLogin: Date.now() });

            // Audit Log
            await createLog(req, user.email, 'Successful Login', 'login');

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                token: generateToken(user._id),
            });
        } else {
            console.log(`Login failed for: ${email} - User not found or password mismatch`);
            // Log failed attempt
            const failedEmail = req.body.email || 'Unknown';
            await createLog(req, failedEmail, 'Failed Login Attempt', 'login');

            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login internal error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.company = req.body.company || user.company;
            user.phone = req.body.phone || user.phone;

            if (req.body.email) {
                user.email = req.body.email;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                company: updatedUser.company,
                phone: updatedUser.phone,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, getMe, updateProfile };
