'use client';

import { motion } from 'framer-motion';
import { useSiteTranslation } from '@/i18n/SiteTranslationProvider';

const rows = ['content', 'social', 'progress', 'time', 'gamification'] as const;

export default function WhyItSticks() {
  const { t } = useSiteTranslation();

  return (
    <section className="relative py-20 sm:py-28 bg-[#0a0908]">
      <div className="relative max-w-3xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-50 mb-3">
            {t('site.sticks.title')}
          </h2>
          <p className="text-amber-200/50 text-base max-w-lg mx-auto">
            {t('site.sticks.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-amber-500/10 overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-3 bg-amber-500/[0.04] border-b border-amber-500/10">
            <div className="p-3 sm:p-4 text-xs font-semibold text-amber-200/50 uppercase tracking-wider">
              {t('site.sticks.headers.feature')}
            </div>
            <div className="p-3 sm:p-4 text-xs font-semibold text-amber-200/30 uppercase tracking-wider text-center">
              {t('site.sticks.headers.others')}
            </div>
            <div className="p-3 sm:p-4 text-xs font-semibold text-amber-400 uppercase tracking-wider text-center">
              {t('site.sticks.headers.solonsway')}
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row}
              className={`grid grid-cols-3 ${i < rows.length - 1 ? 'border-b border-amber-500/5' : ''} hover:bg-amber-500/[0.02] transition-colors`}
            >
              <div className="p-3 sm:p-4 text-sm text-amber-200/70 font-medium">
                {t(`site.sticks.rows.${row}.label`)}
              </div>
              <div className="p-3 sm:p-4 text-xs text-amber-200/30 text-center flex items-center justify-center">
                <span className="inline-flex items-center gap-1">
                  <span className="text-red-400/50">✗</span>
                  <span className="hidden sm:inline">{t(`site.sticks.rows.${row}.others`)}</span>
                </span>
              </div>
              <div className="p-3 sm:p-4 text-xs text-amber-200/80 text-center flex items-center justify-center">
                <span className="inline-flex items-center gap-1">
                  <span className="text-green-400">✓</span>
                  <span className="hidden sm:inline">{t(`site.sticks.rows.${row}.ours`)}</span>
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Mobile: show text labels below table */}
        <div className="sm:hidden mt-4 space-y-2">
          {rows.map(row => (
            <div key={row} className="flex items-start gap-2 text-xs">
              <span className="text-green-400 mt-0.5 shrink-0">✓</span>
              <span className="text-amber-200/60">{t(`site.sticks.rows.${row}.ours`)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
