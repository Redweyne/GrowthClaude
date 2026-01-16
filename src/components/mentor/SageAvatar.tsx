'use client';

import { motion } from 'framer-motion';

export type SageMood = 'neutral' | 'happy' | 'proud' | 'thinking' | 'encouraging' | 'celebrating' | 'disappointed' | 'wise';

interface SageAvatarProps {
  mood?: SageMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 80,
  md: 120,
  lg: 160,
  xl: 200,
};

export function SageAvatar({ mood = 'neutral', size = 'md', animate = true, className = '' }: SageAvatarProps) {
  const pixelSize = sizeMap[size];

  // Eye expressions based on mood
  const getEyes = () => {
    switch (mood) {
      case 'happy':
      case 'celebrating':
        return 'happy';
      case 'proud':
      case 'wise':  // Wise has half-closed, serene eyes
        return 'closed';
      case 'thinking':
        return 'looking';
      case 'disappointed':
        return 'sad';
      default:
        return 'normal';
    }
  };

  // Mouth shape based on mood
  const getMouth = () => {
    switch (mood) {
      case 'happy':
      case 'celebrating':
        return 'M 42 68 Q 50 76 58 68';
      case 'proud':
      case 'encouraging':
        return 'M 44 68 Q 50 73 56 68';
      case 'wise':  // Wise has a subtle, knowing smile
        return 'M 44 68 Q 50 72 56 68';
      case 'thinking':
        return 'M 46 69 Q 50 67 54 69';
      case 'disappointed':
        return 'M 44 72 Q 50 68 56 72';
      default:
        return 'M 45 68 Q 50 72 55 68';
    }
  };

  const eyeType = getEyes();
  const showSparkles = mood === 'celebrating';
  const showThought = mood === 'thinking';

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
      animate={animate ? { y: [0, -4, 0] } : undefined}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Glow for celebrating */}
      {showSparkles && (
        <motion.div
          className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Face skin gradient */}
          <linearGradient id="skinFace" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FDEBD0" />
            <stop offset="100%" stopColor="#F5CBA7" />
          </linearGradient>

          {/* Robe gradient */}
          <linearGradient id="robeColor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9B59B6" />
            <stop offset="100%" stopColor="#6C3483" />
          </linearGradient>

          {/* White hair/beard */}
          <linearGradient id="hairWhite" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#D5D8DC" />
          </linearGradient>

          {/* Shadow */}
          <filter id="glow">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2"/>
          </filter>
        </defs>

        {/* === ROBE === */}
        <ellipse cx="50" cy="95" rx="32" ry="18" fill="url(#robeColor)" />
        <path
          d="M 25 85 Q 25 70 35 65 L 50 60 L 65 65 Q 75 70 75 85 L 75 100 L 25 100 Z"
          fill="url(#robeColor)"
          filter="url(#glow)"
        />

        {/* Robe collar */}
        <path d="M 40 63 L 50 70 L 60 63" stroke="#5B2C6F" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Gold clasp */}
        <circle cx="50" cy="68" r="4" fill="#F4D03F" />
        <circle cx="48" cy="66" r="1.5" fill="#FEF9E7" />

        {/* === HAIR (behind head) === */}
        <ellipse cx="50" cy="32" rx="28" ry="22" fill="url(#hairWhite)" />

        {/* === FACE - ONE CONTINUOUS SHAPE === */}
        {/* This is the key - face and beard are ONE path, no gaps */}
        <path
          d="M 26 45
             C 26 28 38 18 50 18
             C 62 18 74 28 74 45
             C 74 52 72 58 68 62
             L 68 65
             C 68 75 62 82 50 88
             C 38 82 32 75 32 65
             L 32 62
             C 28 58 26 52 26 45
             Z"
          fill="url(#skinFace)"
          filter="url(#glow)"
        />

        {/* === BEARD OVERLAY (same shape, white) === */}
        <path
          d="M 30 55
             C 30 55 32 58 32 62
             L 32 65
             C 32 75 38 82 50 88
             C 62 82 68 75 68 65
             L 68 62
             C 68 58 70 55 70 55
             C 65 58 57 60 50 60
             C 43 60 35 58 30 55
             Z"
          fill="url(#hairWhite)"
        />

        {/* Beard texture lines */}
        <path d="M 40 65 Q 42 75 46 84" stroke="#BDC3C7" strokeWidth="1" opacity="0.5" fill="none" />
        <path d="M 50 62 L 50 85" stroke="#BDC3C7" strokeWidth="1" opacity="0.5" fill="none" />
        <path d="M 60 65 Q 58 75 54 84" stroke="#BDC3C7" strokeWidth="1" opacity="0.5" fill="none" />

        {/* === MUSTACHE === */}
        <path
          d="M 38 54 Q 44 58 50 55 Q 56 58 62 54"
          fill="url(#hairWhite)"
        />

        {/* === EYEBROWS === */}
        <path
          d={mood === 'happy' || mood === 'celebrating'
            ? 'M 35 36 Q 41 32 47 36'
            : mood === 'disappointed'
            ? 'M 36 34 Q 41 38 46 36'
            : 'M 35 36 Q 41 34 47 37'}
          stroke="#AAB7B8"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={mood === 'happy' || mood === 'celebrating'
            ? 'M 53 36 Q 59 32 65 36'
            : mood === 'disappointed'
            ? 'M 54 36 Q 59 38 64 34'
            : 'M 53 37 Q 59 34 65 36'}
          stroke="#AAB7B8"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* === EYES === */}
        {eyeType === 'happy' && (
          <>
            <path d="M 36 43 Q 41 38 46 43" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 54 43 Q 59 38 64 43" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        )}
        {eyeType === 'closed' && (
          <>
            <path d="M 36 42 L 46 42" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 54 42 L 64 42" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}
        {eyeType === 'looking' && (
          <>
            <ellipse cx="41" cy="42" rx="6" ry="7" fill="white" />
            <ellipse cx="41" cy="40" rx="4" ry="5" fill="#2C3E50" />
            <circle cx="40" cy="38" r="1.5" fill="white" />
            <ellipse cx="59" cy="42" rx="6" ry="7" fill="white" />
            <ellipse cx="59" cy="40" rx="4" ry="5" fill="#2C3E50" />
            <circle cx="58" cy="38" r="1.5" fill="white" />
          </>
        )}
        {eyeType === 'sad' && (
          <>
            <ellipse cx="41" cy="43" rx="5" ry="6" fill="white" />
            <ellipse cx="41" cy="44" rx="3.5" ry="4.5" fill="#2C3E50" />
            <circle cx="40" cy="42" r="1.5" fill="white" />
            <ellipse cx="59" cy="43" rx="5" ry="6" fill="white" />
            <ellipse cx="59" cy="44" rx="3.5" ry="4.5" fill="#2C3E50" />
            <circle cx="58" cy="42" r="1.5" fill="white" />
          </>
        )}
        {eyeType === 'normal' && (
          <>
            <ellipse cx="41" cy="42" rx="6" ry="7" fill="white" />
            <ellipse cx="41" cy="43" rx="4" ry="5" fill="#2C3E50" />
            <circle cx="39" cy="41" r="2" fill="white" />
            <circle cx="42" cy="45" r="1" fill="white" opacity="0.5" />
            <ellipse cx="59" cy="42" rx="6" ry="7" fill="white" />
            <ellipse cx="59" cy="43" rx="4" ry="5" fill="#2C3E50" />
            <circle cx="57" cy="41" r="2" fill="white" />
            <circle cx="60" cy="45" r="1" fill="white" opacity="0.5" />
          </>
        )}

        {/* === NOSE === */}
        <path d="M 48 48 Q 50 52 52 48" stroke="#D5A67A" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* === MOUTH === */}
        <path
          d={getMouth()}
          stroke="#7B4B3A"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill={mood === 'celebrating' ? '#F5B7B1' : 'none'}
        />

        {/* === EARS === */}
        <ellipse cx="26" cy="45" rx="4" ry="6" fill="#F5CBA7" />
        <ellipse cx="74" cy="45" rx="4" ry="6" fill="#F5CBA7" />

        {/* === CHEEK BLUSH === */}
        {(mood === 'happy' || mood === 'celebrating' || mood === 'encouraging') && (
          <>
            <ellipse cx="32" cy="50" rx="5" ry="3" fill="#F5B7B1" opacity="0.6" />
            <ellipse cx="68" cy="50" rx="5" ry="3" fill="#F5B7B1" opacity="0.6" />
          </>
        )}

        {/* === SPARKLES === */}
        {showSparkles && (
          <>
            <motion.circle
              cx="18" cy="25" r="3"
              fill="#F4D03F"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.circle
              cx="82" cy="20" r="2.5"
              fill="#F5B041"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
            />
            <motion.circle
              cx="15" cy="55" r="2"
              fill="#F4D03F"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
            />
            <motion.circle
              cx="85" cy="50" r="2.5"
              fill="#F5B041"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.9 }}
            />
          </>
        )}

        {/* === THOUGHT BUBBLES === */}
        {showThought && (
          <>
            <motion.circle
              cx="80" cy="28" r="4"
              fill="#D6EAF8"
              animate={{ y: [0, -2, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx="86" cy="18" r="3"
              fill="#EBF5FB"
              animate={{ y: [0, -3, 0], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            />
            <motion.circle
              cx="90" cy="10" r="2"
              fill="#EBF5FB"
              animate={{ y: [0, -2, 0], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            />
          </>
        )}

        {/* === SWEAT DROP === */}
        {mood === 'disappointed' && (
          <motion.path
            d="M 75 38 Q 77 42 75 46 Q 73 42 75 38"
            fill="#85C1E9"
            animate={{ y: [0, 2, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </svg>
    </motion.div>
  );
}

export default SageAvatar;
