import React from 'react';

export default function Card({ children, className = '' }){
  return (
    <div className={`bg-white/85 backdrop-blur-sm border border-white/30 rounded-2xl shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
}
