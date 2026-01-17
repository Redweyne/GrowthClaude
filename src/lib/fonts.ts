// ═══════════════════════════════════════════════════════════════════════════
// TYPOGRAPHY SYSTEM
// A harmonious pairing of fonts that evoke timeless wisdom and modern clarity
//
// Using optimized system font stacks that provide excellent typography
// without external dependencies. Custom web fonts can be added later.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Font configuration object
 * Provides CSS variables and class names for the typography system
 */

/**
 * DISPLAY FONT: Elegant Serif
 *
 * A high-contrast serif that feels carved from ancient stone.
 * Used for headlines, titles, and moments of philosophical weight.
 *
 * Stack: Georgia → Cambria → Times New Roman → serif
 */
export const fontDisplay = {
  variable: '--font-display',
  className: 'font-display',
  style: {
    fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
  },
};

/**
 * BODY FONT: Clean Sans-Serif
 *
 * A highly legible sans-serif optimized for screens.
 * Used for body text, UI elements, and functional content.
 *
 * Stack: system-ui → -apple-system → Segoe UI → Roboto → sans-serif
 */
export const fontBody = {
  variable: '--font-body',
  className: 'font-body',
  style: {
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
};

/**
 * ACCENT FONT: Warm Serif
 *
 * A warm, readable serif for quotes, wisdom, and emphasis.
 * Bridges the gap between display and body.
 *
 * Stack: Georgia → Cambria → serif
 */
export const fontAccent = {
  variable: '--font-accent',
  className: 'font-accent',
  style: {
    fontFamily: 'Georgia, Cambria, "Book Antiqua", Palatino, serif',
  },
};

/**
 * Combined font variables for the HTML element
 * Since we're using system fonts, this just provides semantic class names
 */
export const fontVariables = '';

/**
 * Font family strings for direct CSS usage
 */
export const fontFamilies = {
  display: fontDisplay.style.fontFamily,
  body: fontBody.style.fontFamily,
  accent: fontAccent.style.fontFamily,
  mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};
