import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronRight, Brain, Filter, Trophy } from 'lucide-react';
import { CURRICULUM_MODULES } from '../data/curriculumData';
import { INTELLIGENCE_DEFINITIONS } from '../data/intelligenceData';
import { GrammarCategoryId, LessonModule } from '../types';
import { useGame } from '../context/GameContext';

interface CurriculumViewProps {
  onSelectModule: (module: LessonModule) => void;
  onOpenDiagnostic: () => void;
  onOpenSimulator: () => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  onSelectModule,
  onOpenDiagnostic,
  onOpenSimulator,
}) => {
  const { stats, getExecutiveRank } = useGame();
  const rank = getExecutiveRank();
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const filteredModules = CURRICULUM_MODULES.filter((m) => {
    if (filterDifficulty === 'all') return true;
    return m.difficulty === filterDifficulty;
  });

  const completedCount = stats.completedLessonIds.length;
  const totalCount = CURRICULUM_MODULES.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  const dominantFirst = stats.dominantIntelligences[0];
  const dominantInfo = dominantFirst ? INTELLIGENCE_DEFINITIONS[dominantFirst] : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-10 mb-10">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
            <Sparkles className="h-4 w-4" />
            <span>YETİŞKİN PROFESYONELLER İÇİN ÜST DÜZEY İŞ İNGİLİZCESİ MİMARİSİ</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Boardroom Fluency & Executive Speech
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            10 kritik ileri gramer yapısı, akademik söz varlığı ve gerçek zamanlı ses tanıma motoruyla uluslararası iş dünyasında ikna gücünüzü ve vokal otoritenizi zirveye taşıyın.
          </p>

          {/* Quick Metrics (Zero-Pill Discipline) */}
          <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-300 border-t border-slate-800/80 pt-5">
            <div>
              <span className="text-slate-400">Yönetici Kademesi: </span>
              <strong className="text-amber-400 font-semibold">{rank.title}</strong>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div>
              <span className="text-slate-400">Müfredat İlerlemesi: </span>
              <strong className="text-slate-100 font-mono font-bold tabular-nums">
                %{progressPct} ({completedCount}/{totalCount} Modül)
              </strong>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div>
              <span className="text-slate-400">Baskın Zekâ: </span>
              <strong className="text-slate-200">
                {dominantInfo ? dominantInfo.titleTr : 'Tespit Edilmedi'}
              </strong>
            </div>
          </div>
        </div>

        {/* Subtle Decorative Backdrop Elements */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-radial from-amber-500/5 to-transparent pointer-events-none" />
      </div>

      {/* Filter and Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800/80 gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
            10 Temel İleri Düzey Modül
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Yönetim kurulu toplantıları, M&A müzakereleri ve uluslararası stratejik kriz yönetimi odaklı senaryolar
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 self-start sm:self-auto">
          {[
            { id: 'all', label: 'Tüm Modüller' },
            { id: 'Executive B2', label: 'Executive B2' },
            { id: 'Senior Leadership C1', label: 'Senior C1' },
            { id: 'Boardroom C2', label: 'Boardroom C2' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterDifficulty(btn.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterDifficulty === btn.id
                  ? 'bg-slate-800 text-amber-300 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* 10 Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        {filteredModules.map((mod, idx) => {
          const isDone = stats.completedLessonIds.includes(mod.id);

          return (
            <div
              key={mod.id}
              onClick={() => onSelectModule(mod)}
              className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-amber-500/40 hover:bg-slate-900 transition-all flex flex-col justify-between shadow-sm relative overflow-hidden"
            >
              {/* Top Accent Line */}
              <div
                className={`absolute top-0 left-0 h-1 w-full transition-colors ${
                  isDone ? 'bg-emerald-500' : 'bg-slate-800 group-hover:bg-amber-400'
                }`}
              />

              <div>
                {/* Clean unboxed metadata with typographic separators */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-400/90">{mod.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span>{mod.executiveRoleContext}</span>
                  </div>

                  {isDone ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Tamamlandı
                    </span>
                  ) : (
                    <span className="font-mono text-slate-400 text-[11px]">
                      {mod.exercises.length} Egzersiz
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors mb-1.5">
                  {mod.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {mod.tagline}
                </p>

                {/* Grammatical Formula Box */}
                <div className="rounded-lg border border-slate-800/80 bg-slate-950/70 p-3 mb-4 font-mono text-[11px] text-slate-300">
                  <span className="text-amber-400 font-semibold block mb-0.5">Formül:</span>
                  <span className="text-slate-300 line-clamp-1">{mod.grammaticalFormula}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Senaryo: <strong className="text-slate-200">{mod.exercises[0]?.scenarioTitle}</strong>
                </span>

                <div className="flex items-center gap-1 font-semibold text-amber-400 group-hover:translate-x-0.5 transition-transform">
                  <span>{isDone ? 'Yeniden İncele' : 'Modülü Başlat'}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Promo: Boardroom Simulation Callout */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            Sosyal Zekâ & Müzakere Laboratuvarı
          </div>
          <h3 className="font-serif text-2xl font-bold text-white mb-2">
            Boardroom Simulator'a Hazır mısınız?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Öğrendiğiniz devrik cümleleri, diplomatik modal fiilleri ve bağlaçları simüle edilmiş 450M dolarlık bir M&A masasında veya uluslararası basın toplantısında test edin.
          </p>
        </div>

        <button
          onClick={onOpenSimulator}
          className="shrink-0 flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/10"
        >
          <span>Yönetim Kurulu Simülasyonunu Aç</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
