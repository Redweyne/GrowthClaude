'use client';

import type { ReactNode } from 'react';
import { useSupabaseStoreSync } from '@/hooks/useSupabaseStoreSync';
import { useProgressBlobSync } from '@/hooks/useProgressBlobSync';

export function SupabaseSyncProvider({ children }: { children: ReactNode }) {
  useSupabaseStoreSync();   // Granular per-table sync (lessons, reflections, echoes, etc.)
  useProgressBlobSync();    // Full-state JSONB blob backup/restore
  return <>{children}</>;
}
