import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Music,
  Play,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { CURRICULUM_MODULES } from '../data/curriculumData';
import { SpeechEvaluationResult } from '../types';
import { useGame } from '../context/GameContext';
import {
  createSpeechRecognizer,
  evaluateSpeechAccuracy,
  isSpeechRecognitionSupported,
  playExecutiveSpeech,
  stopSpeechSynthesis,
} from '../utils/speechHelper';

export const SpeechLab: React.FC = () => {
  const { stats, recordExerciseCompletion } = useGame();

  // Aggregate all speech exercises from the 10 modules
  const speechDrills = CURRICULUM_MODULES.flatMap((mod) =>
    mod.exercises
      .filter((ex) => ex.type === 'speech')
      .map((ex) => ({
        ...ex,
        moduleTitle: mod.title,
        moduleId: mod.id,
      }))
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const currentDrill = speechDrills[selectedIndex];

  // Speech Recognition state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [speechResult, setSpeechResult] = useState<SpeechEvaluationResult | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [accent, setAccent] = useState<'us' | 'uk'>('us');
  const [speed, setSpeed] = useState<number>(0.95);

  // Waveform visualization animation
  const [waveformBars, setWaveformBars] = useState<number[]>(new Array(24).fill(12));
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRecording) {
      const updateWave = () => {
        setWaveformBars(
          new Array(24).fill(0).map(() => Math.floor(Math.random() * 48) + 8)
        );
        animRef.current = requestAnimationFrame(updateWave);
      };
      animRef.current = requestAnimationFrame(updateWave);
    } else {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      setWaveformBars(new Array(24).fill(10));
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isRecording]);

  const handleSelectDrill = (idx: number) => {
    stopSpeechSynthesis();
    setSelectedIndex(idx);
    setTranscript('');
    setSpeechResult(null);
    setSpeechError(null);
  };

  const handleListenAudio = async (text: string) => {
    setIsPlaying(true);
    await playExecutiveSpeech(text, speed, accent);
    setIsPlaying(false);
  };

  const handleToggleSpeech = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setSpeechError(null);
    setTranscript('');
    setSpeechResult(null);

    if (!isSpeechRecognitionSupported()) {
      setSpeechError(
        'Web Speech API bu tarayıcıda desteklenmiyor. Aşağıdaki "Ses Girişi Simülasyonu" butonunu kullanabilirsiniz.'
      );
      return;
    }

    const recognizer = createSpeechRecognizer(
      (newTranscript, isFinal) => {
        setTranscript(newTranscript);
        if (isFinal) {
          setIsRecording(false);
          const evaluation = evaluateSpeechAccuracy(
            newTranscript,
            currentDrill.targetSentence,
            currentDrill.acceptableVariations || []
          );
          setSpeechResult(evaluation);
          if (evaluation.isPassing) {
            recordExerciseCompletion(currentDrill.moduleId, currentDrill.id, true, 40, true);
          }
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

  const handleSimulateSpeech = (isAccurate: boolean) => {
    const text = isAccurate
      ? currentDrill.targetSentence
      : currentDrill.targetSentence.split(' ').slice(0, 4).join(' ') + ' ...';

    setTranscript(text);
    const evaluation = evaluateSpeechAccuracy(
      text,
      currentDrill.targetSentence,
      currentDrill.acceptableVariations || []
    );
    setSpeechResult(evaluation);
    if (evaluation.isPassing) {
      recordExerciseCompletion(currentDrill.moduleId, currentDrill.id, true, 40, true);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="border-b border-slate-800 pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
          <Activity className="h-4 w-4" />
          <span>MÜZİKSEL-RİTMİK & KİNESTETİK SES LABORATUVARI</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Acoustic Speech & Fluency Lab
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
          İngilizcenin cümle melodisini, hece vurgu kalıplarını ve vokal tonlamasını Web Speech API ve ses sentezleme motoru ile gerçek zamanlı kalibre edin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: List of 10 Grammar Speech Challenges */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            Ses Alıştırması Seçimi ({speechDrills.length} Modül)
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {speechDrills.map((drill, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={drill.id}
                  onClick={() => handleSelectDrill(idx)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all text-left ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/10 text-white'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>{drill.moduleTitle}</span>
                    <span className="text-amber-400 font-semibold">0{idx + 1}</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1 text-slate-100">{drill.scenarioTitle}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 italic">
                    "{drill.targetSentence}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Audio Recording & Feedback Terminal */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                  {currentDrill.moduleTitle} · {currentDrill.scenarioTitle}
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-0.5">
                  Hedef Hitabet Cümlesi
                </h3>
              </div>

              {/* Accent & Rate Switchers */}
              <div className="flex items-center gap-2">
                <select
                  value={accent}
                  onChange={(e) => setAccent(e.target.value as 'us' | 'uk')}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-300"
                >
                  <option value="us">US Corporate</option>
                  <option value="uk">UK Boardroom</option>
                </select>

                <select
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-300"
                >
                  <option value={0.8}>0.8x Yavaş</option>
                  <option value={0.95}>1.0x Normal</option>
                  <option value={1.15}>1.2x Hızlı</option>
                </select>
              </div>
            </div>

            {/* Target Display with TTS */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Yönetim Kurulu Vokal Standardı:</span>
                <button
                  onClick={() => handleListenAudio(currentDrill.targetSentence)}
                  disabled={isPlaying}
                  className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>{isPlaying ? 'Dinletiliyor...' : 'Doğru Vurguyu Dinle'}</span>
                </button>
              </div>

              <blockquote className="font-serif text-xl sm:text-2xl text-amber-200/95 font-medium leading-relaxed">
                "{currentDrill.targetSentence}"
              </blockquote>

              <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-900">
                💡 {currentDrill.executiveTip}
              </p>
            </div>

            {/* Live Audio Waveform Animation Visualizer */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-6 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-1.5 h-14 mb-4">
                {waveformBars.map((height, i) => (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-75 ${
                      isRecording ? 'bg-amber-400' : 'bg-slate-800'
                    }`}
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>

              {/* Main Record Action */}
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleToggleSpeech}
                  className={`flex h-16 w-16 items-center justify-center rounded-full text-slate-950 shadow-xl transition-all ${
                    isRecording
                      ? 'bg-rose-500 animate-pulse text-white shadow-rose-500/40'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                  }`}
                >
                  {isRecording ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
                </button>

                <div className="text-center">
                  <div className="text-sm font-semibold text-white">
                    {isRecording ? 'Mikrofon Açık — Şimdi Konuşunuz' : 'Telaffuzunuzu Test Etmek İçin Basın'}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Web Speech API ses tonunuzu ve sözcük sıralamanızı milisaniyeler içinde değerlendirir.
                  </div>
                </div>

                {/* Instant fallback buttons */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleSimulateSpeech(true)}
                    className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Kusursuz Simülasyon
                  </button>
                  <button
                    onClick={() => handleSimulateSpeech(false)}
                    className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-300"
                  >
                    Eksik Simülasyon
                  </button>
                </div>
              </div>
            </div>

            {speechError && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-800/40 bg-rose-950/20 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{speechError}</span>
              </div>
            )}

            {/* Real-Time Acoustic & Fluency Scoring Output */}
            {transcript && (
              <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Algılanan Ses Transkripti:</span>
                  {speechResult && (
                    <span className="font-mono text-amber-400 font-bold text-sm">
                      %{speechResult.similarityScore} Benzerlik
                    </span>
                  )}
                </div>

                <div className="text-sm font-mono text-slate-200 italic bg-slate-900 p-3 rounded-lg border border-slate-800">
                  "{transcript}"
                </div>

                {speechResult && (
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          speechResult.isPassing ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                      <span className="font-semibold text-sm text-slate-100">
                        {speechResult.fluencyGrade}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {speechResult.feedback}
                    </p>

                    {/* Word match breakdown */}
                    <div>
                      <div className="text-[11px] text-slate-400 mb-1.5 font-mono">
                        Kelime Bazlı Doğrulama:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {currentDrill.targetSentence.split(' ').map((w, i) => {
                          const cleanW = w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '');
                          const isMatch = speechResult.matchedWords.includes(cleanW);
                          return (
                            <span
                              key={i}
                              className={`text-xs px-2 py-0.5 rounded font-mono ${
                                isMatch
                                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                              }`}
                            >
                              {w}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
