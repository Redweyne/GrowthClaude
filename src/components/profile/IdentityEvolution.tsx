'use client';

import { motion } from 'framer-motion';
import { Fingerprint } from 'lucide-react';
import type { IdentityStatement } from '@/types/identity';
import { useTranslation } from '@/i18n';

interface IdentityEvolutionProps {
  statements: IdentityStatement[];
}

export function IdentityEvolution({ statements }: IdentityEvolutionProps) {
  const { t } = useTranslation();
  if (statements.length === 0) return null;

  // Most recent first
  const sorted = [...statements].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <motion.div
      className="px-5 mt-6"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
    >
      <h3 className="text-sm font-medium uppercase tracking-wider text-stone-500 mb-4">
        {t('profilePage.myEvolution')}
      </h3>

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-amber-700/40 via-stone-800 to-transparent" />

        {sorted.map((stmt, i) => {
          const isLatest = i === 0;
          const date = new Date(stmt.createdAt);
          const dayLabel = formatRelativeDate(date, t);

          return (
            <motion.div
              key={stmt.id}
              className="relative flex gap-3 pb-5 last:pb-0"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.55 + i * 0.06,
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
            >
              {/* Node dot */}
              <div className="relative flex-shrink-0 mt-1">
                {isLatest ? (
                  <div className="relative">
                    <motion.div
                      className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center"
                      animate={{
                        boxShadow: [
                          '0 0 0px rgba(251,191,36,0.2)',
                          '0 0 12px rgba(251,191,36,0.4)',
                          '0 0 0px rgba(251,191,36,0.2)',
                        ],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
                    </motion.div>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-stone-600" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-stone-600 mb-1">{dayLabel}</div>
                <p
                  className={`text-sm leading-relaxed ${
                    isLatest
                      ? 'text-amber-200/80 light:text-stone-700'
                      : 'text-stone-400 light:text-stone-500'
                  }`}
                  style={{
                    fontSize: isLatest ? 14 : Math.max(12, 14 - i * 0.5),
                    opacity: isLatest ? 1 : Math.max(0.5, 1 - i * 0.1),
                  }}
                >
                  &ldquo;{stmt.statement}&rdquo;
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function formatRelativeDate(date: Date, t: (key: string) => string): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return t('common.today');
  if (diffDays === 1) return t('common.yesterday');
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
