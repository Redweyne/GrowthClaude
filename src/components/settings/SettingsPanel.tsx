'use client';

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS PANEL - PERSONALIZE YOUR JOURNEY
// ═══════════════════════════════════════════════════════════════════════════
//
// Clean, immersive settings for audio, haptics, and preferences.
// Every control should feel intentional and satisfying.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Volume2, VolumeX, Vibrate, Music, Bell, Sparkles, Globe, Check, AlertTriangle, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useEchoesStore } from '@/store/useEchoesStore';
import { useDailyPracticeStore } from '@/store/useDailyPracticeStore';
import { useAudio } from '@/hooks/useAudio';
import { useTranslation, languageConfig, type Locale } from '@/i18n';

interface SettingsPanelProps {
  onBack: () => void;
}

export function SettingsPanel({ onBack }: SettingsPanelProps) {
  const { t, isRTL, locale, setLocale } = useTranslation();
  const { soundEnabled, hapticEnabled, toggleSound, toggleHaptic, name, setLanguage, resetUser } = useStore();
  const { resetEchoes } = useEchoesStore();
  const { resetDailyPractice } = useDailyPracticeStore();
  const { playTap, playSuccess, startMusic, stopMusic, playSingingBowl } = useAudio();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Handle complete app reset
  const handleResetAll = () => {
    resetUser();
    resetEchoes();
    resetDailyPractice();
    // Reload the page to ensure clean state
    window.location.reload();
  };

  // Handle language change
  const handleLanguageChange = (newLocale: Locale) => {
    playTap();
    setLocale(newLocale);
    setLanguage(newLocale);
  };

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
        <div className={`max-w-lg mx-auto px-4 py-4 flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={onBack}
            className={`p-2 ${isRTL ? '-mr-2' : '-ml-2'} rounded-xl text-stone-400 hover:text-white hover:bg-stone-800/50 transition-all`}
          >
            {isRTL ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
          </button>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="text-xl font-semibold text-white">{t('settings.title')}</h1>
            <p className="text-sm text-stone-500">{t('settings.personalize')}</p>
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
          <h2 className={`text-sm font-medium text-stone-500 uppercase tracking-wider mb-4 ${isRTL ? 'text-right' : ''}`}>
            {t('settings.profile')}
          </h2>
          <div className="bg-stone-900/50 rounded-2xl border border-stone-800/50 p-4">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/20 to-stone-900 border border-amber-500/30 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-lg text-white font-medium">{name || t('settings.seeker')}</p>
                <p className="text-sm text-stone-500">{t('settings.onPathOf')}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Language Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className={`text-sm font-medium text-stone-500 uppercase tracking-wider mb-4 ${isRTL ? 'text-right' : ''}`}>
            {t('settings.language')}
          </h2>
          <div className="bg-stone-900/50 rounded-2xl border border-stone-800/50 divide-y divide-stone-800/50">
            {(['en', 'fr', 'ar'] as Locale[]).map((lang) => {
              const config = languageConfig[lang];
              const isSelected = locale === lang;

              return (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full p-4 flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-amber-500/10' : 'hover:bg-stone-800/50'
                  } ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-2xl">{config.flag}</span>
                    <div className={isRTL ? 'text-right' : ''}>
                      <p className={`font-medium ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                        {config.nativeName}
                      </p>
                      <p className="text-sm text-stone-500">{config.name}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center"
                    >
                      <Check size={14} className="text-stone-950" strokeWidth={3} />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* Audio Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className={`text-sm font-medium text-stone-500 uppercase tracking-wider mb-4 ${isRTL ? 'text-right' : ''}`}>
            {t('settings.audioHaptics')}
          </h2>
          <div className="bg-stone-900/50 rounded-2xl border border-stone-800/50 divide-y divide-stone-800/50">
            {/* Sound Toggle */}
            <div className={`p-4 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {soundEnabled ? (
                  <Volume2 className="text-amber-400" size={22} />
                ) : (
                  <VolumeX className="text-stone-500" size={22} />
                )}
                <div className={isRTL ? 'text-right' : ''}>
                  <p className="text-white font-medium">{t('settings.soundEffects')}</p>
                  <p className="text-sm text-stone-500">{t('settings.soundDesc')}</p>
                </div>
              </div>
              <ToggleSwitch enabled={soundEnabled} onToggle={handleToggleSound} />
            </div>

            {/* Haptic Toggle */}
            <div className={`p-4 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Vibrate className={hapticEnabled ? 'text-amber-400' : 'text-stone-500'} size={22} />
                <div className={isRTL ? 'text-right' : ''}>
                  <p className="text-white font-medium">{t('settings.hapticFeedback')}</p>
                  <p className="text-sm text-stone-500">{t('settings.hapticDesc')}</p>
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
            <h2 className={`text-sm font-medium text-stone-500 uppercase tracking-wider mb-4 ${isRTL ? 'text-right' : ''}`}>
              {t('settings.testAudio')}
            </h2>
            <div className="bg-stone-900/50 rounded-2xl border border-stone-800/50 p-4 space-y-3">
              <p className={`text-sm text-stone-400 mb-4 ${isRTL ? 'text-right' : ''}`}>
                {t('settings.previewAudio')}
              </p>

              <div className="grid grid-cols-3 gap-3">
                <AudioTestButton
                  icon={<Bell size={20} />}
                  label={t('settings.uiSounds')}
                  onClick={handleTestUISound}
                />
                <AudioTestButton
                  icon={<Music size={20} />}
                  label={t('settings.ambience')}
                  onClick={handleTestAmbience}
                />
                <AudioTestButton
                  icon={<Sparkles size={20} />}
                  label={t('settings.meditation')}
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
          <h2 className={`text-sm font-medium text-stone-500 uppercase tracking-wider mb-4 ${isRTL ? 'text-right' : ''}`}>
            {t('settings.about')}
          </h2>
          <div className="bg-stone-900/50 rounded-2xl border border-stone-800/50 p-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-stone-900 border border-amber-500/30 flex items-center justify-center">
                <span className="text-xl">🌱</span>
              </div>
              <p className="text-white font-medium">{t('settings.appName')}</p>
              <p className="text-sm text-stone-500">{t('settings.appDesc')}</p>
              <p className="text-xs text-stone-600 pt-2">{t('settings.version')} 1.0.0</p>
            </div>
          </div>
        </motion.section>

        {/* Danger Zone - Reset Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className={`text-sm font-medium text-red-500/70 uppercase tracking-wider mb-4 ${isRTL ? 'text-right' : ''}`}>
            {t('settings.dangerZone') || 'Danger Zone'}
          </h2>
          <div className="bg-red-950/20 rounded-2xl border border-red-900/30 p-4">
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                <p className="text-white font-medium">{t('settings.resetProgress') || 'Reset All Progress'}</p>
                <p className="text-sm text-stone-400 mt-1">
                  {t('settings.resetDesc') || 'Delete all your progress and start fresh. This cannot be undone.'}
                </p>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="mt-4 px-4 py-2 rounded-lg bg-red-600/30 border border-red-600/50 text-red-300 hover:bg-red-600/50 transition-colors text-sm font-medium"
                >
                  {t('settings.resetButton') || 'Reset Everything'}
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-stone-900 rounded-2xl border border-red-900/50 p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle size={32} className="text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {t('settings.confirmResetTitle') || 'Reset All Progress?'}
                </h3>
                <p className="text-stone-400">
                  {t('settings.confirmResetDesc') || 'This will permanently delete all your lessons, reflections, streak, and identity statements. You will start completely fresh.'}
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 transition-colors font-medium"
                  >
                    {t('common.cancel') || 'Cancel'}
                  </button>
                  <button
                    onClick={handleResetAll}
                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-colors font-medium"
                  >
                    {t('settings.confirmReset') || 'Yes, Reset'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
