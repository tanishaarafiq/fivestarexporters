const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: process.env.EMAIL_USER || 'fivestarexporterss@gmail.com',
            pass: process.env.EMAIL_PASS,
        },
    });
};

const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: `"Five Star Exporters" <${process.env.EMAIL_USER || 'fivestarexporterss@gmail.com'}>`,
            to: userEmail,
            subject: 'Welcome to Five Star Exporters – Precision Engineering Delivered',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
                    <div style="background: #001e3c; color: #fff; padding: 20px; text-align: center;">
                        <h1 style="margin: 0; color: #ffcc00; font-size: 24px;">Five Star Exporters</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #0056b3;">Welcome aboard, ${userName}!</h2>
                        <p>We are thrilled to have you join Five Star Exporters, your global benchmark in powerloom spare parts and textile machinery components.</p>
                        <p>Your account has been successfully created. You can now:</p>
                        <ul style="list-style: none; padding: 0;">
                            <li>✅ Browse our 154+ precision-engineered spare parts.</li>
                            <li>✅ Track your enquiries in real-time.</li>
                            <li>✅ Place international orders with seamless logistics.</li>
                        </ul>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="http://localhost:5175/login" style="background: #0056b3; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Your Dashboard</a>
                        </div>
                        <p>If you have any technical queries, feel free to contact our support team at <a href="mailto:fivestarexporterss@gmail.com">fivestarexporterss@gmail.com</a>.</p>
                        <br>
                        <p>Best Regards,</p>
                        <p><strong>Operations Command</strong><br>Five Star Exporters, Tamil Nadu</p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};

const sendOrderConfirmation = async (userEmail, order) => {
    try {
        const transporter = createTransporter();
        const orderId = order._id.toString().slice(-8).toUpperCase();
        
        const mailOptions = {
            from: `"Five Star Exporters" <${process.env.EMAIL_USER || 'fivestarexporterss@gmail.com'}>`,
            to: userEmail,
            subject: `Order Confirmed: #${orderId} - Five Star Exporters`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
                    <div style="background: #001e3c; color: #fff; padding: 20px; text-align: center;">
                        <h1 style="margin: 0; color: #ffcc00; font-size: 24px;">Order Confirmed</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #0056b3;">Thank you for your order!</h2>
                        <p>We've received your order <strong>#${orderId}</strong> and are currently preparing it for international dispatch.</p>
                        
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h4 style="margin: 0; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Order Summary</h4>
                            <p style="margin: 10px 0 0;"><strong>Total Amount:</strong> ₹${order.totalAmount.toLocaleString('en-IN')}</p>
                            <p style="margin: 5px 0 0;"><strong>Shipping To:</strong> ${order.shippingAddress}</p>
                            <p style="margin: 5px 0 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                        </div>
                        
                        <p>Our quality assurance team will perform a final stress test on your spare parts prior to containerization.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="http://localhost:5175/dashboard" style="background: #0056b3; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Track My Order</a>
                        </div>
                        <p>For logistics or tracking updates, contact our freight directorate at <a href="mailto:fivestarexporterss@gmail.com">fivestarexporterss@gmail.com</a>.</p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
};

const sendPasswordResetEmail = async (userEmail, resetUrl) => {
    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: `"Five Star Exporters Security" <${process.env.EMAIL_USER || 'fivestarexporterss@gmail.com'}>`,
            to: userEmail,
            subject: 'Strategic Access Reset Request - Five Star Exporters',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
                    <div style="background: #001e3c; color: #fff; padding: 20px; text-align: center;">
                        <h1 style="margin: 0; color: #ffcc00; font-size: 24px;">Security Protocol</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #0056b3;">Password Reset Protocol Initiated</h2>
                        <p>We received a request to reset the password for your Five Star Exporters Command Center account.</p>
                        <p>This secure link will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" style="background: #d90429; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Strategic Password</a>
                        </div>
                        
                        <p>If the button above does not work, copy and paste this URL into your browser:</p>
                        <p style="font-size: 11px; color: #666; word-wrap: break-word;">${resetUrl}</p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
};

module.exports = { 
    sendWelcomeEmail, 
    sendOrderConfirmation, 
    sendPasswordResetEmail 
};
