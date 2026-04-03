const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer',
    },
    company: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        quantity: {
            type: Number,
            default: 1,
        },
    }],
    lastLogin: {
        type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, {
    timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
