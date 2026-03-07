'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  TrendingUp,
  Brain,
  BookOpen,
  Sparkles,
  BarChart3,
  Calendar,
  Zap
} from 'lucide-react';
import { Card } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { PatternAnalysis } from './PatternAnalysis';
import { TransformationRadar } from './TransformationRadar';
import { WisdomInActionLog } from './WisdomInActionLog';
import { StreakCalendar } from './StreakCalendar';
import { useTranslation } from '@/i18n';

type TabType = 'overview' | 'patterns' | 'growth' | 'wisdom';

interface TransformationHubProps {
  onBack: () => void;
  onOpenAssessment: () => void;
}

export function TransformationHub({ onBack, onOpenAssessment }: TransformationHubProps) {
  const { locale } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const {
    name,
    totalXp,
    currentStreak,
    allReflections,
    monthlyAssessments,
    wisdomInActionLogs,
    isAssessmentDue,
  } = useStore();

  const copy = {
    en: {
      tabs: { overview: 'Overview', patterns: 'Patterns', growth: 'Growth', wisdom: 'Actions' },
      stats: {
        totalReflections: 'Total Reflections',
        assessments: 'Assessments',
        wisdomLogs: 'Wisdom Logs',
        currentStreak: 'Current Streak',
      },
      days: 'days',
      back: 'Back',
      xpSuffix: 'XP',
      title: 'Transformation Hub',
      yourProof: 'Your proof of growth',
      nameProof: "{name}'s proof of growth",
      monthlyAssessmentDue: 'Monthly Assessment Due',
      measureTransformation: 'Measure your transformation',
      yourGrowthSnapshot: 'Your Growth Snapshot',
      quote: '"The soul becomes dyed with the color of its thoughts."',
      quoteAuthor: 'Marcus Aurelius',
    },
    fr: {
      tabs: { overview: "Vue d'ensemble", patterns: 'Schémas', growth: 'Croissance', wisdom: 'Actions' },
      stats: {
        totalReflections: 'Réflexions totales',
        assessments: 'Évaluations',
        wisdomLogs: 'Journal de sagesse',
        currentStreak: 'Série actuelle',
      },
      days: 'jours',
      back: 'Retour',
      xpSuffix: 'XP',
      title: 'Hub de transformation',
      yourProof: 'Votre preuve de progression',
      nameProof: 'La preuve de progression de {name}',
      monthlyAssessmentDue: 'Évaluation mensuelle disponible',
      measureTransformation: 'Mesurez votre transformation',
      yourGrowthSnapshot: 'Aperçu de votre progression',
      quote: '"L âme se colore de la teinte de ses pensées."',
      quoteAuthor: 'Marc Aurèle',
    },
    ar: {
      tabs: { overview: 'نظرة عامة', patterns: 'الأنماط', growth: 'النمو', wisdom: 'التطبيق' },
      stats: {
        totalReflections: 'إجمالي التأملات',
        assessments: 'التقييمات',
        wisdomLogs: 'سجل الحكمة',
        currentStreak: 'السلسلة الحالية',
      },
      days: 'أيام',
      back: 'رجوع',
      xpSuffix: 'XP',
      title: 'مركز التحول',
      yourProof: 'دليلك على النمو',
      nameProof: 'دليل نمو {name}',
      monthlyAssessmentDue: 'موعد التقييم الشهري',
      measureTransformation: 'قِس تحوّلك',
      yourGrowthSnapshot: 'لقطة عن نموك',
      quote: '"تتلون الروح بلون أفكارها."',
      quoteAuthor: 'ماركوس أوريليوس',
    },
  } as const;

  const c = copy[locale] ?? copy.en;

  const tabs = [
    { id: 'overview' as const, label: c.tabs.overview, icon: Sparkles },
    { id: 'patterns' as const, label: c.tabs.patterns, icon: Brain },
    { id: 'growth' as const, label: c.tabs.growth, icon: TrendingUp },
    { id: 'wisdom' as const, label: c.tabs.wisdom, icon: BookOpen },
  ];

  const stats = [
    {
      label: c.stats.totalReflections,
      value: allReflections.length,
      icon: Brain,
      color: '#8b5cf6',
    },
    {
      label: c.stats.assessments,
      value: monthlyAssessments.length,
      icon: BarChart3,
      color: '#10b981',
    },
    {
      label: c.stats.wisdomLogs,
      value: wisdomInActionLogs.length,
      icon: BookOpen,
      color: '#f59e0b',
    },
    {
      label: c.stats.currentStreak,
      value: `${currentStreak} ${c.days}`,
      icon: Zap,
      color: '#ec4899',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-950 light:bg-stone-50 pb-20">
      <div className="sticky top-0 z-40 bg-stone-950/95 light:bg-stone-50/95 backdrop-blur border-b border-stone-800 light:border-stone-200">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-stone-400 light:text-stone-600 hover:text-white light:hover:text-stone-900 transition-colors"
            >
              <ChevronLeft size={20} />
              <span>{c.back}</span>
            </button>
            <div className="flex items-center gap-2 text-amber-400">
              <Zap size={16} />
              <span className="text-sm font-medium">{totalXp.toLocaleString()} {c.xpSuffix}</span>
            </div>
          </div>

          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-white light:text-stone-900 mb-1">{c.title}</h1>
            <p className="text-stone-500 light:text-stone-500 text-sm">
              {name ? c.nameProof.replace('{name}', name) : c.yourProof}
            </p>
          </div>

          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                      : 'bg-stone-800/50 light:bg-stone-200/50 text-stone-400 light:text-stone-600 hover:text-white light:hover:text-stone-900'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card variant="glass" padding="md" className="text-center">
                        <div
                          className="w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${stat.color}20` }}
                        >
                          <Icon size={20} style={{ color: stat.color }} />
                        </div>
                        <p className="text-xl font-bold text-white light:text-stone-900">{stat.value}</p>
                        <p className="text-xs text-stone-500 light:text-stone-500">{stat.label}</p>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Card variant="glass" padding="md">
                  <StreakCalendar />
                </Card>
              </motion.div>

              {isAssessmentDue() && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <button
                    onClick={onOpenAssessment}
                    className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-between hover:from-purple-500/30 hover:to-indigo-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Calendar size={24} className="text-purple-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-white light:text-stone-900 font-medium">{c.monthlyAssessmentDue}</p>
                        <p className="text-xs text-stone-400 light:text-stone-600">{c.measureTransformation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Zap size={14} />
                      <span className="text-sm font-medium">+100 XP</span>
                    </div>
                  </button>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-lg font-medium text-white light:text-stone-900 mb-4">{c.yourGrowthSnapshot}</h2>
                <TransformationRadar compact />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <PatternAnalysis compact />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <WisdomInActionLog compact />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center pt-4 pb-8"
              >
                <p className="text-stone-600 light:text-stone-500 text-sm italic">
                  {c.quote}
                </p>
                <p className="text-stone-700 light:text-stone-500 text-xs mt-1">- {c.quoteAuthor}</p>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'patterns' && (
            <motion.div
              key="patterns"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PatternAnalysis />
            </motion.div>
          )}

          {activeTab === 'growth' && (
            <motion.div
              key="growth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TransformationRadar />
            </motion.div>
          )}

          {activeTab === 'wisdom' && (
            <motion.div
              key="wisdom"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <WisdomInActionLog />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default TransformationHub;
