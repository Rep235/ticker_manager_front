import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variantStyles = {
  primary: 'bg-[var(--accent-600)] hover:bg-[var(--accent-700)] text-white focus:ring-[color:var(--accent-300)]',
  secondary: 'bg-[var(--surface-muted)] border border-[var(--border)] hover:bg-[var(--border)] text-[var(--text)]',
  ghost: 'bg-transparent hover:bg-[var(--surface-muted)] text-[var(--text)]',
  destructive: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-400',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, disabled, ...props }, ref) => {
    const baseStyles = 'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-300)] focus:ring-offset-[var(--surface)] disabled:opacity-50 disabled:cursor-not-allowed';

    const className = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${props.className || ''}`;

    return (
      <button ref={ref} disabled={disabled || isLoading} className={className} {...props}>
        {isLoading ? 'Cargando...' : props.children}
      </button>
    );
  }
);

Button.displayName = 'Button';
