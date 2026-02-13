'use client';

import { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const { signUpWithPassword, isConfigured, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  async function handleSignup() {
    setErrorMessage(null);
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const { error } = await signUpWithPassword(email.trim(), password);
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
          <h2 className="text-xl font-semibold text-white light:text-stone-900">Create account</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 light:text-stone-600 hover:text-white light:hover:text-stone-900 hover:bg-stone-800 light:hover:bg-stone-200"
            aria-label="Close signup modal"
          >
            <X size={18} />
          </button>
        </div>

        {!isConfigured && (
          <p className="mb-4 text-sm text-amber-400 light:text-amber-700">
            Supabase is not configured yet. Add environment keys to enable signup.
          </p>
        )}

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
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm password"
            className="w-full rounded-xl px-4 py-3 bg-stone-800 light:bg-stone-100 border border-stone-700 light:border-stone-300 text-white light:text-stone-900 placeholder-stone-500 light:placeholder-stone-500"
          />
        </div>

        {errorMessage && <p className="text-sm text-red-400 light:text-red-700 mb-4">{errorMessage}</p>}

        <Button
          onClick={handleSignup}
          isLoading={submitting || isLoading}
          disabled={!isConfigured || !email || !password || !confirmPassword}
          className="w-full"
        >
          <UserPlus size={16} />
          Create account
        </Button>

        {onSwitchToLogin && (
          <p className="mt-4 text-sm text-stone-400 light:text-stone-600 text-center">
            Already have an account?{' '}
            <button
              type="button"
              className="text-amber-400 light:text-amber-700 hover:underline"
              onClick={onSwitchToLogin}
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
