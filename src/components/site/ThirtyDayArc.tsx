'use client';

import { motion } from 'framer-motion';
import { useSiteTranslation } from '@/i18n/SiteTranslationProvider';

const milestones = [
  { key: 'day1', color: 'from-amber-400 to-amber-500', position: '5%' },
  { key: 'day7', color: 'from-emerald-400 to-emerald-500', position: '25%' },
  { key: 'day14', color: 'from-blue-400 to-indigo-500', position: '55%' },
  { key: 'day30', color: 'from-purple-400 to-purple-600', position: '90%' },
] as const;

export default function ThirtyDayArc() {
  const { t } = useSiteTranslation();

  return (
    <section className="relative py-20 sm:py-28 bg-[#0a0908]">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.01] via-transparent to-transparent" />

      <div className="relative max-w-3xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-50 mb-3">
            {t('site.arc.title')}
          </h2>
          <p className="text-amber-200/50 text-base">
            {t('site.arc.subtitle')}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/30 via-amber-500/20 to-purple-500/30" />

          <div className="space-y-8">
            {milestones.map((m, i) => (
              <motion.div
                key={m.key}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative pl-14 sm:pl-20"
              >
                {/* Dot on timeline */}
                <div className={`absolute left-3.5 sm:left-6.5 top-1 w-3 h-3 rounded-full bg-gradient-to-br ${m.color} shadow-lg`}>
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${m.color} animate-ping opacity-20`} />
                </div>

                <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.02] p-4 hover:border-amber-500/20 transition-colors">
                  <span className={`inline-block text-xs font-bold mb-1 bg-gradient-to-r ${m.color} bg-clip-text text-transparent`}>
                    {t(`site.arc.${m.key}.label`)}
                  </span>
                  <p className="text-sm text-amber-200/60 leading-relaxed">
                    {t(`site.arc.${m.key}.desc`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
