'use client';

import { motion } from 'framer-motion';
import { useSiteTranslation } from '@/i18n/SiteTranslationProvider';

export default function HeroSection() {
  const { t } = useSiteTranslation();

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-14">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-[#0a0908]">
        {/* Radial glow from top center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-amber-500/8 via-amber-900/3 to-transparent rounded-full blur-3xl" />
        {/* Secondary glow bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-amber-600/5 to-transparent rounded-full blur-3xl" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(251,191,36,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-5 text-center">
        {/* Overline badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-amber-500/20 bg-amber-500/5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-amber-200/80 font-medium tracking-wide uppercase">
            {t('site.hero.overline')}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-amber-50 leading-[1.1] tracking-tight mb-5"
        >
          {t('site.hero.headline')}
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg text-amber-200/60 leading-relaxed mb-8 max-w-lg mx-auto"
        >
          {t('site.hero.subhead')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href="/?signup=1"
            data-cta="free"
            className="group relative w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-[#0a0908] bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 text-base"
          >
            <span className="relative z-10">{t('site.hero.cta')}</span>
            <div className="absolute inset-0 rounded-full bg-amber-300/0 group-hover:bg-amber-300/20 transition-colors" />
          </a>
          <button
            onClick={() => document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-medium text-amber-200/80 border border-amber-500/20 hover:border-amber-500/40 hover:text-amber-100 transition-all"
          >
            {t('site.hero.secondary')}
          </button>
        </motion.div>

        {/* Phone mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, type: 'spring', damping: 20 }}
          className="mt-12 sm:mt-16 relative mx-auto w-[260px] sm:w-[280px]"
        >
          {/* Phone frame */}
          <div className="relative rounded-[2.5rem] border-2 border-amber-500/15 bg-[#111] p-2 shadow-2xl shadow-black/50">
            {/* Screen content mockup */}
            <div className="rounded-[2rem] overflow-hidden bg-[#0a0908] aspect-[9/19.5]">
              {/* Status bar */}
              <div className="h-10 flex items-end justify-center pb-1">
                <div className="w-20 h-5 rounded-full bg-black" />
              </div>
              {/* App UI mockup */}
              <div className="px-4 pt-2 space-y-3">
                {/* Greeting */}
                <div className="space-y-1">
                  <div className="h-2.5 w-24 rounded bg-amber-500/20" />
                  <div className="h-4 w-40 rounded bg-amber-500/30" />
                </div>
                {/* Progress bar */}
                <div className="h-2 rounded-full bg-amber-500/10">
                  <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400" />
                </div>
                {/* Cards */}
                <div className="space-y-2">
                  <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-3 space-y-2">
                    <div className="h-2.5 w-20 rounded bg-amber-400/30" />
                    <div className="h-2 w-full rounded bg-amber-200/10" />
                    <div className="h-2 w-4/5 rounded bg-amber-200/10" />
                  </div>
                  <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20" />
                      <div className="h-2.5 w-16 rounded bg-amber-400/20" />
                    </div>
                    <div className="h-2 w-full rounded bg-amber-200/10" />
                    <div className="h-2 w-3/4 rounded bg-amber-200/10" />
                  </div>
                  <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-3 space-y-2">
                    <div className="h-2.5 w-28 rounded bg-amber-400/30" />
                    <div className="flex gap-2">
                      <div className="h-8 flex-1 rounded-lg bg-amber-500/10" />
                      <div className="h-8 flex-1 rounded-lg bg-amber-500/10" />
                    </div>
                  </div>
                </div>
                {/* Bottom nav mockup */}
                <div className="flex justify-around pt-4 border-t border-amber-500/5 mt-2">
                  <div className="w-5 h-5 rounded bg-amber-500/30" />
                  <div className="w-5 h-5 rounded bg-amber-500/10" />
                  <div className="w-5 h-5 rounded bg-amber-500/10" />
                  <div className="w-5 h-5 rounded bg-amber-500/10" />
                  <div className="w-5 h-5 rounded-full bg-amber-500/10" />
                </div>
              </div>
            </div>
          </div>

          {/* Glow behind phone */}
          <div className="absolute -inset-10 bg-gradient-radial from-amber-500/10 to-transparent rounded-full blur-2xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
