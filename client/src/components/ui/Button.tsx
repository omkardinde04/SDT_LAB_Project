import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CBF] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-full cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 min-h-[36px] gap-1.5',
    md: 'text-sm px-5 py-2.5 min-h-[44px] gap-2 font-medium',
    lg: 'text-base px-6 py-3 min-h-[48px] gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-[#7C5CBF] hover:bg-[#5B3FA0] active:scale-[0.98] text-white shadow-purple-sm hover:shadow-purple-soft border border-transparent',
    secondary:
      'bg-[#E9E0FA] hover:bg-[#DDD2F3] text-[#5B3FA0] active:scale-[0.98] border border-transparent',
    outline:
      'bg-transparent hover:bg-[#FAF7FF] text-[#7C5CBF] border border-[#DDD2F3] active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-[#E9E0FA]/50 text-[#2D2442] hover:text-[#5B3FA0] border border-transparent',
    danger:
      'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
