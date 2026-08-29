import React from 'react';
import { Loader2 } from 'lucide-react';

// Assuming we might install class-variance-authority and clsx/tailwind-merge for standard modern react UI, 
// but for simplicity without installing more, we'll build a standard mapped class string.

const buttonVariants = {
  variant: {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 border border-transparent',
    secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/20',
    ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-white/5',
    destructive: 'bg-red-600/90 text-white hover:bg-red-700',
  },
  size: {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
  }
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50';
    const variantStyles = buttonVariants.variant[variant];
    const sizeStyles = buttonVariants.size[size];

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
