'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useTheme } from 'next-themes';

// ═══════════════════════════════════════════════════════════════════════════
// AMBIENT BACKGROUND
// Creates a living, breathing atmosphere that responds to the time of day
// Floating particles, luminous orbs, and subtle gradients create depth
// ═══════════════════════════════════════════════════════════════════════════

interface TimeTheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  particleColor: string;
  orbColors: string[];
  gradientStops: string[];
  lightPrimary: string;
  lightSecondary: string;
  lightAccent: string;
  lightParticleColor: string;
  lightOrbColors: string[];
  lightGradientStops: string[];
}

// Time-based themes for atmospheric shifts
const timeThemes: Record<string, TimeTheme> = {
  dawn: {
    name: 'Dawn',
    primary: 'rgba(251, 191, 36, 0.15)',
    secondary: 'rgba(251, 113, 133, 0.1)',
    accent: 'rgba(167, 139, 250, 0.08)',
    glow: 'rgba(251, 191, 36, 0.3)',
    particleColor: 'rgba(251, 191, 36, 0.6)',
    orbColors: ['rgba(251, 191, 36, 0.2)', 'rgba(251, 113, 133, 0.15)', 'rgba(167, 139, 250, 0.1)'],
    gradientStops: ['#0c0a09', '#1a1412', '#0c0a09'],
    lightPrimary: 'rgba(245, 158, 11, 0.14)',
    lightSecondary: 'rgba(244, 114, 182, 0.1)',
    lightAccent: 'rgba(99, 102, 241, 0.08)',
    lightParticleColor: 'rgba(245, 158, 11, 0.3)',
    lightOrbColors: ['rgba(245, 158, 11, 0.14)', 'rgba(244, 114, 182, 0.1)', 'rgba(99, 102, 241, 0.08)'],
    lightGradientStops: ['#fafaf9', '#fef3c7', '#fafaf9'],
  },
  morning: {
    name: 'Morning',
    primary: 'rgba(251, 191, 36, 0.12)',
    secondary: 'rgba(52, 211, 153, 0.08)',
    accent: 'rgba(34, 211, 238, 0.06)',
    glow: 'rgba(251, 191, 36, 0.25)',
    particleColor: 'rgba(251, 191, 36, 0.5)',
    orbColors: ['rgba(251, 191, 36, 0.15)', 'rgba(52, 211, 153, 0.1)', 'rgba(34, 211, 238, 0.08)'],
    gradientStops: ['#0c0a09', '#0f0d0c', '#0c0a09'],
    lightPrimary: 'rgba(245, 158, 11, 0.12)',
    lightSecondary: 'rgba(16, 185, 129, 0.08)',
    lightAccent: 'rgba(14, 165, 233, 0.07)',
    lightParticleColor: 'rgba(245, 158, 11, 0.25)',
    lightOrbColors: ['rgba(245, 158, 11, 0.12)', 'rgba(16, 185, 129, 0.08)', 'rgba(14, 165, 233, 0.07)'],
    lightGradientStops: ['#fafaf9', '#fefce8', '#f5f5f4'],
  },
  afternoon: {
    name: 'Afternoon',
    primary: 'rgba(249, 115, 22, 0.1)',
    secondary: 'rgba(251, 191, 36, 0.08)',
    accent: 'rgba(52, 211, 153, 0.06)',
    glow: 'rgba(249, 115, 22, 0.2)',
    particleColor: 'rgba(249, 115, 22, 0.5)',
    orbColors: ['rgba(249, 115, 22, 0.15)', 'rgba(251, 191, 36, 0.12)', 'rgba(52, 211, 153, 0.08)'],
    gradientStops: ['#0c0a09', '#0d0b0a', '#0c0a09'],
    lightPrimary: 'rgba(234, 88, 12, 0.11)',
    lightSecondary: 'rgba(245, 158, 11, 0.09)',
    lightAccent: 'rgba(5, 150, 105, 0.07)',
    lightParticleColor: 'rgba(234, 88, 12, 0.24)',
    lightOrbColors: ['rgba(234, 88, 12, 0.11)', 'rgba(245, 158, 11, 0.09)', 'rgba(5, 150, 105, 0.07)'],
    lightGradientStops: ['#fafaf9', '#ffedd5', '#fafaf9'],
  },
  evening: {
    name: 'Evening',
    primary: 'rgba(167, 139, 250, 0.12)',
    secondary: 'rgba(251, 113, 133, 0.08)',
    accent: 'rgba(251, 191, 36, 0.06)',
    glow: 'rgba(167, 139, 250, 0.25)',
    particleColor: 'rgba(167, 139, 250, 0.5)',
    orbColors: ['rgba(167, 139, 250, 0.15)', 'rgba(251, 113, 133, 0.12)', 'rgba(251, 191, 36, 0.08)'],
    gradientStops: ['#0c0a09', '#0e0a0f', '#0c0a09'],
    lightPrimary: 'rgba(124, 58, 237, 0.11)',
    lightSecondary: 'rgba(244, 63, 94, 0.09)',
    lightAccent: 'rgba(245, 158, 11, 0.08)',
    lightParticleColor: 'rgba(124, 58, 237, 0.24)',
    lightOrbColors: ['rgba(124, 58, 237, 0.11)', 'rgba(244, 63, 94, 0.09)', 'rgba(245, 158, 11, 0.08)'],
    lightGradientStops: ['#fafaf9', '#f5f3ff', '#fafaf9'],
  },
  night: {
    name: 'Night',
    primary: 'rgba(34, 211, 238, 0.08)',
    secondary: 'rgba(167, 139, 250, 0.06)',
    accent: 'rgba(251, 191, 36, 0.04)',
    glow: 'rgba(34, 211, 238, 0.2)',
    particleColor: 'rgba(34, 211, 238, 0.4)',
    orbColors: ['rgba(34, 211, 238, 0.1)', 'rgba(167, 139, 250, 0.08)', 'rgba(251, 191, 36, 0.05)'],
    gradientStops: ['#050403', '#080608', '#050403'],
    lightPrimary: 'rgba(14, 165, 233, 0.09)',
    lightSecondary: 'rgba(99, 102, 241, 0.08)',
    lightAccent: 'rgba(245, 158, 11, 0.06)',
    lightParticleColor: 'rgba(14, 165, 233, 0.2)',
    lightOrbColors: ['rgba(14, 165, 233, 0.09)', 'rgba(99, 102, 241, 0.08)', 'rgba(245, 158, 11, 0.06)'],
    lightGradientStops: ['#f8fafc', '#eef2ff', '#f8fafc'],
  },
};

