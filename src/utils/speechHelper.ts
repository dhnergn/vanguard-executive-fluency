import { SpeechEvaluationResult } from '../types';

// Speech Recognition Type Definitions for cross-browser support
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as IWindow;
  return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
}

export function createSpeechRecognizer(
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  onEnd: () => void,
  onStart?: () => void
) {
  if (!isSpeechRecognitionSupported()) {
    onError('Speech recognition is not supported in this browser.');
    return null;
  }

  const win = window as IWindow;
  const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionClass();

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    if (onStart) onStart();
  };

  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    const currentText = finalTranscript || interimTranscript;
    onResult(currentText, Boolean(finalTranscript));
  };

  recognition.onerror = (event: any) => {
    const errorMsg = event.error || 'Speech capture failed';
    onError(errorMsg);
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}

/**
 * Text-to-Speech Engine with executive accents
 */
export function playExecutiveSpeech(
  text: string,
  rate: number = 0.95,
  accent: 'us' | 'uk' = 'us'
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const targetLang = accent === 'uk' ? 'en-GB' : 'en-US';

    // Prioritize natural sounding corporate voices
    const preferredVoice = voices.find(
      (v) =>
        v.lang.startsWith(targetLang) &&
        (v.name.includes('Natural') ||
          v.name.includes('Premium') ||
          v.name.includes('Google') ||
          v.name.includes('Daniel') ||
          v.name.includes('Samantha') ||
          v.name.includes('Arthur'))
    ) || voices.find((v) => v.lang.startsWith(targetLang)) || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeechSynthesis() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Normalizes text for fair comparison (strips punctuation, standardizes contractions)
 */
function normalizeText(str: string): string[] {
  return str
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, ' ')
    .replace(/\bwe've\b/g, 'we have')
    .replace(/\bwe'll\b/g, 'we will')
    .replace(/\bwe're\b/g, 'we are')
    .replace(/\bit's\b/g, 'it is')
    .replace(/\bthat's\b/g, 'that is')
    .replace(/\bcan't\b/g, 'cannot')
    .replace(/\bdon't\b/g, 'do not')
    .replace(/\bwon't\b/g, 'will not')
    .replace(/\bhaven't\b/g, 'have not')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}

/**
 * Compare spoken transcript with target sentence
 */
export function evaluateSpeechAccuracy(
  transcript: string,
  target: string,
  acceptableVariations: string[] = []
): SpeechEvaluationResult {
  const targets = [target, ...acceptableVariations];
  let bestResult: SpeechEvaluationResult | null = null;
  let highestScore = -1;

  for (const candidateTarget of targets) {
    const targetWords = normalizeText(candidateTarget);
    const spokenWords = normalizeText(transcript);

    if (spokenWords.length === 0) {
      return {
        transcript,
        target,
        similarityScore: 0,
        matchedWords: [],
        missedWords: targetWords,
        extraWords: [],
        isPassing: false,
        fluencyGrade: 'Requires Re-articulation',
        feedback: 'No clear speech detected. Please speak firmly into the microphone.',
      };
    }

    const matchedWords: string[] = [];
    const missedWords: string[] = [];
    const extraWords: string[] = [];

    // Matching logic
    const spokenCopy = [...spokenWords];

    for (const tw of targetWords) {
      const matchIndex = spokenCopy.findIndex((sw) => sw === tw);
      if (matchIndex !== -1) {
        matchedWords.push(tw);
        spokenCopy.splice(matchIndex, 1);
      } else {
        missedWords.push(tw);
      }
    }

    extraWords.push(...spokenCopy);

    // Compute score based on recall of target words and penalty for extraneous noise
    const recall = targetWords.length > 0 ? (matchedWords.length / targetWords.length) : 0;
    const precision = spokenWords.length > 0 ? (matchedWords.length / spokenWords.length) : 0;
    const f1Score = recall + precision > 0 ? (2 * recall * precision) / (recall + precision) : 0;
    
    // Scale 0-100
    const score = Math.round(f1Score * 100);

    let fluencyGrade: SpeechEvaluationResult['fluencyGrade'] = 'Requires Re-articulation';
    let feedback = '';

    if (score >= 90) {
      fluencyGrade = 'Flawless C2';
      feedback = 'Outstanding executive cadence and precision. Ready for the boardroom.';
    } else if (score >= 75) {
      fluencyGrade = 'Strong Executive C1';
      feedback = 'High executive register achieved. Excellent syntax articulation.';
    } else if (score >= 60) {
      fluencyGrade = 'Competent B2';
      feedback = 'Good core delivery, though minor structural components were altered.';
    } else {
      fluencyGrade = 'Requires Re-articulation';
      feedback = 'Key grammatical nuances or collocations were omitted. Review and repeat.';
    }

    if (score > highestScore) {
      highestScore = score;
      bestResult = {
        transcript,
        target: candidateTarget,
        similarityScore: score,
        matchedWords,
        missedWords,
        extraWords,
        isPassing: score >= 65,
        fluencyGrade,
        feedback,
      };
    }
  }

  return bestResult!;
}

/**
 * Web Audio API synthesizer for clean executive feedback chimes (no external audio assets required)
 */
export function playExecutiveChime(type: 'success' | 'critique' | 'click') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'success') {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.4);
      });
    } else if (type === 'critique') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
      osc.frequency.linearRampToValueAtTime(293.66, ctx.currentTime + 0.2); // D4
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    }
  } catch {
    // Audio context may be restricted before user gesture
  }
}
