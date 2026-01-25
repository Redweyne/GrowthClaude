'use client';

// ============================================================================
// PROVIDERS - Client-side context providers wrapper
// ============================================================================

import { ReactNode } from 'react';
import { AudioProvider } from '@/providers/AudioProvider';
import { AudioDebugPanel } from '@/components/ui/AudioDebugPanel';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AudioProvider>
      {children}
      <AudioDebugPanel />
    </AudioProvider>
  );
}

export default Providers;
