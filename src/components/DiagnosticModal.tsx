import React, { useState } from 'react';
import { X, Check, Brain, ChevronRight, ChevronLeft, Sparkles, ArrowRight } from 'lucide-react';
import { DIAGNOSTIC_QUESTIONS, INTELLIGENCE_DEFINITIONS, calculateIntelligenceProfile } from '../data/intelligenceData';
import { IntelligenceType } from '../types';
import { useGame } from '../context/GameContext';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewFullProfile?: () => void;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({ isOpen, onClose, onViewFullProfile }) => {
  const { stats, saveDiagnosticResults } = useGame();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [calculatedResult, setCalculatedResult] = useState<{
    scores: any;
    dominant: IntelligenceType[];
  } | null>(null);

  if (!isOpen) return null;

  const totalQuestions = DIAGNOSTIC_QUESTIONS.length;
  const currentQ = DIAGNOSTIC_QUESTIONS[currentStep];
  const selectedAnswer = answers[currentQ?.id];

  const handleSelectOption = (weight: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: weight,
    }));
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Calculate
      const result = calculateIntelligenceProfile(answers);
      setCalculatedResult(result);
      saveDiagnosticResults(result.scores, result.dominant);
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
    setCalculatedResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-8 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {!isCompleted ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-medium text-amber-400 mb-1.5">
                <Brain className="h-4 w-4" />
                <span>8 ÇOKLU ZEKÂ TEORİSİ TESPİT ENVANTERİ</span>
              </div>
              <h2 className="font-serif text-2xl font-bold tracking-tight text-white">
                Bilişsel Öğrenme ve İletişim Profilinizi Belirleyin
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Howard Gardner'ın 8 Çoklu Zekâ kuramı ışığında, yetişkin profesyonel iş İngilizcesi ve hitabet potansiyelinizi tespit ediyoruz.
              </p>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                <span>Soru {currentStep + 1} / {totalQuestions}</span>
                <span>{Math.round(((currentStep + 1) / totalQuestions) * 100)}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-6 mb-6">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-2">
                Senaryo: {currentQ.scenario}
              </div>
              <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                "{currentQ.prompt}"
              </p>

              {/* Likert Scale */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { label: 'Kesinlikle Katılıyorum', weight: 4 },
                  { label: 'Katılıyorum', weight: 3 },
                  { label: 'Kısmen / Nötr', weight: 2 },
                  { label: 'Katılmıyorum', weight: 1 },
                ].map((opt) => {
                  const isSelected = selectedAnswer === opt.weight;
                  return (
                    <button
                      key={opt.weight}
                      onClick={() => handleSelectOption(opt.weight)}
                      className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-all text-left ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/10 text-amber-200'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="h-4 w-4 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Önceki
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedAnswer}
                className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-lg shadow-amber-500/10"
              >
                <span>{currentStep === totalQuestions - 1 ? 'Profili Hesapla' : 'Sonraki'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Completed Result Screen */
          <div className="text-center py-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4">
              <Sparkles className="h-7 w-7" />
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
              <span>BİLİŞSEL PROFİLİNİZ TESPİT EDİLDİ (+100 XP)</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
              Öne Çıkan Baskın Zekâ Alanlarınız
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Vanguard sistemi, iş İngilizcesi derslerinizi ve konuşma egzersizlerinizi bu bilişsel güçlü yönlerinize göre adapte edecektir.
            </p>

            {/* Dominant Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
              {calculatedResult?.dominant.map((domKey, idx) => {
                const info = INTELLIGENCE_DEFINITIONS[domKey];
                const score = calculatedResult.scores[domKey];
                return (
                  <div
                    key={domKey}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 relative overflow-hidden"
                  >
                    <div
                      className="absolute top-0 left-0 h-1 w-full"
                      style={{ backgroundColor: info.color }}
                    />
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>{idx + 1}. Öncelikli Alan</span>
                      <span className="font-mono font-bold text-slate-200">%{score}</span>
                    </div>
                    <h4 className="font-semibold text-slate-100 text-sm mb-1">{info.titleTr}</h4>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {info.learningApproach}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  if (onViewFullProfile) onViewFullProfile();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
              >
                <span>Detaylı 8 Zekâ Raporunu İncele</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                Testi Yeniden Başlat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
