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

  // Get eye shapes based on mood
  const getEyeStyle = () => {
    switch (mood) {
      case 'happy':
      case 'celebrating':
        return 'happy'; // Curved happy arcs
      case 'proud':
        return 'closed'; // Confident closed
      case 'thinking':
        return 'looking-up';
      case 'disappointed':
        return 'sad';
      default:
        return 'open';
    }
  };

  // Get mouth path based on mood
  const getMouthPath = () => {
    switch (mood) {
      case 'happy':
        return 'M 35 62 Q 50 74 65 62';
      case 'celebrating':
        return 'M 32 60 Q 50 80 68 60';
      case 'proud':
        return 'M 38 62 Q 50 70 62 62';
      case 'thinking':
        return 'M 42 64 Q 50 62 58 64';
      case 'encouraging':
        return 'M 36 62 Q 50 72 64 62';
      case 'disappointed':
        return 'M 38 68 Q 50 60 62 68';
      default:
        return 'M 40 62 Q 50 68 60 62';
    }
  };

  const eyeStyle = getEyeStyle();

  // Render eyes based on style
  const renderLeftEye = () => {
    const baseX = 38;
    const baseY = 45;

    switch (eyeStyle) {
      case 'happy':
        return (
          <motion.path
            d={`M ${baseX - 7} ${baseY} Q ${baseX} ${baseY - 8} ${baseX + 7} ${baseY}`}
            stroke="#2d1b4e"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        );
      case 'closed':
        return (
          <motion.path
            d={`M ${baseX - 6} ${baseY} L ${baseX + 6} ${baseY}`}
            stroke="#2d1b4e"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        );
      case 'looking-up':
        return (
          <g>
            <ellipse cx={baseX} cy={baseY} rx="9" ry="10" fill="white" />
            <ellipse cx={baseX} cy={baseY - 3} rx="6" ry="7" fill="#2d1b4e" />
            <circle cx={baseX - 2} cy={baseY - 5} r="2.5" fill="white" />
            <circle cx={baseX + 2} cy={baseY - 2} r="1.2" fill="white" opacity="0.6" />
          </g>
        );
      case 'sad':
        return (
          <g>
            <ellipse cx={baseX} cy={baseY} rx="8" ry="9" fill="white" />
            <ellipse cx={baseX} cy={baseY + 1} rx="5" ry="6" fill="#2d1b4e" />
            <circle cx={baseX - 1.5} cy={baseY - 1} r="2" fill="white" />
          </g>
        );
      default: // open
        return (
          <g>
            {/* Eye white with subtle shadow */}
            <ellipse cx={baseX} cy={baseY} rx="9" ry="10" fill="white" />
            <ellipse cx={baseX} cy={baseY - 1} rx="9" ry="8" fill="white" />
            {/* Iris */}
            <ellipse cx={baseX} cy={baseY} rx="6" ry="7" fill="#2d1b4e" />
            {/* Pupil highlight - main */}
            <circle cx={baseX - 2} cy={baseY - 2} r="2.5" fill="white" />
            {/* Secondary highlight */}
            <circle cx={baseX + 2} cy={baseY + 2} r="1.2" fill="white" opacity="0.5" />
          </g>
        );
    }
  };

  const renderRightEye = () => {
    const baseX = 62;
    const baseY = 45;

    switch (eyeStyle) {
      case 'happy':
        return (
          <motion.path
            d={`M ${baseX - 7} ${baseY} Q ${baseX} ${baseY - 8} ${baseX + 7} ${baseY}`}
            stroke="#2d1b4e"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        );
      case 'closed':
        return (
          <motion.path
            d={`M ${baseX - 6} ${baseY} L ${baseX + 6} ${baseY}`}
            stroke="#2d1b4e"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        );
      case 'looking-up':
        return (
          <g>
            <ellipse cx={baseX} cy={baseY} rx="9" ry="10" fill="white" />
            <ellipse cx={baseX} cy={baseY - 3} rx="6" ry="7" fill="#2d1b4e" />
            <circle cx={baseX - 2} cy={baseY - 5} r="2.5" fill="white" />
            <circle cx={baseX + 2} cy={baseY - 2} r="1.2" fill="white" opacity="0.6" />
          </g>
        );
      case 'sad':
        return (
          <g>
            <ellipse cx={baseX} cy={baseY} rx="8" ry="9" fill="white" />
            <ellipse cx={baseX} cy={baseY + 1} rx="5" ry="6" fill="#2d1b4e" />
            <circle cx={baseX - 1.5} cy={baseY - 1} r="2" fill="white" />
          </g>
        );
      default:
        return (
          <g>
            <ellipse cx={baseX} cy={baseY} rx="9" ry="10" fill="white" />
            <ellipse cx={baseX} cy={baseY - 1} rx="9" ry="8" fill="white" />
            <ellipse cx={baseX} cy={baseY} rx="6" ry="7" fill="#2d1b4e" />
            <circle cx={baseX - 2} cy={baseY - 2} r="2.5" fill="white" />
            <circle cx={baseX + 2} cy={baseY + 2} r="1.2" fill="white" opacity="0.5" />
          </g>
        );
    }
  };

  // Eyebrow positions based on mood
  const getEyebrows = () => {
    switch (mood) {
      case 'happy':
      case 'celebrating':
        return {
          left: 'M 28 34 Q 38 28 48 34',
          right: 'M 52 34 Q 62 28 72 34',
        };
      case 'thinking':
        return {
          left: 'M 28 36 Q 38 32 48 36',
          right: 'M 52 32 Q 62 26 72 34',
        };
      case 'disappointed':
        return {
          left: 'M 30 32 Q 38 36 46 34',
          right: 'M 54 34 Q 62 36 70 32',
        };
      case 'encouraging':
        return {
          left: 'M 28 34 Q 38 30 48 35',
          right: 'M 52 35 Q 62 30 72 34',
        };
      default:
        return {
          left: 'M 28 35 Q 38 31 48 35',
          right: 'M 52 35 Q 62 31 72 35',
        };
    }
  };

  const eyebrows = getEyebrows();
  const showBlush = mood === 'happy' || mood === 'celebrating' || mood === 'encouraging';
  const showSparkles = mood === 'celebrating';
  const showThoughtBubbles = mood === 'thinking';

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
      animate={animate ? { y: [0, -4, 0] } : undefined}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Celebration glow */}
      {mood === 'celebrating' && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 60%)',
            transform: 'scale(1.4)',
          }}
          animate={{ opacity: [0.5, 0.8, 0.5], scale: [1.4, 1.5, 1.4] }}
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
          {/* Main face gradient - warm, professional */}
          <radialGradient id="sageHead" cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFF5E6" />
            <stop offset="50%" stopColor="#FFE4C4" />
            <stop offset="100%" stopColor="#DEB887" />
          </radialGradient>

          {/* Robe gradient - rich purple */}
          <linearGradient id="sageRobe" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333EA" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#5B21B6" />
          </linearGradient>

          {/* Robe highlight */}
          <linearGradient id="robeHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.35" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* Beard gradient - silvery white */}
          <linearGradient id="sageBeard" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FAFAFA" />
            <stop offset="50%" stopColor="#F0F0F0" />
            <stop offset="100%" stopColor="#E0E0E0" />
          </linearGradient>

          {/* Hair gradient */}
          <linearGradient id="sageHair" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#F5F5F5" />
            <stop offset="100%" stopColor="#E0E0E0" />
          </linearGradient>

          {/* Gold accent gradient */}
          <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Soft shadow */}
          <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.2"/>
          </filter>

          {/* Inner shadow for depth */}
          <filter id="innerGlow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
            <feOffset in="blur" dx="0" dy="1" result="offsetBlur"/>
            <feComposite in="SourceGraphic" in2="offsetBlur" operator="over"/>
          </filter>
        </defs>

        {/* === BODY/ROBE === */}
        <motion.path
          d="M 15 100
             Q 15 78 28 68
             C 35 62 42 58 50 58
             C 58 58 65 62 72 68
             Q 85 78 85 100
             Z"
          fill="url(#sageRobe)"
          filter="url(#softShadow)"
        />

        {/* Robe shine/highlight */}
        <path
          d="M 28 70 Q 38 62 50 60 L 48 90 L 30 95 Z"
          fill="url(#robeHighlight)"
        />

        {/* Collar V-shape */}
        <path
          d="M 36 66 L 50 76 L 64 66"
          stroke="#4C1D95"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Golden clasp/brooch */}
        <motion.circle
          cx="50"
          cy="72"
          r="5"
          fill="url(#goldAccent)"
          filter="url(#softShadow)"
          animate={showSparkles ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.8, repeat: showSparkles ? Infinity : 0 }}
        />
        <circle cx="48" cy="70" r="1.8" fill="white" opacity="0.8" />
        <circle cx="52" cy="74" r="0.8" fill="white" opacity="0.5" />

        {/* === HAIR (behind head) === */}
        <ellipse cx="50" cy="32" rx="30" ry="26" fill="url(#sageHair)" />

        {/* === HEAD/FACE === */}
        <ellipse
          cx="50"
          cy="38"
          rx="27"
          ry="26"
          fill="url(#sageHead)"
          filter="url(#softShadow)"
        />

        {/* Face highlight */}
        <ellipse cx="42" cy="32" rx="12" ry="10" fill="white" opacity="0.15" />

        {/* === EARS === */}
        <ellipse cx="23" cy="42" rx="5" ry="7" fill="#FFE4C4" />
        <ellipse cx="23" cy="42" rx="3" ry="4" fill="#DEB887" opacity="0.5" />
        <ellipse cx="77" cy="42" rx="5" ry="7" fill="#FFE4C4" />
        <ellipse cx="77" cy="42" rx="3" ry="4" fill="#DEB887" opacity="0.5" />

        {/* === EYEBROWS === */}
        <motion.path
          d={eyebrows.left}
          stroke="#9CA3AF"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          animate={showSparkles ? { y: [-2, 0, -2] } : {}}
          transition={{ duration: 0.4, repeat: showSparkles ? Infinity : 0 }}
        />
        <motion.path
          d={eyebrows.right}
          stroke="#9CA3AF"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          animate={showSparkles ? { y: [-2, 0, -2] } : {}}
          transition={{ duration: 0.4, repeat: showSparkles ? Infinity : 0, delay: 0.1 }}
        />

        {/* === EYES === */}
        {renderLeftEye()}
        {renderRightEye()}

        {/* === BLUSH === */}
        {showBlush && (
          <>
            <motion.ellipse
              cx="28"
              cy="52"
              rx="6"
              ry="3.5"
              fill="#FDA4AF"
              opacity="0.6"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.ellipse
              cx="72"
              cy="52"
              rx="6"
              ry="3.5"
              fill="#FDA4AF"
              opacity="0.6"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
          </>
        )}

        {/* === NOSE === */}
        <path
          d="M 47 50 Q 50 56 53 50"
          stroke="#D4A574"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* === MOUTH === */}
        <motion.path
          d={getMouthPath()}
          stroke="#92400E"
          strokeWidth="3"
          strokeLinecap="round"
          fill={mood === 'celebrating' ? '#FDE68A' : 'none'}
          animate={showSparkles ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.5, repeat: showSparkles ? Infinity : 0 }}
        />

        {/* Open mouth interior for celebrating */}
        {mood === 'celebrating' && (
          <>
            <ellipse cx="50" cy="68" rx="8" ry="5" fill="#7C2D12" />
            <ellipse cx="50" cy="71" rx="5" ry="3" fill="#F87171" />
          </>
        )}

        {/* === BEARD === */}
        <path
          d="M 24 52
             Q 20 70 32 82
             Q 42 90 50 92
             Q 58 90 68 82
             Q 80 70 76 52
             Q 68 58 50 62
             Q 32 58 24 52
             Z"
          fill="url(#sageBeard)"
          filter="url(#softShadow)"
        />

        {/* Beard texture/flow lines */}
        <path d="M 32 62 Q 36 74 40 84" stroke="#D4D4D4" strokeWidth="1.5" fill="none" opacity="0.4" />
        <path d="M 50 64 Q 50 76 50 88" stroke="#D4D4D4" strokeWidth="1.5" fill="none" opacity="0.4" />
        <path d="M 68 62 Q 64 74 60 84" stroke="#D4D4D4" strokeWidth="1.5" fill="none" opacity="0.4" />

        {/* Beard highlight */}
        <path
          d="M 30 55 Q 40 58 50 60 L 45 70 L 28 65 Z"
          fill="white"
          opacity="0.15"
        />

        {/* === MUSTACHE === */}
        <path
          d="M 35 56 Q 42 62 50 58 Q 58 62 65 56"
          fill="#F5F5F5"
          stroke="#E5E5E5"
          strokeWidth="1"
        />

        {/* === CELEBRATION SPARKLES === */}
        {showSparkles && (
          <>
            {/* Orbiting sparkles */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '50px 50px' }}
            >
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <motion.circle
                  key={angle}
                  cx={50 + 44 * Math.cos((angle * Math.PI) / 180)}
                  cy={50 + 44 * Math.sin((angle * Math.PI) / 180)}
                  r="3.5"
                  fill="#FBBF24"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.6, 1.3, 0.6],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </motion.g>

            {/* Star sparkles */}
            <motion.path
              d="M 12 22 L 14 28 L 20 28 L 15 32 L 17 38 L 12 34 L 7 38 L 9 32 L 4 28 L 10 28 Z"
              fill="#FCD34D"
              animate={{ opacity: [0, 1, 0], scale: [0.7, 1.1, 0.7], rotate: [0, 15, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ transformOrigin: '12px 30px' }}
            />
            <motion.path
              d="M 88 18 L 90 22 L 94 22 L 91 25 L 92 29 L 88 26 L 84 29 L 85 25 L 82 22 L 86 22 Z"
              fill="#F59E0B"
              animate={{ opacity: [0, 1, 0], scale: [0.7, 1.1, 0.7], rotate: [0, -15, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              style={{ transformOrigin: '88px 23px' }}
            />
            <motion.path
              d="M 78 8 L 79 11 L 82 11 L 80 13 L 81 16 L 78 14 L 75 16 L 76 13 L 74 11 L 77 11 Z"
              fill="#FBBF24"
              animate={{ opacity: [0, 1, 0], scale: [0.7, 1.1, 0.7] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.8 }}
            />
          </>
        )}

        {/* === THOUGHT BUBBLES === */}
        {showThoughtBubbles && (
          <>
            <motion.circle
              cx="84"
              cy="26"
              r="5"
              fill="#C7D2FE"
              filter="url(#softShadow)"
              animate={{ y: [0, -3, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <motion.circle
              cx="90"
              cy="14"
              r="3.5"
              fill="#DDD6FE"
              animate={{ y: [0, -4, 0], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
            />
            <motion.circle
              cx="94"
              cy="6"
              r="2.5"
              fill="#E9D5FF"
              animate={{ y: [0, -3, 0], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}
            />
          </>
        )}

        {/* === DISAPPOINTED SWEAT DROP === */}
        {mood === 'disappointed' && (
          <motion.path
            d="M 78 35 Q 80 40 78 45 Q 76 40 78 35"
            fill="#60A5FA"
            animate={{ y: [0, 3, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </svg>
    </motion.div>
  );
}

export default SageAvatar;
