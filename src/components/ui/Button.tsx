'use client';

import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'warm';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  glow?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      glow = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'relative inline-flex items-center justify-center font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-900 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';

    const variants = {
      primary:
        'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-900 shadow-lg shadow-amber-500/25 focus:ring-amber-500',
      secondary:
        'bg-stone-800 hover:bg-stone-700 text-amber-100 border border-stone-700 hover:border-amber-500/30 focus:ring-stone-500',
      ghost: 'bg-transparent hover:bg-stone-800/50 text-amber-100 focus:ring-stone-500',
      outline:
        'bg-transparent border-2 border-amber-500/30 hover:border-amber-500/60 text-amber-100 hover:text-amber-50 focus:ring-amber-500',
      warm:
        'bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white shadow-lg shadow-rose-500/25 focus:ring-rose-500',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const glowClass = glow ? 'animate-pulse-warm' : '';

    return (
      <motion.button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${glowClass} ${className}`}
        disabled={disabled || isLoading}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={false}
          whileHover={{
            opacity: 1,
            x: ['0%', '200%'],
            transition: { duration: 0.6, ease: 'easeInOut' },
          }}
        />

        {isLoading && (
          <svg
            className="absolute left-4 w-5 h-5 animate-spin"
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        <span className={`relative z-10 ${isLoading ? 'opacity-0' : ''}`}>{children}</span>
        {isLoading && <span className="ml-2 relative z-10">{children}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
