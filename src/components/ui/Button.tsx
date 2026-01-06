import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variantStyles = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-900',
  destructive: 'bg-red-600 hover:bg-red-700 text-white',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, disabled, ...props }, ref) => {
    const baseStyles = 'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';

    const className = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${props.className || ''}`;

    return (
      <button ref={ref} disabled={disabled || isLoading} className={className} {...props}>
        {isLoading ? 'Cargando...' : props.children}
      </button>
    );
  }
);

Button.displayName = 'Button';
