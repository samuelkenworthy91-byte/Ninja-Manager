import type { RivalVillage, RivalWeeklyResult } from '../simulation/rivalVillageSimulator';

export interface LeagueTableRow {
  position: number;
  villageId: string;
  villageName: string;
  played: number;
  missionSuccesses: number;
  missionFailures: number;
  prestige: number;
  moneyEarned: number;
  leaguePoints: number;
  weeklyMovement: number;
}

interface LeagueTeamRecord {
  villageId: string;
  villageName: string;
  played: number;
  missionSuccesses: number;
  missionFailures: number;
  moneyEarned: number;
  leaguePoints: number;
  previousPosition: number;
}

export class LeagueSystem {
  private records: Map<string, LeagueTeamRecord>;

  constructor(villages: RivalVillage[]) {
    this.records = new Map(
      villages.map((v) => [
        v.id,
        {
          villageId: v.id,
          villageName: v.name,
          played: 0,
          missionSuccesses: 0,
          missionFailures: 0,
          moneyEarned: 0,
          leaguePoints: 0,
          previousPosition: 0,
        },
      ])
    );
  }

  public applyWeeklyResults(results: RivalWeeklyResult[]): LeagueTableRow[] {
    const previous = this.getTable();
    const previousPositionById = new Map(previous.map((row) => [row.villageId, row.position]));

    results.forEach((result) => {
      const record = this.records.get(result.rivalVillageId);
      if (!record) return;

      record.played += result.missionsAttempted;
      record.missionSuccesses += result.successes;
      record.missionFailures += result.failures;
      record.moneyEarned += result.moneyDelta;

      const basePoints = result.successes * 3 + result.partials;
      const highRankBonus = result.highRankBonusPoints;
      record.leaguePoints += basePoints + highRankBonus;
      record.previousPosition = previousPositionById.get(record.villageId) ?? 0;
    });

    return this.getTable();
  }

  public getTable(prestigeByVillageId?: Record<string, number>): LeagueTableRow[] {
    const rows: LeagueTableRow[] = Array.from(this.records.values()).map((record) => ({
      position: 0,
      villageId: record.villageId,
      villageName: record.villageName,
      played: record.played,
      missionSuccesses: record.missionSuccesses,
      missionFailures: record.missionFailures,
      prestige: prestigeByVillageId?.[record.villageId] ?? 0,
      moneyEarned: record.moneyEarned,
      leaguePoints: record.leaguePoints,
      weeklyMovement: 0,
    }));

    rows.sort((a, b) => {
      if (b.leaguePoints !== a.leaguePoints) return b.leaguePoints - a.leaguePoints;
      if (b.prestige !== a.prestige) return b.prestige - a.prestige;
      if (b.missionSuccesses !== a.missionSuccesses) return b.missionSuccesses - a.missionSuccesses;
      return b.moneyEarned - a.moneyEarned;
    });

    rows.forEach((row, index) => {
      row.position = index + 1;
      const prev = this.records.get(row.villageId)?.previousPosition ?? 0;
      row.weeklyMovement = prev === 0 ? 0 : prev - row.position;
    });

    return rows;
  }
}

export function buildRivalVillageWeeklyNews(results: RivalWeeklyResult[]): string[] {
  return results.map((result) => {
    const perf = `${result.successes}W-${result.partials}D-${result.failures}L`;
    const prestigeText = result.prestigeDelta >= 0 ? `+${result.prestigeDelta}` : `${result.prestigeDelta}`;
    const moneyText = result.moneyDelta >= 0 ? `+$${result.moneyDelta}` : `-$${Math.abs(result.moneyDelta)}`;
    const setbackText = result.setbacks.length > 0 ? ` Setback: ${result.setbacks[0]}` : '';
    return `${result.villageName}: ${perf}, Prestige ${prestigeText}, Money ${moneyText}.${setbackText}`;
  });
}
