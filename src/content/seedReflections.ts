// ═══════════════════════════════════════════════════════════════════════════
// SEED REFLECTIONS
// ═══════════════════════════════════════════════════════════════════════════
//
// These are human-sounding reflections used ONLY when no real reflections
// are available. They're designed to feel authentic - with real vulnerability,
// imperfect grammar, genuine insight, and human warmth.
//
// Each lesson has multiple seed reflections to provide variety.
//
// ═══════════════════════════════════════════════════════════════════════════

import type { SeedReflection, GenderIdentity } from '@/types/echoes';

// Helper to create seed reflections
function seed(lessonId: string, content: string, gender: GenderIdentity): SeedReflection {
  return { lessonId, content, gender };
}

export const SEED_REFLECTIONS: SeedReflection[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // Lesson 1: The Compound Effect (modern-wisdom-1)
  // ─────────────────────────────────────────────────────────────────────────
  seed(
    'modern-wisdom-1',
    `I've been so focused on the big moments that I forgot life is really just a series of small ones strung together. Today I chose to drink water instead of my usual soda. It felt insignificant in the moment, but reading this made me realize that's exactly the point. The insignificant moments are where change actually lives.`,
    'sister'
  ),
  seed(
    'modern-wisdom-1',
    `This hit different. I've started and quit so many things because I couldn't see immediate results. The gym, meditation, reading... I'd do it for a week, see nothing change, and give up. But what if I'd just kept going? What if I'd trusted the process? Starting again tomorrow, but this time I'm playing the long game.`,
    'brother'
  ),
  seed(
    'modern-wisdom-1',
    `My grandma used to say "little by little, a little becomes a lot." I never really understood what she meant until now. She built her whole life on small consistent actions - waking up early, saving a little money, being kind even when tired. She never did anything dramatic, but she built something beautiful. I want to be more like her.`,
    'traveler'
  ),
  seed(
    'modern-wisdom-1',
    `I calculated it out and honestly it scared me a bit. If I keep scrolling social media for 2 hours a day like I have been, that's 730 hours a year. 30 full days. A whole month of my life, gone. But flip it around - 30 minutes of reading a day is 182 hours. Enough to read 50+ books. Same principle, different direction. Which way am I going to point my ship?`,
    'brother'
  ),
  seed(
    'modern-wisdom-1',
    `Been thinking about this all day. I'm not where I want to be in life, and I keep blaming circumstances - my job, where I live, my family situation. But if I'm honest, it's the thousands of small choices I made that got me here. Which means thousands of small choices can get me somewhere else. That's terrifying and liberating at the same time.`,
    'sister'
  ),

  // ─────────────────────────────────────────────────────────────────────────
  // Lesson 2: The Power of Tiny (modern-wisdom-2)
  // ─────────────────────────────────────────────────────────────────────────
  seed(
    'modern-wisdom-2',
    `The 2-minute rule genuinely changed something in me today. I've been avoiding exercise for months, telling myself I don't have time for a "real workout." But today I just did 2 minutes of stretching. That's it. And you know what? I ended up doing 15 minutes because once I started, stopping felt weird. The hardest part really is just starting.`,
    'brother'
  ),
  seed(
    'modern-wisdom-2',
    `I've been trying to journal for years. Years. Always failed because I thought I had to write pages of profound insights. Today I wrote one sentence: "I feel tired but hopeful." That's it. And somehow that one sentence made me feel more accomplished than all my failed attempts at writing essays about my feelings.`,
    'sister'
  ),
  seed(
    'modern-wisdom-2',
    `Making my bed this morning felt almost too simple to matter. But when I came home after a rough day, seeing that made bed did something to me. It was like past-me had left a small gift for present-me. A reminder that I'm someone who takes care of things. Someone who follows through. It's just a bed, but it's also not just a bed.`,
    'traveler'
  ),
  seed(
    'modern-wisdom-2',
    `I realized I've been all-or-nothing my whole life. Either I work out for an hour or not at all. Either I eat perfectly clean or binge on junk. Either I wake up at 5am or sleep until noon. This lesson made me see how that thinking has kept me stuck. Maybe the middle path isn't weakness - maybe it's wisdom.`,
    'sister'
  ),
  seed(
    'modern-wisdom-2',
    `Started thinking about identity today. I've always said "I'm not a morning person" or "I'm not organized" like these are unchangeable facts about me. But what if identity is just accumulated evidence? If I make my bed for a month, don't I become "someone who makes their bed"? We become what we repeatedly do. That's both simple and profound.`,
    'brother'
  ),

  // ─────────────────────────────────────────────────────────────────────────
  // Lesson 3: Deep Work (modern-wisdom-3)
  // ─────────────────────────────────────────────────────────────────────────
  seed(
    'modern-wisdom-3',
    `I turned off notifications for the first time in... I honestly can't remember. Two hours later, I'd finished work that usually takes me a full day. Not because I worked harder - because I wasn't constantly context-switching. My brain feels clearer than it has in months. Why did I wait so long to try this?`,
    'brother'
  ),
  seed(
    'modern-wisdom-3',
    `The thing about "busyness as a badge of honor" really called me out. I've been proud of how overwhelmed I am, like it proves I matter. But being busy and being productive aren't the same thing. Some of the most impactful people I know seem calm, focused, almost slow. Maybe that's not despite their success - maybe it's part of it.`,
    'sister'
  ),
  seed(
    'modern-wisdom-3',
    `Did my first real deep work session today. Set a timer for 90 minutes, put my phone in another room, closed all tabs except what I needed. The first 20 minutes were uncomfortable - my brain kept wanting to check something, anything. But then something shifted. I got into this flow state I haven't felt since I was a kid drawing for hours. I forgot what that felt like.`,
    'traveler'
  ),
  seed(
    'modern-wisdom-3',
    `I tracked my interruptions for one day and I'm genuinely embarrassed. 73 times. I broke my own focus 73 times in 8 hours. That's once every 6.5 minutes on average. No wonder I feel like I'm always working but never finishing anything. My attention isn't being stolen - I'm giving it away, constantly.`,
    'brother'
  ),
  seed(
    'modern-wisdom-3',
    `Started thinking about what "deep" work even means for me. It's not just about focus time - it's about doing the work that actually matters. I spend so much energy on tasks that feel urgent but aren't important. Emails. Messages. Small requests. Meanwhile the big scary meaningful projects sit untouched. I'm hiding in busyness.`,
    'sister'
  ),

  // ─────────────────────────────────────────────────────────────────────────
  // Lesson 4: The Obstacle (modern-wisdom-4)
  // ─────────────────────────────────────────────────────────────────────────
  seed(
    'modern-wisdom-4',
    `Lost my job last month. Been spiraling ever since, feeling like a failure. But this lesson made me ask a different question: what if this is happening FOR me, not TO me? What if this is the push I needed to finally pursue what I actually want to do? I'm not sure yet, but the reframe helped. The obstacle might actually be the way.`,
    'brother'
  ),
  seed(
    'modern-wisdom-4',
    `I've been avoiding a difficult conversation with my mom for years. Years. After this lesson, I realized the discomfort of having the conversation is nothing compared to the weight of carrying the unspoken. The obstacle isn't the conversation - it's my fear of it. And I've been letting fear win.`,
    'sister'
  ),
  seed(
    'modern-wisdom-4',
    `Something clicked today about how I view problems. I always saw them as interruptions to my "real life" - things to get past so I could get back to normal. But what if working through problems IS the real life? What if growth only happens in the struggle, never in the comfort? That changes everything about how I want to live.`,
    'traveler'
  ),
  seed(
    'modern-wisdom-4',
    `My anxiety has always felt like my biggest weakness. But today I wondered - what if it's actually information? What if it's pointing me toward what I care about most? You don't get anxious about things that don't matter to you. Maybe my anxiety isn't something to eliminate. Maybe it's something to listen to and work with.`,
    'sister'
  ),
  seed(
    'modern-wisdom-4',
    `The stories we tell ourselves about our obstacles are wild. I've been telling myself I can't start a business because I don't have enough money. But people with less have done more. The real obstacle isn't money - it's my fear of failure dressed up as a practical concern. Once I saw that, I couldn't unsee it.`,
    'brother'
  ),

  // ─────────────────────────────────────────────────────────────────────────
  // Lesson 5: Present Moment (modern-wisdom-5)
  // ─────────────────────────────────────────────────────────────────────────
  seed(
    'modern-wisdom-5',
    `I ate dinner tonight without my phone for the first time in I don't know how long. Actually tasted my food. Noticed the texture, the temperature, how it changed as I chewed. It was just rice and vegetables, nothing special, but it felt like the most luxurious meal I've had in months. I've been eating without being present for years.`,
    'sister'
  ),
  seed(
    'modern-wisdom-5',
    `Caught myself today doing that thing where I'm physically somewhere but mentally already in the next moment. Playing with my kid but thinking about work. At dinner but planning tomorrow. In the shower but rehearsing conversations. I'm never actually HERE. I'm always half-living in a future that doesn't exist yet.`,
    'brother'
  ),
  seed(
    'modern-wisdom-5',
    `The breathing exercise seemed too simple to work. Just noticing breath? That's it? But something happened when I did it. For maybe 30 seconds, my mind went quiet. No past, no future, just breath. And I realized how rare that is - how I'm almost never fully present. 30 seconds of presence felt like a vacation from my own mind.`,
    'traveler'
  ),
  seed(
    'modern-wisdom-5',
    `I took a walk today and left my phone at home. At first I felt naked, anxious, like I was missing something. But then... the sky looked different. More vivid. I noticed flowers I walk past every day. Heard birds. Felt the air. When did I stop experiencing the world? When did my phone become more real to me than reality?`,
    'sister'
  ),
  seed(
    'modern-wisdom-5',
    `Been thinking about how much of my life I've missed while being physically present. All the sunsets I scrolled through. Conversations I half-listened to. Moments with people I love where I was there but not THERE. You can't get that time back. But you can decide to be present starting now. That's what I'm choosing.`,
    'brother'
  ),

  // ─────────────────────────────────────────────────────────────────────────
  // Generic reflections (fallback for any lesson)
  // ─────────────────────────────────────────────────────────────────────────
  seed(
    '_generic',
    `Some lessons hit different depending on where you are in life. Today this one hit hard. Not because it told me something I didn't know, but because it reminded me of something I'd forgotten. Sometimes we need to hear the same truth from a different angle before it finally sticks.`,
    'traveler'
  ),
  seed(
    '_generic',
    `I almost skipped today. Told myself I was too tired, too busy, not in the right headspace. But I showed up anyway, and I'm glad I did. The showing up is the thing. The content matters, but the consistency matters more. I'm building something here, one day at a time.`,
    'brother'
  ),
  seed(
    '_generic',
    `Had one of those moments where something just clicks and you can't unthink it. The kind of understanding that changes how you see everything else. These lessons are building on each other in ways I didn't expect. I feel like I'm slowly becoming a different person - or maybe becoming more myself.`,
    'sister'
  ),
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get seed reflections for a specific lesson
 * Falls back to generic reflections if none exist for the lesson
 */
export function getSeedReflectionsForLesson(lessonId: string): SeedReflection[] {
  const specific = SEED_REFLECTIONS.filter(r => r.lessonId === lessonId);
  if (specific.length > 0) return specific;

  // Fall back to generic reflections
  return SEED_REFLECTIONS.filter(r => r.lessonId === '_generic');
}

/**
 * Get a random seed reflection for a lesson
 */
export function getRandomSeedReflection(lessonId: string): SeedReflection | null {
  const reflections = getSeedReflectionsForLesson(lessonId);
  if (reflections.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * reflections.length);
  return reflections[randomIndex];
}

/**
 * Convert a seed reflection to a PublicReflection format
 */
export function seedToPublicReflection(seed: SeedReflection, lessonTitle: string): {
  id: string;
  lessonId: string;
  lessonTitle: string;
  authorId: string;
  authorGender: GenderIdentity;
  content: string;
  createdAt: string;
  isOpenToConnect: boolean;
  isSeed: true;
} {
  // Create a deterministic ID based on content (so same seed = same ID)
  const id = `seed-${seed.lessonId}-${seed.content.slice(0, 20).replace(/\s/g, '-')}`;

  // Random time in the last 24-72 hours
  const hoursAgo = Math.floor(Math.random() * 48) + 24;
  const createdAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();

  return {
    id,
    lessonId: seed.lessonId,
    lessonTitle,
    authorId: `seed-author-${seed.gender}`,
    authorGender: seed.gender,
    content: seed.content,
    createdAt,
    isOpenToConnect: false, // Seed reflections can't connect
    isSeed: true,
  };
}
