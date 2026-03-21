'use client';

import { motion } from 'framer-motion';
import { ChevronUp, Lightbulb, Bug, Heart, HelpCircle, CheckCircle2, Eye, Loader2, MessageCircle } from 'lucide-react';
import type { AgoraPost, AgoraStatus } from '@/types/agora';
import { useTranslation } from '@/i18n';

interface AgoraPostCardProps {
  post: AgoraPost;
  hasVoted: boolean;
  onVote: () => void;
  onClick: () => void;
  isOwnPost?: boolean;
}

const CATEGORY_CONFIG = {
  idea: {
    icon: Lightbulb,
    gradient: 'from-blue-400 to-cyan-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    glow: 'rgba(59, 130, 246, 0.15)',
  },
  bug: {
    icon: Bug,
    gradient: 'from-red-400 to-rose-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
    glow: 'rgba(239, 68, 68, 0.15)',
  },
  love: {
    icon: Heart,
    gradient: 'from-pink-400 to-rose-300',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    text: 'text-pink-400',
    glow: 'rgba(236, 72, 153, 0.15)',
  },
  question: {
    icon: HelpCircle,
    gradient: 'from-emerald-400 to-teal-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    glow: 'rgba(52, 211, 153, 0.15)',
  },
};

const STATUS_CONFIG: Record<Exclude<AgoraStatus, 'open'>, { icon: typeof Eye; label: string; bg: string; text: string }> = {
  heard: { icon: Eye, label: 'agora.statusHeard', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  in_progress: { icon: Loader2, label: 'agora.statusInProgress', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  done: { icon: CheckCircle2, label: 'agora.statusDone', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
};

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  return `${Math.floor(days / 30)}mo`;
}

export function AgoraPostCard({ post, hasVoted, onVote, onClick, isOwnPost }: AgoraPostCardProps) {
  const { t, isRTL } = useTranslation();
  const cat = CATEGORY_CONFIG[post.category];
  const CategoryIcon = cat.icon;
  const statusCfg = post.status !== 'open' ? STATUS_CONFIG[post.status] : null;
  const StatusIcon = statusCfg?.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      {/* Subtle glow on hover */}
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at center, ${cat.glow}, transparent 70%)` }}
      />

      <div className={`relative flex gap-3 p-4 rounded-2xl bg-stone-900/80 light:bg-white/80 backdrop-blur-sm border border-stone-800/60 light:border-stone-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Vote column */}
        <div className="flex flex-col items-center gap-0.5 min-w-[40px]">
          <motion.button
            onClick={(e) => { e.stopPropagation(); onVote(); }}
            whileTap={{ scale: 0.8 }}
            disabled={isOwnPost}
            className={`
              w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300
              ${hasVoted
                ? 'bg-gradient-to-b from-amber-400/20 to-orange-500/20 border border-amber-500/40 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                : 'bg-stone-800/60 light:bg-stone-100 border border-stone-700/40 light:border-stone-300 hover:border-amber-500/30'
              }
              ${isOwnPost ? 'opacity-40 cursor-default' : 'cursor-pointer'}
            `}
          >
            <ChevronUp
              size={18}
              className={`transition-colors duration-300 ${hasVoted ? 'text-amber-400' : 'text-stone-500 light:text-stone-400'}`}
            />
          </motion.button>
          <span className={`text-xs font-semibold tabular-nums ${hasVoted ? 'text-amber-400' : 'text-stone-500'}`}>
            {post.voteCount}
          </span>
        </div>

        {/* Content column */}
        <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
          {/* Category badge + time */}
          <div className={`flex items-center gap-2 mb-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${cat.bg} ${cat.text} ${cat.border} border`}>
              <CategoryIcon size={10} />
              {t(`agora.category${post.category.charAt(0).toUpperCase() + post.category.slice(1)}` as 'agora.categoryIdea')}
            </span>

            {statusCfg && StatusIcon && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusCfg.bg} ${statusCfg.text}`}>
                <StatusIcon size={10} className={post.status === 'in_progress' ? 'animate-spin' : ''} />
                {t(statusCfg.label as 'agora.statusHeard')}
              </span>
            )}

            <span className={`text-[10px] text-stone-600 ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
              {timeAgo(post.createdAt)}
            </span>
          </div>

          {/* Post content */}
          <p className="text-sm text-stone-200 light:text-stone-800 leading-relaxed line-clamp-3">
            {post.content}
          </p>

          {/* Comment count + tap hint */}
          <div className={`flex items-center gap-3 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <MessageCircle size={11} className={post.commentCount > 0 ? 'text-amber-500/60' : 'text-stone-600'} />
              <span className={`text-[10px] ${post.commentCount > 0 ? 'text-amber-500/60 font-medium' : 'text-stone-600'}`}>
                {post.commentCount > 0 ? post.commentCount : ''} {post.commentCount > 0 ? t('agora.comments') : t('agora.tapToRead')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
