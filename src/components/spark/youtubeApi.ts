'use client';

export interface YouTubePlayerStateMap {
  UNSTARTED: number;
  ENDED: number;
  PLAYING: number;
  PAUSED: number;
  BUFFERING: number;
  CUED: number;
}

export interface YouTubePlayer {
  destroy: () => void;
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (videoId: string, startSeconds?: number) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  getPlayerState: () => number;
  setPlaybackQuality: (quality: string) => void;
}

export interface YouTubePlayerEvent {
  target: YouTubePlayer;
  data: number;
}

interface YouTubePlayerOptions {
  videoId: string;
  width?: string;
  height?: string;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (event: YouTubePlayerEvent) => void;
    onStateChange?: (event: YouTubePlayerEvent) => void;
    onError?: (event: YouTubePlayerEvent) => void;
  };
}

export interface YouTubeApi {
  Player: new (element: HTMLElement, options: YouTubePlayerOptions) => YouTubePlayer;
  PlayerState: YouTubePlayerStateMap;
}

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: (() => void) | null;
  }
}

const YOUTUBE_IFRAME_API_URL = 'https://www.youtube.com/iframe_api';

let youtubeApiPromise: Promise<YouTubeApi> | null = null;

function resolveExistingApi(): YouTubeApi | null {
  if (typeof window === 'undefined') return null;
  if (!window.YT?.Player) return null;
  return window.YT;
}

const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 1500;

function loadYouTubeApiOnce(): Promise<YouTubeApi> {
  return new Promise<YouTubeApi>((resolve, reject) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      reject(new Error('YouTube API can only be loaded in the browser.'));
      return;
    }

    const scriptSelector = 'script[data-spark-youtube-api="true"]';
    let existingScript = document.querySelector<HTMLScriptElement>(scriptSelector);

    const cleanup = (pollTimer: number, timeoutTimer: number) => {
      window.clearInterval(pollTimer);
      window.clearTimeout(timeoutTimer);
    };

    const finish = (pollTimer: number, timeoutTimer: number) => {
      const api = resolveExistingApi();
      if (!api) return false;
      cleanup(pollTimer, timeoutTimer);
      resolve(api);
      return true;
    };

    const previousReady = window.onYouTubeIframeAPIReady;

    const pollTimer = window.setInterval(() => {
      finish(pollTimer, timeoutTimer);
    }, 80);

    const timeoutTimer = window.setTimeout(() => {
      cleanup(pollTimer, timeoutTimer);
      reject(new Error('YouTube IFrame API load timed out.'));
    }, 20000);

    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      finish(pollTimer, timeoutTimer);
    };

    if (existingScript) {
      // Remove stale script from a previous failed attempt so we get a fresh load
      existingScript.remove();
      existingScript = null;
    }

    const script = document.createElement('script');
    script.src = YOUTUBE_IFRAME_API_URL;
    script.async = true;
    script.dataset.sparkYoutubeApi = 'true';
    script.onerror = () => {
      cleanup(pollTimer, timeoutTimer);
      script.remove();
      reject(new Error('Failed to load YouTube IFrame API script.'));
    };
    document.head.appendChild(script);
  });
}

export function loadYouTubeApi(): Promise<YouTubeApi> {
  const existingApi = resolveExistingApi();
  if (existingApi) {
    return Promise.resolve(existingApi);
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = (async () => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      // Check if API appeared between retries (e.g. another component loaded it)
      const api = resolveExistingApi();
      if (api) return api;

      try {
        return await loadYouTubeApiOnce();
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(`[youtubeApi] Attempt ${attempt + 1}/${MAX_RETRIES} failed:`, lastError.message);

        if (attempt < MAX_RETRIES - 1) {
          await new Promise((r) => setTimeout(r, RETRY_BASE_DELAY_MS * (attempt + 1)));
        }
      }
    }

    // All retries exhausted
    youtubeApiPromise = null;
    throw lastError ?? new Error('Failed to load YouTube API after retries.');
  })();

  return youtubeApiPromise;
}
