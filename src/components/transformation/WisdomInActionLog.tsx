'use client';

import { useMemo, useState } from 'react';
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
import { useAudio } from '@/hooks/useAudio';
import { useTranslation } from '@/i18n';

type Step = 'principle' | 'situation' | 'application' | 'outcome';

interface WisdomInActionLogProps {
  compact?: boolean;
}

interface PrincipleBase {
  id: string;
  icon: typeof Target;
  color: string;
}

interface PrincipleText {
  name: string;
  description: string;
}

interface Principle extends PrincipleBase, PrincipleText {}

const STOIC_PRINCIPLE_BASE: PrincipleBase[] = [
  {
    id: 'dichotomy-of-control',
    icon: Target,
    color: '#8b5cf6',
  },
  {
    id: 'amor-fati',
    icon: Heart,
    color: '#ec4899',
  },
  {
    id: 'memento-mori',
    icon: Clock,
    color: '#64748b',
  },
  {
    id: 'premeditatio-malorum',
    icon: Shield,
    color: '#f59e0b',
  },
  {
    id: 'view-from-above',
    icon: Eye,
    color: '#06b6d4',
  },
  {
    id: 'reserve-clause',
    icon: BookOpen,
    color: '#10b981',
  },
];

export function WisdomInActionLog({ compact = false }: WisdomInActionLogProps) {
  const { locale } = useTranslation();
  const { saveWisdomInAction, getWisdomInActionLogs } = useStore();
  const { playSparkle, playCelebrate } = useAudio();

  const principleText = {
    en: {
      'dichotomy-of-control': {
        name: 'Dichotomy of Control',
        description: 'Focusing only on what is within your control',
      },
      'amor-fati': {
        name: 'Amor Fati',
        description: 'Loving your fate and embracing all experiences',
      },
      'memento-mori': {
        name: 'Memento Mori',
        description: 'Remembering mortality to appreciate the present',
      },
      'premeditatio-malorum': {
        name: 'Negative Visualization',
        description: 'Preparing mentally for potential challenges',
      },
      'view-from-above': {
        name: 'View from Above',
        description: 'Seeing the bigger picture beyond immediate concerns',
      },
      'reserve-clause': {
        name: 'Reserve Clause',
        description: '"Fate permitting" - accepting uncertain outcomes',
      },
    },
    fr: {
      'dichotomy-of-control': {
        name: 'Dichotomie du contrôle',
        description: 'Se concentrer uniquement sur ce qui dépend de vous',
      },
      'amor-fati': {
        name: 'Amor Fati',
        description: 'Aimer son destin et accueillir toutes les expériences',
      },
      'memento-mori': {
        name: 'Memento Mori',
        description: 'Se rappeler sa mortalité pour valoriser le présent',
      },
      'premeditatio-malorum': {
        name: 'Visualisation négative',
        description: 'Se préparer mentalement aux difficultés possibles',
      },
      'view-from-above': {
        name: "Vue d'en haut",
        description: "Voir la vue d'ensemble au-delà des soucis immédiats",
      },
      'reserve-clause': {
        name: 'Clause de réserve',
        description: '"Si le destin le permet" - accepter les issues incertaines',
      },
    },
    ar: {
      'dichotomy-of-control': {
        name: 'ثنائية التحكم',
        description: 'التركيز فقط على ما يقع ضمن سيطرتك',
      },
      'amor-fati': {
        name: 'حب القدر',
        description: 'حب قدرك واحتضان كل التجارب',
      },
      'memento-mori': {
        name: 'تذكّر الموت',
        description: 'تذكر فناء الحياة لتقدير الحاضر',
      },
      'premeditatio-malorum': {
        name: 'التصور السلبي',
        description: 'الاستعداد الذهني للتحديات المحتملة',
      },
      'view-from-above': {
        name: 'النظر من الأعلى',
        description: 'رؤية الصورة الكبرى بعيداً عن القلق المباشر',
      },
      'reserve-clause': {
        name: 'شرط التحفّظ',
        description: '"إن شاء القدر" - تقبل النتائج غير المؤكدة',
      },
    },
  } as const;

  const copy = {
    en: {
      title: 'Wisdom in Action',
      compactEmpty: 'Record moments when you applied Stoic wisdom',
      fullSubtitle: 'Record when you apply Stoic principles in real life',
      addEntry: 'Add Entry',
      xpPerEntry: '+15 XP per entry',
      xpHelper: 'Earn XP for applying wisdom in your daily life',
      noEntries: 'No Entries Yet',
      noEntriesBody: 'Start documenting moments when Stoic wisdom guided your actions.',
      addFirstEntry: 'Add Your First Entry',
      situation: 'Situation',
      howApplied: 'How I Applied It',
      outcome: 'Outcome',
      logTitle: 'Log Wisdom in Action',
      principleQuestion: 'Which Stoic principle did you apply?',
      situationQuestion: 'What was the situation?',
      situationPlaceholder: 'Describe what happened...',
      back: 'Back',
      next: 'Next',
      applicationQuestion: 'How did you apply {principle}?',
      applicationPlaceholder: 'Describe how you used this principle...',
      outcomeQuestion: 'What was the outcome?',
      optional: '(optional)',
      outcomePlaceholder: 'How did it turn out...',
      xpForLog: '+15 XP for logging wisdom in action',
      saveEntry: 'Save Entry',
    },
    fr: {
      title: 'Sagesse en action',
      compactEmpty: 'Notez les moments où vous avez appliqué la sagesse stoïcienne',
      fullSubtitle: 'Enregistrez quand vous appliquez les principes stoïciens dans la vie réelle',
      addEntry: 'Ajouter une entrée',
      xpPerEntry: '+15 XP par entrée',
      xpHelper: 'Gagnez des XP en appliquant la sagesse au quotidien',
      noEntries: 'Aucune entrée pour le moment',
      noEntriesBody: 'Commencez à documenter les moments où la sagesse stoïcienne a guidé vos actions.',
      addFirstEntry: 'Ajouter votre première entrée',
      situation: 'Situation',
      howApplied: "Comment je l'ai appliqué",
      outcome: 'Résultat',
      logTitle: 'Journal de sagesse en action',
      principleQuestion: 'Quel principe stoïcien avez-vous appliqué ?',
      situationQuestion: 'Quelle était la situation ?',
      situationPlaceholder: "Décrivez ce qui s'est passé...",
      back: 'Retour',
      next: 'Suivant',
      applicationQuestion: 'Comment avez-vous appliqué {principle} ?',
      applicationPlaceholder: 'Décrivez comment vous avez utilisé ce principe...',
      outcomeQuestion: 'Quel a été le résultat ?',
      optional: '(optionnel)',
      outcomePlaceholder: "Comment cela s'est terminé...",
      xpForLog: '+15 XP pour chaque note de sagesse en action',
      saveEntry: "Enregistrer l'entrée",
    },
    ar: {
      title: 'الحكمة في التطبيق',
      compactEmpty: 'سجّل اللحظات التي طبّقت فيها الحكمة الرواقية',
      fullSubtitle: 'سجّل متى تطبق المبادئ الرواقية في حياتك الواقعية',
      addEntry: 'إضافة إدخال',
      xpPerEntry: '+15 XP لكل إدخال',
      xpHelper: 'اكسب XP عند تطبيق الحكمة في حياتك اليومية',
      noEntries: 'لا توجد إدخالات بعد',
      noEntriesBody: 'ابدأ بتوثيق اللحظات التي وجّهت فيها الحكمة الرواقية أفعالك.',
      addFirstEntry: 'أضف إدخالك الأول',
      situation: 'الموقف',
      howApplied: 'كيف طبّقت ذلك',
      outcome: 'النتيجة',
      logTitle: 'تسجيل الحكمة في التطبيق',
      principleQuestion: 'أي مبدأ رواقي طبّقت؟',
      situationQuestion: 'ما كان الموقف؟',
      situationPlaceholder: 'صف ما حدث...',
      back: 'رجوع',
      next: 'التالي',
      applicationQuestion: 'كيف طبّقت {principle}؟',
      applicationPlaceholder: 'صف كيف استخدمت هذا المبدأ...',
      outcomeQuestion: 'ما النتيجة؟',
      optional: '(اختياري)',
      outcomePlaceholder: 'كيف انتهى الأمر...',
      xpForLog: '+15 XP لتسجيل الحكمة في التطبيق',
      saveEntry: 'حفظ الإدخال',
    },
  } as const;

  const c = copy[locale] ?? copy.en;
  const localeTag = locale === 'ar' ? 'ar' : locale === 'fr' ? 'fr-FR' : 'en-US';

  const principles = useMemo<Principle[]>(() => {
    const texts = principleText[locale] ?? principleText.en;
    return STOIC_PRINCIPLE_BASE.map((principle) => ({
      ...principle,
      ...(texts[principle.id as keyof typeof texts] ?? principleText.en[principle.id as keyof typeof principleText.en]),
    }));
  }, [locale]);

  const [isAdding, setIsAdding] = useState(false);
  const [step, setStep] = useState<Step>('principle');
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

    playCelebrate();
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

  const getPrincipleById = (id: string) => principles.find((principle) => principle.id === id);

  if (compact) {
    return (
      <Card variant="glass" padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white light:text-stone-900">{c.title}</h3>
          <button
            onClick={() => setIsAdding(true)}
            className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/30 transition-colors"
          >
            <Plus size={14} className="text-emerald-400" />
          </button>
        </div>

        {logs.length === 0 ? (
          <p className="text-xs text-stone-500 light:text-stone-500 text-center py-4">
            {c.compactEmpty}
          </p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => {
              const principle = getPrincipleById(log.stoicPrinciple);
              const Icon = principle?.icon || Sparkles;

              return (
                <div
                  key={log.id}
                  className="p-2 rounded-lg bg-stone-800/50 light:bg-stone-200/50 flex items-center gap-2"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${principle?.color || '#6366f1'}20` }}
                  >
                    <Icon size={14} style={{ color: principle?.color || '#6366f1' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white light:text-stone-900 truncate">{log.situation}</p>
                    <p className="text-[10px] text-stone-500 light:text-stone-500">{principle?.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 light:bg-stone-900/50 flex items-center justify-center p-4"
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
                copy={c}
                principles={principles}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white light:text-stone-900">{c.title}</h2>
          <p className="text-stone-400 light:text-stone-600">{c.fullSubtitle}</p>
        </div>
        <Button onClick={() => setIsAdding(true)} size="sm">
          <Plus size={16} className="mr-1" />
          {c.addEntry}
        </Button>
      </div>

      <Card variant="glass" padding="sm" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <Zap size={18} className="text-amber-400" />
        </div>
        <div>
          <p className="text-sm text-white light:text-stone-900 font-medium">{c.xpPerEntry}</p>
          <p className="text-xs text-stone-500 light:text-stone-500">
            {c.xpHelper}
          </p>
        </div>
      </Card>

      {logs.length === 0 ? (
        <Card variant="glass" padding="lg" className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-purple-500/20 flex items-center justify-center">
            <BookOpen size={32} className="text-stone-600 light:text-stone-500" />
          </div>
          <h3 className="text-lg font-medium text-white light:text-stone-900 mb-2">{c.noEntries}</h3>
          <p className="text-sm text-stone-500 light:text-stone-500 mb-4">
            {c.noEntriesBody}
          </p>
          <Button onClick={() => setIsAdding(true)}>
            <Plus size={16} className="mr-1" />
            {c.addFirstEntry}
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
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${principle?.color || '#6366f1'}20` }}
                    >
                      <Icon size={24} style={{ color: principle?.color || '#6366f1' }} />
                    </div>
                    <div>
                      <p className="text-white light:text-stone-900 font-medium">{principle?.name}</p>
                      <p className="text-xs text-stone-500 light:text-stone-500">
                        {new Date(log.date).toLocaleDateString(localeTag, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-stone-500 light:text-stone-500 uppercase tracking-wide mb-1">{c.situation}</p>
                      <p className="text-stone-300 light:text-stone-700">{log.situation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 light:text-stone-500 uppercase tracking-wide mb-1">{c.howApplied}</p>
                      <p className="text-stone-300 light:text-stone-700">{log.application}</p>
                    </div>
                    {log.outcome && (
                      <div>
                        <p className="text-xs text-stone-500 light:text-stone-500 uppercase tracking-wide mb-1">{c.outcome}</p>
                        <p className="text-stone-300 light:text-stone-700">{log.outcome}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 light:bg-stone-900/50 flex items-center justify-center p-4"
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
              copy={c}
              principles={principles}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
  copy,
  principles,
}: {
  step: Step;
  setStep: (step: Step) => void;
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
  copy: {
    logTitle: string;
    principleQuestion: string;
    situationQuestion: string;
    situationPlaceholder: string;
    back: string;
    next: string;
    applicationQuestion: string;
    applicationPlaceholder: string;
    outcomeQuestion: string;
    optional: string;
    outcomePlaceholder: string;
    xpForLog: string;
    saveEntry: string;
  };
  principles: Principle[];
}) {
  const principle = selectedPrinciple ? principles.find((p) => p.id === selectedPrinciple) : null;
  const Icon = principle?.icon || Sparkles;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="w-full max-w-lg bg-stone-900 light:bg-stone-100 rounded-2xl border border-stone-800 light:border-stone-200 overflow-hidden"
    >
      <div className="p-4 border-b border-stone-800 light:border-stone-200 flex items-center justify-between">
        <h3 className="text-lg font-medium text-white light:text-stone-900">{copy.logTitle}</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-stone-800 light:bg-stone-200 flex items-center justify-center hover:bg-stone-700 light:hover:bg-stone-300 transition-colors"
        >
          <X size={18} className="text-stone-400 light:text-stone-600" />
        </button>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {step === 'principle' && (
            <motion.div
              key="principle"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p className="text-stone-400 light:text-stone-600 mb-4">{copy.principleQuestion}</p>
              <div className="grid grid-cols-2 gap-3">
                {principles.map((p) => {
                  const PIcon = p.icon;
                  return (
                    <button
                      key={p.id}
                      onClick={() => onSelectPrinciple(p.id)}
                      className="p-4 rounded-xl bg-stone-800/50 light:bg-stone-200/50 border border-stone-700 light:border-stone-300 hover:border-stone-600 light:hover:border-stone-400 transition-colors text-left"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                        style={{ backgroundColor: `${p.color}20` }}
                      >
                        <PIcon size={20} style={{ color: p.color }} />
                      </div>
                      <p className="text-white light:text-stone-900 font-medium text-sm mb-1">{p.name}</p>
                      <p className="text-xs text-stone-500 light:text-stone-500 line-clamp-2">{p.description}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

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
                  <p className="text-white light:text-stone-900 font-medium">{principle?.name}</p>
                  <p className="text-xs text-stone-500 light:text-stone-500">{principle?.description}</p>
                </div>
              </div>

              <label className="block text-sm text-stone-400 light:text-stone-600 mb-2">
                {copy.situationQuestion}
              </label>
              <textarea
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder={copy.situationPlaceholder}
                className="w-full h-32 px-4 py-3 bg-stone-800 light:bg-stone-200 border border-stone-700 light:border-stone-300 rounded-xl text-white light:text-stone-900 placeholder-stone-500 light:placeholder-stone-400 focus:outline-none focus:border-purple-500 resize-none"
              />

              <div className="flex gap-3 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => setStep('principle')}
                  className="flex-1"
                >
                  {copy.back}
                </Button>
                <Button
                  onClick={() => setStep('application')}
                  disabled={situation.trim().length < 10}
                  className="flex-1"
                >
                  {copy.next}
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'application' && (
            <motion.div
              key="application"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <label className="block text-sm text-stone-400 light:text-stone-600 mb-2">
                {copy.applicationQuestion.replace('{principle}', principle?.name || '')}
              </label>
              <textarea
                value={application}
                onChange={(e) => setApplication(e.target.value)}
                placeholder={copy.applicationPlaceholder}
                className="w-full h-32 px-4 py-3 bg-stone-800 light:bg-stone-200 border border-stone-700 light:border-stone-300 rounded-xl text-white light:text-stone-900 placeholder-stone-500 light:placeholder-stone-400 focus:outline-none focus:border-purple-500 resize-none"
              />

              <div className="flex gap-3 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => setStep('situation')}
                  className="flex-1"
                >
                  {copy.back}
                </Button>
                <Button
                  onClick={() => setStep('outcome')}
                  disabled={application.trim().length < 10}
                  className="flex-1"
                >
                  {copy.next}
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'outcome' && (
            <motion.div
              key="outcome"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <label className="block text-sm text-stone-400 light:text-stone-600 mb-2">
                {copy.outcomeQuestion} <span className="text-stone-600 light:text-stone-500">{copy.optional}</span>
              </label>
              <textarea
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                placeholder={copy.outcomePlaceholder}
                className="w-full h-32 px-4 py-3 bg-stone-800 light:bg-stone-200 border border-stone-700 light:border-stone-300 rounded-xl text-white light:text-stone-900 placeholder-stone-500 light:placeholder-stone-400 focus:outline-none focus:border-purple-500 resize-none"
              />

              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                <Zap size={16} className="text-amber-400" />
                <span className="text-sm text-amber-300">{copy.xpForLog}</span>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => setStep('application')}
                  className="flex-1"
                >
                  {copy.back}
                </Button>
                <Button onClick={onSubmit} className="flex-1">
                  <Sparkles size={16} className="mr-1" />
                  {copy.saveEntry}
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
