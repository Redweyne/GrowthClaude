// ═══════════════════════════════════════════════════════════════════════════
// SPARK VIDEO CATALOG
// ═══════════════════════════════════════════════════════════════════════════
//
// Curated motivational YouTube Shorts for the Spark feed.
//
// IMPORTANT: Replace the youtubeId values below with real YouTube Short IDs.
// Each ID is the 11-character string from a YouTube URL:
// https://www.youtube.com/shorts/XXXXXXXXXXX
//
// Curation guidelines:
// - Vertical format (YouTube Shorts, under 60 seconds)
// - Motivational, educational, or wisdom-oriented
// - No explicit content, profanity, or controversial material
// - Diverse voices and perspectives
// - Aligned with growth mindset, Stoic philosophy, and self-improvement
//
// ═══════════════════════════════════════════════════════════════════════════

import type { SparkVideo, SparkCategory } from '@/types/spark';

export const sparkVideos: SparkVideo[] = [
  // ── DISCIPLINE ──────────────────────────────────────────────────────────
  {
    id: 'spark_001',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'discipline',
    creatorName: 'David Goggins',
    caption: 'Stay hard. The only way out is through.',
    tags: ['motivation', 'discipline', 'grind'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_002',
    youtubeId: 'ZXsQAXx_ao0',
    category: 'discipline',
    creatorName: 'Jocko Willink',
    caption: 'Discipline equals freedom.',
    tags: ['discipline', 'freedom', 'military'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_003',
    youtubeId: 'mgmVOuLgFB0',
    category: 'discipline',
    creatorName: 'Andy Frisella',
    caption: 'Win the morning, win the day.',
    tags: ['morning-routine', 'discipline', 'success'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_004',
    youtubeId: 'hPSvdKTEZfg',
    category: 'discipline',
    creatorName: 'Jordan Peterson',
    caption: 'Clean your room. Start with what you can control.',
    tags: ['order', 'responsibility', 'discipline'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_005',
    youtubeId: 'IdTMDpizis8',
    category: 'discipline',
    creatorName: 'Marcus Aurelius',
    caption: 'At dawn, tell yourself: today I shall meet with interference.',
    tags: ['stoicism', 'morning', 'preparation'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_006',
    youtubeId: 'KxGRhd_iWuE',
    category: 'discipline',
    creatorName: 'Navy SEAL Training',
    caption: 'The 40% rule: when your mind says quit, you\'re only 40% done.',
    tags: ['mental-toughness', 'discipline', 'endurance'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_007',
    youtubeId: 'TQMbvJNRpLE',
    category: 'discipline',
    creatorName: 'Atomic Habits',
    caption: 'You don\'t rise to the level of your goals. You fall to the level of your systems.',
    tags: ['habits', 'systems', 'discipline'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_008',
    youtubeId: 'R2_Mn-qRKjA',
    category: 'discipline',
    creatorName: 'Kobe Bryant',
    caption: 'The Mamba Mentality: obsession with being the best.',
    tags: ['excellence', 'obsession', 'discipline'],
    addedAt: '2026-02-01',
  },

  // ── CALM ─────────────────────────────────────────────────────────────────
  {
    id: 'spark_009',
    youtubeId: 'inpok4MKVLM',
    category: 'calm',
    creatorName: 'Alan Watts',
    caption: 'The only way to make sense out of change is to plunge into it.',
    tags: ['zen', 'acceptance', 'calm'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_010',
    youtubeId: 'aALsFhZKg-Q',
    category: 'calm',
    creatorName: 'Thich Nhat Hanh',
    caption: 'Breathing in, I calm my body. Breathing out, I smile.',
    tags: ['meditation', 'breathing', 'mindfulness'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_011',
    youtubeId: 'o49wMEpg0pI',
    category: 'calm',
    creatorName: 'Eckhart Tolle',
    caption: 'Realize deeply that the present moment is all you have.',
    tags: ['presence', 'now', 'calm'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_012',
    youtubeId: 'nMFHa42gMqo',
    category: 'calm',
    creatorName: 'Seneca',
    caption: 'We suffer more in imagination than in reality.',
    tags: ['stoicism', 'anxiety', 'calm'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_013',
    youtubeId: 'qPNaB_aHN8c',
    category: 'calm',
    creatorName: 'Sadhguru',
    caption: 'If you choose, you can be joyful every moment of your life.',
    tags: ['joy', 'choice', 'inner-peace'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_014',
    youtubeId: 'n3Xv_g3g-mA',
    category: 'calm',
    creatorName: 'Meditation Guide',
    caption: 'Let thoughts come and go like clouds in the sky.',
    tags: ['meditation', 'detachment', 'calm'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_015',
    youtubeId: 'lmyZMtPVodo',
    category: 'calm',
    creatorName: 'Marcus Aurelius',
    caption: 'You have power over your mind, not outside events.',
    tags: ['stoicism', 'control', 'serenity'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_016',
    youtubeId: 'PLPkSQKsTk0',
    category: 'calm',
    creatorName: 'Naval Ravikant',
    caption: 'A calm mind, a fit body, a house full of love.',
    tags: ['peace', 'simplicity', 'wisdom'],
    addedAt: '2026-02-01',
  },

  // ── RESILIENCE ──────────────────────────────────────────────────────────
  {
    id: 'spark_017',
    youtubeId: 'D_Vg4uyYwEk',
    category: 'resilience',
    creatorName: 'Nick Vujicic',
    caption: 'If I can do it without arms and legs, what\'s your excuse?',
    tags: ['overcoming', 'no-excuses', 'resilience'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_018',
    youtubeId: 'TN8xJZ22g4o',
    category: 'resilience',
    creatorName: 'Les Brown',
    caption: 'When life knocks you down, try to land on your back. If you can look up, you can get up.',
    tags: ['comeback', 'resilience', 'hope'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_019',
    youtubeId: 'k6_QUhUPrF4',
    category: 'resilience',
    creatorName: 'Epictetus',
    caption: 'It\'s not what happens to you, but how you react that matters.',
    tags: ['stoicism', 'response', 'resilience'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_020',
    youtubeId: 'KZnGSVwIiAs',
    category: 'resilience',
    creatorName: 'Denzel Washington',
    caption: 'Fall seven times, get up eight.',
    tags: ['perseverance', 'resilience', 'success'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_021',
    youtubeId: 'lpROW7QY7E0',
    category: 'resilience',
    creatorName: 'Rocky Balboa',
    caption: 'It ain\'t about how hard you hit. It\'s about how hard you can get hit and keep moving forward.',
    tags: ['grit', 'toughness', 'resilience'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_022',
    youtubeId: 'UNQhuFL6CWg',
    category: 'resilience',
    creatorName: 'Admiral McRaven',
    caption: 'If you want to change the world, start by making your bed.',
    tags: ['small-wins', 'discipline', 'resilience'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_023',
    youtubeId: 'nkQFdjWEdXs',
    category: 'resilience',
    creatorName: 'Brené Brown',
    caption: 'Vulnerability is not weakness. It is our greatest measure of courage.',
    tags: ['vulnerability', 'courage', 'strength'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_024',
    youtubeId: 'z4Rl4MkV5kM',
    category: 'resilience',
    creatorName: 'Viktor Frankl',
    caption: 'Those who have a why to live can bear almost any how.',
    tags: ['purpose', 'meaning', 'endurance'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_025',
    youtubeId: 'v6KHZS_jdLA',
    category: 'resilience',
    creatorName: 'Eric Thomas',
    caption: 'When you want to succeed as bad as you want to breathe, then you\'ll be successful.',
    tags: ['hunger', 'desire', 'resilience'],
    addedAt: '2026-02-01',
  },

  // ── GRATITUDE ───────────────────────────────────────────────────────────
  {
    id: 'spark_026',
    youtubeId: 'UtBsl3j0YRQ',
    category: 'gratitude',
    creatorName: 'Oprah Winfrey',
    caption: 'Be thankful for what you have. You\'ll end up having more.',
    tags: ['gratitude', 'abundance', 'perspective'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_027',
    youtubeId: 'WPPPFqsECz0',
    category: 'gratitude',
    creatorName: 'Seneca',
    caption: 'True happiness is to enjoy the present, without anxious dependence upon the future.',
    tags: ['stoicism', 'presence', 'gratitude'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_028',
    youtubeId: 'gXDMoiEkyuQ',
    category: 'gratitude',
    creatorName: 'Jay Shetty',
    caption: 'Gratitude turns what we have into enough.',
    tags: ['gratitude', 'contentment', 'joy'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_029',
    youtubeId: 'pN34FNbOKXc',
    category: 'gratitude',
    creatorName: 'Perspective Shift',
    caption: 'Someone out there is praying for the things you take for granted.',
    tags: ['perspective', 'gratitude', 'humility'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_030',
    youtubeId: 'JGz_hAYDvkc',
    category: 'gratitude',
    creatorName: 'Marcus Aurelius',
    caption: 'When you arise in the morning, think of what a precious privilege it is to be alive.',
    tags: ['stoicism', 'morning', 'gratitude'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_031',
    youtubeId: 'Hzgzim5m7oU',
    category: 'gratitude',
    creatorName: 'Gratitude Practice',
    caption: 'The root of joy is gratefulness.',
    tags: ['joy', 'gratitude', 'practice'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_032',
    youtubeId: 'WmksT7ggrJ4',
    category: 'gratitude',
    creatorName: 'Rumi',
    caption: 'Wear gratitude like a cloak and it will feed every corner of your life.',
    tags: ['poetry', 'gratitude', 'abundance'],
    addedAt: '2026-02-01',
  },

  // ── MINDSET ─────────────────────────────────────────────────────────────
  {
    id: 'spark_033',
    youtubeId: 'LNHBMFCzznE',
    category: 'mindset',
    creatorName: 'Carol Dweck',
    caption: 'The power of believing that you can improve.',
    tags: ['growth-mindset', 'learning', 'potential'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_034',
    youtubeId: 'H14bBuluwB8',
    category: 'mindset',
    creatorName: 'Tony Robbins',
    caption: 'Where focus goes, energy flows.',
    tags: ['focus', 'energy', 'mindset'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_035',
    youtubeId: 'iCvmsMzlF7o',
    category: 'mindset',
    creatorName: 'Jim Rohn',
    caption: 'You are the average of the five people you spend the most time with.',
    tags: ['environment', 'influence', 'growth'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_036',
    youtubeId: 'TLKxdTmk-zc',
    category: 'mindset',
    creatorName: 'Epictetus',
    caption: 'First say to yourself what you would be; then do what you have to do.',
    tags: ['identity', 'action', 'stoicism'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_037',
    youtubeId: 'Htv6I9Q4Nh4',
    category: 'mindset',
    creatorName: 'Steve Jobs',
    caption: 'Stay hungry. Stay foolish.',
    tags: ['innovation', 'curiosity', 'mindset'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_038',
    youtubeId: 'vEli4dfAXrM',
    category: 'mindset',
    creatorName: 'Ray Dalio',
    caption: 'Pain + Reflection = Progress.',
    tags: ['principles', 'growth', 'reflection'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_039',
    youtubeId: '5MgBikgcWnY',
    category: 'mindset',
    creatorName: 'Naval Ravikant',
    caption: 'Desire is a contract you make with yourself to be unhappy until you get what you want.',
    tags: ['desire', 'contentment', 'wisdom'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_040',
    youtubeId: 'sTJ7AzBIJoI',
    category: 'mindset',
    creatorName: 'Ryan Holiday',
    caption: 'The obstacle is the way.',
    tags: ['stoicism', 'obstacles', 'opportunity'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_041',
    youtubeId: 'kYfNvmF0Bqw',
    category: 'mindset',
    creatorName: 'Miyamoto Musashi',
    caption: 'There is nothing outside of yourself that can enable you to get better, stronger, richer, or smarter.',
    tags: ['self-reliance', 'warrior', 'mindset'],
    addedAt: '2026-02-01',
  },

  // ── FOCUS ───────────────────────────────────────────────────────────────
  {
    id: 'spark_042',
    youtubeId: 'Hu4Yvq-g7_Y',
    category: 'focus',
    creatorName: 'Cal Newport',
    caption: 'Deep work: the ability to focus without distraction on a cognitively demanding task.',
    tags: ['deep-work', 'focus', 'productivity'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_043',
    youtubeId: 'arj7oStGLkU',
    category: 'focus',
    creatorName: 'Andrew Huberman',
    caption: 'Your ability to focus determines the quality of your life.',
    tags: ['neuroscience', 'focus', 'performance'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_044',
    youtubeId: 'Ks-_Mh1QhMc',
    category: 'focus',
    creatorName: 'Bruce Lee',
    caption: 'The successful warrior is the average man with laser-like focus.',
    tags: ['focus', 'martial-arts', 'excellence'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_045',
    youtubeId: 'BQ4yd2W50No',
    category: 'focus',
    creatorName: 'Seneca',
    caption: 'It is not that we have a short time to live, but that we waste a great deal of it.',
    tags: ['time', 'focus', 'stoicism'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_046',
    youtubeId: 'V80-gPkpH6M',
    category: 'focus',
    creatorName: 'Elon Musk',
    caption: 'Focus on signal over noise.',
    tags: ['signal', 'noise', 'focus'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_047',
    youtubeId: 'vJG698U2Mvo',
    category: 'focus',
    creatorName: 'Flow State',
    caption: 'Enter the zone. Lose track of time. Create your masterpiece.',
    tags: ['flow', 'creativity', 'focus'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_048',
    youtubeId: 'UF8uR6Z6KLc',
    category: 'focus',
    creatorName: 'Steve Jobs',
    caption: 'Focus is about saying no to the hundred other good ideas.',
    tags: ['simplicity', 'priorities', 'focus'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_049',
    youtubeId: 'Y6aGHrVQbyg',
    category: 'focus',
    creatorName: 'Meditation Timer',
    caption: 'Train your attention like a muscle. Focus is a skill, not a talent.',
    tags: ['attention', 'training', 'focus'],
    addedAt: '2026-02-01',
  },
  {
    id: 'spark_050',
    youtubeId: 'RcGyVTAoXEU',
    category: 'focus',
    creatorName: 'Marcus Aurelius',
    caption: 'Concentrate every minute on doing what\'s in front of you.',
    tags: ['presence', 'stoicism', 'focus'],
    addedAt: '2026-02-01',
  },
];

/**
 * Get shuffled videos that haven't been watched yet.
 * Falls back to full shuffle if all have been watched.
 */
export function getShuffledSparkVideos(watchedIds: string[]): SparkVideo[] {
  const unwatched = sparkVideos.filter(v => !watchedIds.includes(v.id));
  const pool = unwatched.length > 0 ? unwatched : [...sparkVideos];

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool;
}

/**
 * Get videos filtered by category
 */
export function getVideosByCategory(category: SparkCategory): SparkVideo[] {
  return sparkVideos.filter(v => v.category === category);
}
