'use client';

import { useState } from 'react';
import { X, LogIn } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup?: () => void;
}

export function LoginModal({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) {
  const { signInWithPassword, signInWithGoogle, signInAnonymously, isConfigured, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    const { error } = await signInWithGoogle();
    setSubmitting(false);

    if (error) {
      setErrorMessage(error);
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
      <div className="w-full max-w-md rounded-2xl bg-stone-900 light:bg-stone-50 border border-stone-700 light:border-stone-300 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-white light:text-stone-900">Welcome back</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 light:text-stone-600 hover:text-white light:hover:text-stone-900 hover:bg-stone-800 light:hover:bg-stone-200"
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              className="w-full rounded-xl px-4 py-3 bg-stone-800 light:bg-stone-100 border border-stone-700 light:border-stone-300 text-white light:text-stone-900 placeholder-stone-500 light:placeholder-stone-500"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full rounded-xl px-4 py-3 bg-stone-800 light:bg-stone-100 border border-stone-700 light:border-stone-300 text-white light:text-stone-900 placeholder-stone-500 light:placeholder-stone-500"
            />
          </div>

          {errorMessage && <p className="text-sm text-red-400 light:text-red-700 mb-4">{errorMessage}</p>}

          <div className="space-y-3">
            <Button
              type="submit"
              isLoading={submitting || isLoading}
              disabled={!isConfigured || !email || !password}
              className="w-full"
            >
              <LogIn size={16} />
              Sign in with email
            </Button>
          <Button
            onClick={handleGoogleSignIn}
            variant="secondary"
            isLoading={submitting || isLoading}
            disabled={!isConfigured}
            className="w-full"
          >
            Continue with Google
          </Button>
          <Button
            onClick={handleAnonymousSignIn}
            variant="ghost"
            isLoading={submitting || isLoading}
            disabled={!isConfigured}
            className="w-full"
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
              className="text-amber-400 light:text-amber-700 hover:underline"
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
