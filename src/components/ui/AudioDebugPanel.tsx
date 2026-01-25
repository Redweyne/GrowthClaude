'use client';

// ============================================================================
// AUDIO DEBUG PANEL - Production debugging for audio issues
// ============================================================================
//
// Enable in production: localStorage.setItem('AUDIO_DEBUG', 'true')
// Toggle panel: Ctrl+Shift+A
//
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { useAudio } from '@/hooks/useAudio';

export function AudioDebugPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const { state, playTap, startMusic, stopAllAudio } = useAudio();

  // Check if debug is enabled
  useEffect(() => {
    const checkDebug = () => {
      const enabled = localStorage.getItem('AUDIO_DEBUG') === 'true';
      setIsEnabled(enabled);
    };
    
    checkDebug();
    
    // Re-check periodically
    const interval = setInterval(checkDebug, 2000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut: Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsVisible(v => !v);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleDebug = useCallback(() => {
    const newValue = localStorage.getItem('AUDIO_DEBUG') !== 'true';
    localStorage.setItem('AUDIO_DEBUG', String(newValue));
    setIsEnabled(newValue);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] w-80 bg-black/90 border border-cyan-500/50 rounded-lg p-4 text-xs font-mono text-white shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-cyan-400 font-bold">🔊 Audio Debug</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-stone-500 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Status indicators */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-stone-400">Initialized:</span>
          <span className={state.isInitialized ? 'text-green-400' : 'text-red-400'}>
            {state.isInitialized ? '✓ Yes' : '✗ No'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-400">Unlocked:</span>
          <span className={state.isUnlocked ? 'text-green-400' : 'text-red-400'}>
            {state.isUnlocked ? '✓ Yes' : '✗ No'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-400">Unlocking:</span>
          <span className={state.isUnlocking ? 'text-yellow-400' : 'text-stone-500'}>
            {state.isUnlocking ? '⏳ In progress...' : '-'}
          </span>
        </div>
      </div>

      {/* Current tracks */}
      <div className="space-y-2 mb-4 border-t border-stone-700 pt-3">
        <div className="flex justify-between">
          <span className="text-stone-400">Music:</span>
          <span className={state.isMusicPlaying ? 'text-cyan-400' : 'text-stone-500'}>
            {state.currentMusicTrack || 'None'}
            {state.isMusicPlaying && ' ▶'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-400">Ambience:</span>
          <span className={state.isAmbiencePlaying ? 'text-cyan-400' : 'text-stone-500'}>
            {state.currentAmbienceTrack || 'None'}
            {state.isAmbiencePlaying && ' ▶'}
          </span>
        </div>
      </div>

      {/* Volume levels */}
      <div className="space-y-1 mb-4 border-t border-stone-700 pt-3">
        <div className="flex justify-between">
          <span className="text-stone-400">Master:</span>
          <span>{Math.round(state.settings.masterVolume * 100)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-400">Music:</span>
          <span>{Math.round(state.settings.musicVolume * 100)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-400">UI:</span>
          <span>{Math.round(state.settings.uiVolume * 100)}%</span>
        </div>
      </div>

      {/* Last error */}
      {state.lastError && (
        <div className="mb-4 p-2 bg-red-900/50 rounded text-red-300 text-xs">
          Error: {state.lastError}
        </div>
      )}

      {/* Test buttons */}
      <div className="space-y-2 border-t border-stone-700 pt-3">
        <div className="flex gap-2">
          <button
            onClick={() => playTap()}
            className="flex-1 px-2 py-1 bg-stone-700 hover:bg-stone-600 rounded text-xs"
          >
            Test Tap
          </button>
          <button
            onClick={() => startMusic('reflection', 1)}
            className="flex-1 px-2 py-1 bg-stone-700 hover:bg-stone-600 rounded text-xs"
          >
            Test Music
          </button>
        </div>
        <button
          onClick={() => stopAllAudio()}
          className="w-full px-2 py-1 bg-red-900/50 hover:bg-red-800/50 rounded text-xs text-red-300"
        >
          Stop All Audio
        </button>
      </div>

      {/* Debug toggle */}
      <div className="mt-3 pt-3 border-t border-stone-700">
        <button
          onClick={toggleDebug}
          className={`w-full px-2 py-1 rounded text-xs ${
            isEnabled 
              ? 'bg-cyan-900/50 text-cyan-300' 
              : 'bg-stone-700 text-stone-400'
          }`}
        >
          Console Logging: {isEnabled ? 'ON' : 'OFF'}
        </button>
        <p className="mt-2 text-stone-500 text-center">
          Press Ctrl+Shift+A to toggle panel
        </p>
      </div>
    </div>
  );
}

export default AudioDebugPanel;
