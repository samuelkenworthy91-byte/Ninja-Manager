export type RivalSpeciality =
  | 'Stealth'
  | 'Assault'
  | 'Tracking'
  | 'Support'
  | 'Sabotage'
  | 'Intel'
  | 'Medical';

export type MissionPreference =
  | 'Any'
  | 'Low Risk'
  | 'High Reward'
  | 'Recon'
  | 'Combat'
  | 'Escort'
  | 'Sabotage';

export interface RivalVillage {
  id: string;
  name: string;
  speciality: RivalSpeciality;
  money: number;
  prestige: number;
  rosterStrength: number;
  facilitiesLevel: number;
  aggressionLevel: number;
  recruitmentTendency: number;
  missionPreference: MissionPreference;
}

export type MissionOutcome = 'success' | 'partial' | 'failure';

export interface RivalWeeklyResult {
  rivalVillageId: string;
  villageName: string;
  missionsAttempted: number;
  successes: number;
  partials: number;
  failures: number;
  prestigeDelta: number;
  moneyDelta: number;
  rosterDelta: number;
  facilitiesDelta: number;
  setbacks: string[];
  notableEvents: string[];
  outcomes: MissionOutcome[];
  highRankBonusPoints: number;
}

export interface RivalSimulationState {
  villages: RivalVillage[];
  week: number;
}

const VILLAGE_NAME_PARTS_1 = ['Iron', 'Mist', 'Stone', 'Ash', 'Moon', 'Storm', 'Frost', 'River', 'Shadow', 'Crimson'];
const VILLAGE_NAME_PARTS_2 = ['leaf', 'spire', 'haven', 'forge', 'watch', 'brook', 'fang', 'peak', 'hollow', 'gate'];

const SPECIALITIES: RivalSpeciality[] = ['Stealth', 'Assault', 'Tracking', 'Support', 'Sabotage', 'Intel', 'Medical'];
const MISSION_PREFERENCES: MissionPreference[] = ['Any', 'Low Risk', 'High Reward', 'Recon', 'Combat', 'Escort', 'Sabotage'];

export function createInitialRivalVillages(count = 7, seed = Date.now()): RivalVillage[] {
  const rng = mulberry32(seed);
  const usedNames = new Set<string>();
  const villages: RivalVillage[] = [];

  while (villages.length < count) {
    const name = `${pick(VILLAGE_NAME_PARTS_1, rng)} ${pick(VILLAGE_NAME_PARTS_2, rng)}`;
    if (usedNames.has(name)) continue;

    usedNames.add(name);
    villages.push({
      id: `rival-${villages.length + 1}`,
      name,
      speciality: SPECIALITIES[villages.length % SPECIALITIES.length],
      money: randomInt(rng, 4000, 9000),
      prestige: randomInt(rng, 40, 90),
      rosterStrength: randomInt(rng, 45, 85),
      facilitiesLevel: randomInt(rng, 1, 5),
      aggressionLevel: randomInt(rng, 25, 95),
      recruitmentTendency: randomInt(rng, 20, 90),
      missionPreference: pick(MISSION_PREFERENCES, rng),
    });
  }

  return villages;
}

export function simulateRivalWeek(state: RivalSimulationState, seed = Date.now()): { state: RivalSimulationState; weeklyResults: RivalWeeklyResult[] } {
  const rng = mulberry32(seed + state.week * 9973);

  const weeklyResults = state.villages.map((village) => simulateVillageWeek(village, rng));

  const villages = state.villages.map((village) => {
    const result = weeklyResults.find((r) => r.rivalVillageId === village.id)!;
    return {
      ...village,
      money: Math.max(0, village.money + result.moneyDelta),
      prestige: Math.max(0, village.prestige + result.prestigeDelta),
      rosterStrength: clamp(village.rosterStrength + result.rosterDelta, 1, 100),
      facilitiesLevel: clamp(village.facilitiesLevel + result.facilitiesDelta, 1, 10),
    };
  });

  return {
    state: {
      villages,
      week: state.week + 1,
    },
    weeklyResults,
  };
}

function simulateVillageWeek(village: RivalVillage, rng: () => number): RivalWeeklyResult {
  const missionBias = village.aggressionLevel / 40;
  const missionsAttempted = clamp(Math.round(1 + missionBias + rng() * 2), 1, 5);

  let successes = 0;
  let partials = 0;
  let failures = 0;
  let moneyDelta = 0;
  let prestigeDelta = 0;
  let highRankBonusPoints = 0;
  const outcomes: MissionOutcome[] = [];

  for (let i = 0; i < missionsAttempted; i++) {
    const difficulty = randomInt(rng, 1, 100);
    const capability = village.rosterStrength + village.facilitiesLevel * 4 + (village.aggressionLevel > 70 ? 4 : 0);

    if (capability - difficulty > 15) {
      outcomes.push('success');
      successes += 1;
      moneyDelta += randomInt(rng, 700, 1800);
      prestigeDelta += randomInt(rng, 2, 6);
      if (difficulty > 80) {
        prestigeDelta += 2;
        highRankBonusPoints += 1;
      }
    } else if (capability - difficulty > -10) {
      outcomes.push('partial');
      partials += 1;
      moneyDelta += randomInt(rng, 250, 850);
      prestigeDelta += randomInt(rng, 0, 2);
    } else {
      outcomes.push('failure');
      failures += 1;
      moneyDelta += randomInt(rng, 0, 200);
      prestigeDelta -= randomInt(rng, 1, 4);
    }
  }

  let rosterDelta = 0;
  let facilitiesDelta = 0;
  const setbacks: string[] = [];
  const notableEvents: string[] = [];

  if (rng() < village.recruitmentTendency / 250) {
    rosterDelta += 1;
    notableEvents.push('Successful recruitment drive improved roster depth.');
  }

  if (rng() < 0.2) {
    rosterDelta += 1;
    notableEvents.push('Training breakthrough increased squad cohesion.');
  }

  if (rng() < 0.12) {
    facilitiesDelta += 1;
    notableEvents.push('Facilities upgrade completed this week.');
  }

  if (rng() < 0.18) {
    const setbackPool = [
      'Supply convoy delayed mission execution.',
      'Key operative injured during deployment.',
      'Equipment malfunction reduced mission efficiency.',
      'Internal dispute lowered unit morale.',
    ];
    const setback = pick(setbackPool, rng);
    setbacks.push(setback);
    rosterDelta -= 1;
    prestigeDelta -= 1;
  }

  return {
    rivalVillageId: village.id,
    villageName: village.name,
    missionsAttempted,
    successes,
    partials,
    failures,
    prestigeDelta,
    moneyDelta,
    rosterDelta,
    facilitiesDelta,
    setbacks,
    notableEvents,
    outcomes,
    highRankBonusPoints,
  };
}

function pick<T>(array: T[], rng: () => number): T {
  return array[Math.floor(rng() * array.length)];
}

function randomInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function mulberry32(seed: number): () => number {
  let t = seed + 0x6d2b79f5;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
