'use client';

// ═══════════════════════════════════════════════════════════════════════════
// THEME TOGGLE - Premium Light/Dark Mode Switcher
// ═══════════════════════════════════════════════════════════════════════════

import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ThemeToggle({ size = 'md', showLabel = false }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();

  if (!resolvedTheme) {
    return (
      <div
        className={`
          ${size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-14 h-14' : 'w-12 h-12'}
          rounded-full bg-stone-800/50 animate-pulse
        `}
      />
    );
  }

  const isDark = resolvedTheme === 'dark';
  const sizes = {
    sm: { button: 'w-10 h-10', icon: 18 },
    md: { button: 'w-12 h-12', icon: 20 },
    lg: { button: 'w-14 h-14', icon: 24 },
  };

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center gap-3">
      <motion.button
        onClick={toggleTheme}
        className={`
          ${sizes[size].button}
          relative rounded-full
          bg-gradient-to-br from-stone-800/90 to-stone-900/90
          light:from-stone-200/90 light:to-stone-300/90
          border border-stone-700/50
          light:border-stone-400/50
          hover:border-amber-500/40
          light:hover:border-amber-600/50
          shadow-lg shadow-black/20
          light:shadow-black/10
          flex items-center justify-center
          transition-all duration-300
          overflow-hidden
        `}
        whileHover={{ scale: 1.05, rotate: isDark ? 0 : 180 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            background: isDark
              ? 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)',
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Icon container */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <Moon
                  size={sizes[size].icon}
                  className="text-amber-300"
                  fill="currentColor"
                />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <Sun
                  size={sizes[size].icon}
                  className="text-amber-500"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{
              duration: 1.5,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        </motion.div>
      </motion.button>

      {showLabel && (
        <motion.span
          className="text-sm font-medium text-stone-400 light:text-stone-600"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {isDark ? 'Dark' : 'Light'}
        </motion.span>
      )}
    </div>
  );
}

export default ThemeToggle;
