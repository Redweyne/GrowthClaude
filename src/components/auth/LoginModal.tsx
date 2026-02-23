'use client';

import { useState } from 'react';
import { X, LogIn } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useKeyboardAware } from '@/hooks/useKeyboardAware';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup?: () => void;
}

export function LoginModal({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) {
  const { signInWithPassword, signInWithGoogle, signInAnonymously, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Keyboard + focus trap hooks (called unconditionally before any early return)
  const containerRef = useFocusTrap(isOpen, onClose);
  const { isKeyboardOpen, keyboardHeight, scrollInputIntoView } = useKeyboardAware();

  if (!isOpen) {
    return null;
  }

  async function handleEmailSignIn() {
    setSubmitting(true);
    setErrorMessage(null);
    const { error } = await signInWithPassword(email.trim(), password);
    setSubmitting(false);

    if (error) {
      setErrorMessage(error);
      return;
    }

    onClose();
  }

  async function handleGoogleSignIn() {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMessage(error);
      }
    } catch (googleError) {
      setErrorMessage(googleError instanceof Error ? googleError.message : 'Google sign-in failed to start.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAnonymousSignIn() {
    setSubmitting(true);
    setErrorMessage(null);
    const { error } = await signInAnonymously();
    setSubmitting(false);

    if (error) {
      setErrorMessage(error);
      return;
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 light:bg-stone-900/30 backdrop-blur-sm p-4 flex items-center justify-center">
      <div
        ref={containerRef}
        className="w-full max-w-md rounded-2xl bg-stone-900 light:bg-stone-50 border border-stone-700 light:border-stone-300 shadow-2xl p-6"
        style={isKeyboardOpen ? { marginBottom: `${keyboardHeight}px`, transition: 'margin-bottom 0.2s ease' } : undefined}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="login-modal-title" className="text-xl font-semibold text-white light:text-stone-900">Welcome back</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 light:text-stone-600 hover:text-white light:hover:text-stone-900 hover:bg-stone-800 light:hover:bg-stone-200 active:scale-95 transition-transform"
            aria-label="Close login modal"
          >
            <X size={18} />
          </button>
        </div>

        {!isConfigured && (
          <p className="mb-4 text-sm text-amber-400 light:text-amber-700">
            Supabase is not configured yet. Add environment keys to enable authentication.
          </p>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleEmailSignIn(); }}>
          <div className="space-y-3 mb-4">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onFocus={(e) => scrollInputIntoView(e.currentTarget)}
              placeholder="Email"
              className="w-full rounded-xl px-4 py-3 bg-stone-800 light:bg-stone-100 border border-stone-700 light:border-stone-300 text-white light:text-stone-900 placeholder-stone-500 light:placeholder-stone-500 focus:border-amber-500/60 focus:outline-none transition-colors"
            />
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onFocus={(e) => scrollInputIntoView(e.currentTarget)}
              placeholder="Password"
              className="w-full rounded-xl px-4 py-3 bg-stone-800 light:bg-stone-100 border border-stone-700 light:border-stone-300 text-white light:text-stone-900 placeholder-stone-500 light:placeholder-stone-500 focus:border-amber-500/60 focus:outline-none transition-colors"
            />
          </div>

          {errorMessage && <p className="text-sm text-red-400 light:text-red-700 mb-4">{errorMessage}</p>}

          <div className="space-y-3">
            <Button
              type="submit"
              isLoading={submitting}
              disabled={!isConfigured || !email || !password}
              className="w-full active:scale-95"
            >
              <LogIn size={16} />
              Sign in with email
            </Button>
            <Button
              onClick={handleGoogleSignIn}
              variant="secondary"
              isLoading={submitting}
              disabled={!isConfigured}
              className="w-full active:scale-95"
            >
              Continue with Google
            </Button>
            <Button
              onClick={handleAnonymousSignIn}
              variant="ghost"
              isLoading={submitting}
              disabled={!isConfigured}
              className="w-full active:scale-95"
            >
              Continue as guest
            </Button>
          </div>
        </form>

        {onSwitchToSignup && (
          <p className="mt-4 text-sm text-stone-400 light:text-stone-600 text-center">
            New here?{' '}
            <button
              type="button"
              className="text-amber-400 light:text-amber-700 hover:underline active:scale-95"
              onClick={onSwitchToSignup}
            >
              Create an account
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
