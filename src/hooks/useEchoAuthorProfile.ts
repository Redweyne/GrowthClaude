'use client';

import { useState, useEffect, useRef } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

interface EchoAuthorProfile {
  name: string;
  avatar_url: string | null;
  equipped_title_id: string | null;
  current_level: number;
  profile_visible: boolean;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const profileCache = new Map<string, { data: EchoAuthorProfile | null; ts: number }>();

/**
 * Fetches an echo author's public profile using the privacy-safe RPC.
 * Only returns data if the author has opted in via profile_visible_in_echoes.
 * Results are cached client-side to avoid repeated calls.
 */
export function useEchoAuthorProfile(authorId: string | null) {
  const [profile, setProfile] = useState<EchoAuthorProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!authorId || authorId.startsWith('seed-') || authorId === 'current-user') {
      setProfile(null);
      return;
    }

    // Skip if already fetched for this authorId
    if (fetchedRef.current === authorId) return;
    fetchedRef.current = authorId;

    // Check cache first (with TTL)
    const cached = profileCache.get(authorId);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      setProfile(cached.data);
      return;
    }

    const client = getSupabaseBrowserClient();
    if (!client) {
      setProfile(null);
      return;
    }

    setLoading(true);

    const fetchProfile = async () => {
      try {
        const { data, error } = await client.rpc('get_echo_author_profile', { author_id: authorId });
        if (error || !data || (Array.isArray(data) && data.length === 0)) {
          profileCache.set(authorId, { data: null, ts: Date.now() });
          setProfile(null);
        } else {
          const p = (Array.isArray(data) ? data[0] : data) as EchoAuthorProfile;
          profileCache.set(authorId, { data: p, ts: Date.now() });
          setProfile(p);
        }
      } catch {
        profileCache.set(authorId, { data: null, ts: Date.now() });
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authorId]);

  return { profile, loading };
}
