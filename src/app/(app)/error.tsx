'use client';

// ═══════════════════════════════════════════════════════════════════════════
// APP ERROR BOUNDARY — Catches errors within the (app) route group
// Shows a branded recovery screen without losing the shell layout.
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect } from 'react';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[SolonsWay] App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        {/* Decorative element */}
        <div className="text-5xl mb-6 opacity-80">
          ✦
        </div>

        <h1 className="text-2xl font-bold text-stone-100 mb-3">
          A moment of pause
        </h1>

        <p className="text-stone-500 text-sm leading-relaxed mb-8">
          Something unexpected happened, but your progress is safe.
          Take a breath, then continue.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full px-6 py-3.5 text-base font-semibold text-stone-950 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-shadow"
          >
            Try Again
          </button>

          <button
            onClick={() => { window.location.href = '/'; }}
            className="w-full px-6 py-3.5 text-base font-medium text-stone-400 bg-stone-900 border border-stone-800 rounded-xl hover:border-stone-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}
