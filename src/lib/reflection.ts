const MIN_REFLECTION_LENGTH = 20;

const LOW_EFFORT_PATTERNS = [
  /^(idk|ok|whatever|test|asdf|qwer|nothing|none|na|n\/a|\.+|no|yes|meh|lol|lmao)$/i,
  /^[^a-zA-Z]+$/,
  /^(.)\1{3,}$/,
  /asdf|qwer|zxcv/i,
  /^[0-9\s]+$/,
];

export function isLowEffortReflection(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < MIN_REFLECTION_LENGTH) return true;

  const normalized = trimmed.toLowerCase();
  return LOW_EFFORT_PATTERNS.some(pattern => pattern.test(normalized));
}

export { MIN_REFLECTION_LENGTH };
