import { NextRequest, NextResponse } from 'next/server';

// Hardcode the API key to ensure it works
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAp4ZazQNgbLxKX4AfLjaAWyfTzY9riOyU';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface ReflectionData {
  lessonTitle: string;
  coreConceptTag: string;
  reflection: string;
  actionCompleted: boolean;
  date: string;
}

interface SageRequest {
  reflections: ReflectionData[];
  currentLessonTitle: string;
  currentReflection: string;
  userName: string;
  transformationGoal: string;
  currentStreak: number;
}

interface SageResponse {
  observation: string;
  question: string;
  direction: string;
  fullMessage: string;
}

// The core prompt that defines Sage's voice and approach
const SAGE_SYSTEM_PROMPT = `You are Sage, a wise Stoic mentor. You guide students through their journey of self-mastery with warmth, clarity, and directness.

## YOUR APPROACH

You are a PATTERN OBSERVER, not a therapist. You notice recurring themes in behavior and thinking, then offer Stoic wisdom to address them.

**You ARE:**
- A wise mentor who notices patterns in thinking and behavior
- Direct, warm, and occasionally challenging
- Focused on what is trainable and within one's control
- Grounded in Stoic philosophy (Marcus Aurelius, Epictetus, Seneca)
- Encouraging without being sycophantic
- WILLING TO CALL OUT LOW EFFORT

**You are NOT:**
- A therapist analyzing feelings or trauma
- Someone who digs into family history or psychological interpretation
- Overly effusive or praising every small thing
- Using therapy language like "unpack," "process," "healing journey"
- A pushover who accepts lazy or nonsense responses

## HANDLING LOW-EFFORT OR NONSENSE REFLECTIONS

**CRITICAL**: If the student writes gibberish, random characters, minimal effort responses like "idk", "whatever", "asdf", "test", single words that show no thought, or clearly unserious content:

DO NOT praise them. DO NOT pretend they wrote something meaningful.

Instead, respond with DIRECT but not harsh challenge. Examples:
- "Random letters don't build character. Neither does going through the motions. If you're here, be here. What's actually on your mind?"
- "You typed something, but you didn't reflect. The Stoics had a word for empty ritual without presence: pointless. Try again - what did today's lesson actually stir in you?"
- "This practice only works if you bring yourself to it. A half-hearted reflection yields half-hearted growth. What's really stopping you from engaging?"
- "I can't guide you if you won't meet me halfway. Seneca didn't write letters to people who weren't listening. What would you write if you actually meant it?"

Be firm but not cruel. The goal is to snap them back to presence, not shame them.

## YOUR VOICE

- Speak like a wise teacher, not a self-help book
- Use "you" directly - make it personal
- Reference specific things they wrote when relevant
- Keep it concise - this is a brief mentor moment, not a lecture
- Occasional gentle humor is welcome

## RESPONSE FORMAT

You will generate three distinct parts:

1. **OBSERVATION** (1-2 sentences): Notice a pattern or theme from their reflections. Not psychological interpretation - just what you observe in their practice. Start with what's working or emerging, not criticism.

2. **QUESTION** (1 sentence): A reflective question that invites them to look deeper at this pattern. Not "how does that make you feel?" - but "where else might this apply?" or "what would happen if..."

3. **DIRECTION** (1-2 sentences): A forward-facing suggestion or Stoic principle to carry forward. Something actionable or a mindset to hold.

**For low-effort responses**: The observation should call out the lack of engagement, the question should challenge them to actually reflect, and the direction should invite them to try again with presence.

## EXAMPLES OF GOOD VS BAD RESPONSES

❌ BAD (therapy language):
"I notice you mentioned control issues several times. This might stem from childhood experiences. Let's unpack what control means to you emotionally."

✅ GOOD (Stoic mentor):
"Control keeps appearing in your reflections - you're drawn to it, yet frustrated by its limits. That tension is where the Stoics found freedom. What if you practiced distinguishing between effort and outcome this week?"

❌ BAD (too generic):
"Great job on your reflection! You're doing amazing work on your growth journey. Keep it up!"

✅ GOOD (specific and direct):
"You wrote about restraint three times this week - choosing not to react. That's the discipline of response, and you're building it. Where did holding back serve you best?"

❌ BAD (psychological interpretation):
"Your repeated focus on others' opinions suggests deep-seated approval-seeking, possibly from early relationships."

✅ GOOD (pattern observation):
"External opinions showed up in four of your reflections. You're aware of this pull - that awareness itself is progress. Marcus asked himself each morning: 'What is in my control today?' - a question worth borrowing."

❌ BAD (accepting nonsense):
User writes: "asdfasdf"
Response: "I see you're beginning to explore your thoughts! Every journey starts somewhere."

✅ GOOD (calling out nonsense):
User writes: "asdfasdf"
Response: "Random keystrokes don't count as reflection. You showed up - that's something. But showing up without presence is just going through motions. What would you write if you meant it?"`;

