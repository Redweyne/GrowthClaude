'use client';

// ============================================================================
// PROVIDERS - Client-side context providers wrapper
// ============================================================================

import { ReactNode } from 'react';
import { AudioProvider } from '@/providers/AudioProvider';
import { ActivityLoggerProvider } from '@/providers/ActivityLoggerProvider';
import { TranslationProvider } from '@/i18n';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <TranslationProvider>
      <ActivityLoggerProvider>
        <AudioProvider>
          {children}
        </AudioProvider>
      </ActivityLoggerProvider>
    </TranslationProvider>
  );
}

export default Providers;
