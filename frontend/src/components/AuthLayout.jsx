import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      {children}
    </div>
  );
}
