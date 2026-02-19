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

type TabType = 'overview' | 'patterns' | 'growth' | 'wisdom';

interface TransformationHubProps {
  onBack: () => void;
  onOpenAssessment: () => void;
}

export function TransformationHub({ onBack, onOpenAssessment }: TransformationHubProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const {
    name,
    totalXp,
    currentStreak,
    allReflections,
    monthlyAssessments,
    wisdomInActionLogs,
    isAssessmentDue,
    getStreakCalendarData
  } = useStore();

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Sparkles },
    { id: 'patterns' as const, label: 'Patterns', icon: Brain },
    { id: 'growth' as const, label: 'Growth', icon: TrendingUp },
    { id: 'wisdom' as const, label: 'Actions', icon: BookOpen },
  ];

  // Stats for overview
  const stats = [
    {
      label: 'Total Reflections',
      value: allReflections.length,
      icon: Brain,
      color: '#8b5cf6',
    },
    {
      label: 'Assessments',
      value: monthlyAssessments.length,
      icon: BarChart3,
      color: '#10b981',
    },
    {
      label: 'Wisdom Logs',
      value: wisdomInActionLogs.length,
      icon: BookOpen,
      color: '#f59e0b',
    },
    {
      label: 'Current Streak',
      value: `${currentStreak} days`,
      icon: Zap,
      color: '#ec4899',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-950 light:bg-stone-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-stone-950/95 light:bg-stone-50/95 backdrop-blur border-b border-stone-800 light:border-stone-200">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-stone-400 light:text-stone-600 hover:text-white light:hover:text-stone-900 transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2 text-amber-400">
              <Zap size={16} />
              <span className="text-sm font-medium">{totalXp.toLocaleString()} XP</span>
            </div>
          </div>

          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-white light:text-stone-900 mb-1">Transformation Hub</h1>
            <p className="text-stone-500 light:text-stone-500 text-sm">
              {name ? `${name}'s` : 'Your'} proof of growth
            </p>
          </div>

          {/* Tab Navigation */}
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

      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
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

              {/* Streak Calendar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Card variant="glass" padding="md">
                  <StreakCalendar />
                </Card>
              </motion.div>

              {/* Assessment CTA */}
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
                        <p className="text-white light:text-stone-900 font-medium">Monthly Assessment Due</p>
                        <p className="text-xs text-stone-400 light:text-stone-600">Measure your transformation</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Zap size={14} />
                      <span className="text-sm font-medium">+100 XP</span>
                    </div>
                  </button>
                </motion.div>
              )}

              {/* Quick Views */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-lg font-medium text-white light:text-stone-900 mb-4">Your Growth Snapshot</h2>
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

              {/* Inspiring quote */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center pt-4 pb-8"
              >
                <p className="text-stone-600 light:text-stone-500 text-sm italic">
                  &quot;The soul becomes dyed with the color of its thoughts.&quot;
                </p>
                <p className="text-stone-700 light:text-stone-500 text-xs mt-1">— Marcus Aurelius</p>
              </motion.div>
            </motion.div>
          )}

          {/* Patterns Tab */}
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

          {/* Growth Tab */}
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

          {/* Wisdom Tab */}
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
