import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layout,
  Music,
  Binary,
  Compass,
  BookOpen,
  ArrowRight,
  Play,
  RotateCcw,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Exercise, LessonModule, SpeechEvaluationResult } from '../types';
import { useGame } from '../context/GameContext';
import {
  createSpeechRecognizer,
  evaluateSpeechAccuracy,
  isSpeechRecognitionSupported,
  playExecutiveSpeech,
  stopSpeechSynthesis,
} from '../utils/speechHelper';

interface LessonModalProps {
  module: LessonModule | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({ module, isOpen, onClose }) => {
  const { stats, recordExerciseCompletion } = useGame();

  // Active intelligence tab inside lesson
  const [activeIntelTab, setActiveIntelTab] = useState<
    'visual' | 'musical' | 'logical' | 'existential' | 'verbal'
  >('visual');

  // Exercise state
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [exerciseCompleted, setExerciseCompleted] = useState<boolean>(false);

  // Speech Recognition state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');
  const [speechResult, setSpeechResult] = useState<SpeechEvaluationResult | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [accent, setAccent] = useState<'us' | 'uk'>('us');

  // Sentence builder state
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [builderError, setBuilderError] = useState<string | null>(null);

  // Multiple choice state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [optionSubmitted, setOptionSubmitted] = useState<boolean>(false);

  // Reset when module changes
  useEffect(() => {
    setActiveExerciseIndex(0);
    setExerciseCompleted(false);
    setSpeechResult(null);
    setSpeechTranscript('');
    setSelectedTiles([]);
    setSelectedOptionId(null);
    setOptionSubmitted(false);
    setSpeechError(null);
    stopSpeechSynthesis();
  }, [module]);

  if (!isOpen || !module) return null;

  const currentExercise: Exercise = module.exercises[activeExerciseIndex];
  const isLastExercise = activeExerciseIndex === module.exercises.length - 1;

  // Speech Recognition Handler
  const handleToggleSpeech = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setSpeechError(null);
    setSpeechTranscript('');
    setSpeechResult(null);

    if (!isSpeechRecognitionSupported()) {
      // Graceful fallback simulation
      setSpeechError(
        'Web Speech API bu tarayıcıda desteklenmiyor. Aşağıdaki "Örnek Telaffuz Girişi" butonunu kullanarak test edebilirsiniz.'
      );
      return;
    }

    const recognizer = createSpeechRecognizer(
      (transcript, isFinal) => {
        setSpeechTranscript(transcript);
        if (isFinal) {
          setIsRecording(false);
          const evaluation = evaluateSpeechAccuracy(
            transcript,
            currentExercise.targetSentence,
            currentExercise.acceptableVariations || []
          );
          setSpeechResult(evaluation);
          if (evaluation.isPassing) {
            setExerciseCompleted(true);
            recordExerciseCompletion(module.id, currentExercise.id, true, 40, true);
          } else {
            recordExerciseCompletion(module.id, currentExercise.id, false, 5, true);
          }
        }
      },
      (error) => {
        setIsRecording(false);
        setSpeechError(`Mikrofon hatası: ${error}. İzinleri kontrol ediniz.`);
      },
      () => {
        setIsRecording(false);
      },
      () => {
        setIsRecording(true);
      }
    );

    if (recognizer) {
      try {
        recognizer.start();
      } catch (err: any) {
        setIsRecording(false);
        setSpeechError('Mikrofon başlatılamadı: ' + err.message);
      }
    }
  };

  // Simulated Voice Input for instant test & zero friction
  const handleSimulateSpeech = (accuracyType: 'perfect' | 'minor_error') => {
    const textToSimulate =
      accuracyType === 'perfect'
        ? currentExercise.targetSentence
        : currentExercise.targetSentence.split(' ').slice(0, -2).join(' ') + ' ...';

    setSpeechTranscript(textToSimulate);
    const evaluation = evaluateSpeechAccuracy(
      textToSimulate,
      currentExercise.targetSentence,
      currentExercise.acceptableVariations || []
    );
    setSpeechResult(evaluation);

    if (evaluation.isPassing) {
      setExerciseCompleted(true);
      recordExerciseCompletion(module.id, currentExercise.id, true, 40, true);
    } else {
      recordExerciseCompletion(module.id, currentExercise.id, false, 5, true);
    }
  };

