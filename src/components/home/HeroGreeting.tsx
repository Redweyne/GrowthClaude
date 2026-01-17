'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { Settings } from 'lucide-react';
import { StreakBadge } from '@/components/ui';

// ═══════════════════════════════════════════════════════════════════════════
// HERO GREETING
// A dramatic, animated welcome that makes users feel seen and valued
// Features staggered letter animations, time-aware greetings, and
// inspirational Stoic wisdom that changes daily
// ═══════════════════════════════════════════════════════════════════════════

// Stoic wisdom quotes that rotate daily
const dailyWisdom = [
  { text: 'The obstacle is the way.', author: 'Marcus Aurelius' },
  { text: 'We suffer more in imagination than in reality.', author: 'Seneca' },
  { text: 'No man is free who is not master of himself.', author: 'Epictetus' },
  { text: 'Begin at once to live.', author: 'Seneca' },
  { text: 'Waste no time arguing what a good person should be. Be one.', author: 'Marcus Aurelius' },
  { text: 'First say to yourself what you would be; then do what you have to do.', author: 'Epictetus' },
  { text: 'It is not death that a man should fear, but never beginning to live.', author: 'Marcus Aurelius' },
  { text: 'Luck is what happens when preparation meets opportunity.', author: 'Seneca' },
  { text: 'Make the best use of what is in your power, and take the rest as it happens.', author: 'Epictetus' },
  { text: 'The happiness of your life depends upon the quality of your thoughts.', author: 'Marcus Aurelius' },
];

interface HeroGreetingProps {
  name: string;
  streak: number;
  onOpenSettings: () => void;
}

// Spring configurations
const springs = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  responsive: { type: 'spring' as const, stiffness: 300, damping: 20 },
};

// Get time-based greeting
function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: 'Good morning', emoji: '~' };
  if (hour >= 12 && hour < 17) return { text: 'Good afternoon', emoji: '~' };
  if (hour >= 17 && hour < 21) return { text: 'Good evening', emoji: '~' };
  return { text: 'Welcome back', emoji: '~' };
}

// Get consistent daily quote
function getDailyQuote() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dailyWisdom[dayOfYear % dailyWisdom.length];
}

export function HeroGreeting({ name, streak, onOpenSettings }: HeroGreetingProps) {
  const [mounted, setMounted] = useState(false);
  const greeting = useMemo(() => getGreeting(), []);
  const quote = useMemo(() => getDailyQuote(), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Stagger animation for letters
  const nameLetters = (name || 'Seeker').split('');

  // Container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.2,
      },
    },
  };

  // Letter variants
  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: springs.gentle,
    },
  };

  // Quote variants
  const quoteVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.8, duration: 0.6, ease: 'easeOut' as const },
    },
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-between mb-8">
        <div className="h-20" />
      </div>
    );
  }

  return (
    <motion.header
      className="relative mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top row - streak and settings */}
      <div className="flex items-center justify-between mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, ...springs.gentle }}
        >
          <StreakBadge streak={streak} />
        </motion.div>

        <motion.button
          onClick={onOpenSettings}
          className="relative w-11 h-11 rounded-2xl bg-stone-900/60 backdrop-blur-sm border border-stone-800/80 flex items-center justify-center hover:border-amber-500/30 transition-all duration-300 group"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, ...springs.gentle }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings
            size={20}
            className="text-stone-400 group-hover:text-amber-400 transition-colors duration-300"
          />
          {/* Hover glow */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              boxShadow: '0 0 20px rgba(251, 191, 36, 0.1)',
            }}
          />
        </motion.button>
      </div>

      {/* Greeting text */}
      <motion.p
        className="text-stone-500 text-sm tracking-wide uppercase mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {greeting.text}
      </motion.p>

      {/* Name with staggered letter animation */}
      <motion.h1
        className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 tracking-tight mb-4"
        style={{
          perspective: '1000px',
          WebkitTextStroke: '0.5px rgba(251, 191, 36, 0.1)',
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {nameLetters.map((letter, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className="inline-block"
            style={{
              transformOrigin: 'center bottom',
              textShadow: '0 0 40px rgba(251, 191, 36, 0.3)',
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.h1>

      {/* Daily wisdom quote */}
      <motion.div
        className="relative pl-4 border-l-2 border-amber-500/20"
        variants={quoteVariants}
        initial="hidden"
        animate="visible"
      >
        <p className="text-stone-400 text-sm italic leading-relaxed">
          &ldquo;{quote.text}&rdquo;
        </p>
        <p className="text-stone-600 text-xs mt-1">
          — {quote.author}
        </p>

        {/* Subtle glow on quote */}
        <div
          className="absolute -left-px top-0 bottom-0 w-0.5 rounded-full"
          style={{
            background: 'linear-gradient(180deg, rgba(251, 191, 36, 0.4) 0%, rgba(251, 191, 36, 0.1) 100%)',
            boxShadow: '0 0 8px rgba(251, 191, 36, 0.3)',
          }}
        />
      </motion.div>

      {/* Decorative gradient line */}
      <motion.div
        className="mt-8 h-px w-full"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.3), rgba(167, 139, 250, 0.2), transparent)',
          transformOrigin: 'left',
        }}
      />
    </motion.header>
  );
}

export default HeroGreeting;
