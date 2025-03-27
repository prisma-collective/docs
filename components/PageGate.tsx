'use client' // Add this directive to indicate it's a client-side component

import React, { useState } from 'react';
import Button from './Button'

interface PageGateProps {
  children: React.ReactNode;
  requiredPassword: string;
}

const PageGate: React.FC<PageGateProps> = ({ children, requiredPassword }) => {
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
    <div className="page-gate">
      <div className="password-prompt">
        <h2>Restricted Content</h2>
        <input 
          type="password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          placeholder="Enter password"
          className="password-input"
        />

        <Button 
          onClick={handlePasswordCheck}
        >
          Unlock Content
        </Button>
      </div>
    </div>
  );
}

export default PageGate;
