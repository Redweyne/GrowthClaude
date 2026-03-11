'use client';

import { motion } from 'framer-motion';
import {
  BookOpen, Calendar, BarChart3, MessageCircle,
  Settings, ChevronRight, ChevronLeft, Fingerprint, Heart,
} from 'lucide-react';
import { useTranslation } from '@/i18n';

interface QuickActionsProps {
  isWeeklyCheckinDue: boolean;
  isMonthlyAssessmentDue: boolean;
  unreadEchoCount: number;
  onOpenTodayPractice: () => void;
  onOpenWeeklyCheckin: () => void;
  onOpenMonthlyAssessment: () => void;
  onOpenBrowseEchoes: () => void;
  onOpenPastLessons: () => void;
  onOpenIdentity: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
}

export function QuickActions({
  isWeeklyCheckinDue,
  isMonthlyAssessmentDue,
  unreadEchoCount,
  onOpenTodayPractice,
  onOpenWeeklyCheckin,
  onOpenMonthlyAssessment,
  onOpenBrowseEchoes,
  onOpenPastLessons,
  onOpenIdentity,
  onOpenStats,
  onOpenSettings,
}: QuickActionsProps) {
  const { t, isRTL } = useTranslation();
  const Chevron = isRTL ? ChevronLeft : ChevronRight;

  return (
    <motion.div
      className="px-5 mt-6 pb-8"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <h3 className="text-sm font-medium uppercase tracking-wider text-stone-500 mb-3">
        {t('profilePage.quickAccess')}
      </h3>

      <div className="space-y-1">
        <NavItem
          icon={<BookOpen className="w-4 h-4" />}
          label={t('profilePage.todaysPractice')}
          onClick={onOpenTodayPractice}
          chevron={<Chevron className="w-4 h-4" />}
        />
        <NavItem
          icon={<Calendar className="w-4 h-4" />}
          label={t('profilePage.weeklyCheckin')}
          onClick={onOpenWeeklyCheckin}
          badge={isWeeklyCheckinDue ? t('profilePage.due') : undefined}
          chevron={<Chevron className="w-4 h-4" />}
        />
        {isMonthlyAssessmentDue && (
          <NavItem
            icon={<Heart className="w-4 h-4" />}
            label={t('profilePage.monthlyAssessment')}
            onClick={onOpenMonthlyAssessment}
            badge={t('profilePage.due')}
            chevron={<Chevron className="w-4 h-4" />}
          />
        )}
        <NavItem
          icon={<MessageCircle className="w-4 h-4" />}
          label={t('profilePage.browseEchoes')}
          onClick={onOpenBrowseEchoes}
          badge={unreadEchoCount > 0 ? `${unreadEchoCount}` : undefined}
          chevron={<Chevron className="w-4 h-4" />}
        />
        <NavItem
          icon={<BookOpen className="w-4 h-4" />}
          label={t('profilePage.pastLessons')}
          onClick={onOpenPastLessons}
          chevron={<Chevron className="w-4 h-4" />}
        />
        <NavItem
          icon={<Fingerprint className="w-4 h-4" />}
          label={t('profilePage.identity')}
          onClick={onOpenIdentity}
          chevron={<Chevron className="w-4 h-4" />}
        />
        <NavItem
          icon={<BarChart3 className="w-4 h-4" />}
          label={t('profilePage.statsDashboard')}
          onClick={onOpenStats}
          chevron={<Chevron className="w-4 h-4" />}
        />
        <NavItem
          icon={<Settings className="w-4 h-4" />}
          label={t('profilePage.settings')}
          onClick={onOpenSettings}
          chevron={<Chevron className="w-4 h-4" />}
        />
      </div>
    </motion.div>
  );
}

function NavItem({
  icon,
  label,
  onClick,
  badge,
  chevron,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  badge?: string;
  chevron: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center w-full gap-3 px-3 py-3 rounded-xl hover:bg-stone-800/50 light:hover:bg-stone-200/50 transition-colors group"
    >
      <span className="text-stone-500 group-hover:text-amber-400 transition-colors">{icon}</span>
      <span className="flex-1 text-sm text-stone-300 light:text-stone-600 text-left">{label}</span>
      {badge && (
        <span className="px-1.5 py-0.5 rounded-full bg-amber-600/20 text-amber-400 text-[10px] font-medium">
          {badge}
        </span>
      )}
      <span className="text-stone-600 group-hover:text-stone-400 transition-colors">{chevron}</span>
    </button>
  );
}
