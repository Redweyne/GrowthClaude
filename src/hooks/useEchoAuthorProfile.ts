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

const profileCache = new Map<string, EchoAuthorProfile | null>();

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

    // Check cache first
    if (profileCache.has(authorId)) {
      setProfile(profileCache.get(authorId) ?? null);
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
          profileCache.set(authorId, null);
          setProfile(null);
        } else {
          const p = (Array.isArray(data) ? data[0] : data) as EchoAuthorProfile;
          profileCache.set(authorId, p);
          setProfile(p);
        }
      } catch {
        profileCache.set(authorId, null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authorId]);

  return { profile, loading };
}
