'use client';

import { motion } from 'framer-motion';
import { Home, Compass, Globe, Zap, ListChecks, MessageCircleHeart, User } from 'lucide-react';
import { useSparkStore } from '@/store/useSparkStore';
import { useTranslation } from '@/i18n';

export type NavTab = 'home' | 'journey' | 'worlds' | 'spark' | 'tasks' | 'echoes' | 'profile';

interface BottomNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isSparkUnlocked: boolean;
  unreadEchoCount?: number;
}

const TABS: { id: NavTab; icon: typeof Home }[] = [
  { id: 'home', icon: Home },
  { id: 'journey', icon: Compass },
  { id: 'worlds', icon: Globe },
  { id: 'spark', icon: Zap },
  { id: 'tasks', icon: ListChecks },
  { id: 'echoes', icon: MessageCircleHeart },
  { id: 'profile', icon: User },
];

const COPY_BY_LOCALE = {
  en: {
    home: 'Home',
    journey: 'Journey',
    worlds: 'Worlds',
    spark: 'Spark',
    tasks: 'Tasks',
    echoes: 'Echoes',
    profile: 'Profile',
  },
  fr: {
    home: 'Accueil',
    journey: 'Parcours',
    worlds: 'Mondes',
    spark: 'Étincelle',
    tasks: 'Tâches',
    echoes: 'Échos',
    profile: 'Profil',
  },
  ar: {
    home: 'الرئيسية',
    journey: 'الرحلة',
    worlds: 'العوالم',
    spark: 'الشرارة',
    tasks: 'المهام',
    echoes: 'الأصداء',
    profile: 'الملف الشخصي',
  },
} as const;

export function BottomNavBar({
  activeTab,
  onTabChange,
  isSparkUnlocked,
  unreadEchoCount = 0,
}: BottomNavBarProps) {
  const { isForcedClosedToday } = useSparkStore();
  const { locale } = useTranslation();
  const sparkForcedClosed = isForcedClosedToday();
  const copy = COPY_BY_LOCALE[locale] ?? COPY_BY_LOCALE.en;

  return (
    <nav
      className="relative z-40 shrink-0"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 6px)',
      }}
    >
      <div className="absolute inset-0 bg-stone-950/90 light:bg-stone-50/90 backdrop-blur-xl border-t border-stone-800/60 light:border-stone-300/80" />

      <div className="relative max-w-lg mx-auto flex items-end justify-around px-2 pt-1 pb-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const isSpark = tab.id === 'spark';
          const Icon = tab.icon;

          if (isSpark) {
            const isLocked = !isSparkUnlocked;
            const isDone = sparkForcedClosed;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center -mt-4"
                aria-label={copy.spark}
              >
                <motion.div
                  className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                    isActive
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                      : isLocked || isDone
                        ? 'bg-stone-800 border border-stone-700 light:bg-stone-200 light:border-stone-300'
                        : 'bg-gradient-to-br from-amber-500/80 to-orange-500/80'
                  }`}
                  whileTap={{ scale: 0.9 }}
                  animate={
                    !isLocked && !isDone && !isActive
                      ? {
                          boxShadow: [
                            '0 0 0px rgba(251,191,36,0)',
                            '0 0 20px rgba(251,191,36,0.3)',
                            '0 0 0px rgba(251,191,36,0)',
                          ],
                        }
                      : {}
                  }
                  transition={
                    !isLocked && !isDone && !isActive
                      ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                      : { duration: 0.15 }
                  }
                >
                  <Zap
                    size={24}
                    className={
                      isActive
                        ? 'text-stone-950'
                        : isLocked || isDone
                          ? 'text-stone-600 light:text-stone-500'
                          : 'text-stone-950'
                    }
                    fill={isActive || (!isLocked && !isDone) ? 'currentColor' : 'none'}
                  />
                </motion.div>

                <span
                  className={`text-[10px] mt-1 font-medium ${
                    isActive
                      ? 'text-amber-400'
                      : isLocked || isDone
                        ? 'text-stone-700 light:text-stone-500'
                        : 'text-stone-400 light:text-stone-600'
                  }`}
                >
                  {copy.spark}
                </span>
              </button>
            );
          }

          const label = copy[tab.id];

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center py-2 px-1 min-w-[44px]"
              aria-label={label}
            >
              <motion.div
                className="relative"
                whileTap={{ scale: 0.85 }}
                transition={{ duration: 0.1 }}
              >
                <Icon
                  size={22}
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-white light:text-stone-900' : 'text-stone-500 light:text-stone-700'
                  }`}
                  fill={isActive ? 'currentColor' : 'none'}
                  strokeWidth={isActive ? 2.5 : 2}
                />

                {tab.id === 'echoes' && unreadEchoCount > 0 && (
                  <motion.div
                    className="absolute -top-1 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-500 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                  >
                    <span className="text-[9px] font-bold text-white">
                      {unreadEchoCount > 99 ? '99+' : unreadEchoCount}
                    </span>
                  </motion.div>
                )}
              </motion.div>

              <span
                className={`text-[10px] mt-1 font-medium transition-colors duration-200 ${
                  isActive ? 'text-white light:text-stone-900' : 'text-stone-600 light:text-stone-700'
                }`}
              >
                {label}
              </span>

              {isActive && (
                <motion.div
                  className="absolute -bottom-0 w-1 h-1 rounded-full bg-white light:bg-stone-900"
                  layoutId="activeTabDot"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNavBar;
