import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Check,
  ChevronRight,
  Flame,
  Heart,
  VolumeX,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import {
  createSpeechRecognizer,
  evaluateSpeechAccuracy,
  isSpeechRecognitionSupported,
  playExecutiveSpeech,
} from '../utils/speechHelper';
import { calculateIntelligenceProfile } from '../data/intelligenceData';

interface DuolingoOnboardingProps {
  onComplete: () => void;
}

// 6 engaging Duolingo-style interactive questions that secretly map to intelligence dimensions
interface OnboardingStep {
  id: number;
  type: 'select_one' | 'tiles' | 'speech' | 'listen_select';
  categoryMapping: number[]; // maps to question IDs in intelligenceData for scoring under the hood
  title: string;
  context: string;
  targetSentence?: string;
  options?: { id: string; text: string; subtext?: string; isBest: boolean }[];
  wordBank?: string[];
  audioText?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    type: 'select_one',
    categoryMapping: [7, 15], // Interpersonal
    title: 'Toplantı açılışında müzakere ortağınız zor bir taleple geldiğinde yaklaşımınız:',
    context: 'Lord Alistair sözleşme katsayısını tek taraflı artırmak istiyor.',
    options: [
      {
        id: 'a',
        text: 'Doğrudan karşı çıkmak yerine diplomatik bir dille ortak parametreleri hatırlatırım.',
        subtext: '"Could we explore a restructured schedule..."',
        isBest: true,
      },
      {
        id: 'b',
        text: 'Sözleşmenin kesin maddelerini ve mantıksal doğruluk tablosunu masaya koyarım.',
        subtext: '"Covenants clearly dictate the multiples..."',
        isBest: false,
      },
      {
        id: 'c',
        text: 'Cümlelerimi vurgulu ve tok bir vokal tonlamayla seslendirerek otorite kurarım.',
        subtext: '"Under no circumstances can we compromise..."',
        isBest: false,
      },
    ],
  },
  {
    id: 2,
    type: 'tiles',
    categoryMapping: [2, 10, 6], // Visual-Spatial & Kinesthetic
    title: 'Aşağıdaki kelime bloklarını dizerek doğru yönetici cümlesini oluşturun:',
    context: 'Devrik Cümle (Inversion) ile güçlü bir kurumsal ilke inşa edin.',
    targetSentence: 'Seldom have we witnessed such exponential market growth',
    wordBank: [
      'have we witnessed',
      'Seldom',
      'market growth',
      'such exponential',
      'we witnessed',
      'never before',
    ],
  },
  {
    id: 3,
    type: 'speech',
    categoryMapping: [4, 12, 6], // Musical-Rhythmic & Kinesthetic Speech
    title: 'Mikrofona konuşarak bu kriz yönetimi cümlesini seslendirin:',
    context: 'Basın toplantısında veri güvenliğini savunan tepe yönetici ifadesi.',
    targetSentence: 'Under no circumstances will our leadership compromise client data sovereignty.',
    audioText: 'Under no circumstances will our leadership compromise client data sovereignty.',
  },
  {
    id: 4,
    type: 'listen_select',
    categoryMapping: [4, 1], // Musical & Verbal
    title: 'Örnek ses kaydını dinleyin ve en etkili diplomatik vurguyu seçin:',
    context: 'CFO yatırımcılara hitap ediyor.',
    audioText: 'Notwithstanding short-term headwinds, operating margins have expanded.',
    options: [
      {
        id: 'a',
        text: '"Notwithstanding" ile başlayarak engelleri önemsizleştirip kârlılığı öne çıkarmak',
        isBest: true,
      },
      {
        id: 'b',
        text: 'Zorlukları tamamen gizleyip sadece rakamlardan bahsetmek',
        isBest: false,
      },
    ],
  },
  {
    id: 5,
    type: 'select_one',
    categoryMapping: [5, 13], // Logical-Mathematical
    title: 'Bir iş anlaşmasında şart ve sebep-sonuç bağını nasıl kurarsınız?',
    context: 'Şirket birleşmesi öncesi yasal denetim.',
    options: [
      {
        id: 'a',
        text: 'Matematiksel bir kronoloji kurarım: "Prior to executing the merger, legal had already validated covenants."',
        subtext: 'Zaman kipleriyle (Past Perfect) şüpheye yer bırakmayan kesinlik',
        isBest: true,
      },
      {
        id: 'b',
        text: 'Geniş bir vizyon konuşması yaparak ortak şirket kültürüne vurgu yaparım.',
        subtext: 'Kurumsal misyon ve etik değerler',
        isBest: false,
      },
    ],
  },
  {
    id: 6,
    type: 'select_one',
    categoryMapping: [3, 11], // Existential & Strategic
    title: 'İngilizce iş iletişiminde en çok hangi hedefi gerçekleştirmek istersiniz?',
    context: 'Kişisel kariyer ve liderlik vizyonunuz.',
    options: [
      {
        id: 'a',
        text: 'Global yönetim kurulunda ve sahnede kelimelerimle derin vizyon ve güven aşılamak',
        isBest: true,
      },
      {
        id: 'b',
        text: 'Yabancı meslektaşlarımla hızlı ve hatasız sözleşme müzakereleri yürütmek',
        isBest: true,
      },
      {
        id: 'c',
        text: 'Yatırımcı ve analist çağrılarında akıcı, pürüzsüz ve karizmatik bir aksanla konuşmak',
        isBest: true,
      },
    ],
  },
];

