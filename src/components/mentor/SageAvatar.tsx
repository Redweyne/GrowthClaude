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
  sm: 48,
  md: 80,
  lg: 120,
  xl: 160,
};

export function SageAvatar({ mood = 'neutral', size = 'md', animate = true, className = '' }: SageAvatarProps) {
  const pixelSize = sizeMap[size];

  // Eye positions based on mood
  const getEyeStyle = () => {
    switch (mood) {
      case 'happy':
      case 'celebrating':
        return { leftEye: 'M32 38 Q36 34 40 38', rightEye: 'M60 38 Q64 34 68 38' }; // Curved happy eyes
      case 'proud':
        return { leftEye: 'M32 36 L40 36', rightEye: 'M60 36 L68 36' }; // Confident closed eyes
      case 'thinking':
        return { leftEye: 'M34 38 L38 34', rightEye: 'M62 34 L66 38' }; // Raised eyebrow look
      case 'encouraging':
        return { leftEye: 'M33 36 Q36 33 39 36', rightEye: 'M61 36 Q64 33 67 36' }; // Soft encouraging
      default:
        return { leftEye: 'M34 36 A2 2 0 1 1 38 36 A2 2 0 1 1 34 36', rightEye: 'M62 36 A2 2 0 1 1 66 36 A2 2 0 1 1 62 36' }; // Normal eyes
    }
  };

  // Mouth based on mood
  const getMouth = () => {
    switch (mood) {
      case 'happy':
        return 'M40 52 Q50 60 60 52'; // Big smile
      case 'celebrating':
        return 'M38 50 Q50 65 62 50'; // Huge open smile
      case 'proud':
        return 'M42 52 Q50 56 58 52'; // Gentle satisfied smile
      case 'thinking':
        return 'M44 54 Q50 52 56 54'; // Slight contemplative
      case 'encouraging':
        return 'M40 52 Q50 58 60 52'; // Warm smile
      default:
        return 'M44 54 Q50 56 56 54'; // Neutral slight smile
    }
  };

  const eyeStyle = getEyeStyle();
  const mouth = getMouth();

  return (
    <motion.div
      className={`relative ${className}`}
      animate={
        animate || mood === 'celebrating'
          ? {
              y: animate ? [0, -4, 0] : 0,
              filter:
                mood === 'celebrating'
                  ? [
                      'drop-shadow(0 0 8px rgba(251, 191, 36, 0.4))',
                      'drop-shadow(0 0 16px rgba(251, 191, 36, 0.6))',
                      'drop-shadow(0 0 8px rgba(251, 191, 36, 0.4))',
                    ]
                  : 'none',
            }
          : undefined
      }
      transition={{
        duration: mood === 'celebrating' ? 1 : 3,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      }}
    >
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer glow */}
        <defs>
          <radialGradient id="sageGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="robeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
          <linearGradient id="beardGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e5e7eb" />
            <stop offset="100%" stopColor="#d1d5db" />
          </linearGradient>
        </defs>

        {/* Background glow circle */}
        <circle cx="50" cy="50" r="48" fill="url(#sageGlow)" />

        {/* Robe/body */}
        <path
          d="M25 95 Q25 70 35 60 L50 55 L65 60 Q75 70 75 95"
          fill="url(#robeGradient)"
        />

        {/* Robe collar detail */}
        <path
          d="M40 60 L50 65 L60 60"
          stroke="#4338ca"
          strokeWidth="2"
          fill="none"
        />

        {/* Face */}
        <ellipse cx="50" cy="40" rx="22" ry="24" fill="url(#skinGradient)" />

        {/* Beard */}
        <path
          d="M30 45 Q30 70 50 75 Q70 70 70 45 Q65 50 50 52 Q35 50 30 45"
          fill="url(#beardGradient)"
        />

        {/* Eyes */}
        <motion.path
          d={eyeStyle.leftEye}
          stroke="#4b5563"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill={mood === 'neutral' || mood === 'thinking' ? '#4b5563' : 'none'}
          animate={mood === 'celebrating' ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: mood === 'celebrating' ? Infinity : 0 }}
        />
        <motion.path
          d={eyeStyle.rightEye}
          stroke="#4b5563"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill={mood === 'neutral' || mood === 'thinking' ? '#4b5563' : 'none'}
          animate={mood === 'celebrating' ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: mood === 'celebrating' ? Infinity : 0 }}
        />

        {/* Eyebrows */}
        <motion.path
          d={mood === 'thinking' ? 'M30 30 Q36 26 42 30' : 'M30 30 Q36 28 42 30'}
          stroke="#9ca3af"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <motion.path
          d={mood === 'thinking' ? 'M58 28 Q64 24 70 30' : 'M58 30 Q64 28 70 30'}
          stroke="#9ca3af"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Mouth */}
        <motion.path
          d={mouth}
          stroke="#92400e"
          strokeWidth="2"
          strokeLinecap="round"
          fill={mood === 'celebrating' ? '#fbbf24' : 'none'}
          animate={mood === 'celebrating' ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.3, repeat: mood === 'celebrating' ? Infinity : 0 }}
        />

        {/* Nose */}
        <path
          d="M48 42 Q50 46 52 42"
          stroke="#d97706"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Wisdom sparkles for celebrating mood */}
        {mood === 'celebrating' && (
          <>
            <motion.circle
              cx="20"
              cy="20"
              r="2"
              fill="#fbbf24"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            />
            <motion.circle
              cx="80"
              cy="25"
              r="2"
              fill="#fbbf24"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            />
            <motion.circle
              cx="15"
              cy="50"
              r="1.5"
              fill="#f59e0b"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            />
            <motion.circle
              cx="85"
              cy="55"
              r="1.5"
              fill="#f59e0b"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.9 }}
            />
          </>
        )}

        {/* Thinking bubbles */}
        {mood === 'thinking' && (
          <>
            <motion.circle
              cx="78"
              cy="20"
              r="3"
              fill="#a5b4fc"
              animate={{ opacity: [0.5, 1, 0.5], y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx="85"
              cy="12"
              r="2"
              fill="#a5b4fc"
              animate={{ opacity: [0.3, 0.8, 0.3], y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
            <motion.circle
              cx="90"
              cy="6"
              r="1.5"
              fill="#a5b4fc"
              animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            />
          </>
        )}
      </svg>
    </motion.div>
  );
}

export default SageAvatar;
