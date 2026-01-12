'use client';

// ============================================================================
// TRANSFORMATION STORY VIEWER
// The cinematic player that brings the user's transformation to life.
// Every animation, every transition, every pause - crafted for emotional impact.
// ============================================================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Pause, Play, Share2 } from 'lucide-react';
import { TransformationStory as TransformationStoryType, StorySlide, StoryPlaybackState } from '@/types/story';
import { SlideRenderer } from './SlideRenderer';
import { StoryProgress } from './StoryProgress';
import { useSound } from '@/hooks';

interface TransformationStoryProps {
  story: TransformationStoryType;
  onClose: () => void;
  onShare: () => void;
  onComplete: () => void;
}

export function TransformationStory({
  story,
  onClose,
  onShare,
  onComplete
}: TransformationStoryProps) {
  const { playSound } = useSound();
  const [playbackState, setPlaybackState] = useState<StoryPlaybackState>({
    storyId: story.id,
    currentSlideIndex: 0,
    isPlaying: true,
    isPaused: false,
    isComplete: false,
    slideProgress: 0,
    totalDuration: story.slides.reduce((sum, s) => sum + (s.duration || 5000), 0),
    elapsedTime: 0
  });

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentSlide = story.slides[playbackState.currentSlideIndex];

  // Handle slide auto-advance
  useEffect(() => {
    if (!playbackState.isPlaying || playbackState.isPaused || playbackState.isComplete) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }

    const slideDuration = currentSlide.duration || 5000;
    if (slideDuration === 0) return; // Manual advance slide

    const progressIncrement = 100 / (slideDuration / 50); // Update every 50ms

    progressIntervalRef.current = setInterval(() => {
      setPlaybackState(prev => {
        const newProgress = prev.slideProgress + progressIncrement;

        if (newProgress >= 100) {
          // Move to next slide
          const nextIndex = prev.currentSlideIndex + 1;
          if (nextIndex >= story.slides.length) {
            // Story complete
            return {
              ...prev,
              slideProgress: 100,
              isComplete: true,
              isPlaying: false
            };
          }
          return {
            ...prev,
            currentSlideIndex: nextIndex,
            slideProgress: 0,
            elapsedTime: prev.elapsedTime + slideDuration
          };
        }

        return {
          ...prev,
          slideProgress: newProgress
        };
      });
    }, 50);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [playbackState.isPlaying, playbackState.isPaused, playbackState.isComplete, playbackState.currentSlideIndex, currentSlide.duration, story.slides.length]);

  // Play opening sound on mount
  useEffect(() => {
    playSound('sparkle');
  }, [playSound]);

  // Handle next slide
  const goToNextSlide = useCallback(() => {
    setPlaybackState(prev => {
      const nextIndex = prev.currentSlideIndex + 1;
      if (nextIndex >= story.slides.length) {
        return { ...prev, isComplete: true, isPlaying: false };
      }
      playSound('transition');
      return {
        ...prev,
        currentSlideIndex: nextIndex,
        slideProgress: 0
      };
    });
  }, [story.slides.length, playSound]);

  // Handle previous slide
  const goToPrevSlide = useCallback(() => {
    setPlaybackState(prev => {
      const prevIndex = Math.max(0, prev.currentSlideIndex - 1);
      playSound('transition');
      return {
        ...prev,
        currentSlideIndex: prevIndex,
        slideProgress: 0,
        isComplete: false,
        isPlaying: true
      };
    });
  }, [playSound]);

  // Handle play/pause
  const togglePlayPause = useCallback(() => {
    setPlaybackState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          goToNextSlide();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevSlide();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'p':
          e.preventDefault();
          togglePlayPause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide, onClose, togglePlayPause]);

  // Handle touch/click navigation
  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return; // Ignore button clicks

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const width = rect.width;

    if (x < width * 0.3) {
      goToPrevSlide();
    } else {
      goToNextSlide();
    }
  }, [goToNextSlide, goToPrevSlide]);

  // Handle story completion
  useEffect(() => {
    if (playbackState.isComplete) {
      onComplete();
    }
  }, [playbackState.isComplete, onComplete]);

  // Get background style
  const getBackgroundStyle = (slide: StorySlide) => {
    const bg = slide.background;
    if (bg.type === 'gradient') {
      return {
        background: `linear-gradient(135deg, ${bg.colors.join(', ')})`
      };
    }
    return { backgroundColor: bg.colors[0] };
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Story Container */}
      <div
        className="relative w-full h-full max-w-md mx-auto overflow-hidden"
        onClick={handleTap}
        style={getBackgroundStyle(currentSlide)}
      >
        {/* Pattern Overlay */}
        {currentSlide.background.pattern === 'dots' && (
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />
        )}

        {/* Progress Bars */}
        <StoryProgress
          slides={story.slides}
          currentIndex={playbackState.currentSlideIndex}
          slideProgress={playbackState.slideProgress}
        />

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-12 right-4 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={playbackState.currentSlideIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6"
          >
            <SlideRenderer
              slide={currentSlide}
              isActive={true}
              onAction={(action) => {
                if (action === 'share') onShare();
                else if (action === 'continue') onClose();
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Hints (on pause) */}
        {playbackState.isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none"
          >
            <div className="p-3 rounded-full bg-white/10">
              <ChevronLeft className="w-6 h-6 text-white/70" />
            </div>
            <div className="p-3 rounded-full bg-white/10">
              <ChevronRight className="w-6 h-6 text-white/70" />
            </div>
          </motion.div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4 z-20">
          {/* Play/Pause */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            {playbackState.isPaused ? (
              <Play className="w-5 h-5 text-white" />
            ) : (
              <Pause className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Share (only on final slides) */}
          {(currentSlide.type === 'closing' || currentSlide.type === 'call_to_action') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Share2 className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Slide Counter */}
        <div className="absolute bottom-8 right-4 text-white/50 text-sm z-20">
          {playbackState.currentSlideIndex + 1} / {story.slides.length}
        </div>
      </div>
    </motion.div>
  );
}
