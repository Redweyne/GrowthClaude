// ═══════════════════════════════════════════════════════════════════════════
// WORLDS DISPLAY DATA
// Visual metadata for the Worlds selection page
// ═══════════════════════════════════════════════════════════════════════════

export type WorldStatus = 'active' | 'coming-soon' | 'locked';

export interface WorldDisplay {
  id: string;
  slug: string;
  name: {
    en: string;
    fr: string;
    ar: string;
  };
  subtitle: {
    en: string;
    fr: string;
    ar: string;
  };
  status: WorldStatus;
  imagePath: string;
  totalLessons: number;
  themeColor: {
    primary: string;
    glow: string;
    gradient: string;
    border: string;
  };
  order: number;
}

export const worldsDisplayData: WorldDisplay[] = [
  {
    id: 'modern-wisdom',
    slug: 'modern-wisdom',
    name: {
      en: 'Modern Wisdom',
      fr: 'Sagesse Moderne',
      ar: 'الحكمة الحديثة',
    },
    subtitle: {
      en: 'Timeless Knowledge for Today',
      fr: 'Savoir intemporel pour aujourd\'hui',
      ar: 'معرفة خالدة لليوم',
    },
    status: 'active',
    imagePath: '/images/worlds/modern-wisdom.png',
    totalLessons: 15,
    themeColor: {
      primary: '#fbbf24',
      glow: 'rgba(251, 191, 36, 0.4)',
      gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
      border: 'rgba(251, 191, 36, 0.3)',
    },
    order: 0,
  },
  {
    id: 'stoicism',
    slug: 'stoicism',
    name: {
      en: 'Stoicism',
      fr: 'Stoïcisme',
      ar: 'الرواقية',
    },
    subtitle: {
      en: 'Unlock Inner Resilience',
      fr: 'Libérez votre résilience intérieure',
      ar: 'أطلق صلابتك الداخلية',
    },
    status: 'active',
    imagePath: '/images/worlds/stoicism.png',
    totalLessons: 15,
    themeColor: {
      primary: '#6366f1',
      glow: 'rgba(99, 102, 241, 0.4)',
      gradient: 'from-indigo-500/20 via-purple-500/10 to-transparent',
      border: 'rgba(99, 102, 241, 0.3)',
    },
    order: 1,
  },
  {
    id: 'inner-peace',
    slug: 'inner-peace',
    name: {
      en: 'Inner Peace',
      fr: 'Paix Intérieure',
      ar: 'السلام الداخلي',
    },
    subtitle: {
      en: 'Find Your Serenity',
      fr: 'Trouvez votre sérénité',
      ar: 'اعثر على سكينتك',
    },
    status: 'coming-soon',
    imagePath: '/images/worlds/inner-peace.png',
    totalLessons: 15,
    themeColor: {
      primary: '#c084fc',
      glow: 'rgba(192, 132, 252, 0.4)',
      gradient: 'from-purple-400/20 via-pink-400/10 to-transparent',
      border: 'rgba(192, 132, 252, 0.3)',
    },
    order: 2,
  },
  {
    id: 'courage',
    slug: 'courage',
    name: {
      en: 'Courage',
      fr: 'Courage',
      ar: 'الشجاعة',
    },
    subtitle: {
      en: 'Face Your Fears',
      fr: 'Affrontez vos peurs',
      ar: 'واجه مخاوفك',
    },
    status: 'locked',
    imagePath: '/images/worlds/courage.png',
    totalLessons: 15,
    themeColor: {
      primary: '#f97316',
      glow: 'rgba(249, 115, 22, 0.4)',
      gradient: 'from-orange-500/20 via-amber-500/10 to-transparent',
      border: 'rgba(249, 115, 22, 0.3)',
    },
    order: 3,
  },
  {
    id: 'purpose',
    slug: 'purpose',
    name: {
      en: 'Purpose',
      fr: 'Dessein',
      ar: 'الهدف',
    },
    subtitle: {
      en: 'Discover Your Path',
      fr: 'Découvrez votre voie',
      ar: 'اكتشف طريقك',
    },
    status: 'locked',
    imagePath: '/images/worlds/purpose.png',
    totalLessons: 15,
    themeColor: {
      primary: '#34d399',
      glow: 'rgba(52, 211, 153, 0.4)',
      gradient: 'from-emerald-400/20 via-teal-400/10 to-transparent',
      border: 'rgba(52, 211, 153, 0.3)',
    },
    order: 4,
  },
];
