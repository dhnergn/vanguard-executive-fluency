export type GrammarCategoryId =
  | 'tenses'
  | 'connectors'
  | 'inversions'
  | 'academic_words'
  | 'modal_verbs'
  | 'passive_voice'
  | 'relative_clause'
  | 'reported_speech'
  | 'gerund_infinitive'
  | 'participle_clause';

export type IntelligenceType =
  | 'verbal_linguistic'      // 1. Sözel-dil zekâsı
  | 'visual_spatial'          // 2. Görsel-uzamsal zekâ
  | 'existential'             // 3. Varoluşsal zekâ
  | 'musical_rhythmic'        // 4. Müziksel-ritmik zekâ
  | 'logical_mathematical'    // 5. Mantıksal-matematiksel zekâ
  | 'bodily_kinesthetic'      // 6. Bedensel-kinestetik zekâ
  | 'interpersonal'           // 7. Sosyal zekâ
  | 'intrapersonal';          // 8. İçsel zekâ

export interface IntelligenceInfo {
  id: IntelligenceType;
  titleTr: string;
  titleEn: string;
  description: string;
  businessApplication: string;
  learningApproach: string;
  color: string;
  iconName: string;
}

export interface DiagnosticQuestion {
  id: number;
  scenario: string;
  prompt: string;
  category: IntelligenceType;
  weights: {
    stronglyAgree: number;
    agree: number;
    neutral: number;
    disagree: number;
  };
}

export interface IntelligenceScoreMap {
  verbal_linguistic: number;
  visual_spatial: number;
  existential: number;
  musical_rhythmic: number;
  logical_mathematical: number;
  bodily_kinesthetic: number;
  interpersonal: number;
  intrapersonal: number;
}

export type ExerciseType = 'speech' | 'sentence_builder' | 'multiple_choice' | 'diplomatic_rewrite';

export interface Exercise {
  id: string;
  type: ExerciseType;
  scenarioTitle: string;
  businessContext: string;
  promptQuestion: string;
  targetSentence: string;
  acceptableVariations?: string[];
  options?: {
    id: string;
    text: string;
    isCorrect: boolean;
    register: 'Blunt / Casual' | 'Grammatically Flawed' | 'Pristine Executive';
    feedback: string;
  }[];
  wordBank?: string[]; // For sentence builder / kinesthetic
  audioPromptText?: string;
  explanation: string;
  executiveTip: string;
  intelligenceAlignment: IntelligenceType[];
}

export interface GrammarRuleExample {
  informal: string;
  executive: string;
  rationale: string;
  businessScenario: string;
}

export interface LessonModule {
  id: GrammarCategoryId;
  title: string;
  executiveRoleContext: string;
  tagline: string;
  difficulty: 'Executive B2' | 'Senior Leadership C1' | 'Boardroom C2';
  overview: string;
  strategicImportance: string;
  grammaticalFormula: string;
  // Multi-intelligence educational dimensions
  visualSyntaxMap: {
    stages: { label: string; element: string; hint: string }[];
    architecturalTip: string;
  };
  rhythmicCadenceGuide: {
    pitchPattern: string;
    stressSyllables: string;
    tempoAdvice: string;
  };
  logicalMatrix: {
    condition: string;
    transformation: string;
    result: string;
  }[];
  existentialLeadershipPrompt: {
    ethicalQuestion: string;
    leadershipQuote: string;
  };
  keyExamples: GrammarRuleExample[];
  exercises: Exercise[];
}

export interface BoardroomDialogueTurn {
  id: string;
  speaker: string;
  speakerRole: string;
  avatarSeed: string;
  dialogueText: string;
  businessChallenge: string;
  targetGrammarFocus: GrammarCategoryId;
  promptToUser: string;
  targetSpokenSentence: string;
  alternativeAcceptableSentences?: string[];
  contextClue: string;
  coachingFeedback: {
    vocabularyUsed: string[];
    executiveImpact: string;
  };
}

export interface BoardroomScenario {
  id: string;
  title: string;
  department: string;
  stakes: string;
  image: string;
  overview: string;
  userRole: string;
  counterparts: string[];
  dialogueTurns: BoardroomDialogueTurn[];
}

export interface UserStats {
  xp: number;
  streak: number;
  lastActiveDate: string;
  completedLessonIds: string[];
  completedScenarioIds: string[];
  speechExercisesCount: number;
  accuracyRate: number;
  totalAttempts: number;
  successfulAttempts: number;
  unlockedBadges: string[];
  intelligenceScores: IntelligenceScoreMap | null;
  dominantIntelligences: IntelligenceType[];
  hasCompletedDiagnostic: boolean;
}

export interface SpeechEvaluationResult {
  transcript: string;
  target: string;
  similarityScore: number; // 0 to 100
  matchedWords: string[];
  missedWords: string[];
  extraWords: string[];
  isPassing: boolean;
  fluencyGrade: 'Flawless C2' | 'Strong Executive C1' | 'Competent B2' | 'Requires Re-articulation';
  feedback: string;
}

export interface RoadmapMilestone {
  id: string;
  stepNumber: number;
  moduleId: GrammarCategoryId;
  title: string;
  phaseId: 'foundation' | 'core_negotiation' | 'executive_rhetoric';
  phaseName: string;
  recommendedModality: 'visual_first' | 'cadence_first' | 'logic_first' | 'dialogue_first' | 'ethics_first' | 'kinesthetic_builder';
  modalityLabel: string;
  targetSkill: string;
  cognitiveAdvantage: string;
  scenarioHook: string;
  estimatedMinutes: number;
}

export interface PersonalizedRoadmap {
  strategyTitle: string;
  strategySubtitle: string;
  dominantType: IntelligenceType;
  primaryCognitiveLever: string;
  pedagogicalDirectives: string[];
  milestones: RoadmapMilestone[];
}

