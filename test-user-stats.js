// Simple test script to verify user stats functionality
const { userService } = require('./src/lib/services');

async function testUserStats() {
  try {
    console.log('Testing user stats calculation...');
    
    // Test getting user by email
    const user = await userService.getUserByEmail('yashabalam707@gmail.com');
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (user) {
      console.log('User ID:', user.id);
      console.log('User name:', user.name);
      
      // Test getting user stats
      const stats = await userService.getUserStats(user.id);
      console.log('User stats:', JSON.stringify(stats, null, 2));
    }
    
  } catch (error) {
    console.error('Error testing user stats:', error);
  }
}

testUserStats();
