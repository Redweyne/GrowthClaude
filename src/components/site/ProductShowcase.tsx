'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteTranslation } from '@/i18n/SiteTranslationProvider';

const screens = ['home', 'lesson', 'echo', 'exercises', 'sparks'] as const;

// Phone screen mockup content for each feature
function ScreenContent({ screen }: { screen: string }) {
  switch (screen) {
    case 'home':
      return (
        <div className="space-y-3 px-3 pt-3">
          <div className="space-y-1">
            <div className="h-3 w-32 rounded bg-amber-500/25" />
            <div className="h-5 w-44 rounded bg-amber-500/35" />
          </div>
          <div className="h-2 rounded-full bg-amber-500/10">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400" />
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {['7', '42', 'Lv4'].map(v => (
              <div key={v} className="rounded-lg bg-amber-500/5 border border-amber-500/10 p-2 text-center">
                <div className="text-amber-400 font-bold text-xs">{v}</div>
                <div className="h-1.5 w-10 mx-auto mt-1 rounded bg-amber-200/10" />
              </div>
            ))}
          </div>
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl bg-amber-500/[0.04] border border-amber-500/10 p-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-amber-500/20" />
                <div className="h-2.5 w-20 rounded bg-amber-400/25" />
              </div>
              <div className="h-2 w-full rounded bg-amber-200/8" />
              <div className="h-2 w-3/4 rounded bg-amber-200/8" />
            </div>
          ))}
        </div>
      );
    case 'lesson':
      return (
        <div className="space-y-3 px-3 pt-3">
          <div className="h-4 w-36 rounded bg-amber-500/30" />
          <div className="h-2 w-20 rounded bg-amber-400/15" />
          <div className="space-y-1.5 mt-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-2 rounded bg-amber-200/8" style={{ width: `${70 + Math.random() * 30}%` }} />
            ))}
          </div>
          <div className="mt-3 p-3 rounded-xl border border-amber-500/15 bg-amber-500/[0.04]">
            <div className="h-2.5 w-16 rounded bg-amber-400/25 mb-2" />
            <div className="h-2 w-full rounded bg-amber-200/8" />
            <div className="h-2 w-5/6 rounded bg-amber-200/8 mt-1" />
          </div>
          <div className="flex gap-2 mt-2">
            <div className="h-8 flex-1 rounded-lg bg-amber-500/15" />
            <div className="h-8 flex-1 rounded-lg bg-amber-500/10" />
          </div>
        </div>
      );
    case 'echo':
      return (
        <div className="space-y-3 px-3 pt-3">
          <div className="h-4 w-32 rounded bg-amber-500/30" />
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-xl bg-amber-500/[0.03] border border-amber-500/10 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400/30 to-amber-600/30" />
                <div className="h-2 w-16 rounded bg-amber-200/15" />
              </div>
              <div className="h-2 w-full rounded bg-amber-200/8" />
              <div className="h-2 w-4/5 rounded bg-amber-200/8" />
              <div className="flex gap-3">
                <div className="h-2 w-8 rounded bg-amber-400/15" />
                <div className="h-2 w-6 rounded bg-amber-400/10" />
              </div>
            </div>
          ))}
        </div>
      );
    case 'exercises':
      return (
        <div className="space-y-3 px-3 pt-3">
          <div className="h-4 w-36 rounded bg-amber-500/30" />
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-12 rounded bg-green-400/30" />
            <div className="h-2 w-20 rounded bg-amber-200/10" />
          </div>
          {['Reframe', 'Gratitude', 'Imagine', 'Apply', 'Commit'].map((ex, i) => (
            <div key={ex} className="flex items-center gap-3 rounded-xl bg-amber-500/[0.03] border border-amber-500/10 p-3">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${i < 2 ? 'bg-green-500/20 text-green-400' : i === 2 ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-500/5 text-amber-500/30'}`}>
                {i < 2 ? '✓' : i + 1}
              </div>
              <div className="flex-1">
                <div className="h-2.5 w-20 rounded bg-amber-400/20" />
                <div className="h-2 w-32 rounded bg-amber-200/8 mt-1" />
              </div>
            </div>
          ))}
        </div>
      );
    case 'sparks':
      return (
        <div className="relative h-full">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
            </div>
            <div className="text-center mt-2">
              <div className="h-3 w-40 mx-auto rounded bg-white/30" />
              <div className="h-2 w-28 mx-auto rounded bg-white/15 mt-2" />
            </div>
          </div>
          {/* Like/share buttons */}
          <div className="absolute right-3 bottom-20 space-y-4">
            {['❤️', '💬', '↗️'].map((icon, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">{icon}</div>
                <div className="h-1.5 w-5 rounded bg-white/15" />
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function ProductShowcase() {
  const { t } = useSiteTranslation();
  const [active, setActive] = useState(0);

  return (
    <section className="relative py-20 sm:py-28 bg-[#0a0908]">
      <div className="relative max-w-4xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-50 mb-3">
            {t('site.showcase.title')}
          </h2>
          <p className="text-amber-200/50 text-base">
            {t('site.showcase.subtitle')}
          </p>
        </motion.div>

        {/* Tab pills */}
        <div className="flex justify-center gap-2 flex-wrap mb-8">
          {screens.map((s, i) => (
            <button
              key={s}
              onClick={() => setActive(i)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                i === active
                  ? 'bg-amber-500 text-[#0a0908]'
                  : 'bg-amber-500/5 text-amber-200/50 hover:text-amber-200/80 border border-amber-500/10'
              }`}
            >
              {t(`site.showcase.screens.${s}`)}
            </button>
          ))}
        </div>

        {/* Phone with screen */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative w-[260px] sm:w-[280px]"
          >
            <div className="relative rounded-[2.5rem] border-2 border-amber-500/15 bg-[#111] p-2 shadow-2xl shadow-black/50">
              <div className="rounded-[2rem] overflow-hidden bg-[#0a0908] aspect-[9/19.5]">
                {/* Notch */}
                <div className="h-10 flex items-end justify-center pb-1">
                  <div className="w-20 h-5 rounded-full bg-black" />
                </div>
                {/* Screen content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="h-[calc(100%-2.5rem)]"
                  >
                    <ScreenContent screen={screens[active]} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            {/* Glow */}
            <div className="absolute -inset-10 bg-gradient-radial from-amber-500/8 to-transparent rounded-full blur-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
