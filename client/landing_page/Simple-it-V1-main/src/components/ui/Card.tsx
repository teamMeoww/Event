import React from 'react';

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
};
