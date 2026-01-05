'use client';

import { motion } from 'framer-motion';

export type SageMood = 'neutral' | 'happy' | 'proud' | 'thinking' | 'encouraging' | 'celebrating';

interface SageAvatarProps {
  mood?: SageMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 64,
  md: 96,
  lg: 140,
  xl: 180,
};

export function SageAvatar({ mood = 'neutral', size = 'md', animate = true, className = '' }: SageAvatarProps) {
  const pixelSize = sizeMap[size];

  // Dynamic expressions based on mood
  const getExpression = () => {
    switch (mood) {
      case 'happy':
        return {
          leftEye: { cy: 42, rx: 4, ry: 2, type: 'happy' }, // Curved happy eyes
          rightEye: { cy: 42, rx: 4, ry: 2, type: 'happy' },
          mouth: 'M40 58 Q50 68 60 58', // Big smile
          eyebrows: { left: 'M32 34 Q38 30 44 34', right: 'M56 34 Q62 30 68 34' }, // Raised happy
          blush: true,
        };
      case 'celebrating':
        return {
          leftEye: { cy: 42, rx: 4, ry: 1.5, type: 'celebrating' }, // Super happy squint
          rightEye: { cy: 42, rx: 4, ry: 1.5, type: 'celebrating' },
          mouth: 'M38 56 Q50 72 62 56', // Huge open smile
          eyebrows: { left: 'M30 32 Q38 26 46 32', right: 'M54 32 Q62 26 70 32' }, // Very raised
          blush: true,
          sparkles: true,
        };
      case 'proud':
        return {
          leftEye: { cy: 42, rx: 3, ry: 3, type: 'closed' }, // Confident closed eyes
          rightEye: { cy: 42, rx: 3, ry: 3, type: 'closed' },
          mouth: 'M42 56 Q50 62 58 56', // Satisfied smile
          eyebrows: { left: 'M32 34 Q38 32 44 34', right: 'M56 34 Q62 32 68 34' }, // Relaxed
          blush: false,
        };
      case 'thinking':
        return {
          leftEye: { cy: 42, rx: 3.5, ry: 4, type: 'open' },
          rightEye: { cy: 40, rx: 3.5, ry: 4, type: 'open' }, // One eye slightly higher
          mouth: 'M44 58 Q50 56 56 58', // Slight ponder
          eyebrows: { left: 'M32 34 Q38 32 44 35', right: 'M54 32 Q62 28 70 34' }, // One raised
          blush: false,
          thoughtBubbles: true,
        };
      case 'encouraging':
        return {
          leftEye: { cy: 42, rx: 3.5, ry: 4, type: 'kind' },
          rightEye: { cy: 42, rx: 3.5, ry: 4, type: 'kind' },
          mouth: 'M40 56 Q50 64 60 56', // Warm smile
          eyebrows: { left: 'M32 34 Q38 31 44 34', right: 'M56 34 Q62 31 68 34' }, // Gentle lift
          blush: true,
        };
      default: // neutral
        return {
          leftEye: { cy: 42, rx: 3.5, ry: 4, type: 'open' },
          rightEye: { cy: 42, rx: 3.5, ry: 4, type: 'open' },
          mouth: 'M44 56 Q50 60 56 56', // Slight smile
          eyebrows: { left: 'M32 35 Q38 33 44 35', right: 'M56 35 Q62 33 68 35' },
          blush: false,
        };
    }
  };

  const expr = getExpression();

  // Eye rendering based on type
  const renderEye = (cx: number, eye: typeof expr.leftEye, delay: number = 0) => {
    if (eye.type === 'happy' || eye.type === 'celebrating') {
      // Arc-shaped happy eyes
      return (
        <motion.path
          d={`M${cx - 5} ${eye.cy} Q${cx} ${eye.cy - 6} ${cx + 5} ${eye.cy}`}
          stroke="#1e1b4b"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          animate={mood === 'celebrating' ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.4, repeat: mood === 'celebrating' ? Infinity : 0, delay }}
        />
      );
    }
    if (eye.type === 'closed') {
      return (
        <motion.path
          d={`M${cx - 5} ${eye.cy} L${cx + 5} ${eye.cy}`}
          stroke="#1e1b4b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );
    }
    // Regular open eyes with shine
    return (
      <g>
        {/* Eye white */}
        <ellipse cx={cx} cy={eye.cy} rx={eye.rx + 2} ry={eye.ry + 2} fill="white" />
        {/* Iris */}
        <ellipse cx={cx} cy={eye.cy + 0.5} rx={eye.rx} ry={eye.ry} fill="#1e1b4b" />
        {/* Pupil shine */}
        <circle cx={cx - 1} cy={eye.cy - 1} r={1.5} fill="white" opacity={0.9} />
        {/* Bottom shine */}
        <ellipse cx={cx + 1} cy={eye.cy + 2} rx={1} ry={0.5} fill="white" opacity={0.4} />
      </g>
    );
  };

  return (
    <motion.div
      className={`relative ${className}`}
      animate={animate ? { y: [0, -6, 0] } : undefined}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Outer glow for celebrating */}
      {mood === 'celebrating' && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)',
            transform: 'scale(1.3)',
          }}
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1.3, 1.4, 1.3] }}
          transition={{ duration: 1, repeat: Infinity }}
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
          {/* Gradients for depth */}
          <radialGradient id="faceGradient" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fff4e6" />
            <stop offset="60%" stopColor="#ffe8cc" />
            <stop offset="100%" stopColor="#ffd9b3" />
          </radialGradient>

          <linearGradient id="robeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>

          <linearGradient id="robeShineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.3" />
            <stop offset="50%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="beardGradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#f5f5f5" />
            <stop offset="100%" stopColor="#e5e5e5" />
          </linearGradient>

          <linearGradient id="hairGradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#e8e8e8" />
            <stop offset="100%" stopColor="#d4d4d4" />
          </linearGradient>

          {/* Drop shadow filter */}
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
          </filter>
        </defs>

        {/* Body/Robe */}
        <motion.path
          d="M20 100 Q20 72 32 62 C38 58 44 56 50 56 C56 56 62 58 68 62 Q80 72 80 100"
          fill="url(#robeGradient)"
          filter="url(#dropShadow)"
        />
        {/* Robe shine */}
        <path
          d="M32 65 Q40 60 50 58 L50 80 L35 85 Z"
          fill="url(#robeShineGradient)"
        />
        {/* Robe collar */}
        <path
          d="M38 62 L50 68 L62 62"
          stroke="#5b21b6"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Collar gem */}
        <motion.circle
          cx="50"
          cy="66"
          r="3"
          fill="#fbbf24"
          animate={mood === 'celebrating' ? { scale: [1, 1.3, 1], opacity: [1, 0.8, 1] } : {}}
          transition={{ duration: 0.5, repeat: mood === 'celebrating' ? Infinity : 0 }}
        />
        <circle cx="49" cy="65" r="1" fill="white" opacity="0.7" />

        {/* Hair/back of head */}
        <ellipse cx="50" cy="35" rx="26" ry="24" fill="url(#hairGradient)" />

        {/* Face */}
        <ellipse cx="50" cy="40" rx="23" ry="22" fill="url(#faceGradient)" filter="url(#dropShadow)" />

        {/* Ears */}
        <ellipse cx="27" cy="42" rx="4" ry="5" fill="#ffe8cc" />
        <ellipse cx="73" cy="42" rx="4" ry="5" fill="#ffe8cc" />
        <ellipse cx="27" cy="42" rx="2" ry="3" fill="#ffd9b3" />
        <ellipse cx="73" cy="42" rx="2" ry="3" fill="#ffd9b3" />

        {/* Eyebrows */}
        <motion.path
          d={expr.eyebrows.left}
          stroke="#9ca3af"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          animate={mood === 'celebrating' ? { y: [-1, 1, -1] } : {}}
          transition={{ duration: 0.3, repeat: mood === 'celebrating' ? Infinity : 0 }}
        />
        <motion.path
          d={expr.eyebrows.right}
          stroke="#9ca3af"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          animate={mood === 'celebrating' ? { y: [-1, 1, -1] } : {}}
          transition={{ duration: 0.3, repeat: mood === 'celebrating' ? Infinity : 0, delay: 0.1 }}
        />

        {/* Eyes */}
        {renderEye(38, expr.leftEye, 0)}
        {renderEye(62, expr.rightEye, 0.1)}

        {/* Blush */}
        {expr.blush && (
          <>
            <motion.ellipse
              cx="30"
              cy="50"
              rx="5"
              ry="3"
              fill="#fca5a5"
              opacity={0.5}
              animate={{ opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.ellipse
              cx="70"
              cy="50"
              rx="5"
              ry="3"
              fill="#fca5a5"
              opacity={0.5}
              animate={{ opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}

        {/* Nose */}
        <path
          d="M48 48 Q50 52 52 48"
          stroke="#e5a87a"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Mouth */}
        <motion.path
          d={expr.mouth}
          stroke="#92400e"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill={mood === 'celebrating' ? '#fcd34d' : 'none'}
          animate={mood === 'celebrating' ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.3, repeat: mood === 'celebrating' ? Infinity : 0 }}
        />
        {/* Tongue for celebrating */}
        {mood === 'celebrating' && (
          <ellipse cx="50" cy="64" rx="4" ry="3" fill="#f87171" />
        )}

        {/* Beard */}
        <path
          d="M28 50 Q26 68 38 78 Q44 82 50 83 Q56 82 62 78 Q74 68 72 50 Q68 55 50 58 Q32 55 28 50"
          fill="url(#beardGradient)"
          filter="url(#dropShadow)"
        />
        {/* Beard texture lines */}
        <path d="M35 60 Q38 68 42 75" stroke="#d4d4d4" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M50 60 Q50 70 50 80" stroke="#d4d4d4" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M65 60 Q62 68 58 75" stroke="#d4d4d4" strokeWidth="1" fill="none" opacity="0.5" />

        {/* Mustache */}
        <path
          d="M38 54 Q44 58 50 54 Q56 58 62 54"
          fill="#e5e5e5"
          stroke="#d4d4d4"
          strokeWidth="0.5"
        />

        {/* Wisdom sparkles for celebrating */}
        {expr.sparkles && (
          <>
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '50px 50px' }}
            >
              {[0, 72, 144, 216, 288].map((angle, i) => (
                <motion.circle
                  key={angle}
                  cx={50 + 42 * Math.cos((angle * Math.PI) / 180)}
                  cy={50 + 42 * Math.sin((angle * Math.PI) / 180)}
                  r="3"
                  fill="#fbbf24"
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.2, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.g>
            {/* Extra twinkles */}
            <motion.path
              d="M15 25 L17 30 L22 30 L18 33 L20 38 L15 35 L10 38 L12 33 L8 30 L13 30 Z"
              fill="#fbbf24"
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.path
              d="M85 20 L86 23 L89 23 L87 25 L88 28 L85 26 L82 28 L83 25 L81 23 L84 23 Z"
              fill="#f59e0b"
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}

        {/* Thought bubbles for thinking */}
        {expr.thoughtBubbles && (
          <>
            <motion.circle
              cx="82"
              cy="28"
              r="4"
              fill="#c7d2fe"
              animate={{ opacity: [0.5, 1, 0.5], y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx="88"
              cy="18"
              r="3"
              fill="#c7d2fe"
              animate={{ opacity: [0.4, 0.9, 0.4], y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
            <motion.circle
              cx="92"
              cy="10"
              r="2"
              fill="#c7d2fe"
              animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            />
          </>
        )}
      </svg>
    </motion.div>
  );
}

export default SageAvatar;
