'use client';

import { forwardRef, type ReactNode, type MouseEvent, useState, useCallback } from 'react';
import { motion, type HTMLMotionProps, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/hooks/useAudio';

// ═══════════════════════════════════════════════════════════════════════════
// BUTTON COMPONENT
// A tactile, luminous button that feels satisfying to interact with
// Now with audio feedback for every interaction!
// ═══════════════════════════════════════════════════════════════════════════

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'warm' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  glow?: boolean;
  children?: ReactNode;
  sound?: 'tap' | 'tapConfirm' | 'success' | 'celebrate' | 'none'; // Control which sound plays
}

// Spring presets for different interactions
const springs = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  responsive: { type: 'spring' as const, stiffness: 300, damping: 20 },
  snappy: { type: 'spring' as const, stiffness: 400, damping: 25 },
  bouncy: { type: 'spring' as const, stiffness: 500, damping: 15 },
};

// Ripple component for tactile feedback
interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
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
      onClick,
      sound = 'tap',
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const audio = useAudio();

    // Create ripple on click with sound
    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        if (disabled || isLoading) return;

        // Play sound based on sound prop
        if (sound !== 'none') {
          if (sound === 'celebrate') {
            audio.playCelebrate();
          } else if (sound === 'success') {
            audio.playSuccess();
          } else if (sound === 'tapConfirm' || variant === 'primary' || glow) {
            audio.playTapConfirm();
          } else {
            audio.playTap();
          }
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const newRipple: Ripple = {
          id: Date.now(),
          x,
          y,
          size,
        };

        setRipples((prev) => [...prev, newRipple]);

        // Clean up ripple after animation
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 600);

        onClick?.(e);
      },
      [disabled, isLoading, onClick, audio, sound, variant, glow]
    );

    // Base styles
    const baseStyles = `
      relative inline-flex items-center justify-center font-semibold
      rounded-xl overflow-hidden
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      transition-shadow duration-200
    `;

    // Variant styles with enhanced visuals
    const variants = {
      primary: `
        bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600
        text-stone-950 font-bold
        shadow-lg shadow-amber-500/30
        hover:shadow-xl hover:shadow-amber-500/40
        focus-visible:ring-amber-500
        border border-amber-400/20
      `,
      secondary: `
        bg-gradient-to-br from-stone-800 to-stone-900
        text-amber-100
        border border-stone-700/80
        hover:border-amber-500/30 hover:bg-gradient-to-br hover:from-stone-750 hover:to-stone-850
        shadow-md shadow-black/30
        hover:shadow-lg hover:shadow-amber-500/10
        focus-visible:ring-stone-500
      `,
      ghost: `
        bg-transparent
        text-amber-100
        hover:bg-stone-800/60
        focus-visible:ring-stone-500
        border border-transparent
        hover:border-stone-700/50
      `,
      outline: `
        bg-transparent
        border-2 border-amber-500/40
        text-amber-100
        hover:border-amber-400/70 hover:bg-amber-500/5
        hover:shadow-lg hover:shadow-amber-500/10
        focus-visible:ring-amber-500
      `,
      warm: `
        bg-gradient-to-br from-rose-500 via-rose-600 to-purple-700
        text-white font-bold
        shadow-lg shadow-rose-500/30
        hover:shadow-xl hover:shadow-rose-500/40
        focus-visible:ring-rose-500
        border border-rose-400/20
      `,
      glass: `
        bg-stone-900/40 backdrop-blur-xl
        text-amber-100
        border border-white/10
        hover:bg-stone-800/50 hover:border-amber-500/20
        shadow-lg shadow-black/20
        hover:shadow-xl hover:shadow-amber-500/5
        focus-visible:ring-amber-500
      `,
    };

    // Size variants
    const sizes = {
      sm: 'px-4 py-2 text-sm gap-2',
      md: 'px-6 py-3 text-base gap-2.5',
      lg: 'px-8 py-4 text-lg gap-3',
    };

    // Glow animation class
    const glowClass = glow ? 'animate-pulse-glow' : '';

    // Ripple color based on variant
    const rippleColor =
      variant === 'primary' || variant === 'warm'
        ? 'bg-white/30'
        : 'bg-amber-400/20';

    return (
      <motion.button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${glowClass} ${className}`}
        disabled={disabled || isLoading}
        onClick={handleClick}
        whileHover={
          disabled || isLoading
            ? {}
            : {
                scale: 1.02,
                y: -2,
              }
        }
        whileTap={
          disabled || isLoading
            ? {}
            : {
                scale: 0.97,
                y: 0,
              }
        }
        transition={springs.snappy}
        {...props}
      >
        {/* Inner glow overlay - subtle top highlight */}
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 100%)',
          }}
        />

        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{
            opacity: 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
            }}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        </motion.div>

        {/* Ripple effects */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className={`absolute rounded-full ${rippleColor} pointer-events-none`}
              style={{
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
              }}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>

        {/* Loading spinner */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Spinner container */}
              <div className="relative w-5 h-5">
                {/* Outer ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-current/20"
                />
                {/* Spinning arc */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-current"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    ease: 'linear',
                    repeat: Infinity,
                  }}
                />
                {/* Inner glow */}
                <motion.div
                  className="absolute inset-1 rounded-full bg-current/10"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: 'easeInOut',
                    repeat: Infinity,
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <motion.span
          className="relative z-10 flex items-center justify-center gap-inherit"
          animate={{
            opacity: isLoading ? 0 : 1,
            scale: isLoading ? 0.9 : 1,
          }}
          transition={{ duration: 0.15 }}
        >
          {children}
        </motion.span>

        {/* Bottom edge highlight for depth */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              variant === 'primary' || variant === 'warm'
                ? 'linear-gradient(90deg, transparent, rgba(0,0,0,0.2), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
          }}
        />
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
