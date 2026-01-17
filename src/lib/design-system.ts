// ═══════════════════════════════════════════════════════════════════════════
// TRANSFORMATION HUB DESIGN SYSTEM
// The foundational constants that create visual harmony across the application
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TYPOGRAPHY SCALE
 *
 * Based on a 1.25 (Major Third) ratio for harmonious progression.
 * Each step feels naturally connected to the next.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const typography = {
  // Font families (CSS variable references)
  fonts: {
    display: 'var(--font-display), ui-serif, Georgia, serif',
    body: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
    accent: 'var(--font-accent), ui-serif, Georgia, serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
  },

  // Font sizes with line heights and letter spacing
  scale: {
    // Micro text - labels, captions
    xs: {
      size: '0.75rem', // 12px
      lineHeight: '1rem',
      letterSpacing: '0.025em',
    },
    // Small text - secondary content
    sm: {
      size: '0.875rem', // 14px
      lineHeight: '1.25rem',
      letterSpacing: '0.01em',
    },
    // Base text - body copy
    base: {
      size: '1rem', // 16px
      lineHeight: '1.625rem',
      letterSpacing: '0',
    },
    // Large text - emphasized body
    lg: {
      size: '1.125rem', // 18px
      lineHeight: '1.75rem',
      letterSpacing: '-0.01em',
    },
    // Extra large - subheadings
    xl: {
      size: '1.25rem', // 20px
      lineHeight: '1.875rem',
      letterSpacing: '-0.015em',
    },
    // 2XL - section headings
    '2xl': {
      size: '1.5rem', // 24px
      lineHeight: '2rem',
      letterSpacing: '-0.02em',
    },
    // 3XL - page headings
    '3xl': {
      size: '1.875rem', // 30px
      lineHeight: '2.375rem',
      letterSpacing: '-0.025em',
    },
    // 4XL - hero headings
    '4xl': {
      size: '2.25rem', // 36px
      lineHeight: '2.75rem',
      letterSpacing: '-0.03em',
    },
    // 5XL - display headings
    '5xl': {
      size: '3rem', // 48px
      lineHeight: '3.5rem',
      letterSpacing: '-0.035em',
    },
    // 6XL - dramatic display
    '6xl': {
      size: '3.75rem', // 60px
      lineHeight: '4.25rem',
      letterSpacing: '-0.04em',
    },
  },

  // Font weights with semantic names
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SPACING SCALE
 *
 * Based on a 4px base unit for consistent rhythm.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  11: '2.75rem', // 44px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
} as const;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COLOR SYSTEM
 *
 * Semantic color tokens that convey meaning and atmosphere.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const colors = {
  // Background depths - from deepest void to elevated surface
  depth: {
    void: '#050403', // Absolute darkness
    abyss: '#0a0908', // Deep background
    deep: '#0c0a09', // Primary background
    base: '#1c1917', // Card backgrounds
    raised: '#292524', // Elevated surfaces
    elevated: '#3f3b38', // Highest surfaces
  },

  // Foreground - text and content colors
  text: {
    primary: '#fef3c7', // Warm cream - primary text
    secondary: '#d6d3d1', // Stone-300 - secondary text
    muted: '#a8a29e', // Stone-400 - muted text
    subtle: '#78716c', // Stone-500 - subtle text
    disabled: '#57534e', // Stone-600 - disabled text
  },

  // Semantic colors - convey meaning
  semantic: {
    // Wisdom - knowledge, insight, understanding
    wisdom: {
      base: '#a78bfa', // Purple
      glow: 'rgba(167, 139, 250, 0.5)',
    },
    // Courage - action, bravery, determination
    courage: {
      base: '#f97316', // Orange
      glow: 'rgba(249, 115, 22, 0.5)',
    },
    // Temperance - balance, moderation, self-control
    temperance: {
      base: '#22d3ee', // Cyan
      glow: 'rgba(34, 211, 238, 0.5)',
    },
    // Justice - fairness, integrity, righteousness
    justice: {
      base: '#fbbf24', // Amber
      glow: 'rgba(251, 191, 36, 0.5)',
    },
    // Growth - progress, transformation
    growth: {
      base: '#34d399', // Emerald
      glow: 'rgba(52, 211, 153, 0.5)',
    },
    // Warning - attention needed
    warning: {
      base: '#fbbf24', // Amber
      glow: 'rgba(251, 191, 36, 0.5)',
    },
    // Error - problems, failures
    error: {
      base: '#f87171', // Red
      glow: 'rgba(248, 113, 113, 0.5)',
    },
    // Success - completion, achievement
    success: {
      base: '#34d399', // Emerald
      glow: 'rgba(52, 211, 153, 0.5)',
    },
  },

  // Primary accent - the main interactive color
  accent: {
    gold: '#fbbf24',
    amber: '#f59e0b',
    orange: '#ea580c',
  },

  // Atmospheric colors for gradients and glows
  atmosphere: {
    warm: 'rgba(251, 191, 36, 0.1)',
    cool: 'rgba(167, 139, 250, 0.1)',
    rose: 'rgba(251, 113, 133, 0.1)',
  },
} as const;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MOTION SYSTEM
 *
 * Consistent animation parameters for fluid, natural movement.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const motion = {
  // Duration presets (in seconds for Framer Motion)
  duration: {
    instant: 0.1,
    fast: 0.15,
    normal: 0.25,
    slow: 0.4,
    slower: 0.6,
    dramatic: 1.0,
  },

  // Spring presets for Framer Motion
  spring: {
    // Gentle - for subtle, ambient movements
    gentle: {
      type: 'spring' as const,
      stiffness: 120,
      damping: 14,
    },
    // Responsive - for UI feedback
    responsive: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 20,
    },
    // Snappy - for quick interactions
    snappy: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 25,
    },
    // Bouncy - for playful, celebratory moments
    bouncy: {
      type: 'spring' as const,
      stiffness: 500,
      damping: 15,
    },
    // Stiff - for precise, controlled movements
    stiff: {
      type: 'spring' as const,
      stiffness: 700,
      damping: 30,
    },
  },

  // Easing curves (for CSS transitions)
  easing: {
    // Standard easings
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

    // Expressive easings
    easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    easeInOutSmooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Common animation variants for Framer Motion
  variants: {
    // Fade in from bottom
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
    },
    // Fade in with scale
    fadeInScale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
    // Slide in from right
    slideInRight: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    },
    // Pop in (for celebrations)
    popIn: {
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
    },
    // Blur in
    blurIn: {
      initial: { opacity: 0, filter: 'blur(10px)' },
      animate: { opacity: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, filter: 'blur(10px)' },
    },
  },

  // Stagger children timing
  stagger: {
    fast: 0.03,
    normal: 0.05,
    slow: 0.08,
  },
} as const;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SHADOWS
 *
 * Elevation system for visual hierarchy.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const shadows = {
  // Elevation shadows
  xs: '0 1px 2px rgba(0, 0, 0, 0.3)',
  sm: '0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
  md: '0 4px 8px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)',
  xl: '0 16px 32px rgba(0, 0, 0, 0.6), 0 8px 16px rgba(0, 0, 0, 0.4)',
  '2xl': '0 24px 48px rgba(0, 0, 0, 0.7), 0 12px 24px rgba(0, 0, 0, 0.5)',

  // Glow shadows by color
  glow: {
    gold: '0 0 20px rgba(251, 191, 36, 0.3), 0 0 40px rgba(251, 191, 36, 0.15)',
    goldStrong: '0 0 30px rgba(251, 191, 36, 0.5), 0 0 60px rgba(251, 191, 36, 0.3)',
    purple: '0 0 20px rgba(167, 139, 250, 0.3), 0 0 40px rgba(167, 139, 250, 0.15)',
    emerald: '0 0 20px rgba(52, 211, 153, 0.3), 0 0 40px rgba(52, 211, 153, 0.15)',
    rose: '0 0 20px rgba(251, 113, 133, 0.3), 0 0 40px rgba(251, 113, 133, 0.15)',
  },

  // Inner shadows for depth
  inner: {
    subtle: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
    deep: 'inset 0 4px 8px rgba(0, 0, 0, 0.5)',
  },
} as const;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BORDERS & RADII
 *
 * Consistent corner rounding and border treatments.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const borders = {
  radius: {
    none: '0',
    sm: '0.5rem', // 8px
    md: '0.75rem', // 12px
    lg: '1rem', // 16px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },

  width: {
    none: '0',
    thin: '1px',
    medium: '2px',
    thick: '3px',
  },
} as const;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BREAKPOINTS
 *
 * Responsive design breakpoints.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Z-INDEX SCALE
 *
 * Layering system for predictable stacking.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const zIndex = {
  behind: -1,
  base: 0,
  raised: 10,
  dropdown: 20,
  sticky: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
  max: 9999,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const designSystem = {
  typography,
  spacing,
  colors,
  motion,
  shadows,
  borders,
  breakpoints,
  zIndex,
} as const;

export default designSystem;
