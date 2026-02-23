'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { IdentityJourney } from './IdentityJourney';
import { useTranslation } from '@/i18n';

interface IdentityScreenProps {
  onBack: () => void;
}

export function IdentityScreen({ onBack }: IdentityScreenProps) {
  const { t, isRTL } = useTranslation();

  return (
    <div className={`min-h-screen bg-stone-950 light:bg-stone-50 ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-stone-950/80 light:bg-stone-50/80 backdrop-blur-lg border-b border-stone-800 light:border-stone-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={onBack}
              className={`p-2 ${isRTL ? '-mr-2' : '-ml-2'} text-stone-400 light:text-stone-600 hover:text-white light:hover:text-stone-900 transition-colors`}
            >
              <ChevronLeft size={24} className={isRTL ? 'rotate-180' : ''} />
            </button>
            <div className={isRTL ? 'text-right' : ''}>
              <h1 className="text-xl font-bold text-white light:text-stone-900">{t('identity.title')}</h1>
              <p className="text-sm text-stone-500 light:text-stone-500">{t('identity.defineWhoYouAre')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <IdentityJourney />
      </div>
    </div>
  );
}

export default IdentityScreen;
