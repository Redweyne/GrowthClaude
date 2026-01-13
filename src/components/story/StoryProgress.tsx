'use client';

// ============================================================================
// STORY PROGRESS INDICATOR
// The Instagram-style progress bars that show how far through the story you are.
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { StorySlide } from '@/types/story';

interface StoryProgressProps {
  slides: StorySlide[];
  currentIndex: number;
  slideProgress: number;
}

export function StoryProgress({ slides, currentIndex, slideProgress }: StoryProgressProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden"
        >
          {index < currentIndex ? (
            // Completed slide
            <div className="h-full w-full bg-white/80" />
          ) : index === currentIndex ? (
            // Current slide with animated progress
            <motion.div
              className="h-full bg-white/80"
              initial={{ width: 0 }}
              animate={{ width: `${slideProgress}%` }}
              transition={{ duration: 0.05, ease: 'linear' }}
            />
          ) : (
            // Future slide
            <div className="h-full w-0 bg-white/80" />
          )}
        </div>
      ))}
    </div>
  );
}
