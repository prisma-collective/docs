'use client' // Add this directive to indicate it's a client-side component

import React, { useState } from 'react';
import StandardButton from '@/components/StandardButton';

interface PageGateProps {
  children: React.ReactNode;
  requiredPassword: string;
}

export default function PageGate({ children, requiredPassword }: PageGateProps) {
  const [inputPassword, setInputPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handlePasswordCheck = () => {
    if (inputPassword === requiredPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();  // Prevent default form submission behavior
        handlePasswordCheck();  // Call your existing password check function
      }}
      className="flex flex-col items-start"
    >
      <h2>Restricted Content</h2>
      <input 
        type="password"
        value={inputPassword}
        onChange={(e) => setInputPassword(e.target.value)}
        placeholder="Enter password"
        className="w-5/6 sm:w-1/2 p-3 mt-4 mb-4 bg-gray-800/80 text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c362ff] focus:border-transparent placeholder-gray-400 transition duration-300 ease-in-out"
      />

      <StandardButton>
        Unlock
      </StandardButton>
    </form>
  );
}
