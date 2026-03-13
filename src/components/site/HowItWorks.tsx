'use client';

import { motion } from 'framer-motion';
import { useSiteTranslation } from '@/i18n/SiteTranslationProvider';

const steps = [
  { num: '01', key: 'step1', gradient: 'from-amber-400 to-amber-600', icon: '📖' },
  { num: '02', key: 'step2', gradient: 'from-blue-400 to-indigo-500', icon: '💭' },
  { num: '03', key: 'step3', gradient: 'from-emerald-400 to-teal-500', icon: '⚡' },
] as const;

export default function HowItWorks() {
  const { t } = useSiteTranslation();

  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 bg-[#0a0908]">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent" />

      <div className="relative max-w-4xl mx-auto px-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-50 mb-3">
            {t('site.howItWorks.title')}
          </h2>
          <p className="text-amber-200/50 text-base sm:text-lg">
            {t('site.howItWorks.subtitle')}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative"
            >
              <div className="relative rounded-2xl border border-amber-500/10 bg-amber-500/[0.02] p-6 h-full hover:border-amber-500/20 transition-colors">
                {/* Step number */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} mb-4`}>
                  <span className="text-xl">{step.icon}</span>
                </div>

                {/* Connector line (desktop) */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 -right-3 w-6 border-t border-dashed border-amber-500/20" />
                )}

                <h3 className="text-lg font-semibold text-amber-50 mb-2">
                  {t(`site.howItWorks.${step.key}.title`)}
                </h3>
                <p className="text-sm text-amber-200/50 leading-relaxed">
                  {t(`site.howItWorks.${step.key}.desc`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
