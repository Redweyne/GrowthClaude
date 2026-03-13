'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteTranslation } from '@/i18n/SiteTranslationProvider';

const questions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;

function FAQItem({ qKey, t }: { qKey: string; t: (key: string) => string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-amber-500/5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm sm:text-base text-amber-50 font-medium pr-4">
          {t(`site.faq.${qKey}.q`)}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          className="text-amber-500 text-xl shrink-0 leading-none"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-amber-200/50 leading-relaxed">
              {t(`site.faq.${qKey}.a`)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const { t } = useSiteTranslation();

  return (
    <section id="faq" className="relative py-20 sm:py-28 bg-[#0a0908]">
      <div className="relative max-w-2xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-50 mb-3">
            {t('site.faq.title')}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-amber-500/10 bg-amber-500/[0.02] px-5"
        >
          {questions.map(q => (
            <FAQItem key={q} qKey={q} t={t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
