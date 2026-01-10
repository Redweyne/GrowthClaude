'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  X,
  ChevronRight,
  Sparkles,
  Zap,
  BookOpen,
  Shield,
  Heart,
  Eye,
  Target,
  Clock
} from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { useSound } from '@/hooks/useSound';

// Stoic principles to choose from
const STOIC_PRINCIPLES = [
  {
    id: 'dichotomy-of-control',
    name: 'Dichotomy of Control',
    icon: Target,
    color: '#8b5cf6',
    description: 'Focusing only on what is within your control',
  },
  {
    id: 'amor-fati',
    name: 'Amor Fati',
    icon: Heart,
    color: '#ec4899',
    description: 'Loving your fate and embracing all experiences',
  },
  {
    id: 'memento-mori',
    name: 'Memento Mori',
    icon: Clock,
    color: '#64748b',
    description: 'Remembering mortality to appreciate the present',
  },
  {
    id: 'premeditatio-malorum',
    name: 'Negative Visualization',
    icon: Shield,
    color: '#f59e0b',
    description: 'Preparing mentally for potential challenges',
  },
  {
    id: 'view-from-above',
    name: 'View from Above',
    icon: Eye,
    color: '#06b6d4',
    description: 'Seeing the bigger picture beyond immediate concerns',
  },
  {
    id: 'reserve-clause',
    name: 'Reserve Clause',
    icon: BookOpen,
    color: '#10b981',
    description: '"Fate permitting" - accepting uncertain outcomes',
  },
];

interface WisdomInActionLogProps {
  compact?: boolean;
}

