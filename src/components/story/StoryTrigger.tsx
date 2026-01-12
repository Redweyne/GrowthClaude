'use client';

// ============================================================================
// STORY TRIGGER BUTTON
// The beautiful, inviting button that opens the transformation story.
// Designed to create anticipation and curiosity.
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play } from 'lucide-react';

interface StoryTriggerProps {
  onClick: () => void;
  variant?: 'primary' | 'minimal' | 'card';
  label?: string;
  subtitle?: string;
  disabled?: boolean;
}

export function StoryTrigger({
  onClick,
  variant = 'primary',
  label = 'View Your Story',
  subtitle,
  disabled = false
}: StoryTriggerProps) {
  if (variant === 'card') {
    return (
      <motion.button
        onClick={onClick}
        disabled={disabled}
        className="w-full p-6 rounded-2xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 text-left relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Sparkle decorations */}
        <div className="absolute top-4 right-4 text-purple-400/30">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-purple-500/20">
              <Play className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">{label}</h3>
          </div>

          {subtitle && (
            <p className="text-white/60 text-sm ml-12">{subtitle}</p>
          )}

          <div className="flex items-center gap-2 mt-4 ml-12">
            <span className="text-xs text-purple-400 font-medium">
              {disabled ? 'Keep growing to unlock' : 'Tap to experience'}
            </span>
            {!disabled && (
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            )}
          </div>
        </div>
      </motion.button>
    );
  }

  if (variant === 'minimal') {
    return (
      <motion.button
        onClick={onClick}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        <Sparkles className="w-4 h-4 text-purple-400" />
        <span className="text-sm text-white">{label}</span>
      </motion.button>
    );
  }

  // Primary variant
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="relative px-8 py-4 rounded-full overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600" />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
      />

      {/* Content */}
      <div className="relative flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-white" />
        <span className="text-white font-semibold">{label}</span>
      </div>
    </motion.button>
  );
}
