export type VillageBuildingLevels = {
  academy: number;
  trainingGround: number;
};

export type Ninja = {
  id: string;
  name: string;
  rank: 'Genin' | 'Chunin' | 'Jonin';
  power: number;
};

export type Village = {
  id: string;
  name: string;
  money: number;
  prestige: number;
  roster: Ninja[];
  buildings: VillageBuildingLevels;
};

export type WeeklyReport = {
  id: string;
  week: number;
  season: number;
  message: string;
};

export type RecruitmentPoolEntry = Ninja;

export type LeagueTableRow = {
  villageId: string;
  villageName: string;
  points: number;
  played: number;
  won: number;
  lost: number;
  draw: number;
};

export type MissionBoardItem = {
  id: string;
  title: string;
  difficulty: 'D' | 'C' | 'B' | 'A' | 'S';
  reward: number;
};

export type SaveMetadata = {
  version: string;
  createdAt: string;
  lastSavedAt: string;
};

export type GameState = {
  season: number;
  week: number;
  playerVillageId: string;
  villages: Village[];
  recruitmentPool: RecruitmentPoolEntry[];
  missionBoard: MissionBoardItem[];
  leagueTable: LeagueTableRow[];
  weeklyReports: WeeklyReport[];
  saveMetadata: SaveMetadata;
};

const NINJA_NAMES = [
  'Akio', 'Ren', 'Hana', 'Kaede', 'Riku', 'Sora', 'Yuna', 'Takumi',
  'Mika', 'Daichi', 'Aoi', 'Itsuki', 'Rei', 'Kaito', 'Hinata', 'Toru',
];

const RIVAL_VILLAGE_NAMES = [
  'Ember Village',
  'Mistfall Village',
  'Ironleaf Village',
  'Dawnpeak Village',
  'Stonewind Village',
  'Rivershade Village',
  'Nightbloom Village',
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function generateNinja(overrides: Partial<Ninja> = {}): Ninja {
  return {
    id: generateId('ninja'),
    name: NINJA_NAMES[randomInt(0, NINJA_NAMES.length - 1)],
    rank: 'Genin',
    power: randomInt(45, 70),
    ...overrides,
  };
}

function generateNinjas(count: number): Ninja[] {
  return Array.from({ length: count }, () => generateNinja());
}

export function createInitialGameState(): GameState {
  const now = new Date().toISOString();

  const playerVillage: Village = {
    id: 'village_player',
    name: 'Hidden Bamboo Village',
    money: 25000,
    prestige: 100,
    roster: generateNinjas(5),
    buildings: {
      academy: 1,
      trainingGround: 1,
    },
  };

  const rivalVillages: Village[] = RIVAL_VILLAGE_NAMES.map((name, index) => ({
    id: `village_rival_${index + 1}`,
    name,
    money: randomInt(18000, 30000),
    prestige: randomInt(80, 140),
    roster: generateNinjas(randomInt(4, 7)),
    buildings: {
      academy: 1,
      trainingGround: 1,
    },
  }));

  return {
    season: 1,
    week: 1,
    playerVillageId: playerVillage.id,
    villages: [playerVillage, ...rivalVillages],
    recruitmentPool: generateNinjas(10),
    missionBoard: [],
    leagueTable: [],
    weeklyReports: [],
    saveMetadata: {
      version: '0.1.0',
      createdAt: now,
      lastSavedAt: now,
    },
  };
}
