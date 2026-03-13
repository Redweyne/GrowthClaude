'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSiteTranslation } from '@/i18n/SiteTranslationProvider';

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-green-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

type Tier = 'free' | 'supporter' | 'founding_member';

interface EmailModalProps {
  tier: Tier;
  onClose: () => void;
  t: (key: string) => string;
}

function EmailModal({ tier, onClose, t }: EmailModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1a1816] border border-amber-500/20 rounded-2xl p-6 max-w-sm w-full"
      >
        <h3 className="text-lg font-semibold text-amber-50 mb-1">
          {tier === 'supporter' ? t('site.pricing.supporter.name') : t('site.pricing.founder.name')}
        </h3>
        <p className="text-sm text-amber-200/50 mb-4">
          {t('site.pricing.checkout.desc')}
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('site.pricing.checkout.placeholder')}
            className="w-full px-4 py-2.5 rounded-xl bg-[#0a0908] border border-amber-500/15 text-amber-50 text-sm placeholder:text-amber-200/30 focus:outline-none focus:border-amber-500/40"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl font-semibold text-sm bg-amber-500 text-[#0a0908] hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            {loading ? '...' : t('site.pricing.checkout.submit')}
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-3 w-full text-center text-xs text-amber-200/40 hover:text-amber-200/60"
        >
          {t('site.pricing.checkout.cancel')}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function PricingSection() {
  const { t } = useSiteTranslation();
  const [emailModal, setEmailModal] = useState<Tier | null>(null);

  const handlePaidCTA = (tier: Tier) => {
    setEmailModal(tier);
  };

  const features = (prefix: string) =>
    ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'].map(f => t(`${prefix}.${f}`));

  return (
    <section id="pricing" className="relative py-20 sm:py-28 bg-[#0a0908]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.015] to-transparent" />

      <div className="relative max-w-5xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-50 mb-3">
            {t('site.pricing.title')}
          </h2>
          <p className="text-amber-200/50 text-base">
            {t('site.pricing.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="rounded-2xl border border-amber-500/10 bg-amber-500/[0.02] p-5 flex flex-col"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-amber-50">{t('site.pricing.free.name')}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-amber-50">{t('site.pricing.free.price')}</span>
                <span className="text-sm text-amber-200/40">{t('site.pricing.free.period')}</span>
              </div>
            </div>
            <ul className="space-y-2.5 mb-6 flex-1">
              {features('site.pricing.free.features').map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-200/60">
                  <CheckIcon />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="/?signup=1"
              data-cta="free"
              className="block text-center py-2.5 rounded-xl font-semibold text-sm border border-amber-500/20 text-amber-200/80 hover:bg-amber-500/5 hover:text-amber-100 transition-colors"
            >
              {t('site.pricing.free.cta')}
            </a>
          </motion.div>

          {/* Supporter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-5 flex flex-col"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-amber-50">{t('site.pricing.supporter.name')}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-amber-50">{t('site.pricing.supporter.price')}</span>
                <span className="text-sm text-amber-200/40">{t('site.pricing.supporter.period')}</span>
              </div>
            </div>
            <ul className="space-y-2.5 mb-6 flex-1">
              {features('site.pricing.supporter.features').map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-200/60">
                  <CheckIcon />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePaidCTA('supporter')}
              data-cta="supporter"
              className="w-full py-2.5 rounded-xl font-semibold text-sm bg-amber-500/80 text-[#0a0908] hover:bg-amber-500 transition-colors"
            >
              {t('site.pricing.supporter.cta')}
            </button>
          </motion.div>

          {/* Founder — highlighted */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative rounded-2xl border-2 border-amber-500/40 bg-amber-500/[0.06] p-5 flex flex-col"
          >
            {/* Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-500 text-[#0a0908]">
                {t('site.pricing.founder.badge')}
              </span>
            </div>

            <div className="mb-4 mt-1">
              <h3 className="text-lg font-semibold text-amber-50">{t('site.pricing.founder.name')}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-amber-50">{t('site.pricing.founder.price')}</span>
                <span className="text-sm text-amber-200/40">{t('site.pricing.founder.period')}</span>
              </div>
            </div>
            <ul className="space-y-2.5 mb-6 flex-1">
              {features('site.pricing.founder.features').map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-200/70">
                  <CheckIcon />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePaidCTA('founding_member')}
              data-cta="founding_member"
              className="w-full py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-[#0a0908] hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/15"
            >
              {t('site.pricing.founder.cta')}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Email modal */}
      {emailModal && (
        <EmailModal
          tier={emailModal}
          onClose={() => setEmailModal(null)}
          t={t}
        />
      )}
    </section>
  );
}
