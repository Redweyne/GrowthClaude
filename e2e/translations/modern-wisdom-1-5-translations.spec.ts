import { test, expect, type Page } from '@playwright/test';

const lessonIds = [
  'modern-1-instant-reframe',
  'modern-2-power-of-tiny',
  'modern-3-obstacle-opportunity',
  'modern-4-morning-mindset',
  'modern-5-gratitude-shift',
];

const lessonNarrativeSnippets = {
  fr: [
    'En ce moment, quelque chose te reste en tête',
    'Tu as déjà essayé de changer',
    'Quelque chose bloque ton chemin en ce moment',
    'La plupart des gens se réveillent et réagissent immédiatement',
    'entendu mille fois',
  ],
  ar: [
    'الآن، هناك شيء يجلس في مؤخرة ذهنك',
    'لقد حاولت التغيير من قبل',
    'هناك شيء يسد طريقك الآن',
    'معظم الناس يستيقظون ويتفاعلون فوراً',
    'سمعت ذلك آلاف المرات',
  ],
} as const;

async function seedLessonProgress(page: Page, completedCount: number) {
  await page.evaluate(({ lessonIds, completedCount }: { lessonIds: string[]; completedCount: number }) => {
    const key = 'transformation-hub-storage';
    const raw = localStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : { state: {}, version: 0 };
    const state = data.state || {};
    const completedLessons = { ...(state.completedLessons || {}) };

    for (let i = 0; i < completedCount; i += 1) {
      completedLessons[lessonIds[i]] = true;
    }

    data.state = {
      ...state,
      completedLessons,
      currentWorldSlug: 'modern-wisdom',
      firstSessionComplete: true,
      coachingStepsSeen: {
        beforeFirstLesson: true,
        afterLessonBeforeEcho: true,
        afterEchoBeforeExercises: true,
        afterFirstDayComplete: true,
      },
    };

    localStorage.setItem(key, JSON.stringify(data));
  }, { lessonIds, completedCount });
}

async function seedBaseState(page: Page, locale: 'fr' | 'ar') {
  await page.addInitScript(({ locale }) => {
    const key = 'transformation-hub-storage';
    if (localStorage.getItem(key)) return;

    const baseState = {
      language: locale,
      languageSelected: true,
      name: 'TestUser',
      transformationGoal: 'calmer',
      whyStatement: 'Testing translations',
      dailyCommitmentMinutes: 10,
      communityIdentity: 'traveler',
      onboardingComplete: true,
      onboardingStep: 7,
      firstSessionComplete: true,
      coachingStepsSeen: {
        beforeFirstLesson: true,
        afterLessonBeforeEcho: true,
        afterEchoBeforeExercises: true,
        afterFirstDayComplete: true,
      },
      completedLessons: {},
      currentWorldSlug: 'modern-wisdom',
    };

    localStorage.setItem(key, JSON.stringify({ state: baseState, version: 0 }));
  }, { locale });
}

test.describe('Modern Wisdom lessons 1-5 translations', () => {
  for (const locale of ['fr', 'ar'] as const) {
    for (let index = 0; index < lessonIds.length; index += 1) {
      test(`${locale} lesson ${index + 1} shows localized narrative`, async ({ page }) => {
        await seedBaseState(page, locale);
        await page.goto('http://localhost:3000/growthmvp');
        await page.waitForLoadState('networkidle');

        await seedLessonProgress(page, index);
        await page.reload();
        await page.waitForLoadState('networkidle');

        await expect(page.locator('[data-testid="daily-flow-home"]')).toBeVisible({ timeout: 10000 });
        await page.click('[data-testid="start-lesson-btn"]');

        const snippet = lessonNarrativeSnippets[locale][index];
        await expect(page.getByText(snippet, { exact: false })).toBeVisible({ timeout: 15000 });
      });
    }
  }
});
