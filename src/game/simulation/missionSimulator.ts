export type MissionOutcome = 'success' | 'failure' | 'partial_success';

export type NinjaTrait =
  | 'Prodigy'
  | 'Reckless'
  | 'Team Player'
  | 'Lone Wolf'
  | 'Calm Under Pressure'
  | 'Fragile Genius'
  | string;

export interface Ninja {
  id: string;
  name: string;
  level?: number;
  xp: number;
  stamina: number; // 0-100
  morale: number; // -100 to 100
  injured?: boolean;
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    stealth: number;
    combat: number;
    support: number;
  };
  traits: NinjaTrait[];
}

export interface Squad {
  id: string;
  name: string;
  ninjas: Ninja[];
  teamwork: number; // 0-100
  stamina: number; // aggregate 0-100
}

export interface Mission {
  id: string;
  title: string;
  difficulty: number; // 1-100
  dangerLevel: number; // 1-100
  requiredStats: Array<keyof Ninja['stats']>;
  rewardMoney: number;
  rewardPrestige: number;
}

export interface InjuryRecord {
  ninjaId: string;
  ninjaName: string;
  severity: 'light' | 'moderate' | 'severe';
  reason: string;
}

export interface MissionResult {
  missionId: string;
  missionTitle: string;
  outcome: MissionOutcome;
  moneyGained: number;
  prestigeGained: number;
  xpGainedPerNinja: Record<string, number>;
  injuries: InjuryRecord[];
  moraleChanges: Record<string, number>;
  eventLog: string[];
  summaryText: string;
}

export interface VillageState {
  money: number;
  prestige: number;
}

export interface WeeklyReport {
  missionResults: MissionResult[];
}

export interface MissionBoard {
  missions: Mission[];
}

export interface SimulationState {
  village: VillageState;
  missionBoard: MissionBoard;
  weeklyReport: WeeklyReport;
}

export interface SimulateMissionParams {
  assignedSquad: Squad;
  mission: Mission;
  state: SimulationState;
  randomSeed: number;
}

/**
 * Deterministic pseudo-random number generator for replayable mission outcomes.
 */
function createRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function avg(values: number[]): number {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
}

function traitWeight(ninja: Ninja, trait: NinjaTrait): number {
  return ninja.traits.filter((t) => t === trait).length;
}

/**
 * Main simulation entrypoint.
 * Formulas are intentionally linear and documented for easy balancing.
 */
