'use client';

// ============================================================================
// AUDIO DEBUG PANEL - Production debugging for audio issues
// ============================================================================
//
// Enable in production: localStorage.setItem('AUDIO_DEBUG', 'true')
// Toggle panel: Ctrl+Shift+A
//
// ============================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useAudio } from '@/hooks/useAudio';
import {
  logDebug,
  setDebugEnabled,
  subscribeDebugLogs,
  clearDebugLogs,
  isDebugEnabled,
  type DebugLogEntry,
} from '@/lib';

const MAX_VISIBLE = 200;

function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleTimeString();
}

function formatData(data?: Record<string, unknown>): string {
  if (!data || Object.keys(data).length === 0) return '';
  try {
    return JSON.stringify(data);
  } catch {
    return '[unserializable]';
  }
}

export function AudioDebugPanel() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isAudioDebugEnabled, setIsAudioDebugEnabled] = useState(false);
  const [logs, setLogs] = useState<DebugLogEntry[]>([]);
  const [copyStatus, setCopyStatus] = useState('');
  const { state, playTap, startMusic, stopAllAudio } = useAudio();

  // Check if audio debug is enabled
  useEffect(() => {
    const checkDebug = () => {
      const enabled = localStorage.getItem('AUDIO_DEBUG') === 'true';
      setIsAudioDebugEnabled(enabled);
    };
    
    checkDebug();
    
    // Re-check periodically
    const interval = setInterval(checkDebug, 2000);
    return () => clearInterval(interval);
  }, []);

  // Enable app debug via query param or localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const debugParam = params.get('debug');
    if (debugParam === '1') {
      localStorage.setItem('APP_DEBUG', 'true');
      setDebugEnabled(true);
      setIsVisible(true);
      logDebug('Debug enabled via query param', {
        path: pathname,
        query: window.location.search,
      });
    } else if (localStorage.getItem('APP_DEBUG') === 'true') {
      setDebugEnabled(true);
      setIsVisible(true);
    }
  }, [pathname]);

  // Subscribe to debug logs
  useEffect(() => {
    if (!isDebugEnabled()) return;
    const unsubscribe = subscribeDebugLogs((entries) => setLogs(entries));
    return unsubscribe;
  }, []);

  // Global app lifecycle logging
  useEffect(() => {
    if (!isDebugEnabled()) return;

    logDebug('App mounted', {
      path: pathname,
      url: typeof window !== 'undefined' ? window.location.href : '',
      ua: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      viewport: typeof window !== 'undefined'
        ? `${window.innerWidth}x${window.innerHeight}`
        : '',
      dpr: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    });

    const handleVisibility = () => {
      logDebug('Visibility change', { state: document.visibilityState });
    };

    const handlePageHide = (event: PageTransitionEvent) => {
      logDebug('Page hide', { persisted: event.persisted });
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      logDebug('Page show', { persisted: event.persisted });
    };

    const handleResize = () => {
      logDebug('Viewport resize', {
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        orientation: (screen.orientation && screen.orientation.type) || 'unknown',
      });
    };

    const handleError = (event: ErrorEvent) => {
      logDebug('Window error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }, 'error');
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      logDebug('Unhandled rejection', {
        reason: String(event.reason),
      }, 'error');
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('resize', handleResize);
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [pathname]);

  useEffect(() => {
    if (!isDebugEnabled()) return;
    logDebug('Route change', {
      path: pathname,
      query: typeof window !== 'undefined' ? window.location.search : '',
    });
  }, [pathname]);

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

  const toggleAudioDebug = useCallback(() => {
    const newValue = localStorage.getItem('AUDIO_DEBUG') !== 'true';
    localStorage.setItem('AUDIO_DEBUG', String(newValue));
    setIsAudioDebugEnabled(newValue);
  }, []);

  const visibleLogs = useMemo(() => logs.slice(-MAX_VISIBLE), [logs]);

  const handleCopy = useCallback(async () => {
    const payload = visibleLogs
      .map(entry => {
        const line = `${formatTimestamp(entry.ts)} [${entry.level.toUpperCase()}] ${entry.message}`;
        const data = formatData(entry.data);
        return data ? `${line} ${data}` : line;
      })
      .join('\n');

    try {
      await navigator.clipboard.writeText(payload);
      setCopyStatus('Copied');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = payload;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopyStatus('Copied');
    }

    setTimeout(() => setCopyStatus(''), 2000);
  }, [visibleLogs]);

  const handleClear = useCallback(() => {
    clearDebugLogs();
    logDebug('Logs cleared');
  }, []);

  const handleToggle = useCallback(() => {
    const next = !isDebugEnabled();
    localStorage.setItem('APP_DEBUG', String(next));
    setDebugEnabled(next);
    if (next) {
      setIsVisible(true);
      logDebug('Debug enabled via toggle');
    } else {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible || !isDebugEnabled()) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] w-80 bg-black/90 border border-amber-500/40 rounded-lg p-4 text-xs font-mono text-white shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-amber-300 font-bold">Debug Panel</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-stone-500 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={handleCopy}
          className="px-2 py-1 rounded bg-amber-500/20 text-amber-200 hover:bg-amber-500/30"
        >
          {copyStatus ? copyStatus : 'Copy Logs'}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="px-2 py-1 rounded bg-stone-700/60 text-stone-200 hover:bg-stone-600/70"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleToggle}
          className="ml-auto px-2 py-1 rounded bg-stone-800 text-stone-300 hover:bg-stone-700"
        >
          Disable
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

      {/* Recent logs */}
      <div className="space-y-2 mb-4 border-t border-stone-700 pt-3 max-h-48 overflow-y-auto">
        {visibleLogs.length === 0 ? (
          <div className="text-stone-500">No logs yet.</div>
        ) : (
          visibleLogs.map(entry => (
            <div key={entry.id} className="leading-snug">
              <span className="text-stone-500">{formatTimestamp(entry.ts)}</span>{' '}
              <span
                className={
                  entry.level === 'error'
                    ? 'text-red-400'
                    : entry.level === 'warn'
                    ? 'text-amber-300'
                    : 'text-emerald-300'
                }
              >
                [{entry.level.toUpperCase()}]
              </span>{' '}
              <span>{entry.message}</span>
              {entry.data && (
                <span className="text-stone-500"> {formatData(entry.data)}</span>
              )}
            </div>
          ))
        )}
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
          onClick={toggleAudioDebug}
          className={`w-full px-2 py-1 rounded text-xs ${
            isAudioDebugEnabled 
              ? 'bg-cyan-900/50 text-cyan-300' 
              : 'bg-stone-700 text-stone-400'
          }`}
        >
          Audio Console Logging: {isAudioDebugEnabled ? 'ON' : 'OFF'}
        </button>
        <p className="mt-2 text-stone-500 text-center">
          Press Ctrl+Shift+A to toggle panel
        </p>
      </div>
    </div>
  );
}

export default AudioDebugPanel;
