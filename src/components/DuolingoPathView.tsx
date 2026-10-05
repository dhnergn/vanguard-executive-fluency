import React, { useState } from 'react';
import {
  Check,
  Star,
  Flame,
  Award,
  BookOpen,
  Mic,
  Briefcase,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Play,
  X,
  Target,
  Clock,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { CURRICULUM_MODULES } from '../data/curriculumData';
import { generatePersonalizedRoadmap } from '../data/roadmapGenerator';
import { LessonModule, RoadmapMilestone } from '../types';
import { playExecutiveChime } from '../utils/speechHelper';

interface DuolingoPathViewProps {
  onSelectModule: (module: LessonModule) => void;
  onOpenSimulator: () => void;
  onRetakeTest: () => void;
}

export const DuolingoPathView: React.FC<DuolingoPathViewProps> = ({
  onSelectModule,
  onOpenSimulator,
  onRetakeTest,
}) => {
  const { stats, getExecutiveRank, soundEnabled } = useGame();
  const { t } = useLanguage();
  const rank = getExecutiveRank();

  // Active floating popup node state
  const [activePopupMilestone, setActivePopupMilestone] = useState<RoadmapMilestone | null>(null);

  // Personalized roadmap generated from onboarding test
  const roadmap = generatePersonalizedRoadmap(stats.dominantIntelligences);
  const completedSet = new Set(stats.completedLessonIds);

  // Group milestones into Duolingo-style Units
  const unit1Milestones = roadmap.milestones.slice(0, 3);
  const unit2Milestones = roadmap.milestones.slice(3, 7);
  const unit3Milestones = roadmap.milestones.slice(7, 10);

  const units = [
    {
      unitNumber: 1,
      title: t('unit_1_title'),
      description: t('unit_1_desc'),
      accentBg: 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600',
      milestones: unit1Milestones,
    },
    {
      unitNumber: 2,
      title: t('unit_2_title'),
      description: t('unit_2_desc'),
      accentBg: 'bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600',
      milestones: unit2Milestones,
    },
    {
      unitNumber: 3,
      title: t('unit_3_title'),
      description: t('unit_3_desc'),
      accentBg: 'bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600',
      milestones: unit3Milestones,
    },
  ];

  // Alternating horizontal offsets for authentic Duolingo winding path
  const getOffsetClass = (index: number) => {
    const cycle = index % 4;
    if (cycle === 0) return 'translate-x-0';
    if (cycle === 1) return 'translate-x-12 sm:translate-x-20';
    if (cycle === 2) return 'translate-x-0';
    return '-translate-x-12 sm:-translate-x-20';
  };

  const handleNodeClick = (m: RoadmapMilestone) => {
    if (soundEnabled) playExecutiveChime('click');
    if (activePopupMilestone?.id === m.id) {
      setActivePopupMilestone(null);
    } else {
      setActivePopupMilestone(m);
    }
  };

  const handleLaunchModule = (moduleId: string) => {
    setActivePopupMilestone(null);
    const mod = CURRICULUM_MODULES.find((m) => m.id === moduleId);
    if (mod) onSelectModule(mod);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Center Winding Path */}
        <div className="lg:col-span-8 flex flex-col items-center">
          {units.map((unit) => {
            const unitCompletedCount = unit.milestones.filter((m) =>
              completedSet.has(m.moduleId)
            ).length;
            const unitProgressPct = Math.round(
              (unitCompletedCount / unit.milestones.length) * 100
            );

            return (
              <div key={unit.unitNumber} className="w-full max-w-lg mb-16">
                {/* Duolingo Unit Header Banner with 3D Depth */}
                <div
                  className={`rounded-3xl ${unit.accentBg} p-6 text-slate-950 shadow-2xl mb-12 flex items-center justify-between relative overflow-hidden border-b-4 border-black/30`}
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest font-black text-slate-950/80 mb-1">
                      <span>UNIT {unit.unitNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>%{unitProgressPct} TAMAMLANDI</span>
                    </div>
                    <h2 className="font-serif text-xl sm:text-2xl font-black tracking-tight text-slate-950">
                      {unit.title}
                    </h2>
                    <p className="text-xs text-slate-950/80 font-medium mt-1.5 max-w-sm leading-relaxed">
                      {unit.description}
                    </p>
                  </div>

                  <div className="relative z-10 hidden sm:flex flex-col items-center justify-center h-16 w-16 rounded-2xl bg-white/30 backdrop-blur-md text-slate-950 font-serif font-black text-2xl shadow-inner border border-white/40">
                    <span>{unit.unitNumber}</span>
                    <span className="text-[9px] font-mono uppercase tracking-tight font-bold -mt-1">
                      BÖLÜM
                    </span>
                  </div>

                  {/* Decorative Subtle Sheen */}
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-xl pointer-events-none" />
                </div>

                {/* Path of Interconnected 3D Tactile Nodes */}
                <div className="flex flex-col items-center space-y-12 relative">
                  {/* Subtle connecting center dashed line */}
                  <div className="absolute top-8 bottom-8 w-1 bg-gradient-to-b from-amber-500/20 via-slate-700/40 to-slate-800 -z-0 rounded-full" />

                  {unit.milestones.map((m) => {
                    const isCompleted = completedSet.has(m.moduleId);
                    const isCurrent =
                      !isCompleted &&
                      roadmap.milestones.findIndex(
                        (item) => !completedSet.has(item.moduleId)
                      ) === m.stepNumber - 1;

                    const isPopupOpen = activePopupMilestone?.id === m.id;
                    const offsetClass = getOffsetClass(m.stepNumber);

                    return (
                      <div
                        key={m.id}
                        className={`relative flex flex-col items-center transition-transform z-10 ${offsetClass}`}
                      >
                        {/* Interactive Circular 3D Push-Button Node */}
                        <button
                          onClick={() => handleNodeClick(m)}
                          className={`group relative flex h-20 w-20 sm:h-22 sm:w-22 items-center justify-center rounded-full transition-all duration-150 active:translate-y-1 active:border-b-0 ${
                            isCompleted
                              ? 'border-4 border-emerald-400 bg-emerald-500 text-slate-950 border-b-[6px] border-b-emerald-700 shadow-lg shadow-emerald-500/20 hover:brightness-105'
                              : isCurrent
                              ? 'border-4 border-amber-300 bg-amber-400 text-slate-950 border-b-[7px] border-b-amber-600 shadow-xl shadow-amber-400/40 ring-8 ring-amber-400/20 hover:brightness-105'
                              : 'border-4 border-slate-700 bg-slate-800 text-slate-300 border-b-[6px] border-b-slate-900 shadow-md hover:border-slate-600 hover:bg-slate-750'
                          }`}
                          aria-label={m.title}
                        >
                          {isCompleted ? (
                            <Check className="h-10 w-10 stroke-[3.5]" />
                          ) : isCurrent ? (
                            <div className="flex flex-col items-center">
                              <Star className="h-9 w-9 fill-slate-950 stroke-[2] animate-spin-slow" />
                            </div>
                          ) : (
                            <BookOpen className="h-7 w-7" />
                          )}

                          {/* Step Number Badge */}
                          <span className="absolute -bottom-2.5 rounded-full bg-slate-950 border border-slate-700 px-2.5 py-0.5 text-[10px] font-mono font-bold text-slate-200 shadow-md">
                            {m.stepNumber}
                          </span>
                        </button>

                        {/* Node Label Below */}
                        <div className="mt-4 text-center max-w-[190px]">
                          <div className="text-xs font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                            {m.title}
                          </div>
                          <div className="text-[11px] text-amber-400/90 font-mono mt-0.5">
                            {isCompleted
                              ? `✓ ${t('step_completed')}`
                              : isCurrent
                              ? `★ ${t('step_current')}`
                              : m.modalityLabel}
                          </div>
                        </div>

                        {/* Duolingo Floating Popup Bubble Card when clicked */}
                        {isPopupOpen && (
                          <div className="absolute top-24 z-50 w-72 rounded-2xl border-2 border-amber-400/60 bg-slate-900 p-5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                            {/* Speech bubble pointer arrow */}
                            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-5 w-5 rotate-45 border-l-2 border-t-2 border-amber-400/60 bg-slate-900" />

                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                                Adım {m.stepNumber} · {m.phaseName.split(':')[0]}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActivePopupMilestone(null);
                                }}
                                className="text-slate-400 hover:text-white"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>

                            <h4 className="font-serif text-base font-bold text-white mb-1.5 leading-snug">
                              {m.title}
                            </h4>

                            <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                              {m.targetSkill}
                            </p>

                            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5 mb-4 font-mono">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-amber-400" />
                                ~{m.estimatedMinutes} dk
                              </span>
                              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                                <Sparkles className="h-3 w-3" />
                                +40 XP
                              </span>
                            </div>

                            {/* Big Duolingo Start Action */}
                            <button
                              onClick={() => handleLaunchModule(m.moduleId)}
                              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-black uppercase tracking-wider text-slate-950 border-b-4 border-amber-700 shadow-lg shadow-amber-400/20 hover:brightness-105 active:border-b-0 active:translate-y-1 transition-all"
                            >
                              <Play className="h-4 w-4 fill-slate-950" />
                              <span>{isCompleted ? 'Yeniden İncele' : 'Başla (+40 XP)'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Bottom Milestone Trophy Card */}
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 text-center shadow-xl mb-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4 shadow-inner">
              <Award className="h-8 w-8 stroke-[2.5]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-white mb-2">
              Boardroom Otoritesi
            </h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto mb-6 leading-relaxed">
              Öğrendiğiniz tüm ileri dilbilgisi yapılarını $450M M&A ve kriz toplantısı senaryolarında canlı konuşarak test edin.
            </p>
            <button
              onClick={onOpenSimulator}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 border-b-4 border-amber-700 hover:bg-amber-400 active:border-b-0 active:translate-y-1 transition-all shadow-xl shadow-amber-500/20"
            >
              <Briefcase className="h-4 w-4" />
              <span>{t('nav_simulator')} Masasına Otur</span>
            </button>
          </div>
        </div>

        {/* Right Sticky Sidebar: Executive Rank, Daily Quests & League */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          {/* Executive Rank Card */}
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                {t('rank_title')}
              </span>
              <span className="font-mono text-xs font-bold text-slate-300 tabular-nums">
                {stats.xp} {t('xp_label')}
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-serif font-black text-2xl shadow-lg shadow-amber-500/20 border-b-2 border-amber-800">
                {rank.title.charAt(0)}
              </div>
              <div>
                <h4 className="font-serif font-bold text-white text-lg tracking-tight">
                  {rank.title}
                </h4>
                <div className="text-xs text-slate-400">
                  {t('next_level')}: <strong className="text-amber-400">{rank.nextLevelXp - stats.xp} XP</strong>
                </div>
              </div>
            </div>

            <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${rank.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>İlerleme</span>
              <span>%{rank.progress}</span>
            </div>
          </div>

          {/* Daily Quests Card */}
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                {t('daily_quests')}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <Flame className="h-3.5 w-3.5 fill-amber-400" />
                {stats.streak} {t('streak_label')}
              </span>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    <Mic className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">{t('quest_speech')}</div>
                    <div className="text-[10px] text-slate-400">{t('quest_speech_sub')}</div>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  {Math.min(3, stats.speechExercisesCount)}/3
                </span>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">{t('quest_scenario')}</div>
                    <div className="text-[10px] text-slate-400">{t('quest_scenario_sub')}</div>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded-lg">
                  {stats.completedScenarioIds.length > 0 ? '1/1' : '0/1'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Retake Assessment Button */}
          <div className="p-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 text-center">
            <button
              onClick={onRetakeTest}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-1.5 mx-auto font-medium"
            >
              <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
              <span>{t('retake_test')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
