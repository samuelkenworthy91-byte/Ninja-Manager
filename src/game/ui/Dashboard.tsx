import React from 'react';
import { useGameState, usePlayerVillage } from '../state/GameStateContext';

export function Dashboard() {
  const { gameState } = useGameState();
  const playerVillage = usePlayerVillage();

  if (!playerVillage) return null;

  return (
    <section>
      <h2>Dashboard</h2>
      <ul>
        <li>Season: {gameState.season}</li>
        <li>Week: {gameState.week}</li>
        <li>Village Money: {playerVillage.money}</li>
        <li>Prestige: {playerVillage.prestige}</li>
        <li>Roster Size: {playerVillage.roster.length}</li>
        <li>League Position: TBD</li>
      </ul>
    </section>
  );
}