function getTimeTheme(): TimeTheme {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8) return timeThemes.dawn;
  if (hour >= 8 && hour < 12) return timeThemes.morning;
  if (hour >= 12 && hour < 17) return timeThemes.afternoon;
  if (hour >= 17 && hour < 21) return timeThemes.evening;
  return timeThemes.night;
}

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING ORB COMPONENT
// Large, luminous spheres that drift slowly across the background
// ─────────────────────────────────────────────────────────────────────────────

interface OrbProps {
  color: string;
  size: number;
  initialX: number;
  initialY: number;
  duration: number;
  delay: number;
}

const FloatingOrb = memo(function FloatingOrb({ color, size, initialX, initialY, duration, delay }: OrbProps) {
  // Use reduced blur on mobile for better GPU performance
  const isMobileSsr = typeof navigator !== 'undefined' && /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  const blurAmount = isMobileSsr ? 20 : 40;

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
        filter: `blur(${blurAmount}px)`,
        willChange: 'transform, opacity',
        left: `${initialX}%`,
        top: `${initialY}%`,
      }}
      animate={{
        x: [0, 50, -30, 0],
        y: [0, -40, 30, 0],
        scale: [1, 1.2, 0.9, 1],
        opacity: [0.6, 0.8, 0.5, 0.6],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// PARTICLE COMPONENT
// Tiny floating particles that create depth and magic
// ─────────────────────────────────────────────────────────────────────────────

interface ParticleProps {
  color: string;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

const Particle = memo(function Particle({ color, size, x, y, duration, delay }: ParticleProps) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        left: `${x}%`,
        top: `${y}%`,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
      animate={{
        y: [0, -100, -200],
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN AMBIENT BACKGROUND
// ─────────────────────────────────────────────────────────────────────────────

interface ThemeOverride {
  primary: string;    // Main accent color (e.g. '#f59e0b')
  glow: string;       // Glow color with alpha
  gradient: string;   // Background tint color with alpha
}

interface AmbientBackgroundProps {
  intensity?: 'subtle' | 'normal' | 'vivid';
  particleCount?: number;
  orbCount?: number;
  themeOverride?: ThemeOverride;
}

export function AmbientBackground({
  intensity = 'normal',
  particleCount = 20,
  orbCount = 3,
  themeOverride,
}: AmbientBackgroundProps) {
  const { resolvedTheme } = useTheme();
  const [theme, setTheme] = useState<TimeTheme>(getTimeTheme);
  const [mounted, setMounted] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect mobile and reduced motion preference
  useEffect(() => {
    setMounted(true);

    // Detect mobile via touch capability and screen size
    const mobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent) ||
      window.matchMedia('(max-width: 768px)').matches;
    setIsMobileDevice(mobile);

    // Detect prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const interval = setInterval(() => {
      setTheme(getTimeTheme());
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Reduce counts on mobile to prevent GPU overload (especially Android)
  const effectiveOrbCount = prefersReducedMotion ? 0 : (isMobileDevice ? Math.min(orbCount, 2) : orbCount);
  const effectiveParticleCount = prefersReducedMotion ? 0 : (isMobileDevice ? Math.min(particleCount, 6) : particleCount);
  const isLightTheme = resolvedTheme === 'light';

  // If a theme override is provided, blend it with the time theme
  const hasOverride = !!themeOverride;
  const activeOrbColors = hasOverride
    ? [themeOverride!.gradient, ...(isLightTheme ? theme.lightOrbColors.slice(1) : theme.orbColors.slice(1))]
    : (isLightTheme ? theme.lightOrbColors : theme.orbColors);
  const activeParticleColor = hasOverride
    ? themeOverride!.glow
    : (isLightTheme ? theme.lightParticleColor : theme.particleColor);
  const activeGradientStops = isLightTheme ? theme.lightGradientStops : theme.gradientStops;
  const activePrimary = hasOverride
    ? themeOverride!.gradient
    : (isLightTheme ? theme.lightPrimary : theme.primary);
  const activeSecondary = isLightTheme ? theme.lightSecondary : theme.secondary;
  const activeAccent = isLightTheme ? theme.lightAccent : theme.accent;

  // Generate stable orbs
  const orbs = useMemo(() => {
    return Array.from({ length: effectiveOrbCount }, (_, i) => ({
      id: i,
      color: activeOrbColors[i % activeOrbColors.length],
      size: isMobileDevice ? (150 + Math.random() * 150) : (200 + Math.random() * 300),
      initialX: 10 + (i * 30) + Math.random() * 20,
      initialY: 20 + Math.random() * 60,
      duration: 20 + Math.random() * 15,
      delay: i * 2,
    }));
  }, [activeOrbColors, effectiveOrbCount, isMobileDevice]);

  // Generate stable particles
  const particles = useMemo(() => {
    return Array.from({ length: effectiveParticleCount }, (_, i) => ({
      id: i,
      color: activeParticleColor,
      size: 2 + Math.random() * 3,
      x: Math.random() * 100,
      y: 100 + Math.random() * 20,
      duration: 8 + Math.random() * 8,
      delay: Math.random() * 10,
    }));
  }, [activeParticleColor, effectiveParticleCount]);

  // Intensity multipliers
  const intensityMap = {
    subtle: 0.5,
    normal: 1,
    vivid: 1.5,
  };
  const mult = intensityMap[intensity];

  if (!mounted) return null;

  // Reduce blur on mobile for GPU performance
  const atmosphereBlur = isMobileDevice ? 30 : 60;
  const accentBlur = isMobileDevice ? 40 : 80;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      {/* Base gradient layer */}
      <div
        className="absolute inset-0 transition-colors duration-[3000ms]"
        style={{
          background: `linear-gradient(180deg, ${activeGradientStops[0]} 0%, ${activeGradientStops[1]} 50%, ${activeGradientStops[2]} 100%)`,
        }}
      />

      {/* Atmospheric gradient orbs */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: mult }}
        transition={{ duration: 2 }}
      >
        {/* Primary atmosphere - top left */}
        <div
          className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%] rounded-full transition-colors duration-[3000ms]"
          style={{
            background: `radial-gradient(ellipse at center, ${activePrimary} 0%, transparent 70%)`,
            filter: `blur(${atmosphereBlur}px)`,
          }}
        />

        {/* Secondary atmosphere - bottom right */}
        <div
          className="absolute -bottom-1/4 -right-1/4 w-[70%] h-[70%] rounded-full transition-colors duration-[3000ms]"
          style={{
            background: `radial-gradient(ellipse at center, ${activeSecondary} 0%, transparent 70%)`,
            filter: `blur(${atmosphereBlur}px)`,
          }}
        />

        {/* Accent atmosphere - center */}
        <div
          className="absolute top-1/3 left-1/3 w-[50%] h-[50%] rounded-full transition-colors duration-[3000ms]"
          style={{
            background: `radial-gradient(ellipse at center, ${activeAccent} 0%, transparent 70%)`,
            filter: `blur(${accentBlur}px)`,
          }}
        />
      </motion.div>

      {/* Floating orbs */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: mult * 0.8 }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        {orbs.map((orb) => (
          <FloatingOrb key={orb.id} {...orb} />
        ))}
      </motion.div>

      {/* Rising particles */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: mult * 0.6 }}
        transition={{ duration: 2, delay: 1 }}
      >
        {particles.map((particle) => (
          <Particle key={particle.id} {...particle} />
        ))}
      </motion.div>

      {/* Vignette overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, transparent 50%, ${isLightTheme ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.4)'} 100%)`,
        }}
      />

      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

// Export the time theme hook for other components
export function useTimeTheme() {
  const [theme, setTheme] = useState<TimeTheme>(getTimeTheme);

  useEffect(() => {
    const interval = setInterval(() => {
      setTheme(getTimeTheme());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return theme;
}

export default AmbientBackground;
