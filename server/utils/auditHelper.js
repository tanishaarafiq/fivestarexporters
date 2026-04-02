const AuditLog = require('../models/AuditLog');

/**
 * Utility to create a system audit log entry
 * @param {Object} req - The request object (to extract IP)
 * @param {String} userEmail - The email of the user performing the action
 * @param {String} action - Description of the action
 * @param {String} type - Type of log (login, admin, order, system)
 */
const createLog = async (req, userEmail, action, type = 'system') => {
    try {
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';

        await AuditLog.create({
            user: userEmail || 'Guest',
            action,
            ipAddress,
            type,
            timestamp: new Date()
        });

        console.log(`[AUDIT] ${type.toUpperCase()}: ${userEmail} - ${action} (${ipAddress})`);
    } catch (error) {
        console.error('Audit Log Error:', error);
    }
};

module.exports = { createLog };
