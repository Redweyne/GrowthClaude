'use client';

// ============================================================================
// PROVIDERS - Client-side context providers wrapper
// ============================================================================

import { ReactNode } from 'react';
import { AudioProvider } from '@/providers/AudioProvider';
import { TranslationProvider } from '@/i18n';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <TranslationProvider>
      <AudioProvider>
        {children}
      </AudioProvider>
    </TranslationProvider>
  );
}

export default Providers;
