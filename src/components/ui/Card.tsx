'use client';

import {
  motion,
  type HTMLMotionProps,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { forwardRef, type ReactNode, type MouseEvent, useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// CARD COMPONENT
// A container with depth, luminescence, and tactile 3D interactions
// ═══════════════════════════════════════════════════════════════════════════

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'glass' | 'warm' | 'glow' | 'premium';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  tilt?: boolean;
  glowOnHover?: boolean;
}

// Spring presets
const springs = {
  gentle: { stiffness: 120, damping: 14 },
  responsive: { stiffness: 300, damping: 20 },
  snappy: { stiffness: 400, damping: 25 },
  tilt: { stiffness: 400, damping: 30 },
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      tilt = false,
      glowOnHover = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);

    // 3D Tilt effect values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Light position for dynamic highlight
    const lightX = useMotionValue(50);
    const lightY = useMotionValue(0);

    // Smooth springs for rotation
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springs.tilt);
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springs.tilt);

    // Dynamic highlight gradient based on mouse position
    const highlightX = useSpring(lightX, springs.responsive);
    const highlightY = useSpring(lightY, springs.responsive);

    const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const xPos = (event.clientX - rect.left) / rect.width - 0.5;
      const yPos = (event.clientY - rect.top) / rect.height - 0.5;

      if (tilt) {
        x.set(xPos);
        y.set(yPos);
      }

      // Update light position for highlight effect
      lightX.set((event.clientX - rect.left) / rect.width * 100);
      lightY.set((event.clientY - rect.top) / rect.height * 100);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      if (tilt) {
        x.set(0);
        y.set(0);
      }
      lightX.set(50);
      lightY.set(0);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    // Base styles
    const baseStyles = `
      relative rounded-2xl
      transition-colors duration-300
    `;

    // Variant styles with enhanced depth and luminescence
    const variants = {
      default: `
        bg-gradient-to-b from-stone-900 to-stone-950
        border border-stone-800/80
        shadow-lg shadow-black/40
      `,
      elevated: `
        bg-gradient-to-b from-stone-850 to-stone-900
        shadow-xl shadow-black/50
        border border-stone-800/50
      `,
      bordered: `
        bg-stone-950/50
        border-2 border-stone-700/60
      `,
      glass: `
        bg-stone-900/30 backdrop-blur-xl
        border border-white/[0.08]
        shadow-xl shadow-black/30
      `,
      warm: `
        bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950
        border border-amber-500/15
        shadow-lg shadow-black/40
      `,
      glow: `
        bg-gradient-to-b from-stone-900 to-stone-950
        border border-amber-500/25
        shadow-lg shadow-amber-500/10
      `,
      premium: `
        bg-gradient-to-br from-stone-800/50 via-stone-900/60 to-stone-950/70
        backdrop-blur-2xl
        border border-amber-500/20
        shadow-2xl shadow-black/50
      `,
    };

    // Hover styles
    const hoverStyles = hoverable
      ? 'cursor-pointer'
      : '';

    // Padding variants
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <motion.div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}
        style={
          tilt
            ? {
                rotateX,
                rotateY,
                transformPerspective: 1200,
                transformStyle: 'preserve-3d',
              }
            : {}
        }
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        whileHover={
          hoverable
            ? {
                scale: 1.02,
                y: -6,
              }
            : {}
        }
        transition={{ type: 'spring', ...springs.responsive }}
        {...props}
      >
        {/* Dynamic inner highlight that follows cursor */}
        {(variant === 'glass' || variant === 'premium' || variant === 'glow' || glowOnHover) && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
            style={{
              opacity: isHovered ? 1 : 0,
            }}
          >
            <motion.div
              className="absolute w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2"
              style={{
                left: highlightX,
                top: highlightY,
                background: `radial-gradient(circle at center, rgba(251, 191, 36, 0.15) 0%, transparent 50%)`,
              }}
            />
          </motion.div>
        )}

        {/* Top edge highlight - rim light effect */}
        <div
          className="absolute inset-x-0 top-0 h-px rounded-t-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.1) 50%, transparent 90%)',
          }}
        />

        {/* Inner glow from top */}
        {(variant === 'glow' || variant === 'warm' || variant === 'premium') && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: `linear-gradient(180deg, rgba(251, 191, 36, ${
                variant === 'premium' ? '0.08' : '0.05'
              }) 0%, transparent 40%)`,
            }}
          />
        )}

        {/* Glass refraction effect */}
        {(variant === 'glass' || variant === 'premium') && (
          <>
            {/* Top-left subtle highlight */}
            <div
              className="absolute top-0 left-0 w-1/3 h-1/3 rounded-tl-2xl pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
              }}
            />
            {/* Inset shadow for depth */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.1)',
              }}
            />
          </>
        )}

        {/* Hover glow effect */}
        {(hoverable || glowOnHover) && (
          <motion.div
            className="absolute -inset-px rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'transparent',
              boxShadow: variant === 'warm' || variant === 'glow' || variant === 'premium'
                ? '0 0 30px rgba(251, 191, 36, 0.15), 0 0 60px rgba(251, 191, 36, 0.05)'
                : '0 0 30px rgba(255, 255, 255, 0.05)',
            }}
          />
        )}

        {/* Border glow on hover */}
        {hoverable && (
          <motion.div
            className="absolute -inset-px rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
            style={{
              border: variant === 'warm' || variant === 'glow' || variant === 'premium'
                ? '1px solid rgba(251, 191, 36, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.1)',
            }}
          />
        )}

        {/* Content container with preserved 3D for tilt */}
        <div
          className="relative"
          style={tilt ? { transform: 'translateZ(20px)' } : {}}
        >
          {children}
        </div>

        {/* Bottom edge shadow for grounding */}
        <div
          className="absolute inset-x-0 bottom-0 h-px rounded-b-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 10%, rgba(0,0,0,0.3) 50%, transparent 90%)',
          }}
        />
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
