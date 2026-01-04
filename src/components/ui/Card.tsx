'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef, type ReactNode } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-2xl transition-all duration-200';

    const variants = {
      default: 'bg-zinc-900 border border-zinc-800',
      elevated: 'bg-zinc-900 shadow-xl shadow-black/20',
      bordered: 'bg-transparent border-2 border-zinc-700',
      glass: 'bg-zinc-900/50 backdrop-blur-lg border border-zinc-800/50',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const hoverStyles = hoverable
      ? 'hover:border-zinc-700 hover:shadow-lg hover:shadow-black/10 cursor-pointer'
      : '';

    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { scale: 1.01, y: -2 } : {}}
        className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
