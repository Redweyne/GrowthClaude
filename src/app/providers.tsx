'use client';

// ============================================================================
// PROVIDERS - Client-side context providers wrapper
// ============================================================================

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { AudioProvider } from '@/providers/AudioProvider';
import { ActivityLoggerProvider } from '@/providers/ActivityLoggerProvider';
import { TranslationProvider } from '@/i18n';
import { ThemeColorMeta } from '@/components/ThemeColorMeta';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
      <ThemeColorMeta />
      <TranslationProvider>
        <ActivityLoggerProvider>
          <AudioProvider>
            {children}
          </AudioProvider>
        </ActivityLoggerProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
}

export default Providers;