export function simulateMission(params: SimulateMissionParams): MissionResult {
  const { assignedSquad, mission, state, randomSeed } = params;
  const rng = createRng(randomSeed);
  const ninjas = assignedSquad.ninjas;

  // Aggregate required mission stats from the assigned squad.
  const requiredStatScore = avg(
    mission.requiredStats.map((stat) => avg(ninjas.map((n) => n.stats[stat]))),
  );

  const squadStamina = clamp((assignedSquad.stamina + avg(ninjas.map((n) => n.stamina))) / 2, 0, 100);
  const squadTeamwork = clamp(assignedSquad.teamwork, 0, 100);

  let successChance = 45;
  // Better stat match helps success.
  successChance += (requiredStatScore - mission.difficulty) * 0.8;
  // Stamina and teamwork are always relevant.
  successChance += (squadStamina - 50) * 0.35;
  successChance += (squadTeamwork - 50) * 0.25;
  // High danger reduces consistency.
  successChance -= (mission.dangerLevel - 50) * 0.3;

  // Trait pass: team and risk traits.
  for (const ninja of ninjas) {
    successChance += traitWeight(ninja, 'Team Player') * 1.8;
    successChance += traitWeight(ninja, 'Reckless') * 1.5;
    if (ninjas.length === 1) {
      successChance += traitWeight(ninja, 'Lone Wolf') * 6;
    } else if (ninjas.length >= 4) {
      successChance -= traitWeight(ninja, 'Lone Wolf') * 1.5;
    }
  }

  successChance = clamp(successChance, 5, 95);

  const roll = rng() * 100;
  const margin = successChance - roll;
  const outcome: MissionOutcome = margin >= 15 ? 'success' : margin >= -8 ? 'partial_success' : 'failure';

  // Rewards by outcome with readable multipliers.
  const rewardMultiplier = outcome === 'success' ? 1 : outcome === 'partial_success' ? 0.6 : 0.2;
  const moneyGained = Math.round(mission.rewardMoney * rewardMultiplier);
  const prestigeGained = Math.round(mission.rewardPrestige * (outcome === 'failure' ? 0.1 : rewardMultiplier));

  // Injury risk grows with danger and failed outcomes.
  let injuryRisk = mission.dangerLevel * 0.45;
  if (outcome === 'partial_success') injuryRisk += 8;
  if (outcome === 'failure') injuryRisk += 18;

  const injuries: InjuryRecord[] = [];
  const moraleChanges: Record<string, number> = {};
  const xpGainedPerNinja: Record<string, number> = {};

  for (const ninja of ninjas) {
    let individualInjuryRisk = injuryRisk;
    individualInjuryRisk += traitWeight(ninja, 'Reckless') * 10;
    individualInjuryRisk += traitWeight(ninja, 'Fragile Genius') * 12;
    individualInjuryRisk -= traitWeight(ninja, 'Calm Under Pressure') * 10;
    individualInjuryRisk = clamp(individualInjuryRisk, 5, 95);

    if (rng() * 100 < individualInjuryRisk * 0.2) {
      const severityRoll = rng();
      const severity: InjuryRecord['severity'] =
        severityRoll < 0.6 ? 'light' : severityRoll < 0.9 ? 'moderate' : 'severe';
      ninja.injured = true;
      injuries.push({
        ninjaId: ninja.id,
        ninjaName: ninja.name,
        severity,
        reason: outcome === 'failure' ? 'Retreat under pressure.' : 'Combat impact during mission.',
      });
    }

    // Base XP from mission complexity + outcome.
    let xp = 8 + mission.difficulty * 0.5;
    xp *= outcome === 'success' ? 1.2 : outcome === 'partial_success' ? 1 : 0.75;
    xp += traitWeight(ninja, 'Prodigy') * 10;
    xp += traitWeight(ninja, 'Fragile Genius') * (ninja.stats.intelligence * 0.12);
    xp = Math.round(xp);

    const morale = outcome === 'success' ? 8 : outcome === 'partial_success' ? 2 : -8;
    const calmBonus = traitWeight(ninja, 'Calm Under Pressure') * (outcome === 'failure' ? 4 : 1);
    const injuryPenalty = injuries.some((i) => i.ninjaId === ninja.id) ? -6 : 0;

    const moraleDelta = morale + calmBonus + injuryPenalty;

    // Apply post-mission updates to ninja records.
    ninja.xp += xp;
    ninja.stamina = clamp(ninja.stamina - (10 + mission.difficulty * 0.15), 0, 100);
    ninja.morale = clamp(ninja.morale + moraleDelta, -100, 100);

    xpGainedPerNinja[ninja.id] = xp;
    moraleChanges[ninja.id] = moraleDelta;
  }

  const names = ninjas.map((n) => n.name);
  const pickName = () => names[Math.floor(rng() * names.length)] ?? 'Unknown Ninja';

  const eventLog = [
    `${pickName()} led the stealth approach toward ${mission.title}, reading patrol patterns before entry.`,
    `${pickName()} triggered the first enemy encounter, forcing the squad to adapt formation quickly.`,
    `${pickName()} executed a clever tactic using ${mission.requiredStats[0] ?? 'combat'} to break resistance.`,
    `${pickName()} made a mistake under pressure, costing time and stamina for the whole team.`,
    `${pickName()} activated a key trait advantage at a critical moment, stabilizing the mission tempo.`,
    `${pickName()} delivered the finishing move that secured the objective path.`,
    injuries.length
      ? `${injuries[0].ninjaName} suffered a ${injuries[0].severity} injury during the final push.`
      : `${pickName()} avoided serious injury through disciplined movement in the danger zone.`,
    `${pickName()} coordinated extraction and regrouped the squad at a secure route out.`,
  ];

  // Keep event log between 5 and 12 entries.
  const desiredLength = 5 + Math.floor(rng() * 8);
  while (eventLog.length > desiredLength) eventLog.splice(Math.floor(rng() * eventLog.length), 1);

  const summaryText =
    outcome === 'success'
      ? `${assignedSquad.name} completed ${mission.title} with strong execution despite danger level ${mission.dangerLevel}.`
      : outcome === 'partial_success'
        ? `${assignedSquad.name} partially completed ${mission.title}, recovering key value but taking setbacks.`
        : `${assignedSquad.name} failed ${mission.title} and withdrew after heavy resistance.`;

  const result: MissionResult = {
    missionId: mission.id,
    missionTitle: mission.title,
    outcome,
    moneyGained,
    prestigeGained,
    xpGainedPerNinja,
    injuries,
    moraleChanges,
    eventLog,
    summaryText,
  };

  // Apply village-wide updates.
  state.village.money += moneyGained;
  state.village.prestige += prestigeGained;
  state.missionBoard.missions = state.missionBoard.missions.filter((m) => m.id !== mission.id);
  state.weeklyReport.missionResults.push(result);

  return result;
}
