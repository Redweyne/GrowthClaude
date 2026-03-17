'use client';

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL ERROR BOUNDARY — Last line of defense
// Catches root-level errors that escape all other boundaries.
// Must be a client component with its own <html>/<body> since the root
// layout may have crashed.
// ═══════════════════════════════════════════════════════════════════════════

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0c0a09',
        color: '#fafaf9',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '400px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            ✦
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            color: '#fafaf9',
          }}>
            Something went wrong
          </h1>
          <p style={{
            fontSize: '0.9rem',
            color: '#78716c',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}>
            An unexpected error occurred. Your progress is safe — just refresh to continue your journey.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#0c0a09',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              border: 'none',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              marginRight: '0.75rem',
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => { window.location.href = '/'; }}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#a8a29e',
              background: 'transparent',
              border: '1px solid #292524',
              borderRadius: '0.75rem',
              cursor: 'pointer',
            }}
          >
            Go Home
          </button>
        </div>
      </body>
    </html>
  );
}
