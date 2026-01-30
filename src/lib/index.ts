// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM EXPORTS
// Central hub for all design system imports
// ═══════════════════════════════════════════════════════════════════════════

// Design tokens and constants
export {
  designSystem,
  typography,
  spacing,
  colors,
  motion,
  shadows,
  borders,
  breakpoints,
  zIndex,
} from './design-system';

// Font configuration
export {
  fontDisplay,
  fontBody,
  fontAccent,
  fontVariables,
  fontFamilies,
} from './fonts';

// Debug logger (client-safe with runtime guards)
export type DebugLevel = 'info' | 'warn' | 'error';

export interface DebugLogEntry {
  id: number;
  ts: number;
  level: DebugLevel;
  message: string;
  data?: Record<string, unknown>;
}

const DEBUG_MAX_LOGS = 400;
let debugEnabled = false;
let debugLogId = 0;
let debugLogs: DebugLogEntry[] = [];
const debugListeners = new Set<(entries: DebugLogEntry[]) => void>();

function notifyDebug(): void {
  const snapshot = debugLogs.slice();
  debugListeners.forEach(listener => listener(snapshot));
}

export function setDebugEnabled(value: boolean): void {
  debugEnabled = value;
  notifyDebug();
}

export function isDebugEnabled(): boolean {
  return debugEnabled;
}

export function logDebug(message: string, data?: Record<string, unknown>, level: DebugLevel = 'info'): void {
  if (!debugEnabled) return;
  if (typeof window === 'undefined') return;

  const entry: DebugLogEntry = {
    id: ++debugLogId,
    ts: Date.now(),
    level,
    message,
    data,
  };

  debugLogs = [...debugLogs, entry].slice(-DEBUG_MAX_LOGS);
  notifyDebug();

  if (level === 'error') {
    console.error('[Debug]', message, data || '');
  } else if (level === 'warn') {
    console.warn('[Debug]', message, data || '');
  } else {
    console.log('[Debug]', message, data || '');
  }
}

export function getDebugLogs(): DebugLogEntry[] {
  return debugLogs.slice();
}

export function clearDebugLogs(): void {
  debugLogs = [];
  notifyDebug();
}

export function subscribeDebugLogs(listener: (entries: DebugLogEntry[]) => void): () => void {
  debugListeners.add(listener);
  listener(debugLogs.slice());
  return () => debugListeners.delete(listener);
}
