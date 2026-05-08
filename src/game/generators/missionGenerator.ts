export type MissionRank = 'D' | 'C' | 'B' | 'A' | 'S';

export type MissionType =
  | 'escort'
  | 'infiltration'
  | 'bounty hunt'
  | 'patrol'
  | 'rescue'
  | 'investigation'
  | 'defence'
  | 'assassination'
  | 'tournament bout'
  | 'resource run';

export type SkillName =
  | 'taijutsu'
  | 'ninjutsu'
  | 'genjutsu'
  | 'weaponSkill'
  | 'stealth'
  | 'intelligence'
  | 'speed'
  | 'endurance'
  | 'teamwork'
  | 'medicalSkill';

export interface MissionRewards {
  money: number;
  prestige: number;
  xp: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  rank: MissionRank;
  missionType: MissionType;
  requiredSkills: SkillName[];
  dangerLevel: number;
  recommendedSquadSize: number;
  rewards: MissionRewards;
  terrain: string;
  enemyOrObstacleType: string;
  specialCondition: string;
  expiryWeek: number;
}

type RankConfig = {
  weight: number;
  dangerRange: [number, number];
  squadRange: [number, number];
  rewardMultiplier: number;
};

const MISSION_TYPES: MissionType[] = [
  'escort',
  'infiltration',
  'bounty hunt',
  'patrol',
  'rescue',
  'investigation',
  'defence',
  'assassination',
  'tournament bout',
  'resource run',
];

const TYPE_SKILL_WEIGHTS: Record<MissionType, Array<{ skill: SkillName; weight: number }>> = {
  escort: [
    { skill: 'teamwork', weight: 3 },
    { skill: 'endurance', weight: 2 },
    { skill: 'speed', weight: 2 },
    { skill: 'taijutsu', weight: 1 },
    { skill: 'medicalSkill', weight: 1 },
  ],
  infiltration: [
    { skill: 'stealth', weight: 4 },
    { skill: 'intelligence', weight: 3 },
    { skill: 'speed', weight: 2 },
    { skill: 'genjutsu', weight: 2 },
    { skill: 'weaponSkill', weight: 1 },
  ],
  'bounty hunt': [
    { skill: 'taijutsu', weight: 4 },
    { skill: 'weaponSkill', weight: 3 },
    { skill: 'speed', weight: 2 },
    { skill: 'stealth', weight: 1 },
    { skill: 'ninjutsu', weight: 1 },
  ],
  patrol: [
    { skill: 'endurance', weight: 3 },
    { skill: 'teamwork', weight: 2 },
    { skill: 'taijutsu', weight: 2 },
    { skill: 'speed', weight: 1 },
    { skill: 'intelligence', weight: 1 },
  ],
  rescue: [
    { skill: 'speed', weight: 4 },
    { skill: 'teamwork', weight: 3 },
    { skill: 'medicalSkill', weight: 3 },
    { skill: 'endurance', weight: 1 },
    { skill: 'stealth', weight: 1 },
  ],
  investigation: [
    { skill: 'intelligence', weight: 4 },
    { skill: 'stealth', weight: 3 },
    { skill: 'genjutsu', weight: 2 },
    { skill: 'speed', weight: 1 },
    { skill: 'teamwork', weight: 1 },
  ],
  defence: [
    { skill: 'endurance', weight: 4 },
    { skill: 'teamwork', weight: 3 },
    { skill: 'ninjutsu', weight: 3 },
    { skill: 'taijutsu', weight: 1 },
    { skill: 'weaponSkill', weight: 1 },
  ],
  assassination: [
    { skill: 'stealth', weight: 3 },
    { skill: 'weaponSkill', weight: 3 },
    { skill: 'speed', weight: 2 },
    { skill: 'taijutsu', weight: 2 },
    { skill: 'genjutsu', weight: 1 },
  ],
  'tournament bout': [
    { skill: 'taijutsu', weight: 4 },
    { skill: 'ninjutsu', weight: 3 },
    { skill: 'endurance', weight: 2 },
    { skill: 'speed', weight: 2 },
    { skill: 'genjutsu', weight: 1 },
  ],
  'resource run': [
    { skill: 'speed', weight: 3 },
    { skill: 'endurance', weight: 3 },
    { skill: 'teamwork', weight: 2 },
    { skill: 'stealth', weight: 1 },
    { skill: 'intelligence', weight: 1 },
  ],
};

