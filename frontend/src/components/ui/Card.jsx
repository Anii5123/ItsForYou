import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`glass-panel rounded-2xl p-6 shadow-xl transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
