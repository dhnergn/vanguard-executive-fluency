import React from 'react';
import { Trophy, Sparkles, ArrowUp, Crown, Shield, Award, Flame } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';

interface Competitor {
  rank: number;
  name: string;
  role: string;
  xp: number;
  avatarSeed: string;
  isUser?: boolean;
}

export const LeaderboardView: React.FC = () => {
  const { stats } = useGame();
  const { t } = useLanguage();

  const rawCompetitors: Competitor[] = [
    { rank: 1, name: 'Helena Weber', role: 'Chief Strategy Officer · Zurich', xp: 2840, avatarSeed: 'H' },
    { rank: 2, name: 'Siddharth Patel', role: 'VP of Engineering · London', xp: 2310, avatarSeed: 'S' },
    { rank: 3, name: `${t('you_badge')}`, role: 'Senior Executive Lead', xp: stats.xp, avatarSeed: 'Y', isUser: true },
    { rank: 4, name: 'Claire Delacroix', role: 'Head of Global M&A · Paris', xp: 1450, avatarSeed: 'C' },
    { rank: 5, name: 'Marcus Thorne', role: 'Managing Director · Frankfurt', xp: 1220, avatarSeed: 'M' },
    { rank: 6, name: 'Emi Tanaka', role: 'Corporate Affairs Director · Tokyo', xp: 980, avatarSeed: 'E' },
    { rank: 7, name: 'Alexander Lind', role: 'General Counsel · Stockholm', xp: 750, avatarSeed: 'A' },
  ];

  // Re-sort with current user XP
  const sorted = [...rawCompetitors].sort((a, b) => b.xp - a.xp).map((c, idx) => ({
    ...c,
    rank: idx + 1,
  }));

  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];
  const restList = sorted.slice(3);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* League Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 p-6 sm:p-10 text-center mb-10 relative overflow-hidden shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-xl shadow-amber-500/20 mb-4 border-b-2 border-amber-800">
          <Trophy className="h-8 w-8 stroke-[2.5]" />
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-black mb-1">
          {t('leaderboard_league')}
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
          {t('leaderboard_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          {t('leaderboard_desc')}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs text-emerald-300 font-semibold">
          <ArrowUp className="h-3.5 w-3.5" />
          <span>{t('leaderboard_promo')}</span>
        </div>
      </div>

      {/* Top 3 Executive Olympic Podium */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end mb-10 max-w-2xl mx-auto pt-6">
        {/* 2nd Place Podium */}
        <div className="flex flex-col items-center">
          <div className="relative mb-2">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-slate-800 border-2 border-slate-400 text-white font-serif font-bold text-lg shadow-lg">
              {top2.avatarSeed}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-slate-950 font-mono font-bold text-xs shadow-md">
              2
            </span>
          </div>
          <div className="text-xs font-bold text-white line-clamp-1 text-center">{top2.name}</div>
          <div className="text-[11px] font-mono text-slate-400 mb-2">{top2.xp} XP</div>
          {/* Pedestal Box */}
          <div className="w-full h-24 sm:h-28 rounded-t-2xl border-t-4 border-l border-r border-slate-600 bg-gradient-to-b from-slate-800 to-slate-900/80 flex flex-col items-center justify-center shadow-lg">
            <span className="text-xs font-mono font-bold text-slate-300">GÜMÜŞ</span>
          </div>
        </div>

        {/* 1st Place Podium (Trophy & Crown) */}
        <div className="flex flex-col items-center -mt-6">
          <Crown className="h-8 w-8 text-amber-400 fill-amber-400 animate-bounce mb-1" />
          <div className="relative mb-2">
            <div className="flex h-18 w-18 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-4 border-amber-300 text-slate-950 font-serif font-black text-2xl shadow-xl shadow-amber-500/30">
              {top1.avatarSeed}
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-slate-950 font-mono font-black text-xs shadow-md border-2 border-slate-950">
              1
            </span>
          </div>
          <div className="text-sm font-bold text-amber-300 line-clamp-1 text-center">{top1.name}</div>
          <div className="text-xs font-mono font-bold text-amber-400 mb-2">{top1.xp} XP</div>
          {/* Pedestal Box */}
          <div className="w-full h-32 sm:h-36 rounded-t-2xl border-t-4 border-l border-r border-amber-400 bg-gradient-to-b from-amber-500/20 via-slate-800 to-slate-900 flex flex-col items-center justify-center shadow-xl shadow-amber-500/10">
            <span className="text-xs font-mono font-black text-amber-400">ALTIN</span>
            <span className="text-[10px] text-amber-300/80">Lider</span>
          </div>
        </div>

        {/* 3rd Place Podium */}
        <div className="flex flex-col items-center">
          <div className="relative mb-2">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-slate-800 border-2 border-amber-700 text-amber-200 font-serif font-bold text-lg shadow-lg">
              {top3.avatarSeed}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-700 text-white font-mono font-bold text-xs shadow-md">
              3
            </span>
          </div>
          <div className="text-xs font-bold text-white line-clamp-1 text-center">{top3.name}</div>
          <div className="text-[11px] font-mono text-slate-400 mb-2">{top3.xp} XP</div>
          {/* Pedestal Box */}
          <div className="w-full h-20 sm:h-24 rounded-t-2xl border-t-4 border-l border-r border-amber-800 bg-gradient-to-b from-slate-800 to-slate-900/80 flex flex-col items-center justify-center shadow-lg">
            <span className="text-xs font-mono font-bold text-amber-500">BRONZ</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Remaining Ranks */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>{t('rank_header')}</span>
          <span>{t('weekly_xp')}</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {restList.map((item) => (
            <div
              key={item.name}
              className={`flex items-center justify-between p-4 transition-colors ${
                item.isUser
                  ? 'bg-amber-500/10 border-l-4 border-amber-400'
                  : 'hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono font-bold text-xs text-slate-400">
                  {item.rank}
                </span>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-white font-serif font-bold text-sm">
                    {item.avatarSeed}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{item.name}</span>
                      {item.isUser && (
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                          {t('you_badge')}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">{item.role}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-mono font-bold text-sm text-slate-100 tabular-nums">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>{item.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
