import React from 'react';
import { Brain, Sparkles, ArrowRight, Shield, Mic, CheckCircle2, ChevronRight, Award, Compass } from 'lucide-react';
import { INTELLIGENCE_DEFINITIONS } from '../data/intelligenceData';
import { IntelligenceType } from '../types';

interface OnboardingHeroProps {
  onStartDiagnostic: () => void;
  onExploreDirectly: () => void;
}

export const OnboardingHero: React.FC<OnboardingHeroProps> = ({
  onStartDiagnostic,
  onExploreDirectly,
}) => {
  const intelList: IntelligenceType[] = [
    'verbal_linguistic',
    'visual_spatial',
    'existential',
    'musical_rhythmic',
    'logical_mathematical',
    'bodily_kinesthetic',
    'interpersonal',
    'intrapersonal',
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Central Welcome & Profile Genesis Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-12 text-center mb-12 shadow-2xl">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-mono text-amber-300 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>HOWARD GARDNER ÇOKLU ZEKÂ TEORİSİ İLE İŞ İNGİLİZCESİ</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
            Bilişsel Zekâ Profilinizi Belirleyin, Size Özel Yol Haritanızı Çizin
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
            Her yetişkin profesyonelin düşünme ve ikna etme tarzı benzersizdir. 16 soruluk interaktif teşhis envanteri ile 8 zekâ boyutunuzu ölçüyoruz ve 10 ileri gramer modülünü sizin öğrenme hızınıza göre sıralıyoruz.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartDiagnostic}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-amber-500 px-8 py-3.5 text-sm font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 hover:scale-[1.02]"
            >
              <Brain className="h-5 w-5" />
              <span>Zekâ Profilimi Belirle ve Yol Haritamı Çiz</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onExploreDirectly}
              className="w-full sm:w-auto px-6 py-3.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Standart Müfredatı İncele
            </button>
          </div>
        </div>

        {/* 3 Step Progression Cards */}
        <div className="mt-12 pt-10 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
          <div className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-amber-400 font-bold text-xs">ADIM 01</span>
              <Brain className="h-4 w-4 text-amber-400" />
            </div>
            <h4 className="font-semibold text-white text-sm mb-1">
              8 Çoklu Zekâ Tespiti
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mantıksal, müziksel, görsel veya sosyal; hangi bilişsel kanaldan en hızlı kavradığınızı belirleyin.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-amber-400 font-bold text-xs">ADIM 02</span>
              <Compass className="h-4 w-4 text-amber-400" />
            </div>
            <h4 className="font-semibold text-white text-sm mb-1">
              Kişiselleştirilmiş Yol Haritası
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              10 ileri iş İngilizcesi konusunu (Inversions, Modals, Tenses) sizin profilinize en uygun sırayla dizelim.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-amber-400 font-bold text-xs">ADIM 03</span>
              <Mic className="h-4 w-4 text-amber-400" />
            </div>
            <h4 className="font-semibold text-white text-sm mb-1">
              Ses Tanıma ile Vokal Otorite
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Web Speech API ve Boardroom Simulator ile M&A ve basın brifinglerinde sesli konuşarak akıcılık kazanın.
            </p>
          </div>
        </div>
      </div>

      {/* 8 Intelligences Preview Grid */}
      <div className="mb-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="font-serif text-2xl font-bold text-white mb-2">
            Ölçülen 8 Çoklu Zekâ Alanı
          </h2>
          <p className="text-xs text-slate-400">
            İş dünyasında her zekâ boyutu farklı bir liderlik ve hitabet avantajı sağlar:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {intelList.map((k, idx) => {
            const info = INTELLIGENCE_DEFINITIONS[k];
            return (
              <div
                key={k}
                className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 transition-all hover:border-slate-700"
              >
                <div className="text-[10px] font-mono text-slate-400 mb-1">0{idx + 1}</div>
                <h4 className="font-semibold text-slate-100 text-sm mb-0.5">{info.titleTr}</h4>
                <div className="text-[11px] text-slate-400 mb-2">{info.titleEn}</div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {info.businessApplication}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
