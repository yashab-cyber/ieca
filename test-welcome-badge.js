#!/usr/bin/env node

// Test script to verify welcome badge email
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import the email service (simulated)
async function testWelcomeBadge() {
  console.log('Testing Welcome Badge Email...');
  
  try {
    // Use curl to test the API endpoint
    const { exec } = require('child_process');
    
    exec('curl -X GET "http://localhost:9002/api/first-login-badge?email=yashabalam707@gmail.com&name=Yashab+Alam"', (error, stdout, stderr) => {
      if (error) {
        console.error('Error:', error.message);
        return;
      }
      if (stderr) {
        console.error('Stderr:', stderr);
        return;
      }
      
      console.log('Response:', stdout);
      
      try {
        const response = JSON.parse(stdout);
        if (response.success) {
          console.log('✅ Welcome badge email test successful!');
          console.log('Badge:', response.badge.title);
          console.log('Email sent:', response.emailSent);
        } else {
          console.log('❌ Test failed:', response.message);
        }
      } catch (parseError) {
        console.log('Raw response:', stdout);
      }
    });
    
  } catch (error) {
    console.error('❌ Welcome badge test failed:', error.message);
  }
}

testWelcomeBadge();