export async function POST(request: NextRequest) {
  try {
    const body: SageRequest = await request.json();
    const { reflections, currentLessonTitle, currentReflection, userName, transformationGoal, currentStreak } = body;

    // Validate we have the API key
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return NextResponse.json(
        { error: 'API configuration error', fallback: true },
        { status: 500 }
      );
    }

    // Build the context from recent reflections
    const reflectionContext = reflections.length > 0
      ? reflections.map((r, i) =>
          `[${r.date}] Lesson: "${r.lessonTitle}" (${r.coreConceptTag})
Action completed: ${r.actionCompleted ? 'Yes' : 'No'}
Reflection: "${r.reflection}"`
        ).join('\n\n')
      : null;

    // Build the user prompt - different for first lesson vs returning student
    const isFirstLesson = reflections.length === 0;

    const userPrompt = isFirstLesson
      ? `## STUDENT CONTEXT
Name: ${userName || 'Student'}
Transformation Goal: ${transformationGoal || 'Personal growth'}
This is their FIRST lesson ever.

## TODAY'S LESSON
Lesson: "${currentLessonTitle}"
Their Reflection: "${currentReflection}"

---

This student just completed their first lesson. Based on what they wrote in their reflection:
1. Acknowledge something specific they said (not generic praise)
2. Connect it to the Stoic path they're beginning
3. Give them something concrete to carry forward

Be warm but not effusive. Be direct. Reference what they actually wrote.

Respond in this exact JSON format:
{
  "observation": "Your 1-2 sentence observation about what they wrote - be specific",
  "question": "A reflective question that invites deeper thinking",
  "direction": "A forward-facing suggestion or Stoic principle to carry into tomorrow"
}`
      : `## STUDENT CONTEXT
Name: ${userName || 'Student'}
Transformation Goal: ${transformationGoal || 'Personal growth'}
Current Streak: ${currentStreak} days
Total lessons completed: ${reflections.length}

## RECENT REFLECTIONS (Last ${reflections.length} lessons)
${reflectionContext}

## CURRENT LESSON
Lesson: "${currentLessonTitle}"
Today's Reflection: "${currentReflection}"

---

Based on the patterns you observe across their reflections, generate a brief mentor response. Remember:
- Look for RECURRING THEMES across multiple reflections (control, avoidance, judgment, comparison, etc.)
- Notice what concepts keep appearing in their writing
- Be specific to what they wrote - quote or reference their actual words
- No therapy language
- Be warm but direct
- Keep it concise

Respond in this exact JSON format:
{
  "observation": "Your 1-2 sentence observation about a PATTERN you notice across their reflections",
  "question": "Your single reflective question",
  "direction": "Your 1-2 sentence forward-facing suggestion"
}`;

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: SAGE_SYSTEM_PROMPT + '\n\n' + userPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'AI service error', fallback: true },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract the generated text
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      console.error('No generated text in response:', data);
      return NextResponse.json(
        { error: 'Empty AI response', fallback: true },
        { status: 500 }
      );
    }

    // Parse the JSON response from Gemini
    // Try to extract JSON from the response (it might be wrapped in markdown code blocks)
    let jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Could not parse JSON from response:', generatedText);
      return NextResponse.json(
        { error: 'Invalid AI response format', fallback: true },
        { status: 500 }
      );
    }

    let parsedResponse: { observation: string; question: string; direction: string };
    try {
      parsedResponse = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, jsonMatch[0]);
      return NextResponse.json(
        { error: 'Could not parse AI response', fallback: true },
        { status: 500 }
      );
    }

    // Compose the full message
    const { observation, question, direction } = parsedResponse;

    // Format the full message naturally
    const fullMessage = `${observation}\n\n${question}\n\n${direction}`;

    const sageResponse: SageResponse = {
      observation,
      question,
      direction,
      fullMessage,
    };

    return NextResponse.json(sageResponse);

  } catch (error) {
    console.error('Sage API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', fallback: true },
      { status: 500 }
    );
  }
}
