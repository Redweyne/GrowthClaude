'use client';

// ═══════════════════════════════════════════════════════════════════════════════════
// USE AUDIO ENGINE - Main React hook for real MP3 audio playback
// ═══════════════════════════════════════════════════════════════════════════════════

import { useCallback, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import {
    initAudioEngine,
    resumeAudio,
    isAudioReady,
    playUI,
    playSingingBowl as playSingingBowlSound,
    playGong as playGongSound,
    startAmbientMusic,
    stopAmbientMusic,
    startWritingAmbience,
    stopWritingAmbience,
    startBreathingGuide,
    updateBreathPhase,
    stopBreathingGuide,
    type AmbienceType,
    type AmbientSound,
    type BreathPhase,
} from '@/lib/audioEngine';
import { playHaptic, HAPTIC_PATTERNS } from '@/lib/audioManager';

export type BowlType = 'small' | 'medium' | 'large';
export type SceneType = AmbientSound;

export function useAudio() {
    const { soundEnabled, hapticEnabled } = useStore();
    const initialized = useRef(false);

    // Initialize audio on first user interaction
    const init = useCallback(() => {
        if (initialized.current) return true;

        initAudioEngine();
        initialized.current = true;
        return true;
    }, []);

    // Auto-initialize on first click/touch
    useEffect(() => {
        const handleInteraction = () => {
            init();
            resumeAudio();
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };

        document.addEventListener('click', handleInteraction);
        document.addEventListener('touchstart', handleInteraction);

        return () => {
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };
    }, [init]);

    // Resume on visibility change
    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                resumeAudio();
            }
        };

        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, []);

    // Haptic helper
    const vibrate = useCallback((pattern: number | number[] = HAPTIC_PATTERNS.tap) => {
        if (!hapticEnabled) return;
        playHaptic(pattern);
    }, [hapticEnabled]);

    // ─────────────────────────────────────────────────────────────────────────────────
    // UI SOUND METHODS
    // ─────────────────────────────────────────────────────────────────────────────────

    const tap = useCallback(() => {
        if (!soundEnabled) return;
        playUI('tap');
        vibrate(HAPTIC_PATTERNS.tap);
    }, [soundEnabled, vibrate]);

    const success = useCallback(() => {
        if (!soundEnabled) return;
        playUI('success');
        vibrate(HAPTIC_PATTERNS.success);
    }, [soundEnabled, vibrate]);

    const celebrate = useCallback(() => {
        if (!soundEnabled) return;
        playUI('celebrate');
        vibrate(HAPTIC_PATTERNS.celebrate);
    }, [soundEnabled, vibrate]);

    const levelUp = useCallback(() => {
        if (!soundEnabled) return;
        playUI('levelUp');
        vibrate(HAPTIC_PATTERNS.celebrate);
    }, [soundEnabled, vibrate]);

    const unlock = useCallback(() => {
        if (!soundEnabled) return;
        playUI('unlock');
        vibrate([30, 50, 20, 60]);
    }, [soundEnabled, vibrate]);

    const transition = useCallback(() => {
        if (!soundEnabled) return;
        playUI('whoosh');
    }, [soundEnabled]);

    const chime = useCallback(() => {
        if (!soundEnabled) return;
        playUI('chime');
        vibrate(HAPTIC_PATTERNS.tap);
    }, [soundEnabled, vibrate]);

    const reveal = useCallback(() => {
        if (!soundEnabled) return;
        playUI('reveal');
        vibrate(HAPTIC_PATTERNS.tap);
    }, [soundEnabled, vibrate]);

    const gong = useCallback(() => {
        if (!soundEnabled) return;
        playGongSound();
        vibrate(HAPTIC_PATTERNS.complete);
    }, [soundEnabled, vibrate]);

    const singingBowl = useCallback(() => {
        if (!soundEnabled) return;
        playSingingBowlSound();
        vibrate(HAPTIC_PATTERNS.tap);
    }, [soundEnabled, vibrate]);

    // ─────────────────────────────────────────────────────────────────────────────────
    // SCENE MUSIC (for Timer, Visualization steps)
    // ─────────────────────────────────────────────────────────────────────────────────

    const setScene = useCallback((scene: SceneType, fadeSeconds: number = 2) => {
        if (!soundEnabled) {
            stopAmbientMusic(0);
            return;
        }
        startAmbientMusic(scene, fadeSeconds);
    }, [soundEnabled]);

    const clearScene = useCallback((fadeSeconds: number = 1.5) => {
        stopAmbientMusic(fadeSeconds);
    }, []);

    // ─────────────────────────────────────────────────────────────────────────────────
    // AMBIENCE (for Reflection, Commitment steps)
    // ─────────────────────────────────────────────────────────────────────────────────

    const setAmbience = useCallback((type: AmbienceType) => {
        if (!soundEnabled || type === 'silence') {
            stopWritingAmbience();
            return;
        }
        startWritingAmbience(type as 'rain' | 'forest' | 'fire');
    }, [soundEnabled]);

    const clearAmbience = useCallback(() => {
        stopWritingAmbience();
    }, []);

    // ─────────────────────────────────────────────────────────────────────────────────
    // BREATHING GUIDE
    // ─────────────────────────────────────────────────────────────────────────────────

    const startBreathing = useCallback(() => {
        if (!soundEnabled) return;
        startBreathingGuide();
    }, [soundEnabled]);

    const breathPhase = useCallback((phase: BreathPhase, durationMs: number) => {
        if (!soundEnabled) return;
        updateBreathPhase(phase, durationMs);
    }, [soundEnabled]);

    const stopBreathing = useCallback(() => {
        stopBreathingGuide();
    }, []);

    return {
        // Initialization
        init,
        isReady: isAudioReady,

        // UI Sounds
        playTap: tap,
        playSuccess: success,
        playCelebrate: celebrate,
        playLevelUp: levelUp,
        playUnlock: unlock,
        playTransition: transition,
        playChime: chime,
        playReveal: reveal,
        playGong: gong,
        playSingingBowl: singingBowl,

        // Scene music
        setScene,
        clearScene,

        // Ambience
        setAmbience,
        clearAmbience,

        // Breathing
        startBreathing,
        breathPhase,
        stopBreathing,

        // Haptic
        vibrate,
    };
}

export default useAudio;
