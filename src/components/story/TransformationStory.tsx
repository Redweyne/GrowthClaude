'use client';

// ============================================================================
// TRANSFORMATION STORY VIEWER
// The cinematic player that brings the user's transformation to life.
// Every animation, every transition, every pause - crafted for emotional impact.
// This is where data becomes feeling, where numbers become narrative.
// ============================================================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Pause, Play, Share2, Volume2, VolumeX } from 'lucide-react';
import { TransformationStory as TransformationStoryType, StorySlide, StoryPlaybackState } from '@/types/story';
import { SlideRenderer } from './SlideRenderer';
import { StoryProgress } from './StoryProgress';
import { StoryParticles } from './StoryParticles';
import { useStoryAudio } from '@/hooks/useStoryAudio';
import { useStore } from '@/store/useStore';

interface TransformationStoryProps {
  story: TransformationStoryType;
  onClose: () => void;
  onShare: () => void;
  onComplete: () => void;
}

// Map slide types to particle moods
const SLIDE_TO_PARTICLE_MOOD: Record<string, 'ethereal' | 'celebration' | 'contemplative' | 'ascension' | 'warmth' | 'breakthrough'> = {
  opening: 'ethereal',
  journey_start: 'warmth',
  stat_reveal: 'celebration',
  contrast: 'ascension',
  pattern_shift: 'breakthrough',
  streak_highlight: 'celebration',
  identity_moment: 'contemplative',
  assessment_growth: 'ascension',
  word_cloud: 'contemplative',
  closing: 'ethereal',
  call_to_action: 'warmth'
};

// Map slide types to audio moods
const SLIDE_TO_AUDIO_MOOD: Record<string, 'opening' | 'journey' | 'contrast' | 'growth' | 'climax' | 'closing'> = {
  opening: 'opening',
  journey_start: 'journey',
  stat_reveal: 'journey',
  contrast: 'contrast',
  pattern_shift: 'growth',
  streak_highlight: 'climax',
  identity_moment: 'growth',
  assessment_growth: 'growth',
  word_cloud: 'journey',
  closing: 'closing',
  call_to_action: 'closing'
};

// Slides that deserve an emotional swell
const SWELL_SLIDES = ['contrast', 'pattern_shift', 'streak_highlight', 'identity_moment', 'closing'];

