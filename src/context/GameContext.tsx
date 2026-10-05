import React, { createContext, useContext, useEffect, useState } from 'react';
import { IntelligenceScoreMap, IntelligenceType, UserStats } from '../types';
import { playExecutiveChime } from '../utils/speechHelper';

interface GameContextType {
  stats: UserStats;
  soundEnabled: boolean;
  toggleSound: () => void;
  recordExerciseCompletion: (
    lessonId: string,
    exerciseId: string,
    isCorrect: boolean,
    gainedXp: number,
    wasSpeech: boolean
  ) => void;
  recordScenarioCompletion: (scenarioId: string, finalScore: number) => void;
  saveDiagnosticResults: (scores: IntelligenceScoreMap, dominant: IntelligenceType[]) => void;
  resetDiagnostic: () => void;
  getExecutiveRank: () => { title: string; progress: number; nextLevelXp: number };
}

const STORAGE_KEY = 'vanguard_executive_fluency_v1';

const DEFAULT_STATS: UserStats = {
  xp: 120, // Initial executive signing bonus
  streak: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessonIds: [],
  completedScenarioIds: [],
  speechExercisesCount: 0,
  accuracyRate: 92,
  totalAttempts: 5,
  successfulAttempts: 5,
  unlockedBadges: ['First Executive Briefing'],
  intelligenceScores: null,
  dominantIntelligences: ['verbal_linguistic', 'interpersonal', 'logical_mathematical'],
  hasCompletedDiagnostic: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_STATS;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vanguard_sound');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // Ignore storage errors
    }
  }, [stats]);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('vanguard_sound', JSON.stringify(next));
      if (next) playExecutiveChime('click');
      return next;
    });
  };

  const recordExerciseCompletion = (
    lessonId: string,
    _exerciseId: string,
    isCorrect: boolean,
    gainedXp: number,
    wasSpeech: boolean
  ) => {
    if (soundEnabled) {
      playExecutiveChime(isCorrect ? 'success' : 'critique');
    }

    setStats((prev) => {
      const newAttempts = prev.totalAttempts + 1;
      const newSuccess = isCorrect ? prev.successfulAttempts + 1 : prev.successfulAttempts;
      const newAccuracy = Math.round((newSuccess / newAttempts) * 100);

      const completed = new Set(prev.completedLessonIds);
      if (isCorrect && !completed.has(lessonId)) {
        completed.add(lessonId);
      }

      const badges = new Set(prev.unlockedBadges);
      if (wasSpeech && prev.speechExercisesCount + 1 >= 5) {
        badges.add('Voice of Authority');
      }
      if (prev.xp + gainedXp >= 500) {
        badges.add('VP Candidate');
      }
      if (completed.size >= 5) {
        badges.add('Grammar Architect');
      }

      return {
        ...prev,
        xp: prev.xp + gainedXp,
        totalAttempts: newAttempts,
        successfulAttempts: newSuccess,
        accuracyRate: newAccuracy,
        speechExercisesCount: wasSpeech ? prev.speechExercisesCount + 1 : prev.speechExercisesCount,
        completedLessonIds: Array.from(completed),
        unlockedBadges: Array.from(badges),
      };
    });
  };

  const recordScenarioCompletion = (scenarioId: string, finalScore: number) => {
    if (soundEnabled) playExecutiveChime('success');

    setStats((prev) => {
      const completedScenarios = new Set(prev.completedScenarioIds);
      completedScenarios.add(scenarioId);

      const badges = new Set(prev.unlockedBadges);
      badges.add('Boardroom Diplomat');
      if (finalScore >= 85) badges.add('High-Stakes Closer');

      return {
        ...prev,
        xp: prev.xp + 150,
        completedScenarioIds: Array.from(completedScenarios),
        unlockedBadges: Array.from(badges),
      };
    });
  };

  const saveDiagnosticResults = (scores: IntelligenceScoreMap, dominant: IntelligenceType[]) => {
    if (soundEnabled) playExecutiveChime('success');

    setStats((prev) => ({
      ...prev,
      intelligenceScores: scores,
      dominantIntelligences: dominant,
      hasCompletedDiagnostic: true,
      xp: prev.xp + 100, // Reward for discovering cognitive profile
      unlockedBadges: Array.from(new Set([...prev.unlockedBadges, 'Self-Aware Executive'])),
    }));
  };

  const resetDiagnostic = () => {
    setStats((prev) => ({
      ...prev,
      hasCompletedDiagnostic: false,
    }));
  };

  const getExecutiveRank = () => {
    const xp = stats.xp;
    if (xp < 300) {
      return { title: 'Junior Associate', progress: Math.min(100, Math.round((xp / 300) * 100)), nextLevelXp: 300 };
    }
    if (xp < 750) {
      return { title: 'Engagement Manager', progress: Math.min(100, Math.round(((xp - 300) / 450) * 100)), nextLevelXp: 750 };
    }
    if (xp < 1400) {
      return { title: 'Vice President', progress: Math.min(100, Math.round(((xp - 750) / 650) * 100)), nextLevelXp: 1400 };
    }
    if (xp < 2300) {
      return { title: 'Managing Director', progress: Math.min(100, Math.round(((xp - 1400) / 900) * 100)), nextLevelXp: 2300 };
    }
    return { title: 'Chief Executive Officer', progress: 100, nextLevelXp: 2300 };
  };

  return (
    <GameContext.Provider
      value={{
        stats,
        soundEnabled,
        toggleSound,
        recordExerciseCompletion,
        recordScenarioCompletion,
        saveDiagnosticResults,
        resetDiagnostic,
        getExecutiveRank,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
