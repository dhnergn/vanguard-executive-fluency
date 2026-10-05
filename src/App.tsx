import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar, NavTab } from './components/Navbar';
import { DuolingoOnboarding } from './components/DuolingoOnboarding';
import { DuolingoPathView } from './components/DuolingoPathView';
import { BoardroomSimulator } from './components/BoardroomSimulator';
import { SpeechLab } from './components/SpeechLab';
import { LeaderboardView } from './components/LeaderboardView';
import { LessonModal } from './components/LessonModal';
import { LessonModule } from './types';

function MainAppContent() {
  const { stats, resetDiagnostic } = useGame();
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<NavTab>('path');
  const [selectedModule, setSelectedModule] = useState<LessonModule | null>(null);

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Duolingo Top Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* If participant has not completed the onboarding placement quiz, show Duolingo onboarding */}
        {!stats.hasCompletedDiagnostic ? (
          <DuolingoOnboarding onComplete={() => setActiveTab('path')} />
        ) : (
          <>
            {activeTab === 'path' && (
              <DuolingoPathView
                onSelectModule={(mod) => setSelectedModule(mod)}
                onOpenSimulator={() => setActiveTab('simulator')}
                onRetakeTest={() => resetDiagnostic()}
              />
            )}

            {activeTab === 'speech_lab' && <SpeechLab />}

            {activeTab === 'simulator' && <BoardroomSimulator />}

            {activeTab === 'leaderboard' && <LeaderboardView />}
          </>
        )}
      </main>

      {/* Interactive Lesson Modal */}
      <LessonModal
        module={selectedModule}
        isOpen={Boolean(selectedModule)}
        onClose={() => setSelectedModule(null)}
      />

      {/* Minimalist Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-serif text-slate-300 font-semibold">
            Vanguard Executive Fluency
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Kişiselleştirilmiş Öğrenme Yolu</span>
            <span aria-hidden="true">·</span>
            <span>Web Speech API Ses Tanıma</span>
            <span aria-hidden="true">·</span>
            <span>Yönetim Kurulu Simülasyonu</span>
          </div>
          <div>© {new Date().getFullYear()} Vanguard Learning.</div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <GameProvider>
        <MainAppContent />
      </GameProvider>
    </LanguageProvider>
  );
}
