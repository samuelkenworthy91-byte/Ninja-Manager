import type { MissionResult, Squad } from '../simulation/missionSimulator';

export interface MissionResultModalViewModel {
  title: string;
  outcomeLabel: string;
  summary: string;
  rewards: {
    money: string;
    prestige: string;
  };
  xpRows: Array<{ ninjaName: string; xp: string; moraleDelta: string }>;
  injuries: string[];
  eventLog: string[];
}

/**
 * Builds a full mission report model suitable for rendering in a modal/screen.
 */
export function buildMissionResultModalViewModel(
  result: MissionResult,
  squad: Squad,
): MissionResultModalViewModel {
  const ninjaById = new Map(squad.ninjas.map((n) => [n.id, n]));

  return {
    title: `Mission Report: ${result.missionTitle}`,
    outcomeLabel: result.outcome.replace('_', ' ').toUpperCase(),
    summary: result.summaryText,
    rewards: {
      money: `${result.moneyGained} ryo`,
      prestige: `${result.prestigeGained} prestige`,
    },
    xpRows: Object.entries(result.xpGainedPerNinja).map(([ninjaId, xp]) => ({
      ninjaName: ninjaById.get(ninjaId)?.name ?? ninjaId,
      xp: `+${xp} XP`,
      moraleDelta: `${result.moraleChanges[ninjaId] >= 0 ? '+' : ''}${result.moraleChanges[ninjaId]} morale`,
    })),
    injuries: result.injuries.length
      ? result.injuries.map((injury) => `${injury.ninjaName}: ${injury.severity} (${injury.reason})`)
      : ['No injuries reported.'],
    eventLog: result.eventLog,
  };
}
