#!/usr/bin/env node

// Test script to verify email configuration
const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmailConfig() {
  console.log('Testing email configuration...');
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? '[SET]' : '[NOT SET]');
  console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '[SET]' : '[NOT SET]');

  // Create transporter
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
    },
  });

  try {
    // Verify connection
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');

    // Send test email
    console.log('Sending test email to yashabalam707@gmail.com...');
    const result = await transporter.sendMail({
      from: `"IECA Test" <${process.env.SMTP_USER}>`,
      to: 'yashabalam707@gmail.com',
      subject: '🧪 IECA Email Test',
      html: `
        <h2>Email Configuration Test</h2>
        <p>This is a test email to verify that the IECA email configuration is working properly.</p>
        <p>✅ Email system is functional!</p>
        <p>Time: ${new Date().toISOString()}</p>
      `,
      text: 'IECA Email Test - Email system is functional!'
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('✅ All tests passed! Email system is ready.');

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

testEmailConfig().catch(console.error);
