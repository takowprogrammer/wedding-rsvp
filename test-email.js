const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
    console.log('Testing email configuration...');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***' : 'NOT SET');
    console.log('MAIL_FROM:', process.env.MAIL_FROM);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        } : undefined,
    });

    try {
        // Test connection
        console.log('\nTesting SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection successful!');

        // Send test email
        console.log('\nSending test email...');
        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM || 'test@example.com',
            to: process.env.SMTP_USER, // Send to yourself
            subject: 'Test Email from Wedding RSVP',
            html: '<h1>Test Email</h1><p>This is a test email from your Wedding RSVP system.</p>',
        });

        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Email test failed:');
        console.error('Error:', error.message);
        if (error.code) {
            console.error('Error Code:', error.code);
        }
        if (error.response) {
            console.error('Response:', error.response);
        }
    }
}

testEmail();
