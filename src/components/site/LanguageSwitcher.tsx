'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteTranslation } from '@/i18n/SiteTranslationProvider';
import { languageConfig, type Locale, locales } from '@/i18n/config';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useSiteTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm text-amber-200/60 hover:text-amber-100 transition-colors"
      >
        <span>{languageConfig[locale].flag}</span>
        <span className="hidden sm:inline">{languageConfig[locale].nativeName}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full right-0 mt-2 bg-[#1a1816] border border-amber-500/20 rounded-lg overflow-hidden shadow-xl min-w-[140px]"
          >
            {locales.map(loc => (
              <button
                key={loc}
                onClick={() => { setLocale(loc as Locale); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  loc === locale ? 'bg-amber-500/10 text-amber-200' : 'text-amber-200/60 hover:bg-amber-500/5 hover:text-amber-100'
                }`}
              >
                <span>{languageConfig[loc as Locale].flag}</span>
                <span>{languageConfig[loc as Locale].nativeName}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
