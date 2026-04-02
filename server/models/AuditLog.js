const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: String,
        required: true,
        default: 'System',
    },
    action: {
        type: String,
        required: true,
    },
    ipAddress: {
        type: String,
        default: 'Unknown',
    },
    type: {
        type: String,
        enum: ['login', 'admin', 'order', 'system'],
        default: 'system',
    }
}, {
    timestamps: false, // We use our own timestamp
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
