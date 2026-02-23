// Reusable animation variants and utilities for Framer Motion

import { Variants } from 'framer-motion';

// Button press effect - squishes down on click
export const squishVariants: Variants = {
  idle: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.95 },
};

// Card tilt on hover - subtle 3D effect
export const tiltVariants: Variants = {
  idle: { rotateX: 0, rotateY: 0 },
  hover: { rotateX: -2, rotateY: 2, scale: 1.02 },
};

// Attention-seeking wiggle
export const wiggleVariants: Variants = {
  idle: { rotate: 0 },
  wiggle: {
    rotate: [-3, 3, -3, 3, 0],
    transition: { duration: 0.5 },
  },
};

// Pulse effect for progress/notifications
export const pulseVariants: Variants = {
  idle: { scale: 1, opacity: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: { duration: 1.5, repeat: Infinity },
  },
};

// Float animation for avatars/mascots
export const floatVariants: Variants = {
  float: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Bounce in for celebratory elements
export const bounceInVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
    },
  },
};

// Stagger children animation
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

// Glow pulse for XP and celebrations
export const glowVariants: Variants = {
  idle: {
    boxShadow: '0 0 0 rgba(251, 191, 36, 0)',
  },
  glow: {
    boxShadow: [
      '0 0 0 rgba(251, 191, 36, 0)',
      '0 0 20px rgba(251, 191, 36, 0.4)',
      '0 0 0 rgba(251, 191, 36, 0)',
    ],
    transition: { duration: 2, repeat: Infinity },
  },
};

// Slide in from directions
export const slideInVariants = {
  left: {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  },
  right: {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  },
  up: {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  },
  down: {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  },
};

// Progress bar fill animation
export const progressFillVariants: Variants = {
  empty: { width: '0%' },
  fill: (percentage: number) => ({
    width: `${percentage}%`,
    transition: { duration: 1, ease: 'easeOut' },
  }),
};

// Icon attention animation
export const iconAttentionVariants: Variants = {
  idle: { scale: 1, rotate: 0 },
  attention: {
    scale: [1, 1.2, 1],
    rotate: [0, -10, 10, 0],
    transition: { duration: 0.6 },
  },
};

// Page transition variants
export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: { duration: 0.3 },
  },
};

// Success checkmark animation
export const checkmarkVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.5, ease: 'easeInOut' },
      opacity: { duration: 0.2 },
    },
  },
};

// Spring transition presets
export const springTransitions = {
  gentle: { type: 'spring', stiffness: 100, damping: 15 },
  bouncy: { type: 'spring', stiffness: 400, damping: 10 },
  snappy: { type: 'spring', stiffness: 500, damping: 25 },
  slow: { type: 'spring', stiffness: 50, damping: 20 },
};

// Hover spring config for buttons
export const buttonHoverTransition = {
  type: 'spring',
  stiffness: 400,
  damping: 17,
};

// Create a wiggle animation on demand
export function createWiggle(intensity: number = 3) {
  return {
    rotate: [-intensity, intensity, -intensity, intensity, 0],
    transition: { duration: 0.4 },
  };
}

// Create a bounce animation
export function createBounce(height: number = 10) {
  return {
    y: [0, -height, 0],
    transition: {
      duration: 0.4,
      times: [0, 0.5, 1],
      ease: 'easeOut',
    },
  };
}