  // Text to Speech playback
  const handleListenTarget = async (text: string) => {
    setIsPlayingAudio(true);
    await playExecutiveSpeech(text, 0.9, accent);
    setIsPlayingAudio(false);
  };

  // Sentence Builder Tile click
  const handleTileClick = (word: string) => {
    if (selectedTiles.includes(word)) {
      setSelectedTiles((prev) => prev.filter((t) => t !== word));
    } else {
      setSelectedTiles((prev) => [...prev, word]);
    }
  };

  const handleVerifyBuilder = () => {
    const constructed = selectedTiles.join(' ').trim().toLowerCase();
    const target = currentExercise.targetSentence.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '').trim();
    const cleanConstructed = constructed.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '').trim();

    if (cleanConstructed === target) {
      setBuilderError(null);
      setExerciseCompleted(true);
      recordExerciseCompletion(module.id, currentExercise.id, true, 35, false);
    } else {
      setBuilderError('Sözdizimi sırası henüz tam oturmadı. Kural ve ipuçlarını kontrol ediniz.');
      recordExerciseCompletion(module.id, currentExercise.id, false, 5, false);
    }
  };

  // Multiple Choice Select & Submit
  const handleSelectOption = (optId: string) => {
    if (optionSubmitted) return;
    setSelectedOptionId(optId);
  };

  const handleSubmitOption = () => {
    if (!selectedOptionId) return;
    setOptionSubmitted(true);
    const chosen = currentExercise.options?.find((o) => o.id === selectedOptionId);
    if (chosen?.isCorrect) {
      setExerciseCompleted(true);
      recordExerciseCompletion(module.id, currentExercise.id, true, 35, false);
    } else {
      recordExerciseCompletion(module.id, currentExercise.id, false, 5, false);
    }
  };

  // Next exercise
  const handleNextExercise = () => {
    if (!isLastExercise) {
      setActiveExerciseIndex((prev) => prev + 1);
      setExerciseCompleted(false);
      setSpeechResult(null);
      setSpeechTranscript('');
      setSelectedTiles([]);
      setSelectedOptionId(null);
      setOptionSubmitted(false);
      setSpeechError(null);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-6 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl text-slate-100 overflow-hidden">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-4 bg-slate-950/70 backdrop-blur-md">
          <div className="flex-1 pr-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">{module.difficulty}</span>
                <span aria-hidden="true">·</span>
                <span>{module.executiveRoleContext}</span>
              </div>
              <span className="font-bold text-slate-300">
                {activeExerciseIndex + 1} / {module.exercises.length}
              </span>
            </div>

            {/* Duolingo Step Progress Bar */}
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-300"
                style={{
                  width: `${((activeExerciseIndex + (exerciseCompleted ? 1 : 0)) / module.exercises.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700 transition-colors shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body: Split into Knowledge/Intel Deck and Interactive Exercise Deck */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Intelligence Perspectives Tabs (Gardner Multi-Intelligence Framework) */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Çoklu Zekâ Boyutları ile İncele:</span>
              </div>

              {/* Segmented Buttons */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800/80">
                <button
                  onClick={() => setActiveIntelTab('visual')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeIntelTab === 'visual'
                      ? 'bg-indigo-950 text-indigo-200 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layout className="h-3 w-3" />
                  <span>Görsel Şema</span>
                </button>

                <button
                  onClick={() => setActiveIntelTab('musical')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeIntelTab === 'musical'
                      ? 'bg-pink-950 text-pink-200 border border-pink-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Music className="h-3 w-3" />
                  <span>Ritim & Vurgu</span>
                </button>

                <button
                  onClick={() => setActiveIntelTab('logical')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeIntelTab === 'logical'
                      ? 'bg-emerald-950 text-emerald-200 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Binary className="h-3 w-3" />
                  <span>Mantık Matrisi</span>
                </button>

                <button
                  onClick={() => setActiveIntelTab('existential')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeIntelTab === 'existential'
                      ? 'bg-purple-950 text-purple-200 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Compass className="h-3 w-3" />
                  <span>Etik & Vizyon</span>
                </button>

                <button
                  onClick={() => setActiveIntelTab('verbal')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeIntelTab === 'verbal'
                      ? 'bg-sky-950 text-sky-200 border border-sky-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="h-3 w-3" />
                  <span>Retorik</span>
                </button>
              </div>
            </div>

            {/* Dynamic Content based on active intelligence dimension */}
            {activeIntelTab === 'visual' && (
              <div className="pt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  {module.visualSyntaxMap.stages.map((stg, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-slate-800 bg-slate-900/80 p-3 relative overflow-hidden"
                    >
                      <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider mb-1">
                        Aşama {i + 1}: {stg.label}
                      </div>
                      <div className="font-mono text-xs font-bold text-slate-100 mb-1">
                        {stg.element}
                      </div>
                      <div className="text-xs text-slate-400">{stg.hint}</div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-indigo-300/90 font-medium">
                  Mimari İpucu: {module.visualSyntaxMap.architecturalTip}
                </div>
              </div>
            )}

            {activeIntelTab === 'musical' && (
              <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div>
                    <strong className="text-pink-400">Tonlama Eğrisi:</strong>{' '}
                    {module.rhythmicCadenceGuide.pitchPattern}
                  </div>
                  <div>
                    <strong className="text-pink-400">Hece Vurgusu:</strong>{' '}
                    <span className="font-mono">{module.rhythmicCadenceGuide.stressSyllables}</span>
                  </div>
                  <div>
                    <strong className="text-pink-400">Tempo Rehberi:</strong>{' '}
                    {module.rhythmicCadenceGuide.tempoAdvice}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <button
                    onClick={() => handleListenTarget(currentExercise.targetSentence)}
                    disabled={isPlayingAudio}
                    className="flex items-center gap-2 rounded-lg border border-pink-500/40 bg-pink-500/10 px-3.5 py-2 text-xs font-semibold text-pink-300 hover:bg-pink-500/20 transition-colors"
                  >
                    <Volume2 className="h-4 w-4" />
                    <span>{isPlayingAudio ? 'Seslendiriliyor...' : 'Örnek Cümleyi Dinle'}</span>
                  </button>
                  <select
                    value={accent}
                    onChange={(e) => setAccent(e.target.value as 'us' | 'uk')}
                    className="rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-slate-300"
                  >
                    <option value="us">US Corporate</option>
                    <option value="uk">UK Boardroom</option>
                  </select>
                </div>
              </div>
            )}

            {activeIntelTab === 'logical' && (
              <div className="pt-2">
                <div className="mb-2 font-mono text-xs text-emerald-400 font-semibold">
                  Formül: {module.grammaticalFormula}
                </div>
                <div className="space-y-2 text-xs">
                  {module.logicalMatrix.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-2.5 gap-2"
                    >
                      <span className="text-slate-300 font-medium">Koşul: {item.condition}</span>
                      <ArrowRight className="hidden sm:block h-3.5 w-3.5 text-slate-400" />
                      <span className="text-emerald-300 font-mono text-[11px]">{item.result}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeIntelTab === 'existential' && (
              <div className="pt-2 text-xs space-y-2">
                <div className="rounded-lg border border-purple-800/40 bg-purple-950/20 p-3">
                  <div className="text-purple-400 font-semibold mb-1">
                    Yönetimsel Vicdan ve Etik İkilem:
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {module.existentialLeadershipPrompt.ethicalQuestion}
                  </p>
                </div>
                <blockquote className="italic text-purple-200/90 border-l-2 border-purple-500 pl-3 py-1">
                  {module.existentialLeadershipPrompt.leadershipQuote}
                </blockquote>
              </div>
            )}

            {activeIntelTab === 'verbal' && (
              <div className="pt-2 space-y-2 text-xs">
                {module.keyExamples.map((ex, i) => (
                  <div key={i} className="rounded-lg border border-slate-800 bg-slate-900 p-3 space-y-1">
                    <div className="text-[10px] text-amber-400 font-mono uppercase">{ex.businessScenario}</div>
                    <div className="text-slate-400 line-through">Günlük / Yetersiz: "{ex.informal}"</div>
                    <div className="text-sky-300 font-medium">Yönetim Kurulu Standardı: "{ex.executive}"</div>
                    <div className="text-slate-400 text-[11px]">Nüans: {ex.rationale}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Exercise Container */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-medium">
                  {currentExercise.scenarioTitle}
                </span>
                <p className="text-xs text-slate-400 mt-0.5">{currentExercise.businessContext}</p>
              </div>

              <div className="text-xs font-mono text-slate-400">
                {currentExercise.type === 'speech' && '🎤 Ses Tanıma & Akıcılık'}
                {currentExercise.type === 'sentence_builder' && '🧩 Kinestetik Cümle İnşası'}
                {currentExercise.type === 'multiple_choice' && '⚖️ Diplomatik İfade Seçimi'}
              </div>
            </div>

            <p className="text-base font-semibold text-white mb-4">
              {currentExercise.promptQuestion}
            </p>

            {/* Exercise Modality 1: SPEECH RECOGNITION */}
            {currentExercise.type === 'speech' && (
              <div className="space-y-5">
                <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5">
                  <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
                    <span>Hedef İfade (Mikrofona net ve tok bir sesle okuyunuz):</span>
                    <button
                      onClick={() => handleListenTarget(currentExercise.targetSentence)}
                      disabled={isPlayingAudio}
                      className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>{isPlayingAudio ? 'Dinleniyor...' : 'Örnek Dinle'}</span>
                    </button>
                  </div>
                  <p className="font-serif text-lg text-amber-200/95 font-medium leading-relaxed">
                    "{currentExercise.targetSentence}"
                  </p>
                </div>

                {/* Microphone Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleToggleSpeech}
                      className={`relative flex h-14 w-14 items-center justify-center rounded-full text-slate-950 shadow-lg transition-all ${
                        isRecording
                          ? 'bg-rose-500 animate-pulse text-white shadow-rose-500/30'
                          : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                      }`}
                    >
                      {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                    </button>

                    <div>
                      <div className="text-sm font-semibold text-slate-100">
                        {isRecording ? 'Dinleniyor... Konuşunuz' : 'Konuşmayı Başlatmak İçin Basın'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {isRecording
                          ? 'Cümlenizi tamamladığınızda otomatik olarak analiz edilecektir.'
                          : 'Web Speech API ile gerçek zamanlı telaffuz ve sözdizimi doğrulaması'}
                      </div>
                    </div>
                  </div>

                  {/* Fallback Simulation Buttons for Instant Testing */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 hidden lg:inline">Alternatif:</span>
                    <button
                      onClick={() => handleSimulateSpeech('perfect')}
                      className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-700 hover:text-white"
                      title="Ses girişi donanımı bulunmayan ortamlar için kusursuz giriş testi"
                    >
                      Kusursuz Giriş Simülasyonu
                    </button>
                    <button
                      onClick={() => handleSimulateSpeech('minor_error')}
                      className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-300"
                      title="Eksik giriş testi"
                    >
                      Eksik Giriş Simülasyonu
                    </button>
                  </div>
                </div>

                {speechError && (
                  <div className="flex items-center gap-2 rounded-lg border border-rose-800/40 bg-rose-950/20 p-3 text-xs text-rose-300">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{speechError}</span>
                  </div>
                )}

                {/* Speech Transcript & Evaluation Card */}
                {speechTranscript && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Algılanan Ses Transkripti:</div>
                      <p className="text-sm text-slate-200 italic font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        "{speechTranscript}"
                      </p>
                    </div>

                    {speechResult && (
                      <div className="space-y-3 pt-2 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-3 w-3 rounded-full ${
                                speechResult.isPassing ? 'bg-emerald-400' : 'bg-amber-400'
                              }`}
                            />
                            <span className="font-semibold text-sm text-slate-100">
                              {speechResult.fluencyGrade}
                            </span>
                          </div>
                          <span className="font-mono text-sm font-bold text-amber-400 tabular-nums">
                            %{speechResult.similarityScore} Doğruluk
                          </span>
                        </div>

                        <p className="text-xs text-slate-300">{speechResult.feedback}</p>

                        {/* Word analysis */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {currentExercise.targetSentence.split(' ').map((word, wIdx) => {
                            const cleanWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '');
                            const isMatched = speechResult.matchedWords.includes(cleanWord);
                            return (
                              <span
                                key={wIdx}
                                className={`text-xs px-2 py-0.5 rounded font-mono ${
                                  isMatched
                                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                                }`}
                              >
                                {word}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Exercise Modality 2: SENTENCE BUILDER */}
            {currentExercise.type === 'sentence_builder' && (
              <div className="space-y-5">
                {/* Assembled Result Zone */}
                <div className="min-h-16 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 p-4 flex flex-wrap items-center gap-2">
                  {selectedTiles.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">
                      Aşağıdaki kelime bloklarına tıklayarak doğru yönetici sözdizimini oluşturunuz...
                    </span>
                  ) : (
                    selectedTiles.map((tile, tIdx) => (
                      <button
                        key={tIdx}
                        onClick={() => handleTileClick(tile)}
                        className="rounded-lg bg-amber-500/20 border border-amber-400/40 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-rose-500/20 hover:border-rose-400 hover:text-rose-200 transition-colors"
                      >
                        {tile} ✕
                      </button>
                    ))
                  )}
                </div>

                {/* Available Word Bank */}
                <div>
                  <div className="text-xs text-slate-400 mb-2">Kelime ve İfade Havuzu:</div>
                  <div className="flex flex-wrap gap-2">
                    {currentExercise.wordBank?.map((tile, bIdx) => {
                      const isChosen = selectedTiles.includes(tile);
                      return (
                        <button
                          key={bIdx}
                          onClick={() => handleTileClick(tile)}
                          disabled={isChosen}
                          className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-all ${
                            isChosen
                              ? 'border-slate-800 bg-slate-950 text-slate-600 opacity-40 cursor-not-allowed'
                              : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-amber-400/60 hover:bg-slate-800'
                          }`}
                        >
                          {tile}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {builderError && (
                  <div className="text-xs text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" />
                    <span>{builderError}</span>
                  </div>
                )}

                {!exerciseCompleted && (
                  <button
                    onClick={handleVerifyBuilder}
                    disabled={selectedTiles.length === 0}
                    className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-40 transition-colors"
                  >
                    <span>Sözdizimini Doğrula</span>
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {/* Exercise Modality 3: MULTIPLE CHOICE */}
            {currentExercise.type === 'multiple_choice' && (
              <div className="space-y-4">
                <div className="space-y-2.5">
                  {currentExercise.options?.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    const showFeedback = optionSubmitted;

                    let borderClass = 'border-slate-800 bg-slate-900/60 text-slate-300';
                    if (isSelected && !showFeedback) {
                      borderClass = 'border-amber-400 bg-amber-500/10 text-amber-200';
                    } else if (showFeedback && opt.isCorrect) {
                      borderClass = 'border-emerald-500 bg-emerald-950/40 text-emerald-200';
                    } else if (showFeedback && isSelected && !opt.isCorrect) {
                      borderClass = 'border-rose-500 bg-rose-950/40 text-rose-200';
                    }

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`cursor-pointer rounded-xl border p-4 transition-all ${borderClass}`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold">{opt.register}</span>
                          {showFeedback && opt.isCorrect && (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Doğru İfade
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium leading-relaxed">{opt.text}</p>
                        {showFeedback && (
                          <div className="mt-2 text-xs pt-2 border-t border-slate-800/80 text-slate-300">
                            {opt.feedback}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!optionSubmitted && (
                  <button
                    onClick={handleSubmitOption}
                    disabled={!selectedOptionId}
                    className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-40 transition-colors"
                  >
                    <span>Cevabı Gönder</span>
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {/* Explanation & Executive Tip when completed */}
            {exerciseCompleted && (
              <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>YÖNETİCİ DİL STANDARDI SAĞLANDI (+{currentExercise.type === 'speech' ? 40 : 35} XP)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentExercise.explanation}
                </p>
                <div className="pt-2 text-xs text-amber-300/90 font-medium">
                  💡 Yönetici İpucu: {currentExercise.executiveTip}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleNextExercise}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-950 border-b-4 border-amber-700 hover:brightness-105 active:border-b-0 active:translate-y-1 transition-all shadow-xl shadow-amber-500/20"
                  >
                    <span>{isLastExercise ? 'Modülü Tamamla' : 'Sonraki Egzersize Geç'}</span>
                    <ChevronRight className="h-4 w-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