export function WisdomInActionLog({ compact = false }: WisdomInActionLogProps) {
  const { saveWisdomInAction, getWisdomInActionLogs } = useStore();
  const { playSparkle, playCelebration } = useSound();

  const [isAdding, setIsAdding] = useState(false);
  const [step, setStep] = useState<'principle' | 'situation' | 'application' | 'outcome'>('principle');
  const [selectedPrinciple, setSelectedPrinciple] = useState<string | null>(null);
  const [situation, setSituation] = useState('');
  const [application, setApplication] = useState('');
  const [outcome, setOutcome] = useState('');

  const logs = getWisdomInActionLogs(compact ? 3 : 10);

  const handleSelectPrinciple = (principleId: string) => {
    setSelectedPrinciple(principleId);
    playSparkle();
    setStep('situation');
  };

  const handleSubmit = () => {
    if (!selectedPrinciple || !situation || !application) return;

    saveWisdomInAction({
      situation,
      stoicPrinciple: selectedPrinciple,
      application,
      outcome,
      tags: [selectedPrinciple],
    });

    playCelebration();
    resetForm();
  };

  const resetForm = () => {
    setIsAdding(false);
    setStep('principle');
    setSelectedPrinciple(null);
    setSituation('');
    setApplication('');
    setOutcome('');
  };

  const getPrincipleById = (id: string) => {
    return STOIC_PRINCIPLES.find(p => p.id === id);
  };

  // Compact view for dashboard
  if (compact) {
    return (
      <Card variant="glass" padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white">Wisdom in Action</h3>
          <button
            onClick={() => setIsAdding(true)}
            className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/30 transition-colors"
          >
            <Plus size={14} className="text-emerald-400" />
          </button>
        </div>

        {logs.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-4">
            Record moments when you applied Stoic wisdom
          </p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => {
              const principle = getPrincipleById(log.stoicPrinciple);
              const Icon = principle?.icon || Sparkles;

              return (
                <div
                  key={log.id}
                  className="p-2 rounded-lg bg-zinc-800/50 flex items-center gap-2"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${principle?.color || '#6366f1'}20` }}
                  >
                    <Icon size={14} style={{ color: principle?.color || '#6366f1' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">{log.situation}</p>
                    <p className="text-[10px] text-zinc-500">{principle?.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add modal */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && resetForm()}
            >
              <AddWisdomModal
                step={step}
                setStep={setStep}
                selectedPrinciple={selectedPrinciple}
                onSelectPrinciple={handleSelectPrinciple}
                situation={situation}
                setSituation={setSituation}
                application={application}
                setApplication={setApplication}
                outcome={outcome}
                setOutcome={setOutcome}
                onSubmit={handleSubmit}
                onClose={resetForm}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    );
  }

  // Full view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Wisdom in Action</h2>
          <p className="text-zinc-400">Record when you apply Stoic principles in real life</p>
        </div>
        <Button onClick={() => setIsAdding(true)} size="sm">
          <Plus size={16} className="mr-1" />
          Add Entry
        </Button>
      </div>

      {/* XP info */}
      <Card variant="glass" padding="sm" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <Zap size={18} className="text-amber-400" />
        </div>
        <div>
          <p className="text-sm text-white font-medium">+15 XP per entry</p>
          <p className="text-xs text-zinc-500">
            Earn XP for applying wisdom in your daily life
          </p>
        </div>
      </Card>

      {/* Logs list */}
      {logs.length === 0 ? (
        <Card variant="glass" padding="lg" className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-purple-500/20 flex items-center justify-center">
            <BookOpen size={32} className="text-zinc-600" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Entries Yet</h3>
          <p className="text-sm text-zinc-500 mb-4">
            Start documenting moments when Stoic wisdom guided your actions.
          </p>
          <Button onClick={() => setIsAdding(true)}>
            <Plus size={16} className="mr-1" />
            Add Your First Entry
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {logs.map((log, index) => {
            const principle = getPrincipleById(log.stoicPrinciple);
            const Icon = principle?.icon || Sparkles;

            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" padding="lg">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${principle?.color || '#6366f1'}20` }}
                    >
                      <Icon size={24} style={{ color: principle?.color || '#6366f1' }} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{principle?.name}</p>
                      <p className="text-xs text-zinc-500">
                        {new Date(log.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Situation</p>
                      <p className="text-zinc-300">{log.situation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">How I Applied It</p>
                      <p className="text-zinc-300">{log.application}</p>
                    </div>
                    {log.outcome && (
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Outcome</p>
                        <p className="text-zinc-300">{log.outcome}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <AddWisdomModal
              step={step}
              setStep={setStep}
              selectedPrinciple={selectedPrinciple}
              onSelectPrinciple={handleSelectPrinciple}
              situation={situation}
              setSituation={setSituation}
              application={application}
              setApplication={setApplication}
              outcome={outcome}
              setOutcome={setOutcome}
              onSubmit={handleSubmit}
              onClose={resetForm}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Modal component for adding wisdom entries
function AddWisdomModal({
  step,
  setStep,
  selectedPrinciple,
  onSelectPrinciple,
  situation,
  setSituation,
  application,
  setApplication,
  outcome,
  setOutcome,
  onSubmit,
  onClose,
}: {
  step: 'principle' | 'situation' | 'application' | 'outcome';
  setStep: (step: 'principle' | 'situation' | 'application' | 'outcome') => void;
  selectedPrinciple: string | null;
  onSelectPrinciple: (id: string) => void;
  situation: string;
  setSituation: (s: string) => void;
  application: string;
  setApplication: (s: string) => void;
  outcome: string;
  setOutcome: (s: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const principle = selectedPrinciple ? STOIC_PRINCIPLES.find(p => p.id === selectedPrinciple) : null;
  const Icon = principle?.icon || Sparkles;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="w-full max-w-lg bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Log Wisdom in Action</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
        >
          <X size={18} className="text-zinc-400" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Principle */}
          {step === 'principle' && (
            <motion.div
              key="principle"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p className="text-zinc-400 mb-4">Which Stoic principle did you apply?</p>
              <div className="grid grid-cols-2 gap-3">
                {STOIC_PRINCIPLES.map((p) => {
                  const PIcon = p.icon;
                  return (
                    <button
                      key={p.id}
                      onClick={() => onSelectPrinciple(p.id)}
                      className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 transition-colors text-left"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                        style={{ backgroundColor: `${p.color}20` }}
                      >
                        <PIcon size={20} style={{ color: p.color }} />
                      </div>
                      <p className="text-white font-medium text-sm mb-1">{p.name}</p>
                      <p className="text-xs text-zinc-500 line-clamp-2">{p.description}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Describe Situation */}
          {step === 'situation' && (
            <motion.div
              key="situation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${principle?.color || '#6366f1'}20` }}
                >
                  <Icon size={20} style={{ color: principle?.color || '#6366f1' }} />
                </div>
                <div>
                  <p className="text-white font-medium">{principle?.name}</p>
                  <p className="text-xs text-zinc-500">{principle?.description}</p>
                </div>
              </div>

              <label className="block text-sm text-zinc-400 mb-2">
                What was the situation?
              </label>
              <textarea
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="Describe what happened..."
                className="w-full h-32 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none"
              />

              <div className="flex gap-3 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => setStep('principle')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep('application')}
                  disabled={situation.trim().length < 10}
                  className="flex-1"
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Application */}
          {step === 'application' && (
            <motion.div
              key="application"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <label className="block text-sm text-zinc-400 mb-2">
                How did you apply {principle?.name}?
              </label>
              <textarea
                value={application}
                onChange={(e) => setApplication(e.target.value)}
                placeholder="Describe how you used this principle..."
                className="w-full h-32 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none"
              />

              <div className="flex gap-3 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => setStep('situation')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep('outcome')}
                  disabled={application.trim().length < 10}
                  className="flex-1"
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Outcome (Optional) */}
          {step === 'outcome' && (
            <motion.div
              key="outcome"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <label className="block text-sm text-zinc-400 mb-2">
                What was the outcome? <span className="text-zinc-600">(optional)</span>
              </label>
              <textarea
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                placeholder="How did it turn out..."
                className="w-full h-32 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none"
              />

              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                <Zap size={16} className="text-amber-400" />
                <span className="text-sm text-amber-300">+15 XP for logging wisdom in action</span>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => setStep('application')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button onClick={onSubmit} className="flex-1">
                  <Sparkles size={16} className="mr-1" />
                  Save Entry
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default WisdomInActionLog;
