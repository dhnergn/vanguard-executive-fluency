import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  RotateCcw,
  ArrowLeft,
  Building,
  Shield,
  Briefcase,
} from 'lucide-react';
import { BOARDROOM_SCENARIOS } from '../data/scenariosData';
import { BoardroomDialogueTurn, BoardroomScenario, SpeechEvaluationResult } from '../types';
import { useGame } from '../context/GameContext';
import {
  createSpeechRecognizer,
  evaluateSpeechAccuracy,
  isSpeechRecognitionSupported,
  playExecutiveSpeech,
  stopSpeechSynthesis,
} from '../utils/speechHelper';

export const BoardroomSimulator: React.FC = () => {
  const { stats, recordScenarioCompletion } = useGame();
  const [selectedScenario, setSelectedScenario] = useState<BoardroomScenario | null>(null);
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(0);

  // Speech state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');
  const [speechResult, setSpeechResult] = useState<SpeechEvaluationResult | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Scenario completion state
  const [turnScores, setTurnScores] = useState<number[]>([]);
  const [isScenarioFinished, setIsScenarioFinished] = useState<boolean>(false);

  const activeTurn: BoardroomDialogueTurn | null = selectedScenario
    ? selectedScenario.dialogueTurns[currentTurnIndex]
    : null;

  const handleStartScenario = (sc: BoardroomScenario) => {
    setSelectedScenario(sc);
    setCurrentTurnIndex(0);
    setTurnScores([]);
    setIsScenarioFinished(false);
    setSpeechResult(null);
    setSpeechTranscript('');
    setSpeechError(null);
    stopSpeechSynthesis();
  };

  const handleLeaveScenario = () => {
    stopSpeechSynthesis();
    setSelectedScenario(null);
  };

  const handleListenCounterpart = async (text: string) => {
    setIsPlayingAudio(true);
    await playExecutiveSpeech(text, 0.95, 'uk');
    setIsPlayingAudio(false);
  };

  const handleToggleSpeech = () => {
    if (!activeTurn) return;

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setSpeechError(null);
    setSpeechTranscript('');
    setSpeechResult(null);

    if (!isSpeechRecognitionSupported()) {
      setSpeechError(
        'Web Speech API bu tarayıcıda desteklenmiyor. Aşağıdaki "Ses Girişi Simülasyonu" butonunu kullanabilirsiniz.'
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
            activeTurn.targetSpokenSentence,
            activeTurn.alternativeAcceptableSentences || []
          );
          setSpeechResult(evaluation);
        }
      },
      (err) => {
        setIsRecording(false);
        setSpeechError('Mikrofon hatası: ' + err);
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
        setSpeechError('Mikrofon açılamadı: ' + err.message);
      }
    }
  };

  const handleSimulateSpeech = (type: 'accurate' | 'partial') => {
    if (!activeTurn) return;
    const text =
      type === 'accurate'
        ? activeTurn.targetSpokenSentence
        : activeTurn.targetSpokenSentence.split(' ').slice(0, 5).join(' ') + ' ...';

    setSpeechTranscript(text);
    const evaluation = evaluateSpeechAccuracy(
      text,
      activeTurn.targetSpokenSentence,
      activeTurn.alternativeAcceptableSentences || []
    );
    setSpeechResult(evaluation);
  };

  const handleProceedTurn = () => {
    if (!selectedScenario || !speechResult) return;

    const newTurnScores = [...turnScores, speechResult.similarityScore];
    setTurnScores(newTurnScores);

    if (currentTurnIndex < selectedScenario.dialogueTurns.length - 1) {
      setCurrentTurnIndex((prev) => prev + 1);
      setSpeechResult(null);
      setSpeechTranscript('');
      setSpeechError(null);
    } else {
      // Scenario Completed!
      const avgScore = Math.round(
        newTurnScores.reduce((a, b) => a + b, 0) / newTurnScores.length
      );
      recordScenarioCompletion(selectedScenario.id, avgScore);
      setIsScenarioFinished(true);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {!selectedScenario ? (
        /* Scenario Selection Grid */
        <div>
          <div className="border-b border-slate-800 pb-6 mb-8">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
              <Briefcase className="h-4 w-4" />
              <span>SOSYAL & KİNESTETİK ZEKÂ MÜZAKERE ARENASI</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Boardroom Simulator
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
              Yüksek riskli kurumsal senaryolarda simüle edilmiş yönetim kurulu üyelerine, yatırımcılara ve uluslararası gazetecilere karşı sesli konuşma yanıtları verin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BOARDROOM_SCENARIOS.map((sc) => {
              const isCompleted = stats.completedScenarioIds.includes(sc.id);

              return (
                <div
                  key={sc.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition-all group shadow-md"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={sc.image}
                      alt={sc.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                        {sc.department}
                      </div>
                      <h3 className="font-serif text-lg font-bold text-white line-clamp-1">
                        {sc.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        {sc.stakes}
                      </p>

                      <div className="text-xs text-slate-400 border-t border-slate-800/80 pt-3 space-y-1">
                        <div>
                          <strong className="text-slate-300">Rolünüz:</strong> {sc.userRole}
                        </div>
                        <div>
                          <strong className="text-slate-300">Muhataplar:</strong>{' '}
                          {sc.counterparts.join(', ')}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {isCompleted ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Tamamlandı
                          </span>
                        ) : (
                          `${sc.dialogueTurns.length} Kritik Tur`
                        )}
                      </span>

                      <button
                        onClick={() => handleStartScenario(sc)}
                        className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-sm"
                      >
                        <span>{isCompleted ? 'Tekrar Oyna' : 'Masaya Otur'}</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : isScenarioFinished ? (
        /* Scenario Victory Screen */
        <div className="max-w-2xl mx-auto rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4">
            <Sparkles className="h-8 w-8" />
          </div>

          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
            SENARYO BAŞARIYLA TAMAMLANDI (+150 XP)
          </div>
          <h2 className="font-serif text-3xl font-bold text-white mb-2">
            Müzakere Masasında Otorite Tesis Edildi
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            "{selectedScenario.title}" senaryosundaki tüm zorlu soruları üst düzey dilbilgisi kalıpları ve sesli hitabet ile savundunuz.
          </p>

          {/* Average Score */}
          <div className="inline-flex flex-col items-center justify-center p-4 rounded-xl border border-slate-800 bg-slate-950 mb-8 min-w-[200px]">
            <span className="text-xs text-slate-400">Ortalama Akıcılık Skoru:</span>
            <span className="font-mono text-3xl font-bold text-amber-400">
              %{Math.round(turnScores.reduce((a, b) => a + b, 0) / turnScores.length)}
            </span>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleLeaveScenario}
              className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400 transition-colors"
            >
              Senaryo Listesine Dön
            </button>
            <button
              onClick={() => handleStartScenario(selectedScenario)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Yeniden Başlat
            </button>
          </div>
        </div>
      ) : (
        /* Active Dialogue Turn */
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Top Bar of Scenario */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <button
              onClick={handleLeaveScenario}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Senaryolara Dön</span>
            </button>

            <div className="text-xs font-mono text-slate-400">
              Tur: <strong className="text-amber-400">{currentTurnIndex + 1}</strong> /{' '}
              {selectedScenario.dialogueTurns.length}
            </div>
          </div>

          {/* Counterpart Speech Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 relative overflow-hidden">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-amber-300 font-serif font-bold text-lg">
                  {activeTurn?.speaker.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">{activeTurn?.speaker}</h3>
                  <div className="text-xs text-slate-400">{activeTurn?.speakerRole}</div>
                </div>
              </div>

              <button
                onClick={() => handleListenCounterpart(activeTurn?.dialogueText || '')}
                disabled={isPlayingAudio}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
              >
                <Volume2 className="h-3.5 w-3.5 text-amber-400" />
                <span>{isPlayingAudio ? 'Dinleniyor...' : 'Konuşmayı Dinle'}</span>
              </button>
            </div>

            <blockquote className="font-serif text-lg sm:text-xl text-slate-100 italic leading-relaxed pl-3 border-l-2 border-amber-500/80 mb-4">
              "{activeTurn?.dialogueText}"
            </blockquote>

            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-400">
              <strong className="text-amber-300">Yönetimsel Meydan Okuma:</strong>{' '}
              {activeTurn?.businessChallenge}
            </div>
          </div>

          {/* User's Voice Response Terminal */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 space-y-5">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
                SİZİN MÜZAKERE HAMLENİZ ({selectedScenario.userRole})
              </div>
              <h4 className="font-semibold text-white text-base">
                {activeTurn?.promptToUser}
              </h4>
              <p className="text-xs text-slate-400 mt-1">İpucu: {activeTurn?.contextClue}</p>
            </div>

            {/* Target expected sentence preview */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 font-mono text-xs text-slate-300">
              <span className="text-slate-500 block mb-1">Stratejik Hedef İfade:</span>
              <span className="text-amber-200">"{activeTurn?.targetSpokenSentence}"</span>
            </div>

            {/* Mic Button & Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/40">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleSpeech}
                  className={`flex h-14 w-14 items-center justify-center rounded-full text-slate-950 shadow-lg transition-all ${
                    isRecording
                      ? 'bg-rose-500 animate-pulse text-white shadow-rose-500/30'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                  }`}
                >
                  {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </button>
                <div>
                  <div className="text-sm font-semibold text-slate-100">
                    {isRecording ? 'Mikrofon Açık... Yanıtınızı Seslendirin' : 'Sesli Yanıt İçin Basın'}
                  </div>
                  <div className="text-xs text-slate-400">
                    Cümlenizi net bir şekilde söylediğinizde yapay zeka tarafından analiz edilecektir.
                  </div>
                </div>
              </div>

              {/* Instant Simulators */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSimulateSpeech('accurate')}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-700"
                >
                  Doğru Giriş Simüle Et
                </button>
              </div>
            </div>

            {speechError && (
              <div className="text-xs text-rose-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{speechError}</span>
              </div>
            )}

            {/* Speech Analysis & Proceed Button */}
            {speechTranscript && (
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3">
                <div className="text-xs text-slate-400">Algılanan Ses:</div>
                <div className="text-xs font-mono text-slate-200 bg-slate-950 p-2.5 rounded border border-slate-800">
                  "{speechTranscript}"
                </div>

                {speechResult && (
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{speechResult.fluencyGrade}</span>
                      <span className="font-mono text-amber-400 font-bold">
                        %{speechResult.similarityScore} Uyum
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">{speechResult.feedback}</p>

                    <div className="text-xs text-slate-400 pt-1">
                      <strong className="text-amber-300">Yönetimsel Etki:</strong>{' '}
                      {activeTurn?.coachingFeedback.executiveImpact}
                    </div>

                    {speechResult.isPassing && (
                      <div className="pt-3 flex justify-end">
                        <button
                          onClick={handleProceedTurn}
                          className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-md"
                        >
                          <span>Sonraki Tura Geç</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
