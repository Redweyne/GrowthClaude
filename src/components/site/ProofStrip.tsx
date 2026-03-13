'use client';

import { motion } from 'framer-motion';
import { useSiteTranslation } from '@/i18n/SiteTranslationProvider';

export default function ProofStrip() {
  const { t } = useSiteTranslation();

  const items = [
    { icon: '🧭', text: t('site.proof.daily') },
    { icon: '🌍', text: t('site.proof.worlds') },
    { icon: '✍️', text: t('site.proof.exercises') },
    { icon: '🎭', text: t('site.proof.anonymous') },
    { icon: '🆓', text: t('site.proof.free') },
  ];

  return (
    <section id="features" className="relative bg-[#0a0908] py-6 border-y border-amber-500/5">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-2 text-sm text-amber-200/60"
            >
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