const RANKS: Record<MissionRank, RankConfig> = {
  D: { weight: 30, dangerRange: [1, 3], squadRange: [1, 3], rewardMultiplier: 1 },
  C: { weight: 28, dangerRange: [3, 5], squadRange: [2, 4], rewardMultiplier: 1.5 },
  B: { weight: 22, dangerRange: [5, 7], squadRange: [3, 5], rewardMultiplier: 2.2 },
  A: { weight: 14, dangerRange: [7, 9], squadRange: [4, 6], rewardMultiplier: 3.4 },
  S: { weight: 6, dangerRange: [9, 10], squadRange: [5, 8], rewardMultiplier: 5 },
};

const TERRAINS = ['forest', 'mountain', 'urban', 'swamp', 'coast', 'desert', 'ruins', 'caverns'];
const ENEMIES_OR_OBSTACLES = [
  'rogue ninja cell',
  'bandit warlord',
  'chakra beasts',
  'trapped fortress',
  'political saboteurs',
  'hostile mercenary guild',
  'ancient sealing barrier',
  'smuggler convoy',
];
const CONDITIONS = [
  'No civilian casualties allowed',
  'Mission must remain covert',
  'Complete before sunrise',
  'Leader must survive at all costs',
  'No reinforcements available',
  'Target must be captured alive',
  'Weather disruption expected',
  'Stealth tools are limited',
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sampleOne<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)];
}

function weightedPick<T>(items: Array<{ item: T; weight: number }>): T {
  const total = items.reduce((sum, i) => sum + i.weight, 0);
  let roll = Math.random() * total;

  for (const entry of items) {
    roll -= entry.weight;
    if (roll <= 0) {
      return entry.item;
    }
  }

  return items[items.length - 1].item;
}

function getRequiredSkills(type: MissionType): SkillName[] {
  const weightedSkills = TYPE_SKILL_WEIGHTS[type].map((entry) => ({
    item: entry.skill,
    weight: entry.weight,
  }));

  const count = randomInt(3, 4);
  const picks = new Set<SkillName>();

  while (picks.size < count) {
    picks.add(weightedPick(weightedSkills));
  }

  return Array.from(picks);
}

function generateRewards(rank: MissionRank, dangerLevel: number): MissionRewards {
  const multiplier = RANKS[rank].rewardMultiplier;

  const money = Math.round((1000 + dangerLevel * 350) * multiplier);
  const prestige = Math.round((8 + dangerLevel * 2.5) * multiplier);
  const xp = Math.round((120 + dangerLevel * 45) * multiplier);

  return { money, prestige, xp };
}

function createTitle(type: MissionType, rank: MissionRank, terrain: string): string {
  const operations = ['Silent', 'Iron', 'Crimson', 'Shadow', 'Storm', 'Emerald', 'Obsidian'];
  const objective = type.split(' ').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
  return `${sampleOne(operations)} ${objective} (${rank}) - ${terrain}`;
}

export function generateWeeklyMissionBoard(currentWeek: number): Mission[] {
  const missionCount = randomInt(6, 10);

  return Array.from({ length: missionCount }, (_, index) => {
    const missionType = sampleOne(MISSION_TYPES);
    const rank = weightedPick(
      (Object.keys(RANKS) as MissionRank[]).map((r) => ({ item: r, weight: RANKS[r].weight })),
    );
    const [dangerMin, dangerMax] = RANKS[rank].dangerRange;
    const [squadMin, squadMax] = RANKS[rank].squadRange;
    const dangerLevel = randomInt(dangerMin, dangerMax);
    const terrain = sampleOne(TERRAINS);
    const enemyOrObstacleType = sampleOne(ENEMIES_OR_OBSTACLES);
    const specialCondition = sampleOne(CONDITIONS);
    const requiredSkills = getRequiredSkills(missionType);
    const rewards = generateRewards(rank, dangerLevel);

    return {
      id: `wk${currentWeek}-${index + 1}-${Math.random().toString(36).slice(2, 7)}`,
      title: createTitle(missionType, rank, terrain),
      description: `A ${missionType} assignment in ${terrain}. Expect resistance from ${enemyOrObstacleType.toLowerCase()}.`,
      rank,
      missionType,
      requiredSkills,
      dangerLevel,
      recommendedSquadSize: randomInt(squadMin, squadMax),
      rewards,
      terrain,
      enemyOrObstacleType,
      specialCondition,
      expiryWeek: currentWeek + randomInt(1, 2),
    };
  });
}
