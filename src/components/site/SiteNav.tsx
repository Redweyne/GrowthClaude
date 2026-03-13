'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteTranslation } from '@/i18n/SiteTranslationProvider';
import LanguageSwitcher from './LanguageSwitcher';

export default function SiteNav() {
  const { t } = useSiteTranslation();
  const [open, setOpen] = useState(false);

  const links = [
    { href: '#features', label: t('site.nav.features') },
    { href: '#how-it-works', label: t('site.nav.howItWorks') },
    { href: '#pricing', label: t('site.nav.pricing') },
    { href: '#faq', label: t('site.nav.faq') },
  ];

  const scrollTo = (id: string) => {
    setOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#0a0908]/80 backdrop-blur-xl border-b border-amber-500/10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <a href="/site" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <span className="text-[#0a0908] font-bold text-sm">SW</span>
          </div>
          <span className="font-semibold text-amber-50 text-sm tracking-wide">SolonsWay</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="text-sm text-amber-200/60 hover:text-amber-100 transition-colors"
            >
              {l.label}
            </button>
          ))}
          <LanguageSwitcher />
          <a
            href="/?signup=1"
            data-cta="free"
            className="px-4 py-1.5 text-sm font-medium rounded-full bg-amber-500 text-[#0a0908] hover:bg-amber-400 transition-colors"
          >
            {t('site.nav.joinBeta')}
          </a>
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setOpen(!open)}
            className="w-8 h-8 flex flex-col justify-center items-center gap-1"
            aria-label="Menu"
          >
            <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 5 : 0 }} className="block w-5 h-0.5 bg-amber-200" />
            <motion.span animate={{ opacity: open ? 0 : 1 }} className="block w-5 h-0.5 bg-amber-200" />
            <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -5 : 0 }} className="block w-5 h-0.5 bg-amber-200" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#0a0908]/95 border-b border-amber-500/10 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {links.map(l => (
                <button
                  key={l.href}
                  onClick={() => scrollTo(l.href)}
                  className="text-left text-amber-200/80 hover:text-amber-100 py-2 text-base"
                >
                  {l.label}
                </button>
              ))}
              <a
                href="/?signup=1"
                data-cta="free"
                className="mt-2 text-center px-4 py-2.5 text-sm font-medium rounded-full bg-amber-500 text-[#0a0908]"
              >
                {t('site.nav.joinBeta')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
