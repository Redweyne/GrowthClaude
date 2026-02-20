'use client';

// ═══════════════════════════════════════════════════════════════════════════
// AUTH STEP — THE ORIGIN POINT
// ═══════════════════════════════════════════════════════════════════════════
//
// This is not a signup form. This is a sealing ceremony.
// The moment the user anchors their transformation to something permanent.
//
// Three phases:
//   1. REVEAL  — Particles converge. Poetic lines fade in. (2.5s auto)
//   2. FORM    — Minimalist, emotionally designed auth form.
//   3. SEAL    — Golden stamp springs in. Particle burst. Auto-advance.
//
// "Continue as a wanderer" ALWAYS works — never blocks the journey.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/i18n';

type AuthPhase = 'reveal' | 'form' | 'seal';

interface AuthStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function AuthStep({ onNext, onBack }: AuthStepProps) {
  const { t, isRTL } = useTranslation();
  const { signUpWithPassword, signInWithGoogle, isConfigured, isAuthenticated } = useAuth();

  const [phase, setPhase] = useState<AuthPhase>('reveal');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleRedirecting, setGoogleRedirecting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const formContainerRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // ── Mount ────────────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
  }, []);

  // ── If already authenticated when entering → skip to seal ────────────────
  useEffect(() => {
    if (mounted && isAuthenticated && phase !== 'seal') {
      setPhase('seal');
    }
  }, [mounted, isAuthenticated, phase]);

  // ── Auto-advance from reveal → form ──────────────────────────────────────
  useEffect(() => {
    if (phase !== 'reveal') return;
    const timer = setTimeout(() => setPhase('form'), 2600);
    return () => clearTimeout(timer);
  }, [phase]);

  // ── Auto-advance from seal → onNext ──────────────────────────────────────
  useEffect(() => {
    if (phase !== 'seal') return;
    const timer = setTimeout(() => onNext(), 2200);
    return () => clearTimeout(timer);
  }, [phase, onNext]);

  // ── Mobile keyboard — scroll active input into view ──────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const handleViewportResize = () => {
      const focused = document.activeElement as HTMLElement | null;
      if (focused && (focused === emailRef.current || focused === passwordRef.current)) {
        setTimeout(() => focused.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
      }
    };

    window.visualViewport.addEventListener('resize', handleViewportResize);
    return () => window.visualViewport?.removeEventListener('resize', handleViewportResize);
  }, []);

  // ── Password strength: 0-3 ──────────────────────────────────────────────
  const getStrength = (pw: string): 0 | 1 | 2 | 3 => {
    if (pw.length === 0) return 0;
    if (pw.length < 6) return 1;
    if (pw.length < 10) return 2;
    return 3;
  };

  // ── Poetic error mapper ──────────────────────────────────────────────────
  const mapError = useCallback((raw: string): string => {
    const lower = raw.toLowerCase();
    if (lower.includes('already registered') || lower.includes('already exists') || lower.includes('email already')) {
      return t('onboarding.auth.errorAlreadyExists' as any);
    }
    if (lower.includes('password') && (lower.includes('short') || lower.includes('weak') || lower.includes('6'))) {
      return t('onboarding.auth.errorWeakPassword' as any);
    }
    return raw;
  }, [t]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleEmailSignup = async () => {
    setError(null);
    if (!email.trim()) return;
    if (password.length < 6) {
      setError(t('onboarding.auth.errorWeakPassword' as any));
      return;
    }

    setSubmitting(true);
    const { error: authError } = await signUpWithPassword(email.trim(), password);
    setSubmitting(false);

    if (authError) {
      setError(mapError(authError));
      return;
    }

    setPhase('seal');
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setGoogleRedirecting(true);
    try {
      const { error: authError } = await signInWithGoogle();
      if (authError) {
        setError(mapError(authError));
      }
    } catch (googleError) {
      const rawMessage = googleError instanceof Error ? googleError.message : 'Google sign-in failed to start.';
      setError(mapError(rawMessage));
    } finally {
      setGoogleRedirecting(false);
    }
  };

  const handleWanderer = () => {
    onNext();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEmailSignup();
    }
  };

  const strength = getStrength(password);

  if (!mounted) return <div className="min-h-[70dvh]" />;

  return (
    <div className="min-h-[70dvh] flex flex-col">
      <AnimatePresence mode="wait">

        {/* ═══════════════════════════════════════════════════════════════
            PHASE 1: REVEAL — particles converge, poetic lines appear
        ═══════════════════════════════════════════════════════════════ */}
        {phase === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.7 }}
            className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12"
          >
            {/* ── Central convergence point ── */}
            <div className="relative w-16 h-16 mb-10 flex items-center justify-center">
              {/* Orbiting particles that fly in to center */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-amber-300"
                  style={{ top: '50%', left: '50%', marginTop: -3, marginLeft: -3 }}
                  initial={{
                    x: Math.cos((i / 8) * Math.PI * 2) * 72,
                    y: Math.sin((i / 8) * Math.PI * 2) * 72,
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    x: 0,
                    y: 0,
                    opacity: [0, 0.9, 0.9, 0],
                    scale: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    delay: 0.2 + i * 0.08,
                    ease: 'easeIn',
                  }}
                />
              ))}

              {/* Central glow point — appears as particles converge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.6, type: 'spring', stiffness: 300 }}
                className="relative"
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-amber-400/40 blur-sm"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ width: 16, height: 16, top: -2, left: -2 }}
                />
                <div
                  className="w-3 h-3 rounded-full bg-amber-400"
                  style={{ boxShadow: '0 0 12px rgba(251,191,36,0.9), 0 0 24px rgba(251,191,36,0.5)' }}
                />
              </motion.div>
            </div>

            {/* ── Staggered poetic lines ── */}
            <div className="space-y-3 max-w-xs">
              {[
                { text: t('onboarding.auth.line1' as any), delay: 0.3, className: 'text-xl text-amber-100 light:text-amber-900 font-light' },
                { text: t('onboarding.auth.line2' as any), delay: 0.75, className: 'text-sm text-stone-400 light:text-stone-600 leading-relaxed' },
                { text: t('onboarding.auth.line3' as any), delay: 1.2, className: 'text-base text-stone-300 light:text-stone-700' },
                { text: t('onboarding.auth.line4' as any), delay: 1.65, className: 'text-xl text-amber-400 light:text-amber-600 italic font-light' },
              ].map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: line.delay, duration: 0.7 }}
                  className={line.className}
                >
                  {line.text}
                </motion.p>
              ))}
            </div>

            {/* ── Progress bar: auto-advances after 2.6s ── */}
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-0.5 rounded-full overflow-hidden bg-stone-800 light:bg-stone-200"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.4, ease: 'linear' }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PHASE 2: FORM — the auth form
        ═══════════════════════════════════════════════════════════════ */}
        {phase === 'form' && (
          <motion.div
            key="form"
            ref={formContainerRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.55 }}
            className="flex-1 flex flex-col py-4"
          >
            {/* ── Back button ── */}
            <motion.button
              onClick={onBack}
              initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className={`flex items-center gap-1 text-stone-500 light:text-stone-600 hover:text-stone-300 light:hover:text-stone-900 transition-colors mb-8 group ${isRTL ? 'self-end flex-row-reverse' : 'self-start'}`}
            >
              {isRTL ? (
                <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              ) : (
                <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              )}
              <span className="text-sm">{t('common.back')}</span>
            </motion.button>

            {/* ── Header ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              {/* Glowing seal icon */}
              <motion.div
                className="w-16 h-16 mx-auto mb-4 rounded-full border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-stone-900/60 light:to-stone-100 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 16px rgba(251,191,36,0.15), 0 0 32px rgba(251,191,36,0.05)',
                    '0 0 24px rgba(251,191,36,0.28), 0 0 48px rgba(251,191,36,0.12)',
                    '0 0 16px rgba(251,191,36,0.15), 0 0 32px rgba(251,191,36,0.05)',
                  ],
                }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-2xl select-none">⚜️</span>
              </motion.div>

              <h2 className="text-2xl text-white light:text-stone-900 font-light mb-1">
                {t('onboarding.auth.formTitle' as any)}
              </h2>
              <p className="text-sm text-stone-500 light:text-stone-600 leading-relaxed max-w-xs mx-auto">
                {t('onboarding.auth.formSubtitle' as any)}
              </p>
            </motion.div>

            {/* ── If Supabase not configured ── */}
            {!isConfigured && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center"
              >
                <p className="text-xs text-amber-400 light:text-amber-700">
                  {t('onboarding.auth.notConfigured' as any)}
                </p>
              </motion.div>
            )}

            {/* ── Google seal button (prominent) ── */}
            <motion.button
              onClick={handleGoogleSignup}
              disabled={submitting || !isConfigured || googleRedirecting}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/18 text-amber-200 light:text-amber-900 font-medium transition-all flex items-center justify-center gap-3 mb-5 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                boxShadow: isConfigured && !googleRedirecting ? '0 0 18px rgba(251,191,36,0.12)' : 'none',
              }}
            >
              {googleRedirecting ? (
                <motion.div
                  className="w-5 h-5 rounded-full border-2 border-amber-400/40 border-t-amber-400"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              <span>
                {googleRedirecting ? 'Connecting...' : t('onboarding.auth.sealWithGoogle' as any)}
              </span>
            </motion.button>

            {/* ── Divider ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex items-center gap-4 mb-5"
            >
              <div className="flex-1 h-px bg-stone-800/80 light:bg-stone-200" />
              <span className="text-xs text-stone-600 light:text-stone-500 select-none">
                {t('onboarding.auth.or' as any)}
              </span>
              <div className="flex-1 h-px bg-stone-800/80 light:bg-stone-200" />
            </motion.div>

            {/* ── Email field ── */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-3"
            >
              <input
                ref={emailRef}
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('onboarding.auth.emailPlaceholder' as any)}
                disabled={submitting || !isConfigured}
                className="w-full px-4 py-4 rounded-xl bg-stone-900/80 light:bg-stone-100 border border-stone-700/70 light:border-stone-300 text-white light:text-stone-900 placeholder-stone-600 light:placeholder-stone-500 transition-colors outline-none focus:border-amber-500/60 disabled:opacity-40"
                style={{ fontSize: '16px' }}
                dir="ltr"
              />
            </motion.div>

            {/* ── Password field with flame strength indicator ── */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mb-2 relative"
            >
              <input
                ref={passwordRef}
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('onboarding.auth.passwordPlaceholder' as any)}
                disabled={submitting || !isConfigured}
                className="w-full px-4 py-4 pr-20 rounded-xl bg-stone-900/80 light:bg-stone-100 border border-stone-700/70 light:border-stone-300 text-white light:text-stone-900 placeholder-stone-600 light:placeholder-stone-500 transition-colors outline-none focus:border-amber-500/60 disabled:opacity-40"
                style={{ fontSize: '16px' }}
                dir="ltr"
              />

              {/* ── Flame strength indicator ── */}
              <AnimatePresence>
                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5"
                    aria-label={`Password strength: ${strength} of 3`}
                  >
                    {[1, 2, 3].map((level) => (
                      <motion.span
                        key={level}
                        animate={{
                          opacity: strength >= level ? 1 : 0.18,
                          scale: strength >= level ? [1, 1.15, 1] : 0.85,
                          filter: strength >= level ? 'none' : 'grayscale(1)',
                        }}
                        transition={{
                          scale: strength >= level
                            ? { duration: 1.8, repeat: Infinity, delay: level * 0.18, ease: 'easeInOut' }
                            : { duration: 0 },
                          opacity: { duration: 0.25 },
                          filter: { duration: 0.25 },
                        }}
                        className="text-sm leading-none select-none"
                      >
                        🔥
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── Error message (poetic) ── */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-rose-400 light:text-rose-700 mt-2 mb-1 text-center italic"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* ── Seal button ── */}
            <motion.button
              onClick={handleEmailSignup}
              disabled={submitting || !email.trim() || !password || !isConfigured}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-semibold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                boxShadow: 'none',
              }}
            >
              {submitting ? (
                <>
                  <motion.div
                    className="w-4 h-4 rounded-full border-2 border-stone-950/30 border-t-stone-950"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                  />
                  <span>Sealing...</span>
                </>
              ) : (
                t('onboarding.auth.sealOrigin' as any)
              )}
            </motion.button>

            {/* ── Spacer ── */}
            <div className="flex-1 min-h-4" />

            {/* ── Continue as wanderer — ALWAYS visible, NEVER disabled ── */}
            <motion.button
              onClick={handleWanderer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-4 py-2 text-xs text-stone-600 light:text-stone-500 hover:text-stone-400 light:hover:text-stone-700 transition-colors self-center underline underline-offset-2 decoration-stone-700 hover:decoration-stone-500 light:decoration-stone-400"
            >
              {t('onboarding.auth.continueAsWanderer' as any)}
            </motion.button>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PHASE 3: SEAL — golden stamp animation, auto-advance
        ═══════════════════════════════════════════════════════════════ */}
        {phase === 'seal' && (
          <motion.div
            key="seal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-center text-center px-4"
          >
            {/* ── The golden seal stamp ── */}
            <motion.div
              className="relative w-32 h-32 mb-8"
              initial={{ scale: 0, rotate: -18 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
            >
              {/* Radiating glow rings */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(251,191,36,0.35), 0 0 60px rgba(251,191,36,0.15)',
                    '0 0 50px rgba(251,191,36,0.55), 0 0 90px rgba(251,191,36,0.25)',
                    '0 0 30px rgba(251,191,36,0.35), 0 0 60px rgba(251,191,36,0.15)',
                  ],
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Spinning outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-dashed border-amber-500/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              />

              {/* Seal face */}
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-amber-400/20 to-stone-900/80 light:to-stone-100 border-2 border-amber-400/60 flex items-center justify-center overflow-hidden">
                {/* Shimmer sweep */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.2) 50%, transparent 100%)',
                  }}
                />
                <span className="text-5xl relative z-10 select-none">⚜️</span>
              </div>

              {/* Particle burst */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: i % 3 === 0 ? 6 : 4,
                    height: i % 3 === 0 ? 6 : 4,
                    backgroundColor: i % 2 === 0 ? '#fbbf24' : '#fde68a',
                    top: '50%',
                    left: '50%',
                  }}
                  initial={{ x: -3, y: -3, opacity: 0, scale: 0 }}
                  animate={{
                    x: Math.cos((i / 10) * Math.PI * 2) * (56 + Math.random() * 20) - 3,
                    y: Math.sin((i / 10) * Math.PI * 2) * (56 + Math.random() * 20) - 3,
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.4, 1, 0],
                  }}
                  transition={{
                    duration: 0.9,
                    delay: 0.25 + i * 0.04,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </motion.div>

            {/* ── Sealed text ── */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="text-2xl text-amber-200 light:text-amber-800 font-light mb-2"
            >
              {t('onboarding.auth.sealedTitle' as any)}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95, duration: 0.6 }}
              className="text-sm text-stone-500 light:text-stone-600"
            >
              {t('onboarding.auth.sealedSubtitle' as any)}
            </motion.p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default AuthStep;
