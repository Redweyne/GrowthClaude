'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Compass, Zap, MessageCircleHeart, User } from 'lucide-react';
import { useSparkStore } from '@/store/useSparkStore';

export type NavTab = 'home' | 'journey' | 'spark' | 'echoes' | 'profile';

interface BottomNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isSparkUnlocked: boolean;
  unreadEchoCount?: number;
}

const TABS: { id: NavTab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'journey', label: 'Journey', icon: Compass },
  { id: 'spark', label: 'Spark', icon: Zap },
  { id: 'echoes', label: 'Echoes', icon: MessageCircleHeart },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNavBar({
  activeTab,
  onTabChange,
  isSparkUnlocked,
  unreadEchoCount = 0,
}: BottomNavBarProps) {
  const { isForcedClosedToday } = useSparkStore();
  const sparkForcedClosed = isForcedClosedToday();
  const [viewportBottomInset, setViewportBottomInset] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafId = 0;
    const updateViewportInset = () => {
      rafId = 0;
      const viewport = window.visualViewport;
      if (!viewport) {
        setViewportBottomInset(0);
        return;
      }

      const rootStyles = window.getComputedStyle(document.documentElement);
      const safeAreaBottom = Number.parseFloat(
        rootStyles.getPropertyValue('--safe-area-inset-bottom') || '0'
      ) || 0;
      const layoutViewportHeight = Math.max(
        window.innerHeight,
        document.documentElement.clientHeight
      );

      // Keep the nav pinned to the visible viewport when mobile browser chrome
      // expands/collapses (notably iPhone Chrome/Safari).
      const rawInset = Math.max(
        0,
        layoutViewportHeight - viewport.height - viewport.offsetTop
      );
      // `rawInset` can include iOS safe-area; subtract it so we only track
      // browser chrome displacement and avoid a persistent floating gap.
      const nextInset = Math.max(0, Math.round(rawInset - safeAreaBottom));
      setViewportBottomInset((prev) => (prev === nextInset ? prev : nextInset));
    };

    const scheduleUpdate = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(updateViewportInset);
    };

    scheduleUpdate();

    window.addEventListener('resize', scheduleUpdate, { passive: true });
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.visualViewport?.addEventListener('resize', scheduleUpdate);
    window.visualViewport?.addEventListener('scroll', scheduleUpdate);

    return () => {
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('scroll', scheduleUpdate);
      window.visualViewport?.removeEventListener('resize', scheduleUpdate);
      window.visualViewport?.removeEventListener('scroll', scheduleUpdate);
    };
  }, []);

  return (
    <nav
      className="fixed left-0 right-0 z-40"
      style={{
        bottom: `${viewportBottomInset}px`,
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
                aria-label="Spark"
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
                  Spark
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center py-2 px-3 min-w-[60px]"
              aria-label={tab.label}
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
                {tab.label}
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
