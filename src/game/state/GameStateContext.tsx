import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createInitialGameState, type GameState, type Ninja, type WeeklyReport } from './createInitialGameState';

type GameStateContextValue = {
  gameState: GameState;
  recruitNinja: (ninjaId: string) => void;
  advanceWeek: () => void;
  updateVillageMoney: (villageId: string, amount: number) => void;
  addWeeklyReport: (message: string) => void;
};

const GameStateContext = createContext<GameStateContextValue | undefined>(undefined);

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState());

  const recruitNinja = useCallback((ninjaId: string) => {
    setGameState((prev) => {
      const ninjaToRecruit = prev.recruitmentPool.find((ninja) => ninja.id === ninjaId);
      if (!ninjaToRecruit) return prev;

      return {
        ...prev,
        villages: prev.villages.map((village) =>
          village.id === prev.playerVillageId
            ? { ...village, roster: [...village.roster, ninjaToRecruit] }
            : village
        ),
        recruitmentPool: prev.recruitmentPool.filter((ninja) => ninja.id !== ninjaId),
      };
    });
  }, []);

  const advanceWeek = useCallback(() => {
    setGameState((prev) => {
      const nextWeek = prev.week === 52 ? 1 : prev.week + 1;
      const nextSeason = prev.week === 52 ? prev.season + 1 : prev.season;

      return {
        ...prev,
        week: nextWeek,
        season: nextSeason,
        saveMetadata: {
          ...prev.saveMetadata,
          lastSavedAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  const updateVillageMoney = useCallback((villageId: string, amount: number) => {
    setGameState((prev) => ({
      ...prev,
      villages: prev.villages.map((village) =>
        village.id === villageId
          ? { ...village, money: village.money + amount }
          : village
      ),
    }));
  }, []);

  const addWeeklyReport = useCallback((message: string) => {
    setGameState((prev) => {
      const report: WeeklyReport = {
        id: `report_${Date.now()}`,
        season: prev.season,
        week: prev.week,
        message,
      };

      return {
        ...prev,
        weeklyReports: [...prev.weeklyReports, report],
      };
    });
  }, []);

  const value = useMemo(
    () => ({ gameState, recruitNinja, advanceWeek, updateVillageMoney, addWeeklyReport }),
    [gameState, recruitNinja, advanceWeek, updateVillageMoney, addWeeklyReport]
  );

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>;
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used inside GameStateProvider');
  }
  return context;
}

export function usePlayerVillage() {
  const { gameState } = useGameState();
  return gameState.villages.find((village) => village.id === gameState.playerVillageId);
}
