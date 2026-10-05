import React from 'react';
import { Volume2, VolumeX, Flame, Heart, Sparkles, Map, Mic, Briefcase, Trophy } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export type NavTab = 'path' | 'speech_lab' | 'simulator' | 'leaderboard';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { stats, soundEnabled, toggleSound, getExecutiveRank } = useGame();
  const { t } = useLanguage();
  const rank = getExecutiveRank();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('path');
            }}
            className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20">
              V
            </span>
            <span className="font-serif text-xl tracking-tight text-slate-100">
              Vanguard <span className="text-amber-400 font-sans text-xs tracking-widest uppercase font-semibold">Fluency</span>
            </span>
          </a>
        </div>

        {/* Zone 2: Localized Duolingo Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('path')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'path'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-1 -mb-1'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Map className="h-4 w-4" />
            <span>{t('nav_path')}</span>
          </button>

          <button
            onClick={() => setActiveTab('speech_lab')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'speech_lab'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-1 -mb-1'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Mic className="h-4 w-4" />
            <span>{t('nav_speech')}</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-1 -mb-1'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>{t('nav_simulator')}</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'leaderboard'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-1 -mb-1'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>{t('nav_leaderboard')}</span>
          </button>
        </nav>

        {/* Zone 3: Duolingo Stats Bar + Language Switcher */}
        <div className="flex items-center gap-3 text-xs font-mono font-bold">
          {/* Language Switcher Dropdown */}
          <LanguageSwitcher />

          {/* Streak Flame */}
          <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
            <Flame className="h-4 w-4 fill-amber-400" />
            <span className="tabular-nums">{stats.streak}</span>
          </div>

          {/* XP Gems */}
          <div className="flex items-center gap-1.5 text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-full">
            <Sparkles className="h-4 w-4" />
            <span className="tabular-nums">{stats.xp}</span>
          </div>

          {/* Hearts */}
          <div className="hidden sm:flex items-center gap-1.5 text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full">
            <Heart className="h-4 w-4 fill-rose-500" />
            <span>5</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Sesi kapat' : 'Sesi aç'}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-800/60 bg-slate-950 px-2 py-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('path')}
          className={`flex items-center gap-1 px-2 py-1 ${activeTab === 'path' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}
        >
          <Map className="h-3.5 w-3.5" />
          <span>{t('nav_path')}</span>
        </button>
        <button
          onClick={() => setActiveTab('speech_lab')}
          className={`flex items-center gap-1 px-2 py-1 ${activeTab === 'speech_lab' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}
        >
          <Mic className="h-3.5 w-3.5" />
          <span>{t('nav_speech')}</span>
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-1 px-2 py-1 ${activeTab === 'simulator' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}
        >
          <Briefcase className="h-3.5 w-3.5" />
          <span>{t('nav_simulator')}</span>
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center gap-1 px-2 py-1 ${activeTab === 'leaderboard' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}
        >
          <Trophy className="h-3.5 w-3.5" />
          <span>{t('nav_leaderboard')}</span>
        </button>
      </div>
    </header>
  );
};
