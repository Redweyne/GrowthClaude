'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, ChevronRight, Calendar } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui';
import { IdentityPromptModal } from './IdentityPromptModal';
import { useTranslation } from '@/i18n';

export function IdentityJourney() {
  const { getIdentityStatements, name } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t, isRTL, locale } = useTranslation();

  const statements = getIdentityStatements();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const localeMap: Record<string, string> = {
      en: 'en-US',
      fr: 'fr-FR',
      ar: 'ar-SA',
    };
    return date.toLocaleDateString(localeMap[locale] || 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getContextLabel = (context: { type: string; description: string }) => {
    return context.description || context.type;
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : ''}>
          <h2 className={`text-xl font-bold text-white light:text-stone-900 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Sparkles className="w-5 h-5 text-amber-400" />
            {t('identity.title')}
          </h2>
          <p className="text-sm text-stone-400 light:text-stone-600 mt-1">
            {statements.length === 0
              ? t('identity.defineWhoYouAre')
              : t('identity.statementsCount').replace('{count}', statements.length.toString())}
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="secondary"
          className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Plus size={16} />
          {t('common.add')}
        </Button>
      </div>

      {/* Empty state */}
      {statements.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-amber-500/5 to-purple-500/5 border border-amber-500/20 rounded-2xl p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-white light:text-stone-900 mb-2">
            {t('identity.whoAreYouBecoming')}
          </h3>
          <p className="text-stone-400 light:text-stone-600 text-sm mb-6 max-w-xs mx-auto">
            {t('identity.emptyStateDescription')}
          </p>
          <Button onClick={() => setIsModalOpen(true)} className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Sparkles size={16} className={isRTL ? 'ml-2' : 'mr-2'} />
            {t('identity.createFirstStatement')}
          </Button>
        </motion.div>
      )}

      {/* Timeline */}
      {statements.length > 0 && (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/50 via-purple-500/30 to-transparent" />

          {/* Statements */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {statements.map((statement, index) => (
                <motion.div
                  key={statement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-14"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-4 w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-stone-900 light:border-stone-100 shadow-lg shadow-amber-500/30" />

                  {/* Card */}
                  <div className="bg-stone-900/50 light:bg-stone-100/50 border border-stone-800 light:border-stone-200 rounded-xl p-4 hover:border-amber-500/30 transition-colors group">
                    {/* Date and context */}
                    <div className="flex items-center gap-2 text-xs text-stone-500 light:text-stone-500 mb-2">
                      <Calendar size={12} />
                      <span>{formatDate(statement.createdAt)}</span>
                      <span className="text-stone-700 light:text-stone-500">|</span>
                      <span className="text-amber-400/70">
                        {getContextLabel(statement.context)}
                      </span>
                    </div>

                    {/* Statement */}
                    <p className="text-white light:text-stone-900 leading-relaxed">
                      <span className="text-amber-400 font-medium">{t('identity.iAmSomeoneWho')} </span>
                      {statement.statement.replace(/^I am someone who\s*/i, '')}
                    </p>

                    {/* Tags */}
                    {statement.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {statement.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-stone-800 light:bg-stone-200 rounded-full text-xs text-stone-400 light:text-stone-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Evolution summary */}
          {statements.length >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`mt-6 ${isRTL ? 'mr-14' : 'ml-14'} bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 rounded-xl p-4`}
            >
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <ChevronRight className={`w-4 h-4 text-amber-400 ${isRTL ? 'rotate-180' : ''}`} />
                <span className="text-sm font-medium text-amber-400">{t('identity.yourEvolution')}</span>
              </div>
              <p className={`text-sm text-stone-300 light:text-stone-700 ${isRTL ? 'text-right' : ''}`}>
                {t('identity.evolutionMessage')
                  .replace('{name}', name || '')
                  .replace('{count}', statements.length.toString())}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Modal */}
      <IdentityPromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        context={{
          type: 'manual',
          trigger: 'manual',
          description: t('identity.selfInitiated'),
        }}
      />
    </div>
  );
}

export default IdentityJourney;
