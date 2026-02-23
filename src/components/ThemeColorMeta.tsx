'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

/**
 * Dynamically updates <meta name="theme-color"> to match the user's
 * selected theme (not just OS prefers-color-scheme).
 * This ensures the browser chrome / status bar color stays in sync
 * when the user toggles theme via the in-app ThemeToggle.
 *
 * Next.js viewport config creates two meta tags with media queries.
 * This component consolidates them into a single unconditional one.
 */
export function ThemeColorMeta() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const color = resolvedTheme === 'light' ? '#fafaf9' : '#050403';
    const metas = document.querySelectorAll('meta[name="theme-color"]');

    if (metas.length > 0) {
      // Update the first one and remove the media attribute
      metas[0].setAttribute('content', color);
      metas[0].removeAttribute('media');

      // Remove any extra theme-color meta tags (Next.js may create two)
      for (let i = 1; i < metas.length; i++) {
        metas[i].remove();
      }
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      meta.setAttribute('content', color);
      document.head.appendChild(meta);
    }
  }, [resolvedTheme]);

  return null;
}
