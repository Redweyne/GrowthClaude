'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, ChevronRight, CheckCircle, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { FlexibleWorld } from '@/types/lessons';
import { useTranslation } from '@/i18n';

interface WorldSwitcherProps {
    worlds: FlexibleWorld[];
    currentWorldSlug: string;
    onSelectWorld: (worldSlug: string) => void;
    onClose: () => void;
}

const WORLD_ICONS: Record<string, React.ElementType> = {
    Sparkles: Sparkles,
    Flame: Flame,
};

export function WorldSwitcher({
    worlds,
    currentWorldSlug,
    onSelectWorld,
    onClose,
}: WorldSwitcherProps) {
    const { completedLessons } = useStore();
    const { t, isRTL } = useTranslation();

    // Calculate progress for each world
    const getWorldProgress = (world: FlexibleWorld) => {
        const allLessons = world.chapters.flatMap((ch) => ch.lessons);
        const completed = allLessons.filter((l) => completedLessons[l.id]).length;
        return {
            completed,
            total: allLessons.length,
            percentage: Math.round((completed / allLessons.length) * 100),
        };
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`relative w-full max-w-md bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl ${isRTL ? 'rtl' : ''}`}
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header */}
                <div className="p-6 pb-4 border-b border-zinc-800">
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={isRTL ? 'text-right' : ''}>
                            <h2 className="text-xl font-bold text-white">{t('world.chooseYourPath')}</h2>
                            <p className="text-sm text-zinc-500 mt-1">{t('world.switchBetweenWorlds')}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                        >
                            <X size={20} className="text-zinc-400" />
                        </button>
                    </div>
                </div>

                {/* World List */}
                <div className="p-4 space-y-3">
                    {worlds.map((world) => {
                        const progress = getWorldProgress(world);
                        const isActive = world.slug === currentWorldSlug;
                        const Icon = WORLD_ICONS[world.iconName] || Sparkles;

                        return (
                            <motion.button
                                key={world.id}
                                onClick={() => {
                                    onSelectWorld(world.slug);
                                    onClose();
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full p-4 rounded-2xl border transition-all text-left ${isActive
                                        ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30'
                                        : 'bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{
                                            background: `linear-gradient(135deg, ${world.color}20, ${world.color}40)`,
                                            borderColor: `${world.color}50`,
                                            borderWidth: 1,
                                        }}
                                    >
                                        <Icon size={24} style={{ color: world.color }} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-white truncate">{world.name}</h3>
                                            {isActive && (
                                                <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded-full">
                                                    {t('world.active')}
                                                </span>
                                            )}
                                            {progress.percentage === 100 && (
                                                <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-sm text-zinc-400 mt-0.5">{world.subtitle}</p>

                                        {/* Progress bar */}
                                        <div className="mt-3">
                                            <div className={`flex items-center justify-between text-xs text-zinc-500 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                <span>{t('world.lessonsCount').replace('{completed}', progress.completed.toString()).replace('{total}', progress.total.toString())}</span>
                                                <span>{progress.percentage}%</span>
                                            </div>
                                            <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress.percentage}%` }}
                                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                                    className="h-full rounded-full"
                                                    style={{
                                                        background: `linear-gradient(to right, ${world.color}, ${world.color}cc)`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <ChevronRight
                                        size={20}
                                        className={`flex-shrink-0 mt-3 ${isActive ? 'text-amber-400' : 'text-zinc-600'
                                            }`}
                                    />
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Footer hint */}
                <div className="p-4 pt-2 text-center">
                    <p className="text-xs text-zinc-600">
                        {t('world.progressSaved')}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default WorldSwitcher;
