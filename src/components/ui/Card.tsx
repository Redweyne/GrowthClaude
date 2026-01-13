'use client';

import { motion, type HTMLMotionProps, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { forwardRef, type ReactNode, type MouseEvent } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'glass' | 'warm' | 'glow';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  tilt?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      tilt = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-2xl transition-colors duration-200';

    const variants = {
      default: 'bg-stone-900 border border-stone-800',
      elevated: 'bg-stone-900 shadow-xl shadow-black/30',
      bordered: 'bg-transparent border-2 border-stone-700',
      glass: 'bg-stone-900/50 backdrop-blur-lg border border-stone-800/50',
      warm: 'bg-gradient-to-br from-stone-900 to-stone-950 border border-amber-500/10',
      glow: 'bg-stone-900 border border-amber-500/20 shadow-lg shadow-amber-500/10',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const hoverStyles = hoverable
      ? 'hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 cursor-pointer'
      : '';

    // Tilt effect values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { stiffness: 300, damping: 30 };
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), springConfig);
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), springConfig);

    const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
      if (!tilt) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const xPos = (event.clientX - rect.left) / rect.width - 0.5;
      const yPos = (event.clientY - rect.top) / rect.height - 0.5;
      x.set(xPos);
      y.set(yPos);
    };

    const handleMouseLeave = () => {
      if (!tilt) return;
      x.set(0);
      y.set(0);
    };

    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { scale: 1.02, y: -4 } : {}}
        style={tilt ? { rotateX, rotateY, transformPerspective: 1000 } : {}}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}
        {...props}
      >
        {/* Subtle inner glow for glow variant */}
        {variant === 'glow' && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
        )}
        <div className="relative">{children}</div>
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
