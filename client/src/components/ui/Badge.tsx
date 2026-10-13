import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'lavender' | 'success' | 'warning' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'lavender',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  const variantStyles = {
    primary: 'bg-[#7C5CBF] text-white',
    lavender: 'bg-[#E9E0FA] text-[#5B3FA0]',
    success: 'bg-[#5BAE8A]/15 text-[#2E7D5C] border border-[#5BAE8A]/30',
    warning: 'bg-[#E3A94B]/15 text-[#9C6819] border border-[#E3A94B]/30',
    outline: 'bg-white text-[#7A6F8F] border border-[#DDD2F3]',
  };

  const dotColors = {
    primary: 'bg-white',
    lavender: 'bg-[#7C5CBF]',
    success: 'bg-[#5BAE8A]',
    warning: 'bg-[#E3A94B]',
    outline: 'bg-[#7A6F8F]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
