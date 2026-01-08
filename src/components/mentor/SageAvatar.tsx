'use client';

import { motion } from 'framer-motion';

export type SageMood = 'neutral' | 'happy' | 'proud' | 'thinking' | 'encouraging' | 'celebrating' | 'disappointed';

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

  // Get mouth shape based on mood
  const getMouthPath = () => {
    switch (mood) {
      case 'happy':
      case 'celebrating':
        return { d: 'M 36 54 Q 50 66 64 54', fill: 'none' };
      case 'proud':
        return { d: 'M 40 54 Q 50 60 60 54', fill: 'none' };
      case 'thinking':
        return { d: 'M 44 55 Q 50 53 56 55', fill: 'none' };
      case 'disappointed':
        return { d: 'M 40 58 Q 50 52 60 58', fill: 'none' };
      case 'encouraging':
        return { d: 'M 38 54 Q 50 64 62 54', fill: 'none' };
      default:
        return { d: 'M 42 54 Q 50 60 58 54', fill: 'none' };
    }
  };

  // Eye rendering based on mood
  const getEyeProps = () => {
    switch (mood) {
      case 'happy':
      case 'celebrating':
        return { type: 'happy' as const };
      case 'proud':
        return { type: 'closed' as const };
      case 'thinking':
        return { type: 'lookUp' as const };
      case 'disappointed':
        return { type: 'sad' as const };
      default:
        return { type: 'open' as const };
    }
  };

  const eyeProps = getEyeProps();
  const mouth = getMouthPath();

  const renderEye = (cx: number, cy: number) => {
    switch (eyeProps.type) {
      case 'happy':
        return (
          <path
            d={`M ${cx - 5} ${cy} Q ${cx} ${cy - 5} ${cx + 5} ${cy}`}
            stroke="#1a1a2e"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        );
      case 'closed':
        return (
          <path
            d={`M ${cx - 5} ${cy} L ${cx + 5} ${cy}`}
            stroke="#1a1a2e"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      case 'lookUp':
        return (
          <g>
            <ellipse cx={cx} cy={cy} rx="7" ry="8" fill="white" />
            <ellipse cx={cx} cy={cy - 2} rx="4.5" ry="5.5" fill="#1a1a2e" />
            <circle cx={cx - 1.5} cy={cy - 4} r="2" fill="white" />
          </g>
        );
      case 'sad':
        return (
          <g>
            <ellipse cx={cx} cy={cy} rx="7" ry="8" fill="white" />
            <ellipse cx={cx} cy={cy + 1} rx="4.5" ry="5.5" fill="#1a1a2e" />
            <circle cx={cx - 1.5} cy={cy - 1} r="2" fill="white" />
          </g>
        );
      default: // open
        return (
          <g>
            <ellipse cx={cx} cy={cy} rx="7" ry="8" fill="white" />
            <ellipse cx={cx} cy={cy} rx="4.5" ry="5.5" fill="#1a1a2e" />
            <circle cx={cx - 1.5} cy={cy - 2} r="2" fill="white" />
            <circle cx={cx + 1} cy={cy + 1} r="1" fill="white" opacity="0.5" />
          </g>
        );
    }
  };

  const showBlush = mood === 'happy' || mood === 'celebrating' || mood === 'encouraging';
  const showSparkles = mood === 'celebrating';

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
      animate={animate ? { y: [0, -3, 0] } : undefined}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Glow effect for celebrating */}
      {showSparkles && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 60%)',
            transform: 'scale(1.3)',
          }}
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1.3, 1.4, 1.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
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
          {/* Skin gradient */}
          <radialGradient id="skinGrad" cx="45%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFE8D6" />
            <stop offset="70%" stopColor="#F5D5C0" />
            <stop offset="100%" stopColor="#E8C4A8" />
          </radialGradient>

          {/* Robe gradient */}
          <linearGradient id="robeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>

          {/* Hair/Beard gradient */}
          <linearGradient id="hairGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E8E8E8" />
          </linearGradient>

          {/* Gold gradient */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Shadow filter */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15"/>
          </filter>
        </defs>

        {/* === ROBE/BODY === */}
        <path
          d="M 18 100 Q 18 75 30 65 Q 40 58 50 58 Q 60 58 70 65 Q 82 75 82 100 Z"
          fill="url(#robeGrad)"
          filter="url(#shadow)"
        />

        {/* Robe highlight */}
        <path
          d="M 30 68 Q 40 60 50 58 L 45 85 L 25 90 Z"
          fill="white"
          opacity="0.15"
        />

        {/* Collar */}
        <path d="M 38 64 L 50 72 L 62 64" stroke="#5B21B6" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Gold brooch */}
        <circle cx="50" cy="70" r="4" fill="url(#goldGrad)" filter="url(#shadow)" />
        <circle cx="48.5" cy="68.5" r="1.5" fill="white" opacity="0.7" />

        {/* === HAIR (behind) === */}
        <ellipse cx="50" cy="28" rx="26" ry="22" fill="url(#hairGrad)" />

        {/* === HEAD === */}
        <ellipse cx="50" cy="35" rx="24" ry="23" fill="url(#skinGrad)" filter="url(#shadow)" />

        {/* Forehead highlight */}
        <ellipse cx="45" cy="28" rx="10" ry="8" fill="white" opacity="0.12" />

        {/* === EARS === */}
        <ellipse cx="26" cy="38" rx="4" ry="6" fill="#F5D5C0" />
        <ellipse cx="74" cy="38" rx="4" ry="6" fill="#F5D5C0" />

        {/* === EYEBROWS === */}
        <path
          d={mood === 'happy' || mood === 'celebrating'
            ? 'M 32 30 Q 40 26 48 30'
            : mood === 'disappointed'
            ? 'M 34 28 Q 40 32 46 30'
            : 'M 32 31 Q 40 28 48 31'}
          stroke="#A0A0A0"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={mood === 'happy' || mood === 'celebrating'
            ? 'M 52 30 Q 60 26 68 30'
            : mood === 'disappointed'
            ? 'M 54 30 Q 60 32 66 28'
            : 'M 52 31 Q 60 28 68 31'}
          stroke="#A0A0A0"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* === EYES === */}
        {renderEye(40, 40)}
        {renderEye(60, 40)}

        {/* === BLUSH === */}
        {showBlush && (
          <>
            <ellipse cx="30" cy="46" rx="5" ry="3" fill="#FFB4B4" opacity="0.5" />
            <ellipse cx="70" cy="46" rx="5" ry="3" fill="#FFB4B4" opacity="0.5" />
          </>
        )}

        {/* === NOSE === */}
        <path d="M 48 45 Q 50 50 52 45" stroke="#D4A88A" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* === MUSTACHE (connects face to beard) === */}
        <path
          d="M 36 52 Q 43 56 50 54 Q 57 56 64 52"
          fill="url(#hairGrad)"
        />

        {/* === BEARD (connected to face) === */}
        <path
          d="M 28 48
             Q 28 50 30 52
             L 36 52
             Q 43 56 50 54
             Q 57 56 64 52
             L 70 52
             Q 72 50 72 48
             Q 72 65 60 75
             Q 54 80 50 82
             Q 46 80 40 75
             Q 28 65 28 48
             Z"
          fill="url(#hairGrad)"
          filter="url(#shadow)"
        />

        {/* Beard detail lines */}
        <path d="M 35 58 Q 38 68 42 76" stroke="#D8D8D8" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M 50 56 L 50 78" stroke="#D8D8D8" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M 65 58 Q 62 68 58 76" stroke="#D8D8D8" strokeWidth="1" fill="none" opacity="0.5" />

        {/* === MOUTH (in front of beard) === */}
        <path
          d={mouth.d}
          stroke="#8B5A3C"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill={mood === 'celebrating' ? '#FDE68A' : 'none'}
        />

        {/* Open mouth for celebrating */}
        {mood === 'celebrating' && (
          <>
            <ellipse cx="50" cy="58" rx="6" ry="4" fill="#5C3D2E" />
            <ellipse cx="50" cy="60" rx="4" ry="2.5" fill="#E57373" />
          </>
        )}

        {/* === SPARKLES FOR CELEBRATING === */}
        {showSparkles && (
          <>
            <motion.circle
              cx="15" cy="25" r="3"
              fill="#FCD34D"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.circle
              cx="85" cy="20" r="2.5"
              fill="#FBBF24"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
            />
            <motion.circle
              cx="20" cy="70" r="2"
              fill="#F59E0B"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
            />
            <motion.circle
              cx="80" cy="65" r="2.5"
              fill="#FCD34D"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.9 }}
            />

            {/* Star sparkles */}
            <motion.path
              d="M 10 45 L 12 49 L 16 49 L 13 52 L 14 56 L 10 53 L 6 56 L 7 52 L 4 49 L 8 49 Z"
              fill="#FCD34D"
              animate={{ opacity: [0, 1, 0], rotate: [0, 20, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ transformOrigin: '10px 50px' }}
            />
            <motion.path
              d="M 90 40 L 91 43 L 94 43 L 92 45 L 93 48 L 90 46 L 87 48 L 88 45 L 86 43 L 89 43 Z"
              fill="#F59E0B"
              animate={{ opacity: [0, 1, 0], rotate: [0, -20, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.5 }}
              style={{ transformOrigin: '90px 44px' }}
            />
          </>
        )}

        {/* === THOUGHT BUBBLES FOR THINKING === */}
        {mood === 'thinking' && (
          <>
            <motion.circle
              cx="82" cy="22" r="4"
              fill="#C7D2FE"
              animate={{ y: [0, -2, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx="88" cy="12" r="3"
              fill="#DDD6FE"
              animate={{ y: [0, -3, 0], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
            <motion.circle
              cx="92" cy="5" r="2"
              fill="#E9D5FF"
              animate={{ y: [0, -2, 0], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            />
          </>
        )}

        {/* === SWEAT DROP FOR DISAPPOINTED === */}
        {mood === 'disappointed' && (
          <motion.path
            d="M 76 32 Q 78 36 76 40 Q 74 36 76 32"
            fill="#60A5FA"
            animate={{ y: [0, 2, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </svg>
    </motion.div>
  );
}

export default SageAvatar;
