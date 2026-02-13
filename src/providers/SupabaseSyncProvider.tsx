'use client';

import type { ReactNode } from 'react';
import { useSupabaseStoreSync } from '@/hooks/useSupabaseStoreSync';

export function SupabaseSyncProvider({ children }: { children: ReactNode }) {
  useSupabaseStoreSync();
  return <>{children}</>;
}
