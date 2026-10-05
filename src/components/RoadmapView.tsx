import React from 'react';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Clock,
  ArrowRight,
  Compass,
  Trophy,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { generatePersonalizedRoadmap } from '../data/roadmapGenerator';
import { INTELLIGENCE_DEFINITIONS } from '../data/intelligenceData';
import { CURRICULUM_MODULES } from '../data/curriculumData';
import { LessonModule } from '../types';

interface RoadmapViewProps {
  onSelectModule: (module: LessonModule) => void;
  onOpenDiagnostic: () => void;
  onOpenSimulator: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  onSelectModule,
  onOpenDiagnostic,
  onOpenSimulator,
}) => {
  const { stats, getExecutiveRank } = useGame();
  const rank = getExecutiveRank();

  // Generate personalized roadmap based on user's dominant intelligences
  const roadmap = generatePersonalizedRoadmap(stats.dominantIntelligences);
  const primaryInfo = INTELLIGENCE_DEFINITIONS[roadmap.dominantType];

  const completedSet = new Set(stats.completedLessonIds);
  const completedCount = roadmap.milestones.filter((m) => completedSet.has(m.moduleId)).length;
  const progressPercent = Math.round((completedCount / roadmap.milestones.length) * 100);

  // Group milestones by Phase
  const phase1 = roadmap.milestones.filter((m) => m.phaseId === 'foundation');
  const phase2 = roadmap.milestones.filter((m) => m.phaseId === 'core_negotiation');
  const phase3 = roadmap.milestones.filter((m) => m.phaseId === 'executive_rhetoric');

  const handleLaunchMilestone = (moduleId: string) => {
    const mod = CURRICULUM_MODULES.find((m) => m.id === moduleId);
    if (mod) onSelectModule(mod);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Personalized Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-10 mb-10 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
            <Brain className="h-4 w-4" />
            <span>KİŞİSELLEŞTİRİLMİŞ BİLİŞSEL YOL HARİTASI</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            {roadmap.strategyTitle}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            {roadmap.strategySubtitle}
          </p>

          {/* Clean Unboxed Metadata Indicators */}
          <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-300 border-t border-slate-800/80 pt-5">
            <div>
              <span className="text-slate-400">Baskın Zekâ Alanı: </span>
              <strong className="text-amber-400 font-semibold">{primaryInfo.titleTr}</strong>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div>
              <span className="text-slate-400">Yol Haritası Tamamlanma: </span>
              <strong className="text-slate-100 font-mono font-bold tabular-nums">
                %{progressPercent} ({completedCount}/10 Aşama)
              </strong>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div>
              <span className="text-slate-400">Yönetici Seviyesi: </span>
              <strong className="text-slate-200">{rank.title}</strong>
            </div>
          </div>
        </div>

        {/* Retake test action */}
        <div className="mt-6 sm:mt-0 sm:absolute sm:right-8 sm:top-8 z-20">
          <button
            onClick={onOpenDiagnostic}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-xs font-medium text-slate-200 hover:border-amber-400/50 hover:bg-slate-800 transition-colors shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
            <span>{stats.hasCompletedDiagnostic ? 'Zekâ Testini Yenile' : 'Profili Şimdi Belirle'}</span>
          </button>
        </div>
      </div>

      {/* Pedagogical Directives Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 mb-10">
        <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Bilişsel Gücünüzü Maksimuma Çıkarma Stratejisi</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-300">
          {roadmap.pedagogicalDirectives.map((directive, dIdx) => (
            <div key={dIdx} className="flex items-start gap-2.5 rounded-lg border border-slate-800/80 bg-slate-950/60 p-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 font-mono font-bold text-[10px]">
                {dIdx + 1}
              </span>
              <span className="leading-relaxed">{directive}</span>
            </div>
          ))}
        </div>
      </div>

      {/* The 3-Phase Roadmap Timeline */}
      <div className="space-y-12 mb-12">
        {/* Phase 1 */}
        <div>
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs">
              01
            </span>
            <div>
              <h2 className="font-serif text-xl font-bold text-white">
                Aşama 1: Bilişsel Temel & Hızlı Yetkinlik
              </h2>
              <p className="text-xs text-slate-400">
                {primaryInfo.titleTr} yapınıza en uyumlu gramer kalıplarıyla ilk ivmeyi ve özgüveni yakalayın.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {phase1.map((m) => {
              const isDone = completedSet.has(m.moduleId);
              return (
                <MilestoneCard
                  key={m.id}
                  milestone={m}
                  isDone={isDone}
                  onLaunch={() => handleLaunchMilestone(m.moduleId)}
                />
              );
            })}
          </div>
        </div>

        {/* Phase 2 */}
        <div>
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono font-bold text-xs">
              02
            </span>
            <div>
              <h2 className="font-serif text-xl font-bold text-white">
                Aşama 2: Yönetimsel Müzakere & Stratejik Dil
              </h2>
              <p className="text-xs text-slate-400">
                Yüksek riskli iş ortamlarında çatışma çözme, diplomatik hedging ve objektif raporlama yetenekleri.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {phase2.map((m) => {
              const isDone = completedSet.has(m.moduleId);
              return (
                <MilestoneCard
                  key={m.id}
                  milestone={m}
                  isDone={isDone}
                  onLaunch={() => handleLaunchMilestone(m.moduleId)}
                />
              );
            })}
          </div>
        </div>

        {/* Phase 3 */}
        <div>
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono font-bold text-xs">
              03
            </span>
            <div>
              <h2 className="font-serif text-xl font-bold text-white">
                Aşama 3: C-Suite Hitabet & Üst Düzey Retorik
              </h2>
              <p className="text-xs text-slate-400">
                Wall Street kazanç çağrıları, genel kurul toplantıları ve kriz anlarında sarsılmaz vokal duruş.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {phase3.map((m) => {
              const isDone = completedSet.has(m.moduleId);
              return (
                <MilestoneCard
                  key={m.id}
                  milestone={m}
                  isDone={isDone}
                  onLaunch={() => handleLaunchMilestone(m.moduleId)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Arena Callout */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            Yol Haritası Simülasyon Sınavı
          </div>
          <h3 className="font-serif text-2xl font-bold text-white mb-2">
            Öğrendiğiniz Adımları Yönetim Kurulunda Sınayın
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Müzakere masasında gerçek mikrofona konuşarak simüle edilen yöneticilerden anlık akustik geri bildirim alın.
          </p>
        </div>

        <button
          onClick={onOpenSimulator}
          className="shrink-0 flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/10"
        >
          <span>Boardroom Simulator'ı Aç</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

interface MilestoneCardProps {
  milestone: any;
  isDone: boolean;
  onLaunch: () => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, isDone, onLaunch }) => {
  return (
    <div
      onClick={onLaunch}
      className={`group cursor-pointer rounded-xl border p-5 transition-all flex flex-col justify-between relative overflow-hidden ${
        isDone
          ? 'border-emerald-500/40 bg-slate-900 shadow-sm'
          : 'border-slate-800 bg-slate-900/60 hover:border-amber-500/50 hover:bg-slate-900'
      }`}
    >
      {/* Top Progress Line */}
      <div
        className={`absolute top-0 left-0 h-1 w-full ${
          isDone ? 'bg-emerald-500' : 'bg-slate-800 group-hover:bg-amber-400'
        }`}
      />

      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-mono text-amber-400/90 font-bold">
            ADIM {milestone.stepNumber < 10 ? `0${milestone.stepNumber}` : milestone.stepNumber}
          </span>
          {isDone ? (
            <span className="flex items-center gap-1 text-emerald-400 font-semibold text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Tamamlandı
            </span>
          ) : (
            <span className="flex items-center gap-1 font-mono text-slate-400 text-[11px]">
              <Clock className="h-3 w-3" />
              ~{milestone.estimatedMinutes} dk
            </span>
          )}
        </div>

        <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-300 transition-colors mb-1.5 leading-snug">
          {milestone.title}
        </h3>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {milestone.targetSkill}
        </p>

        {/* Personalized Cognitive Modality Badge */}
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 mb-3 text-[11px]">
          <span className="text-amber-400 font-semibold block mb-0.5 font-mono">
            Tavsiye Edilen Giriş:
          </span>
          <span className="text-slate-300">{milestone.modalityLabel}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px] truncate max-w-[150px]">
          {milestone.scenarioHook}
        </span>

        <div className="flex items-center gap-1 font-semibold text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0">
          <span>{isDone ? 'Yeniden İncele' : 'Adıma Başla'}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
};
