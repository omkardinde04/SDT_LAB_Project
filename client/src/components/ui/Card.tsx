import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'white' | 'lavender' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  padding = 'md',
  variant = 'white',
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const variantStyles = {
    white: 'bg-white border border-[#DDD2F3] shadow-purple-soft',
    lavender: 'bg-gradient-to-br from-[#FAF7FF] to-[#F1EAFF] border border-[#DDD2F3] shadow-purple-soft',
    flat: 'bg-white border border-[#DDD2F3]',
  };

  const hoverStyle = hoverable
    ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-purple-lg hover:border-[#B9A6E8]'
    : '';

  return (
    <div
      className={`rounded-[16px] overflow-hidden ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
