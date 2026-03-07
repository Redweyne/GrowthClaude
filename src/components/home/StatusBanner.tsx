'use client';

import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Zap, ChevronRight, Sparkles } from 'lucide-react';
import { useTranslation } from '@/i18n';

// ═══════════════════════════════════════════════════════════════════════════
// STATUS BANNER
// Beautiful, attention-grabbing banners for weekly check-ins and assessments
// Features gradient backgrounds, animated accents, and clear calls to action
// ═══════════════════════════════════════════════════════════════════════════

interface StatusBannerProps {
  variant: 'checkin' | 'assessment';
  onClick: () => void;
}

// Spring configurations
const springs = {
  responsive: { type: 'spring' as const, stiffness: 300, damping: 20 },
};

// Banner configurations
const bannerConfigs = {
  checkin: {
    icon: Calendar,
    title: 'Weekly Check-in',
    subtitle: 'Reflect on your growth this week',
    xp: 50,
    gradientFrom: 'rgba(251, 113, 133, 0.15)',
    gradientTo: 'rgba(236, 72, 153, 0.1)',
    borderColor: 'rgba(251, 113, 133, 0.25)',
    iconBg: 'rgba(251, 113, 133, 0.15)',
    iconColor: '#fb7185',
    accentColor: '#fb7185',
    glowColor: 'rgba(251, 113, 133, 0.3)',
  },
  assessment: {
    icon: TrendingUp,
    title: 'Monthly Assessment',
    subtitle: 'Measure your transformation',
    xp: 100,
    gradientFrom: 'rgba(167, 139, 250, 0.15)',
    gradientTo: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(167, 139, 250, 0.25)',
    iconBg: 'rgba(167, 139, 250, 0.15)',
    iconColor: '#a78bfa',
    accentColor: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.3)',
  },
};

const BANNER_COPY_BY_LOCALE = {
  en: {
    checkin: {
      title: 'Weekly Check-in',
      subtitle: 'Reflect on your growth this week',
    },
    assessment: {
      title: 'Monthly Assessment',
      subtitle: 'Measure your transformation',
    },
  },
  fr: {
    checkin: {
      title: 'Bilan hebdomadaire',
      subtitle: 'Réfléchissez à votre progression cette semaine',
    },
    assessment: {
      title: 'Évaluation mensuelle',
      subtitle: 'Mesurez votre transformation',
    },
  },
  ar: {
    checkin: {
      title: 'مراجعة أسبوعية',
      subtitle: 'تأمل نموك هذا الأسبوع',
    },
    assessment: {
      title: 'تقييم شهري',
      subtitle: 'قم بقياس تحوّلك',
    },
  },
} as const;

export function StatusBanner({ variant, onClick }: StatusBannerProps) {
  const { locale } = useTranslation();
  const copy = BANNER_COPY_BY_LOCALE[locale] ?? BANNER_COPY_BY_LOCALE.en;
  const config = bannerConfigs[variant];
  const localizedContent = copy[variant];
  const Icon = config.icon;

  return (
    <motion.button
      onClick={onClick}
      className="relative w-full overflow-hidden rounded-2xl group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.responsive}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${config.gradientFrom} 0%, ${config.gradientTo} 100%)`,
        }}
      />

      {/* Border */}
      <div
        className="absolute inset-0 rounded-2xl transition-colors duration-300"
        style={{
          border: `1px solid ${config.borderColor}`,
        }}
      />

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: `0 0 30px ${config.glowColor}`,
        }}
      />

      {/* Animated gradient sweep on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${config.glowColor} 50%, transparent 100%)`,
        }}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Content */}
      <div className="relative p-4 flex items-center justify-between">
        {/* Left section - Icon and text */}
        <div className="flex items-center gap-4">
          {/* Icon container with glow */}
          <motion.div
            className="relative w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: config.iconBg,
            }}
            animate={{
              boxShadow: [
                `0 0 10px ${config.glowColor}`,
                `0 0 20px ${config.glowColor}`,
                `0 0 10px ${config.glowColor}`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Icon size={22} style={{ color: config.iconColor }} />

            {/* Sparkle accent */}
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Sparkles size={12} style={{ color: config.accentColor }} />
            </motion.div>
          </motion.div>

          {/* Text */}
          <div className="text-left">
            <h3 className="text-base font-semibold text-stone-100 light:text-stone-900">
              {localizedContent.title}
            </h3>
            <p className="text-sm text-stone-500 light:text-stone-600">
              {localizedContent.subtitle}
            </p>
          </div>
        </div>

        {/* Right section - XP reward and arrow */}
        <div className="flex items-center gap-3">
          {/* XP badge */}
          <motion.div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/20"
            whileHover={{ scale: 1.05 }}
          >
            <Zap size={14} className="text-amber-400" />
            <span className="text-sm font-semibold text-amber-300">
              +{config.xp}
            </span>
          </motion.div>

          {/* Arrow */}
          <motion.div
            className="w-8 h-8 rounded-full bg-stone-800/50 light:bg-stone-200/50 flex items-center justify-center"
            animate={{
              x: [0, 3, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ChevronRight size={16} style={{ color: config.iconColor }} />
          </motion.div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, transparent, ${config.accentColor}60, transparent)`,
        }}
      />
    </motion.button>
  );
}

export default StatusBanner;
