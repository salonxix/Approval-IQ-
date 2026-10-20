/**
 * Voice Subsystem Utilities for "Approve" Voice Assistant.
 */

const DONE_PHRASES = new Set([
  'bye', 'goodbye', 'stop listening', 'end session', 'exit', 'quit', 'close assistant',
  'turn off', 'stop approve', 'good bye', "that's all", "that's it",
]);

/**
 * Normalizes user speech transcript and detects explicit conversational session-end intent.
 * Does NOT terminate on affirmative words like "yes", "yeah", "ok", or gratitude phrases.
 */
export function isDone(text: string): boolean {
  const normalized = text.toLowerCase().trim().replace(/[.,!?;:]+$/, '');
  if (DONE_PHRASES.has(normalized)) return true;
  return /\b(goodbye|bye bye|stop listening|close assistant|end session|turn off voice|quit assistant)\b/i.test(normalized);
}

/**
 * Strips markdown and special symbols so the text reads naturally through Text-to-Speech.
 */
export function cleanForSpeech(text: string): string {
  if (!text) return '';
  let t = text;

  // Handle JSON output strings
  try {
    const parsed = JSON.parse(t);
    if (typeof parsed === 'object' && parsed !== null) {
      t = parsed.spokenText ?? parsed.spoken_answer ?? parsed.reply ?? parsed.answer ?? parsed.text ?? t;
    }
  } catch {
    // Not raw JSON
  }

  return t
    .replace(/<think>[\s\S]*?<\/think>/gi, '') // strip reasoning blocks
    .replace(/#{1,6}\s*/g, '')                 // markdown headers
    .replace(/[*_]{1,3}/g, '')                 // bold/italic
    .replace(/`{1,3}[^`]*`{1,3}/g, '')         // code spans/blocks
    .replace(/^\s*>\s*/gm, '')                 // blockquotes
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')   // [label](url) -> label
    .replace(/https?:\/\/\S+/g, '')            // bare URLs
    .replace(/\|/g, '')                        // table pipes
    .replace(/^\s*\d+\.\s+/gm, '')             // numbered list markers
    .replace(/^\s*[-~•*]\s+/gm, '')            // bullet points
    .replace(/[[\]()]/g, '')                   // brackets
    .replace(/[—–]/g, ', ')                    // em/en dashes -> commas
    .replace(/\s{2,}/g, ' ')                   // collapse multiple whitespace
    .trim();
}

/**
 * Limits maximum words sent to TTS to avoid speech buffer overflows.
 */
export function truncateToWords(text: string, maxWords = 500): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ');
}

/**
 * Selects the warmest, most natural sounding English voice available in the browser.
 */
export function pickFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  return (
    voices.find((v) => v.name === 'Google UK English Female') ??
    voices.find((v) => v.name === 'Samantha') ??
    voices.find((v) => v.name === 'Karen') ??
    voices.find((v) => v.name === 'Victoria') ??
    voices.find((v) => v.name.toLowerCase().includes('female')) ??
    voices.find((v) => /zira|hazel|susan|catherine|veena/i.test(v.name)) ??
    voices.find((v) => v.lang === 'en-IN') ??
    voices.find((v) => v.lang === 'en-GB') ??
    voices.find((v) => v.lang.startsWith('en')) ??
    null
  );
}

/**
 * Detects if a captured STT transcript is merely an acoustic feedback echo of the assistant's own voice.
 * Never drops short queries (< 4 words) or queries spoken after the 800ms buffer.
 */
export function isSelfSpeechEcho(
  userTranscript: string,
  lastAssistantText?: string | null,
  timeSinceSpeechMs?: number
): boolean {
  if (!userTranscript || !lastAssistantText) return false;

  // If more than 800ms has elapsed since assistant stopped speaking, it is definitively user speech
  if (timeSinceSpeechMs != null && timeSinceSpeechMs > 800) {
    return false;
  }

  const normUser = userTranscript
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const normAssistant = lastAssistantText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normUser || !normAssistant) return false;

  // Never suppress short queries (< 4 words or < 18 chars) as echo.
  // Real user queries are often short keywords: "approvals", "what documents", "show roadmap", "mpcb", "help".
  const userWords = normUser.split(' ');
  if (userWords.length < 4 || normUser.length < 18) {
    return false;
  }

  // Exact phrase match of canned greeting phrases that got looped
  const commonEchoSnippets = [
    'how do you want me to help you',
    'hey im approve how do you want me to help you',
    'happy to help with your approvals have a great day',
  ];

  for (const snippet of commonEchoSnippets) {
    if (normUser === snippet) return true;
  }

  // Only consider echo if the user transcript is an exact substring of assistant's words and is at least 5 words long
  if (userWords.length >= 5 && normAssistant.includes(normUser)) {
    return true;
  }

  return false;
}


