'use client';

// ============================================================================
// USE CONTEXTUAL AUDIO - Master hook for managing audio across app views
// ============================================================================
//
// This hook intelligently manages audio state across different app contexts:
// - Starts appropriate music for each view (onboarding, lessons, home)
// - Manages transitions between audio contexts
// - Provides easy scene-based audio control
// - Handles cleanup and crossfading automatically
//
// Example usage:
//   const { enterScene, exitScene, currentScene } = useContextualAudio();
//   
//   useEffect(() => {
//     enterScene('lesson', { lessonType: 'reflection' });
//     return () => exitScene();
//   }, []);
// ============================================================================

import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { useAudio } from './useAudio';
import { useStore } from '@/store/useStore';
import type { AmbientSound } from '@/lib/audioEngine';

// Get soundEnabled directly from store to avoid closure issues
const getSoundEnabledFromStore = () => useStore.getState().soundEnabled;

// Scene types with their audio configurations
export type AudioScene = 
  | 'home'
  | 'onboarding'
  | 'lesson'
  | 'lessonReflection'
  | 'lessonVisualization'
  | 'lessonScenario'
  | 'breathing'
  | 'journaling'
  | 'achievement'
  | 'reward'
  | 'settings'
  | 'silent';

interface SceneConfig {
  music?: AmbientSound;
  fadeIn?: number;
  autoStart?: boolean;
}

// Scene to audio mapping
const SCENE_CONFIGS: Record<AudioScene, SceneConfig> = {
  home: {
    music: 'home',
    fadeIn: 2,
    autoStart: false, // User can choose
  },
  onboarding: {
    music: 'onboarding',
    fadeIn: 3,
    autoStart: true,
  },
  lesson: {
    music: 'lessonCalm',
    fadeIn: 2,
    autoStart: true,
  },
  lessonReflection: {
    music: 'reflection',
    fadeIn: 2,
    autoStart: true,
  },
  lessonVisualization: {
    music: 'visualization',
    fadeIn: 3,
    autoStart: true,
  },
  lessonScenario: {
    music: 'lessonDeep',
    fadeIn: 2,
    autoStart: true,
  },
  breathing: {
    music: undefined, // Breathing has its own sounds
    autoStart: false,
  },
  journaling: {
    music: 'reflection',
    fadeIn: 2,
    autoStart: true,
  },
  achievement: {
    music: 'reward',
    fadeIn: 1,
    autoStart: true,
  },
  reward: {
    music: 'reward',
    fadeIn: 1,
    autoStart: true,
  },
  settings: {
    music: undefined,
    autoStart: false,
  },
  silent: {
    music: undefined,
    autoStart: false,
  },
};

interface UseContextualAudioOptions {
  initialScene?: AudioScene;
  autoStartMusic?: boolean;
  respectUserPreference?: boolean;
}

