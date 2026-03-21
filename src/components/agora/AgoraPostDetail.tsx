'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronUp, Send, MessageCircle, Lightbulb, Bug, Heart, HelpCircle, CheckCircle2, Eye, Loader2 } from 'lucide-react';
import { useAgoraStore } from '@/store/useAgoraStore';
import { useStore } from '@/store/useStore';
import type { AgoraPost, AgoraStatus } from '@/types/agora';
import { useTranslation } from '@/i18n';
import { useHaptics } from '@/hooks/useHaptics';

interface AgoraPostDetailProps {
  post: AgoraPost;
  hasVoted: boolean;
  onVote: () => void;
  onClose: () => void;
}

const CATEGORY_CONFIG = {
  idea: { icon: Lightbulb, bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
  bug: { icon: Bug, bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
  love: { icon: Heart, bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-400' },
  question: { icon: HelpCircle, bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
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

export function AgoraPostDetail({ post, hasVoted, onVote, onClose }: AgoraPostDetailProps) {
  const { t, isRTL } = useTranslation();
  const { hapticLight, hapticSuccess } = useHaptics();
  const userId = useStore((s) => s.userId);
  const { comments, commentsLoading, fetchComments, addComment, clearComments } = useAgoraStore();

  const [commentText, setCommentText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const cat = CATEGORY_CONFIG[post.category];
  const CategoryIcon = cat.icon;
  const statusCfg = post.status !== 'open' ? STATUS_CONFIG[post.status] : null;
  const StatusIcon = statusCfg?.icon;
  const isOwnPost = post.userId === userId;

  useEffect(() => {
    fetchComments(post.id);
    return () => clearComments();
  }, [post.id, fetchComments, clearComments]);

  // Scroll to bottom when new comments arrive
  useEffect(() => {
    if (comments.length > 0) {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments.length]);

  const handleSendComment = async () => {
    if (!userId || !commentText.trim() || isSending) return;
    setIsSending(true);
    hapticLight();
    try {
      await addComment(userId, post.id, commentText.trim());
      setCommentText('');
      hapticSuccess();
    } catch {
      // silent
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.97 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg mx-4 mb-4 sm:mb-0 max-h-[85vh] flex flex-col bg-stone-900/95 light:bg-white/95 backdrop-blur-xl border border-stone-800/60 light:border-stone-200 rounded-3xl overflow-hidden"
      >
        {/* ── Header ── */}
        <div className={`flex items-center justify-between p-5 pb-3 border-b border-stone-800/40 light:border-stone-200 flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
            <span className="text-[10px] text-stone-600">{timeAgo(post.createdAt)}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800/60 light:bg-stone-100 flex items-center justify-center hover:bg-stone-700 light:hover:bg-stone-200 transition-colors"
          >
            <X size={16} className="text-stone-400" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Post content + vote */}
          <div className={`p-5 flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Vote column */}
            <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
              <motion.button
                onClick={(e) => { e.stopPropagation(); onVote(); }}
                whileTap={{ scale: 0.8 }}
                disabled={isOwnPost}
                className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                  ${hasVoted
                    ? 'bg-gradient-to-b from-amber-400/20 to-orange-500/20 border border-amber-500/40 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                    : 'bg-stone-800/60 light:bg-stone-100 border border-stone-700/40 light:border-stone-300 hover:border-amber-500/30'
                  }
                  ${isOwnPost ? 'opacity-40 cursor-default' : 'cursor-pointer'}
                `}
              >
                <ChevronUp
                  size={20}
                  className={`transition-colors duration-300 ${hasVoted ? 'text-amber-400' : 'text-stone-500 light:text-stone-400'}`}
                />
              </motion.button>
              <span className={`text-sm font-semibold tabular-nums ${hasVoted ? 'text-amber-400' : 'text-stone-500'}`}>
                {post.voteCount}
              </span>
            </div>

            {/* Full content */}
            <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
              <p className="text-[15px] text-stone-200 light:text-stone-800 leading-relaxed">
                {post.content}
              </p>
              {!post.userId && (
                <span className="inline-block mt-3 text-[10px] text-stone-600 bg-stone-800/40 light:bg-stone-100 px-2 py-0.5 rounded-full">
                  {t('agora.communityVoice')}
                </span>
              )}
            </div>
          </div>

          {/* ── Comments divider ── */}
          <div className={`px-5 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <MessageCircle size={14} className="text-stone-600" />
            <span className="text-xs text-stone-500 font-medium">
              {t('agora.comments')} ({comments.length})
            </span>
            <div className="flex-1 h-px bg-stone-800/40 light:bg-stone-200" />
          </div>

          {/* ── Comments list ── */}
          <div className="px-5 py-3 space-y-3">
            {commentsLoading ? (
              <div className="flex justify-center py-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 rounded-full border-2 border-amber-500/30 border-t-amber-400"
                />
              </div>
            ) : comments.length === 0 ? (
              <p className={`text-sm text-stone-600 py-6 text-center ${isRTL ? 'text-right' : ''}`}>
                {t('agora.noCommentsYet')}
              </p>
            ) : (
              comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar placeholder */}
                  <div className="w-7 h-7 rounded-full bg-stone-800 light:bg-stone-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] text-stone-500 font-semibold">
                      {comment.userId ? '👤' : '✦'}
                    </span>
                  </div>
                  <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 mb-0.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[11px] font-medium text-stone-400">
                        {comment.userId === userId ? t('agora.you') : t('agora.member')}
                      </span>
                      <span className="text-[10px] text-stone-600">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-stone-300 light:text-stone-700 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
            <div ref={commentsEndRef} />
          </div>
        </div>

        {/* ── Comment input ── */}
        <div className={`flex items-center gap-2 p-4 border-t border-stone-800/40 light:border-stone-200 flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value.slice(0, 300))}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendComment(); } }}
            placeholder={t('agora.writeComment')}
            dir={isRTL ? 'rtl' : 'ltr'}
            className="flex-1 rounded-xl px-4 py-2.5 bg-stone-800/60 light:bg-stone-100 border border-stone-700/40 light:border-stone-300 text-sm text-stone-200 light:text-stone-800 placeholder:text-stone-600 focus:border-amber-500/40 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
          <motion.button
            onClick={handleSendComment}
            whileTap={{ scale: 0.9 }}
            disabled={!commentText.trim() || isSending}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              commentText.trim()
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-stone-950 shadow-lg shadow-amber-500/20'
                : 'bg-stone-800/60 text-stone-600 cursor-not-allowed'
            }`}
          >
            <Send size={16} className={isRTL ? 'rotate-180' : ''} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