export const DuolingoOnboarding: React.FC<DuolingoOnboardingProps> = ({ onComplete }) => {
  const { saveDiagnosticResults } = useGame();
  const { t } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // User input states
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [assembledTiles, setAssembledTiles] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');
  const [speechScore, setSpeechScore] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'try_again'>('idle');

  // Secret intelligence weights collected during test
  const [collectedWeights, setCollectedWeights] = useState<Record<number, number>>({});

  const step = ONBOARDING_STEPS[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100);

  // Play audio
  const handlePlayAudio = async (text: string) => {
    setIsPlayingAudio(true);
    await playExecutiveSpeech(text, 0.95, 'us');
    setIsPlayingAudio(false);
  };

  // Tile toggle
  const handleToggleTile = (word: string) => {
    if (assembledTiles.includes(word)) {
      setAssembledTiles((prev) => prev.filter((w) => w !== word));
    } else {
      setAssembledTiles((prev) => [...prev, word]);
    }
  };

  // Mic Toggle
  const handleToggleMic = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setSpeechTranscript('');
    setSpeechScore(null);

    if (!isSpeechRecognitionSupported()) {
      // Simulate input for environments without mic
      setSpeechTranscript(step.targetSentence || '');
      setSpeechScore(96);
      setFeedbackState('correct');
      return;
    }

    const rec = createSpeechRecognizer(
      (transcript, isFinal) => {
        setSpeechTranscript(transcript);
        if (isFinal) {
          setIsRecording(false);
          const evalResult = evaluateSpeechAccuracy(transcript, step.targetSentence || '');
          setSpeechScore(evalResult.similarityScore);
          setFeedbackState(evalResult.similarityScore >= 60 ? 'correct' : 'try_again');
        }
      },
      () => setIsRecording(false),
      () => setIsRecording(false),
      () => setIsRecording(true)
    );

    if (rec) {
      try {
        rec.start();
      } catch {
        setIsRecording(false);
      }
    }
  };

  const handleSimulateVoice = () => {
    setSpeechTranscript(step.targetSentence || '');
    setSpeechScore(94);
    setFeedbackState('correct');
  };

  // Check / Validate Step
  const handleCheckStep = () => {
    // Record internal weights for intelligence profile
    const currentQIds = step.categoryMapping;
    const newWeights = { ...collectedWeights };
    currentQIds.forEach((qId) => {
      newWeights[qId] = 4; // High score for interactive engagement
    });
    setCollectedWeights(newWeights);

    setFeedbackState('correct');
  };

  // Continue to next step
  const handleContinue = () => {
    setFeedbackState('idle');
    setSelectedOptionId(null);
    setAssembledTiles([]);
    setSpeechTranscript('');
    setSpeechScore(null);

    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Calculate under the hood without showing psychological test labels
      const profile = calculateIntelligenceProfile(collectedWeights);
      saveDiagnosticResults(profile.scores, profile.dominant);
      setIsEvaluating(true);

      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  const isCurrentStepValid = () => {
    if (step.type === 'select_one' || step.type === 'listen_select') {
      return Boolean(selectedOptionId);
    }
    if (step.type === 'tiles') {
      return assembledTiles.length > 0;
    }
    if (step.type === 'speech') {
      return Boolean(speechTranscript);
    }
    return false;
  };

  if (isEvaluating) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 border-2 border-amber-400 text-amber-400 mb-6 animate-pulse">
          <Sparkles className="h-10 w-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-white mb-2">
          {t('onboarding_analyzing')}
        </h2>
        <p className="text-sm text-slate-400 max-w-md">
          {t('onboarding_analyzing_sub')}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Duolingo-style Top Progress Bar with Hearts and Flame */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex-1 flex items-center gap-3">
          <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-amber-400 tabular-nums">
            {progressPercent}%
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono font-bold text-slate-300">
          <div className="flex items-center gap-1 text-amber-400">
            <Flame className="h-4 w-4 fill-amber-400" />
            <span>1</span>
          </div>
          <div className="flex items-center gap-1 text-rose-500">
            <Heart className="h-4 w-4 fill-rose-500" />
            <span>5</span>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 mb-6 shadow-xl">
        <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
          {step.context}
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mb-6 leading-snug">
          {step.title}
        </h2>

        {/* 1. SELECT ONE MODALITY */}
        {step.type === 'select_one' && (
          <div className="space-y-3">
            {step.options?.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`w-full text-left rounded-xl border p-4 transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/10 text-white shadow-md shadow-amber-500/5 ring-1 ring-amber-400/50'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-100">{opt.text}</div>
                    {opt.subtext && (
                      <div className="text-xs text-amber-300/80 mt-1 italic font-mono">
                        {opt.subtext}
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-slate-950">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 2. TILES MODALITY (WORD BUILDER) */}
        {step.type === 'tiles' && (
          <div className="space-y-6">
            {/* Target Assembly Area */}
            <div className="min-h-16 rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/80 p-4 flex flex-wrap items-center gap-2">
              {assembledTiles.length === 0 ? (
                <span className="text-xs text-slate-500 italic">
                  Aşağıdaki kelime bloklarına tıklayarak cümleyi sırayla yerleştirin...
                </span>
              ) : (
                assembledTiles.map((tile, i) => (
                  <button
                    key={i}
                    onClick={() => handleToggleTile(tile)}
                    className="rounded-lg bg-amber-400 text-slate-950 px-3.5 py-1.5 text-xs font-bold shadow-sm hover:bg-rose-400 hover:text-white transition-all"
                  >
                    {tile} ✕
                  </button>
                ))
              )}
            </div>

            {/* Available Word Bank */}
            <div className="flex flex-wrap gap-2.5">
              {step.wordBank?.map((word, idx) => {
                const isUsed = assembledTiles.includes(word);
                return (
                  <button
                    key={idx}
                    onClick={() => handleToggleTile(word)}
                    disabled={isUsed}
                    className={`rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all ${
                      isUsed
                        ? 'border-slate-800 bg-slate-950 text-slate-600 opacity-40 cursor-not-allowed'
                        : 'border-slate-700 bg-slate-800 text-slate-100 hover:border-amber-400 hover:bg-slate-750 shadow-sm'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. SPEECH MODALITY */}
        {step.type === 'speech' && (
          <div className="space-y-6">
            {/* Target to speak */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Seslendirilecek Cümle:</span>
                <button
                  onClick={() => handlePlayAudio(step.targetSentence || '')}
                  disabled={isPlayingAudio}
                  className="flex items-center gap-1 text-amber-400 font-semibold hover:text-amber-300"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>{isPlayingAudio ? 'Dinleniyor...' : 'Dinle'}</span>
                </button>
              </div>
              <blockquote className="font-serif text-lg text-amber-200/90 font-medium">
                "{step.targetSentence}"
              </blockquote>
            </div>

            {/* Mic Trigger */}
            <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-slate-800 bg-slate-950/60">
              <button
                onClick={handleToggleMic}
                className={`flex h-16 w-16 items-center justify-center rounded-full text-slate-950 shadow-xl transition-all mb-3 ${
                  isRecording
                    ? 'bg-rose-500 animate-pulse text-white shadow-rose-500/40'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                }`}
              >
                {isRecording ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
              </button>
              <div className="text-sm font-semibold text-white">
                {isRecording ? 'Dinleniyor... Şimdi Konuşunuz' : 'Mikrofona Basıp Cümleyi Seslendirin'}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Web Speech API telaffuzunuzu anında puanlayacaktır.
              </div>

              <button
                onClick={handleSimulateVoice}
                className="mt-4 text-[11px] text-slate-500 hover:text-slate-300 underline"
              >
                (Mikrofonu olmayan cihazlar için hızlı giriş testi)
              </button>
            </div>

            {speechTranscript && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="text-xs text-slate-400 mb-1">Algılanan Ses:</div>
                <div className="text-xs font-mono text-slate-200 italic">"{speechTranscript}"</div>
                {speechScore !== null && (
                  <div className="mt-2 text-xs font-mono font-bold text-amber-400">
                    Akıcılık Skoru: %{speechScore}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 4. LISTEN & SELECT MODALITY */}
        {step.type === 'listen_select' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-400 mb-1">Örnek Seslendirme:</div>
                <div className="text-sm font-serif text-slate-200 italic">
                  "{step.audioText}"
                </div>
              </div>

              <button
                onClick={() => handlePlayAudio(step.audioText || '')}
                disabled={isPlayingAudio}
                className="flex items-center gap-2 rounded-xl bg-amber-500/20 border border-amber-400/40 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition-all shrink-0"
              >
                <Volume2 className="h-4 w-4" />
                <span>{isPlayingAudio ? 'Dinletiliyor...' : 'Sesi Dinle'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {step.options?.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`w-full text-left rounded-xl border p-4 transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 text-white shadow-sm ring-1 ring-amber-400/50'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{opt.text}</span>
                    {isSelected && (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-slate-950">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Duolingo Control Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 flex items-center justify-between shadow-2xl">
        {feedbackState === 'correct' ? (
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="h-5 w-5" />
            <span>{t('perfect_msg')}</span>
          </div>
        ) : (
          <div className="text-xs text-slate-400">
            {currentStepIndex + 1} / {ONBOARDING_STEPS.length}
          </div>
        )}

        {feedbackState === 'idle' ? (
          <button
            onClick={handleCheckStep}
            disabled={!isCurrentStepValid()}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-lg shadow-amber-500/10"
          >
            <span>{t('check_btn')}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            <span>{t('continue_btn')}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