export function TransformationStory({
  story,
  onClose,
  onShare,
  onComplete
}: TransformationStoryProps) {
  const { soundEnabled, setSoundEnabled } = useStore();
  const { startAmbience, stopAmbience, setMood, swell, playTransition, playReveal } = useStoryAudio();

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

  const [isReady, setIsReady] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentSlide = story.slides[playbackState.currentSlideIndex];
  const previousSlideRef = useRef<string | null>(null);

  // Dramatic intro sequence
  useEffect(() => {
    const introTimer = setTimeout(() => {
      setShowIntro(false);
      setIsReady(true);
      // Start ambient music after intro
      if (soundEnabled) {
        startAmbience();
      }
    }, 2000);

    return () => clearTimeout(introTimer);
  }, [soundEnabled, startAmbience]);

  // Handle audio mood changes based on current slide
  useEffect(() => {
    if (!isReady || playbackState.isPaused) return;

    const slideType = currentSlide.type;

    // Only update if slide changed
    if (previousSlideRef.current !== slideType) {
      previousSlideRef.current = slideType;

      // Set audio mood
      const audioMood = SLIDE_TO_AUDIO_MOOD[slideType] || 'journey';
      setMood(audioMood);

      // Play transition sound
      playTransition();

      // Add swell for emotional slides
      if (SWELL_SLIDES.includes(slideType)) {
        setTimeout(() => {
          if (slideType === 'closing' || slideType === 'streak_highlight') {
            swell('powerful');
          } else if (slideType === 'contrast' || slideType === 'pattern_shift') {
            swell('medium');
          } else {
            swell('gentle');
          }
        }, 500);
      }

      // Play reveal sound for key moments
      if (slideType === 'contrast' || slideType === 'identity_moment' || slideType === 'closing') {
        setTimeout(() => playReveal(), 800);
      }
    }
  }, [currentSlide, isReady, playbackState.isPaused, setMood, swell, playTransition, playReveal]);

  // Handle slide auto-advance
  useEffect(() => {
    if (!isReady || !playbackState.isPlaying || playbackState.isPaused || playbackState.isComplete) {
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
  }, [isReady, playbackState.isPlaying, playbackState.isPaused, playbackState.isComplete, playbackState.currentSlideIndex, currentSlide.duration, story.slides.length]);

  // Handle next slide
  const goToNextSlide = useCallback(() => {
    setPlaybackState(prev => {
      const nextIndex = prev.currentSlideIndex + 1;
      if (nextIndex >= story.slides.length) {
        return { ...prev, isComplete: true, isPlaying: false };
      }
      return {
        ...prev,
        currentSlideIndex: nextIndex,
        slideProgress: 0
      };
    });
  }, [story.slides.length]);

  // Handle previous slide
  const goToPrevSlide = useCallback(() => {
    setPlaybackState(prev => {
      const prevIndex = Math.max(0, prev.currentSlideIndex - 1);
      return {
        ...prev,
        currentSlideIndex: prevIndex,
        slideProgress: 0,
        isComplete: false,
        isPlaying: true
      };
    });
  }, []);

  // Handle play/pause
  const togglePlayPause = useCallback(() => {
    setPlaybackState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  }, []);

  // Handle sound toggle
  const toggleSound = useCallback(() => {
    if (soundEnabled) {
      stopAmbience();
      setSoundEnabled(false);
    } else {
      setSoundEnabled(true);
      startAmbience();
    }
  }, [soundEnabled, setSoundEnabled, stopAmbience, startAmbience]);

  // Handle close with cleanup
  const handleClose = useCallback(() => {
    stopAmbience();
    onClose();
  }, [stopAmbience, onClose]);

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
          handleClose();
          break;
        case 'p':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'm':
          e.preventDefault();
          toggleSound();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide, handleClose, togglePlayPause, toggleSound]);

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
      stopAmbience();
      onComplete();
    }
  }, [playbackState.isComplete, onComplete, stopAmbience]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbience();
    };
  }, [stopAmbience]);

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

  // Get particle mood
  const particleMood = SLIDE_TO_PARTICLE_MOOD[currentSlide.type] || 'ethereal';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Dramatic Intro Overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="text-6xl mb-6"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ✨
              </motion.div>
              <motion.p
                className="text-white/60 text-lg tracking-widest uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Your Transformation Story
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Story Container */}
      <div
        className="relative w-full h-full max-w-md mx-auto overflow-hidden"
        onClick={handleTap}
        style={getBackgroundStyle(currentSlide)}
      >
        {/* Cinematic Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)'
          }}
        />

        {/* Particle Effects Layer */}
        <StoryParticles
          mood={particleMood}
          intensity={playbackState.isPaused ? 'subtle' : 'medium'}
          paused={playbackState.isPaused}
        />

        {/* Pattern Overlay */}
        {currentSlide.background.pattern === 'dots' && (
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
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

        {/* Top Controls */}
        <div className="absolute top-12 right-4 z-20 flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSound();
            }}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-white" />
            ) : (
              <VolumeX className="w-5 h-5 text-white/50" />
            )}
          </button>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Slide Content */}
        <AnimatePresence mode="wait">
          {isReady && (
            <motion.div
              key={playbackState.currentSlideIndex}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] // Custom smooth ease
              }}
              className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10"
            >
              <SlideRenderer
                slide={currentSlide}
                isActive={true}
                onAction={(action) => {
                  if (action === 'share') onShare();
                  else if (action === 'continue') handleClose();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Hints (on pause) */}
        <AnimatePresence>
          {playbackState.isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none z-20"
            >
              <motion.div
                className="p-3 rounded-full bg-white/10"
                animate={{ x: [-5, 0, -5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronLeft className="w-6 h-6 text-white/70" />
              </motion.div>
              <motion.div
                className="p-3 rounded-full bg-white/10"
                animate={{ x: [5, 0, 5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronRight className="w-6 h-6 text-white/70" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Indicator */}
        <AnimatePresence>
          {playbackState.isPaused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            >
              <div className="p-6 rounded-full bg-black/40 backdrop-blur-sm">
                <Pause className="w-12 h-12 text-white/80" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Controls */}
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4 z-20">
          {/* Play/Pause */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            {playbackState.isPaused ? (
              <Play className="w-5 h-5 text-white" />
            ) : (
              <Pause className="w-5 h-5 text-white" />
            )}
          </motion.button>

          {/* Share (only on final slides) */}
          {(currentSlide.type === 'closing' || currentSlide.type === 'call_to_action') && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="p-3 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/50 hover:to-pink-500/50 transition-all backdrop-blur-sm border border-white/10"
            >
              <Share2 className="w-5 h-5 text-white" />
            </motion.button>
          )}
        </div>

        {/* Slide Counter */}
        <div className="absolute bottom-8 right-4 text-white/40 text-sm z-20 font-mono">
          {playbackState.currentSlideIndex + 1} / {story.slides.length}
        </div>

        {/* Keyboard Hints (first slide only) */}
        {playbackState.currentSlideIndex === 0 && isReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-20 left-0 right-0 flex justify-center z-20"
          >
            <p className="text-white/30 text-xs tracking-wide">
              ← → to navigate • space to advance • p to pause • m for sound
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
