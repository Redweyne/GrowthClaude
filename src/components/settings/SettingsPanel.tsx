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
import { ArrowLeft, ArrowRight, Volume2, VolumeX, Vibrate, Music, Bell, Sparkles, Check, AlertTriangle, Trash2, LogIn, UserPlus, LogOut, Link } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useEchoesStore } from '@/store/useEchoesStore';
import { useDailyPracticeStore } from '@/store/useDailyPracticeStore';
import { useAudio } from '@/hooks/useAudio';
import { useAuth } from '@/hooks/useAuth';
import { backgroundMusic } from '@/lib/backgroundMusic';
import { saveAllProgress, clearAllStores } from '@/lib/progressSync';
import { useTranslation, languageConfig, type Locale } from '@/i18n';
import { ThemeToggle } from '@/components/ui';
import { LoginModal } from '@/components/auth/LoginModal';
import { SignupModal } from '@/components/auth/SignupModal';

interface SettingsPanelProps {
  onBack: () => void;
}

export function SettingsPanel({ onBack }: SettingsPanelProps) {
  const { t, isRTL, locale, setLocale } = useTranslation();
  const { soundEnabled, hapticEnabled, toggleSound, toggleHaptic, name, setLanguage, resetUser } = useStore();
  const { resetEchoes } = useEchoesStore();
  const { resetDailyPractice } = useDailyPracticeStore();
  const { playTap, playSuccess, playSingingBowl } = useAudio();
  const { user, isAuthenticated, signOut, isConfigured } = useAuth();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Handle sign out — save progress to server, sign out, then clear local stores
  const handleSignOut = async () => {
    setSigningOut(true);
    // Save one last time while still authenticated (RLS requires active session)
    if (user?.id) {
      await saveAllProgress(user.id);
    }
    await signOut();
    // Clear all local Zustand stores + localStorage so the next user starts fresh
    clearAllStores();
    setSigningOut(false);
  };

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
    // Start background music for test
    backgroundMusic.start();
    // Auto-stop after 5 seconds
    setTimeout(() => backgroundMusic.stop(), 5000);
  };

  const handleTestMeditation = () => {
    playSingingBowl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 light:from-stone-50 light:via-stone-100 light:to-stone-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-stone-950/80 light:bg-stone-50/90 border-b border-stone-800/50 light:border-stone-300"
      >
        <div className={`max-w-lg mx-auto px-4 py-4 flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={onBack}
            className={`p-2 ${isRTL ? '-mr-2' : '-ml-2'} rounded-xl text-stone-400 light:text-stone-600 hover:text-white light:hover:text-stone-900 hover:bg-stone-800/50 light:hover:bg-stone-200/80 transition-all`}
          >
            {isRTL ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
          </button>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="text-xl font-semibold text-white light:text-stone-900">{t('settings.title')}</h1>
            <p className="text-sm text-stone-500 light:text-stone-600">{t('settings.personalize')}</p>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">

        {/* Account Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <h2 className={`text-sm font-medium text-stone-500 uppercase tracking-wider mb-4 ${isRTL ? 'text-right' : ''}`}>
            {t('settings.account' as any)}
          </h2>
          <div className="bg-stone-900/50 light:bg-stone-100/80 rounded-2xl border border-stone-800/50 light:border-stone-300 overflow-hidden">
            {isAuthenticated && user ? (
              user.email ? (
                /* Real account — show email + sign out */
                <div className="p-4">
                  <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-3 min-w-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-stone-900 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">⚜️</span>
                      </div>
                      <div className={`min-w-0 ${isRTL ? 'text-right' : ''}`}>
                        <p className="text-xs text-stone-500 light:text-stone-600 mb-0.5">{t('settings.signedInAs' as any)}</p>
                        <p className="text-sm text-white light:text-stone-900 font-medium truncate">{user.email}</p>
                      </div>
                    </div>
                    <motion.button
                      onClick={handleSignOut}
                      disabled={signingOut}
                      whileTap={{ scale: 0.96 }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-800/70 light:bg-stone-200 text-stone-400 light:text-stone-600 hover:text-white light:hover:text-stone-900 hover:bg-stone-700 light:hover:bg-stone-300 transition-all text-sm font-medium flex-shrink-0 disabled:opacity-50"
                    >
                      {signingOut ? (
                        <motion.div
                          className="w-4 h-4 rounded-full border-2 border-stone-500/40 border-t-stone-400"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        <LogOut size={14} />
                      )}
                      <span>{t('settings.signOut' as any)}</span>
                    </motion.button>
                  </div>
                </div>
              ) : (
                /* Anonymous account — prompt to link */
                <div className="p-4">
                  <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-700/40 to-stone-900 border border-stone-700/50 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">🌿</span>
                    </div>
                    <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                      <p className="text-sm text-white light:text-stone-900 font-medium mb-0.5">{t('settings.wanderingMode' as any)}</p>
                      <p className="text-xs text-stone-500 light:text-stone-600 mb-3">{t('settings.wanderingModeDesc' as any)}</p>
                      {isConfigured && (
                        <motion.button
                          onClick={() => setShowSignup(true)}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 light:text-amber-700 hover:bg-amber-500/25 transition-all text-sm font-medium"
                        >
                          <Link size={14} />
                          <span>{t('settings.linkAccount' as any)}</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              )
            ) : (
              /* Not authenticated — show sign in / create account */
              <div className="p-4">
                <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-700/40 to-stone-900 border border-stone-700/50 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🌿</span>
                  </div>
                  <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                    <p className="text-sm text-white light:text-stone-900 font-medium mb-0.5">{t('settings.wanderingMode' as any)}</p>
                    <p className="text-xs text-stone-500 light:text-stone-600 mb-3">{t('settings.wanderingModeDesc' as any)}</p>
                    {isConfigured && (
                      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <motion.button
                          onClick={() => setShowLogin(true)}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-800/70 light:bg-stone-200 text-stone-300 light:text-stone-700 hover:text-white light:hover:text-stone-900 hover:bg-stone-700 light:hover:bg-stone-300 transition-all text-sm font-medium"
                        >
                          <LogIn size={14} />
                          <span>{t('settings.signIn' as any)}</span>
                        </motion.button>
                        <motion.button
                          onClick={() => setShowSignup(true)}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 light:text-amber-700 hover:bg-amber-500/25 transition-all text-sm font-medium"
                        >
                          <UserPlus size={14} />
                          <span>{t('settings.createAccount' as any)}</span>
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* Profile Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className={`text-sm font-medium text-stone-500 uppercase tracking-wider mb-4 ${isRTL ? 'text-right' : ''}`}>
            {t('settings.profile')}
          </h2>
          <div className="bg-stone-900/50 light:bg-stone-100/80 rounded-2xl border border-stone-800/50 light:border-stone-300 p-4">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/20 to-stone-900 border border-amber-500/30 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-lg text-white light:text-stone-900 font-medium">{name || t('settings.seeker')}</p>
                <p className="text-sm text-stone-500 light:text-stone-600">{t('settings.onPathOf')}</p>
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
          <div className="bg-stone-900/50 light:bg-stone-100/80 rounded-2xl border border-stone-800/50 light:border-stone-300 divide-y divide-stone-800/50 light:divide-stone-300">
            {(['en', 'fr', 'ar'] as Locale[]).map((lang) => {
              const config = languageConfig[lang];
              const isSelected = locale === lang;

              return (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full p-4 flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-amber-500/10 light:bg-amber-500/15' : 'hover:bg-stone-800/50 light:hover:bg-stone-200/80'
                  } ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-2xl">{config.flag}</span>
                    <div className={isRTL ? 'text-right' : ''}>
                      <p className={`font-medium ${isSelected ? 'text-amber-400 light:text-amber-600' : 'text-white light:text-stone-900'}`}>
                        {config.nativeName}
                      </p>
                      <p className="text-sm text-stone-500 light:text-stone-600">{config.name}</p>
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

        {/* Appearance Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.175 }}
        >
          <h2 className={`text-sm font-medium text-stone-500 uppercase tracking-wider mb-4 ${isRTL ? 'text-right' : ''}`}>
            {t('settings.appearance')}
          </h2>
          <div className="bg-stone-900/50 light:bg-stone-100/80 rounded-2xl border border-stone-800/50 light:border-stone-300 p-4">
            <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-white light:text-stone-900 font-medium">{t('settings.theme')}</p>
                <p className="text-sm text-stone-500 light:text-stone-600">{t('settings.themeDesc')}</p>
              </div>
              <ThemeToggle size="sm" showLabel />
            </div>
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
          <div className="bg-stone-900/50 light:bg-stone-100/80 rounded-2xl border border-stone-800/50 light:border-stone-300 divide-y divide-stone-800/50 light:divide-stone-300">
            {/* Sound Toggle */}
            <div className={`p-4 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {soundEnabled ? (
                  <Volume2 className="text-amber-400" size={22} />
                ) : (
                  <VolumeX className="text-stone-500" size={22} />
                )}
                <div className={isRTL ? 'text-right' : ''}>
                   <p className="text-white light:text-stone-900 font-medium">{t('settings.soundEffects')}</p>
                   <p className="text-sm text-stone-500 light:text-stone-600">{t('settings.soundDesc')}</p>
                </div>
              </div>
              <ToggleSwitch enabled={soundEnabled} onToggle={handleToggleSound} />
            </div>

            {/* Haptic Toggle */}
            <div className={`p-4 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Vibrate className={hapticEnabled ? 'text-amber-400' : 'text-stone-500'} size={22} />
                <div className={isRTL ? 'text-right' : ''}>
                   <p className="text-white light:text-stone-900 font-medium">{t('settings.hapticFeedback')}</p>
                   <p className="text-sm text-stone-500 light:text-stone-600">{t('settings.hapticDesc')}</p>
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
            <div className="bg-stone-900/50 light:bg-stone-100/80 rounded-2xl border border-stone-800/50 light:border-stone-300 p-4 space-y-3">
              <p className={`text-sm text-stone-400 light:text-stone-600 mb-4 ${isRTL ? 'text-right' : ''}`}>
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
          <div className="bg-stone-900/50 light:bg-stone-100/80 rounded-2xl border border-stone-800/50 light:border-stone-300 p-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-stone-900 border border-amber-500/30 flex items-center justify-center">
                <span className="text-xl">🌱</span>
              </div>
              <p className="text-white light:text-stone-900 font-medium">{t('settings.appName')}</p>
              <p className="text-sm text-stone-500 light:text-stone-600">{t('settings.appDesc')}</p>
              <p className="text-xs text-stone-600 light:text-stone-500 pt-2">{t('settings.version')} 1.0.0</p>
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
            {t('settings.dangerZone')}
          </h2>
          <div className="bg-red-950/20 light:bg-red-100/70 rounded-2xl border border-red-900/30 light:border-red-300 p-4">
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                <p className="text-white light:text-red-900 font-medium">{t('settings.resetProgress')}</p>
                <p className="text-sm text-stone-400 light:text-stone-600 mt-1">
                  {t('settings.resetDesc')}
                </p>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="mt-4 px-4 py-2 rounded-lg bg-red-600/30 border border-red-600/50 text-red-300 hover:bg-red-600/50 transition-colors text-sm font-medium"
                >
                  {t('settings.resetButton')}
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }}
      />
      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }}
      />

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
              className="bg-stone-900 light:bg-stone-50 rounded-2xl border border-red-900/50 light:border-red-300 p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle size={32} className="text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white light:text-stone-900">
                  {t('settings.confirmResetTitle')}
                </h3>
                <p className="text-stone-400 light:text-stone-600">
                  {t('settings.confirmResetDesc')}
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-stone-800 light:bg-stone-200 text-stone-300 light:text-stone-700 hover:bg-stone-700 light:hover:bg-stone-300 transition-colors font-medium"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleResetAll}
                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-colors font-medium"
                  >
                    {t('settings.confirmReset')}
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
        ${enabled ? 'bg-amber-500' : 'bg-stone-700 light:bg-stone-300'}
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
      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-stone-800/50 light:bg-stone-200/80 border border-stone-700/50 light:border-stone-300 hover:border-amber-500/30 hover:bg-stone-800 light:hover:bg-stone-200 transition-all"
    >
      <span className="text-amber-400">{icon}</span>
      <span className="text-xs text-stone-400 light:text-stone-600">{label}</span>
    </motion.button>
  );
}

export default SettingsPanel;
