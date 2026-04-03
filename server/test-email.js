require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
    console.log('--- Email Configuration Test ---');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '******** (Hidden)' : 'MISSING');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        console.log('Attempting to send test email...');
        const info = await transporter.sendMail({
            from: `"Test Support" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to self
            subject: 'Five Star Exporters - Server Connectivity Test',
            text: 'If you are reading this, the email system is correctly authenticated with Google Servers.',
            html: '<b>Strategic Connectivity Status: ONLINE</b>',
        });
        console.log('✅ Email Sent Successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Email Sending Failed!');
        console.error('Error details:', error);
    }
};

testEmail();
