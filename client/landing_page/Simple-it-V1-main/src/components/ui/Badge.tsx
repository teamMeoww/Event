import React from 'react';

const badgeVariants = {
  default: 'bg-gray-800 text-gray-300 border-gray-700',
  primary: 'bg-indigo-900/50 text-indigo-300 border-indigo-700/50',
  success: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/50',
  warning: 'bg-amber-900/50 text-amber-300 border-amber-700/50',
  error: 'bg-red-900/50 text-red-300 border-red-700/50',
};

export const Badge = ({ children, variant = 'default', className = '' }: { children: React.ReactNode, variant?: keyof typeof badgeVariants, className?: string }) => {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${badgeVariants[variant]} ${className}`}>
      {children}
    </span>
  );
};
