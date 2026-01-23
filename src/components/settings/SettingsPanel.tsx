'use client';

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS PANEL - PERSONALIZE YOUR JOURNEY
// ═══════════════════════════════════════════════════════════════════════════
//
// Clean, immersive settings for audio, haptics, and preferences.
// Every control should feel intentional and satisfying.
//
// ═══════════════════════════════════════════════════════════════════════════

import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, Vibrate, Music, Bell, Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAudio } from '@/hooks/useAudio';

interface SettingsPanelProps {
  onBack: () => void;
}

export function SettingsPanel({ onBack }: SettingsPanelProps) {
  const { soundEnabled, hapticEnabled, toggleSound, toggleHaptic, name } = useStore();
  const { playTap, playSuccess, startMusic, stopMusic, playSingingBowl } = useAudio();

  // Toggle handlers with audio feedback
  const handleToggleSound = () => {
    if (!soundEnabled) {
      // If turning ON, play a success sound immediately after
      toggleSound();
      setTimeout(() => playSuccess(), 100);
    } else {
      toggleSound();
    }
  };

  const handleToggleHaptic = () => {
    playTap();
    toggleHaptic();
  };

  // Test audio functions
  const handleTestUISound = () => {
    playTap();
    setTimeout(() => playSuccess(), 300);
  };

  const handleTestAmbience = () => {
    startMusic('lessonCalm', 1);
    // Auto-stop after 5 seconds
    setTimeout(() => stopMusic(2), 5000);
  };

  const handleTestMeditation = () => {
    playSingingBowl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-stone-950/80 border-b border-stone-800/50"
      >
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800/50 transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-white">Settings</h1>
            <p className="text-sm text-stone-500">Personalize your experience</p>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* Profile Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-4">
            Profile
          </h2>
          <div className="bg-stone-900/50 rounded-2xl border border-stone-800/50 p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/20 to-stone-900 border border-amber-500/30 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <p className="text-lg text-white font-medium">{name || 'Seeker'}</p>
                <p className="text-sm text-stone-500">On the path of transformation</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Audio Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-4">
            Audio & Haptics
          </h2>
          <div className="bg-stone-900/50 rounded-2xl border border-stone-800/50 divide-y divide-stone-800/50">
            {/* Sound Toggle */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 className="text-amber-400" size={22} />
                ) : (
                  <VolumeX className="text-stone-500" size={22} />
                )}
                <div>
                  <p className="text-white font-medium">Sound Effects</p>
                  <p className="text-sm text-stone-500">UI sounds, chimes, and feedback</p>
                </div>
              </div>
              <ToggleSwitch enabled={soundEnabled} onToggle={handleToggleSound} />
            </div>

            {/* Haptic Toggle */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Vibrate className={hapticEnabled ? 'text-amber-400' : 'text-stone-500'} size={22} />
                <div>
                  <p className="text-white font-medium">Haptic Feedback</p>
                  <p className="text-sm text-stone-500">Vibration on interactions</p>
                </div>
              </div>
              <ToggleSwitch enabled={hapticEnabled} onToggle={handleToggleHaptic} />
            </div>
          </div>
        </motion.section>

        {/* Audio Test Section */}
        {soundEnabled && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-4">
              Test Audio
            </h2>
            <div className="bg-stone-900/50 rounded-2xl border border-stone-800/50 p-4 space-y-3">
              <p className="text-sm text-stone-400 mb-4">
                Preview the immersive audio experience
              </p>

              <div className="grid grid-cols-3 gap-3">
                <AudioTestButton
                  icon={<Bell size={20} />}
                  label="UI Sounds"
                  onClick={handleTestUISound}
                />
                <AudioTestButton
                  icon={<Music size={20} />}
                  label="Ambience"
                  onClick={handleTestAmbience}
                />
                <AudioTestButton
                  icon={<Sparkles size={20} />}
                  label="Meditation"
                  onClick={handleTestMeditation}
                />
              </div>
            </div>
          </motion.section>
        )}

        {/* About Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-4">
            About
          </h2>
          <div className="bg-stone-900/50 rounded-2xl border border-stone-800/50 p-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-stone-900 border border-amber-500/30 flex items-center justify-center">
                <span className="text-xl">🌱</span>
              </div>
              <p className="text-white font-medium">Transformation Hub</p>
              <p className="text-sm text-stone-500">Your daily journey to growth</p>
              <p className="text-xs text-stone-600 pt-2">Version 1.0.0</p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE SWITCH COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
}

function ToggleSwitch({ enabled, onToggle }: ToggleSwitchProps) {
  return (
    <motion.button
      onClick={onToggle}
      className={`
        relative w-14 h-8 rounded-full transition-colors duration-300
        ${enabled ? 'bg-amber-500' : 'bg-stone-700'}
      `}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
        animate={{ left: enabled ? '1.75rem' : '0.25rem' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO TEST BUTTON
// ─────────────────────────────────────────────────────────────────────────────

interface AudioTestButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function AudioTestButton({ icon, label, onClick }: AudioTestButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-stone-800/50 border border-stone-700/50 hover:border-amber-500/30 hover:bg-stone-800 transition-all"
    >
      <span className="text-amber-400">{icon}</span>
      <span className="text-xs text-stone-400">{label}</span>
    </motion.button>
  );
}

export default SettingsPanel;
