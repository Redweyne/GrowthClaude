'use client';

import { AvatarDisplay } from './AvatarDisplay';
import { ALL_TITLES } from '@/types/profile';

interface MiniProfileCardProps {
  name: string | null;
  avatarUrl: string | null;
  equippedTitleId: string | null;
  level: number;
  isSupporter?: boolean;
  fallbackLabel?: string; // e.g. "A brother" when profile not visible
}

export function MiniProfileCard({
  name,
  avatarUrl,
  equippedTitleId,
  level,
  isSupporter = false,
  fallbackLabel,
}: MiniProfileCardProps) {
  const titleLabel = equippedTitleId
    ? ALL_TITLES.find(t => t.id === equippedTitleId)?.label
    : null;

  const displayName = name || fallbackLabel || 'A traveler';

  return (
    <div className="flex items-center gap-2.5">
      <AvatarDisplay
        size="sm"
        avatarUrl={avatarUrl}
        name={displayName}
        level={level}
        isSupporter={isSupporter}
      />
      <div className="min-w-0">
        <div className="text-sm font-medium text-stone-200 light:text-stone-700 truncate">
          {displayName}
        </div>
        {titleLabel && (
          <div className="text-[10px] text-amber-500/60 truncate">
            {titleLabel}
          </div>
        )}
      </div>
    </div>
  );
}