export function useContextualAudio(options: UseContextualAudioOptions = {}) {
  const {
    initialScene = 'silent',
    autoStartMusic = true,
    respectUserPreference = true,
  } = options;

  const audio = useAudio();
  const { soundEnabled } = useStore();
  
  const [currentScene, setCurrentScene] = useState<AudioScene>(initialScene);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [userMutedMusic, setUserMutedMusic] = useState(false);

  const sceneStackRef = useRef<AudioScene[]>([initialScene]);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Ref to track current soundEnabled to avoid closure issues in setTimeout
  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Check if we should play music
  const shouldPlayMusic = useCallback(() => {
    if (!soundEnabled) return false;
    if (respectUserPreference && userMutedMusic) return false;
    return true;
  }, [soundEnabled, respectUserPreference, userMutedMusic]);

  // Enter a new scene
  const enterScene = useCallback((
    scene: AudioScene,
    options?: { immediate?: boolean; preserveStack?: boolean }
  ) => {
    const { immediate = false, preserveStack = true } = options || {};
    
    // Clear any pending transition
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Update scene stack
    if (preserveStack) {
      sceneStackRef.current.push(scene);
    } else {
      sceneStackRef.current = [scene];
    }

    setCurrentScene(scene);

    // Get scene config
    const config = SCENE_CONFIGS[scene];
    
    // Handle music
    if (config.music && config.autoStart && autoStartMusic && shouldPlayMusic()) {
      const fadeIn = immediate ? 0.5 : (config.fadeIn || 2);
      audio.startMusic(config.music, fadeIn);
      setIsMusicPlaying(true);
    } else if (!config.music || scene === 'silent') {
      // No music for this scene - stop if playing
      audio.stopMusic(immediate ? 0.5 : 1);
      setIsMusicPlaying(false);
    }
  }, [audio, autoStartMusic, shouldPlayMusic]);

  // Exit current scene (return to previous)
  const exitScene = useCallback((options?: { immediate?: boolean }) => {
    const { immediate = false } = options || {};
    
    // Pop current scene
    if (sceneStackRef.current.length > 1) {
      sceneStackRef.current.pop();
      const previousScene = sceneStackRef.current[sceneStackRef.current.length - 1];
      enterScene(previousScene, { immediate, preserveStack: false });
    } else {
      // No previous scene - go silent
      audio.stopMusic(immediate ? 0.5 : 1);
      setIsMusicPlaying(false);
      setCurrentScene('silent');
    }
  }, [audio, enterScene]);

  // Transition between scenes with crossfade
  const transitionTo = useCallback((
    scene: AudioScene,
    options?: { delay?: number; crossfadeDuration?: number }
  ) => {
    const { delay = 0, crossfadeDuration = 2 } = options || {};

    if (delay > 0) {
      transitionTimeoutRef.current = setTimeout(() => {
        enterScene(scene);
      }, delay);
    } else {
      // Get target config
      const config = SCENE_CONFIGS[scene];

      // Crossfade: stop current, start new
      audio.stopMusic(crossfadeDuration / 2);

      setTimeout(() => {
        // CRITICAL: Use ref/store directly to get current soundEnabled value
        // This prevents closure issues where setTimeout captures stale shouldPlayMusic
        const currentSoundEnabled = soundEnabledRef.current && getSoundEnabledFromStore();
        if (config.music && currentSoundEnabled && !userMutedMusic) {
          audio.startMusic(config.music, crossfadeDuration);
          setIsMusicPlaying(true);
        }
        setCurrentScene(scene);
        sceneStackRef.current = [scene];
      }, (crossfadeDuration / 2) * 1000);
    }
  }, [audio, enterScene, userMutedMusic]);

  // Manual music controls
  const startMusic = useCallback((type?: AmbientSound) => {
    if (!shouldPlayMusic()) return;
    
    const config = SCENE_CONFIGS[currentScene];
    const musicType = type || config.music;
    
    if (musicType) {
      audio.startMusic(musicType, config.fadeIn || 2);
      setIsMusicPlaying(true);
      setUserMutedMusic(false);
    }
  }, [audio, currentScene, shouldPlayMusic]);

  const stopMusic = useCallback((fadeOut?: number) => {
    audio.stopMusic(fadeOut || 1);
    setIsMusicPlaying(false);
    setUserMutedMusic(true);
  }, [audio]);

  const toggleMusic = useCallback(() => {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [isMusicPlaying, startMusic, stopMusic]);

  // Play UI sounds for specific events
  const playStepTransition = useCallback(() => {
    audio.playChime();
  }, [audio]);

  const playStepComplete = useCallback(() => {
    audio.playSuccess();
  }, [audio]);

  const playLessonComplete = useCallback(() => {
    audio.playComplete();
  }, [audio]);

  const playAchievement = useCallback(() => {
    audio.playCelebrate();
  }, [audio]);

  const playLevelUp = useCallback(() => {
    audio.playLevelUp();
  }, [audio]);

  const playXpGain = useCallback((xp: number, duration?: number) => {
    audio.playXpCounting(xp, duration);
  }, [audio]);

  const playReveal = useCallback(() => {
    audio.playReveal();
  }, [audio]);

  // Cleanup on unmount - only clear pending transitions, DON'T stop music
  // The explicit stopMusic calls should handle cleanup
  // Automatic cleanup on unmount was causing race conditions and double-stops
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      // NOTE: We intentionally do NOT stop music here
      // The component using this hook should explicitly call stopMusic when needed
      // This prevents race conditions when onboarding completes and multiple
      // cleanup handlers all try to stop music at the same time
    };
  }, []);

  // Sync with sound enabled setting
  useEffect(() => {
    if (!soundEnabled && isMusicPlaying) {
      audio.stopMusic(0.5);
      setIsMusicPlaying(false);
    }
  }, [soundEnabled, isMusicPlaying, audio]);

  return {
    // State
    currentScene,
    isMusicPlaying,
    userMutedMusic,
    sceneStack: sceneStackRef.current,
    
    // Scene management
    enterScene,
    exitScene,
    transitionTo,
    
    // Music controls
    startMusic,
    stopMusic,
    toggleMusic,
    
    // Event sounds
    playStepTransition,
    playStepComplete,
    playLessonComplete,
    playAchievement,
    playLevelUp,
    playXpGain,
    playReveal,
    
    // Scene configs for reference
    sceneConfigs: SCENE_CONFIGS,
  };
}

export default useContextualAudio;
