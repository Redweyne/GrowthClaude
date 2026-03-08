'use client';

import { memo, useMemo } from 'react';
import { CosmicBackground } from '@/components/effects/CosmicBackground';
import { WorldHeader } from './WorldHeader';
import { ChapterSection } from './ChapterSection';
import { modernWisdomChapterThemes } from '@/lib/chapterThemes';
import { useStore } from '@/store/useStore';
import { useTranslation } from '@/i18n';

// Same generic interface as the old WorldMap for compatibility
interface MapWorld {
  name: string;
  subtitle: string;
  chapters: Array<{
    name: string;
    subtitle: string;
    lessons: Array<{
      id: string;
      title: string;
      xpReward: number;
    }>;
  }>;
}

interface JourneyPageProps {
  world: MapWorld;
  onSelectLesson: (lessonId: string) => void;
}

export const JourneyPage = memo(function JourneyPage({
  world,
  onSelectLesson,
}: JourneyPageProps) {
  const { completedLessons } = useStore();
  const { t, locale, isRTL } = useTranslation();

  // Flatten all lessons to find the next one
  const allLessons = useMemo(
    () => world.chapters.flatMap(ch => ch.lessons),
    [world.chapters]
  );

  const completedCount = allLessons.filter(l => completedLessons[l.id]).length;
  const nextLesson = allLessons.find(l => !completedLessons[l.id]) || null;

  // Check if a chapter is accessible (all lessons in prior chapters completed)
  const isChapterAccessible = (chapterIndex: number): boolean => {
    for (let c = 0; c < chapterIndex; c++) {
      for (const lesson of world.chapters[c].lessons) {
        if (!completedLessons[lesson.id]) return false;
      }
    }
    return true;
  };

  // Cumulative lesson offset for each chapter
  const getGlobalOffset = (chapterIndex: number): number => {
    let offset = 0;
    for (let c = 0; c < chapterIndex; c++) {
      offset += world.chapters[c].lessons.length;
    }
    return offset;
  };

  // i18n copy
  const copy = {
    en: {
      sageMessage: 'Each path reveals new truths. Choose your next chapter.',
      chapter: 'Chapter',
      enter: 'Enter',
    },
    fr: {
      sageMessage: 'Chaque chemin révèle de nouvelles vérités. Choisissez votre prochain chapitre.',
      chapter: 'Chapitre',
      enter: 'Entrer',
    },
    ar: {
      sageMessage: 'كل طريق يكشف حقائق جديدة. اختر فصلك التالي.',
      chapter: 'الفصل',
      enter: 'دخول',
    },
  } as const;
  const c = copy[locale as keyof typeof copy] ?? copy.en;

  const progressLabel = t('world.lessonsProgress')
    .replace('{completed}', completedCount.toString())
    .replace('{total}', allLessons.length.toString());

  return (
    <div
      className={`relative min-h-full ${isRTL ? 'rtl' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Fixed cosmic starfield background */}
      <CosmicBackground fixed />

      {/* Scrollable content */}
      <div className="relative z-10" style={{ paddingTop: 'max(8px, env(safe-area-inset-top))' }}>
        {/* World Header */}
        <WorldHeader
          worldName={world.name}
          worldSubtitle={world.subtitle}
          worldImagePath="/images/worlds/modern-wisdom.png"
          completedCount={completedCount}
          totalCount={allLessons.length}
          sageMessage={c.sageMessage}
          progressLabel={progressLabel}
        />

        {/* Chapter sections */}
        {world.chapters.map((chapter, index) => {
          const theme = modernWisdomChapterThemes[index] || modernWisdomChapterThemes[0];
          const accessible = isChapterAccessible(index);
          const globalOffset = getGlobalOffset(index);

          return (
            <ChapterSection
              key={theme.id}
              chapterLabel={`— ${c.chapter} ${index + 1} —`}
              chapterTitle={chapter.name}
              chapterSubtitle={chapter.subtitle}
              lessons={chapter.lessons}
              completedLessons={completedLessons}
              nextLessonId={nextLesson?.id || null}
              globalLessonOffset={globalOffset}
              isChapterAccessible={accessible}
              theme={theme}
              chapterIndex={index}
              onSelectLesson={onSelectLesson}
              completedLabel={t('world.completed')}
              xpLabel={t('common.xp')}
              enterLabel={c.enter}
            />
          );
        })}

        {/* Bottom spacer */}
        <div className="h-24" />
      </div>
    </div>
  );
});

export default JourneyPage;
