'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Get current user from localStorage
    const userDataStr = localStorage.getItem('user');
    console.log('Raw user data from localStorage:', userDataStr);
    
    if (userDataStr) {
      try {
        const user = JSON.parse(userDataStr);
        console.log('Parsed user data:', user);
        setUserData(user);
        setCurrentUserId(user.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      console.log('No user data found in localStorage');
    }
  }, []);

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-4">User Debug Page</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Current User ID:</strong> {currentUserId || 'Not set'}
        </div>
        
        <div>
          <strong>User Data:</strong>
          <pre className="bg-gray-100 p-4 rounded mt-2">
            {userData ? JSON.stringify(userData, null, 2) : 'No user data'}
          </pre>
        </div>
        
        <div>
          <strong>LocalStorage Raw Data:</strong>
          <pre className="bg-gray-100 p-4 rounded mt-2">
            {typeof window !== 'undefined' ? localStorage.getItem('user') || 'No data' : 'Server side'}
          </pre>
        </div>
      </div>
    </div>
  );
}
