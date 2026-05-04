/**
 * Core domain types for the Ninja Village Management game.
 *
 * Notes:
 * - Most numeric meters are represented as 0-100 values.
 * - String literal unions are used where the set is likely stable.
 * - Prefer additive evolution (adding optional fields) over breaking changes.
 */

/** Generic entity identifier. */
export type ID = string;

/**
 * Constrained percentage-like value intended for 0-100 game meters.
 *
 * TypeScript cannot enforce numeric ranges at compile-time for raw numbers,
 * so this alias is descriptive and should be validated at runtime.
 */
export type StatValue = number;

/** Narrative/competitive rank used by ninjas and missions. */
export type NinjaRank = 'Academy' | 'Genin' | 'Chunin' | 'Jonin' | 'Anbu' | 'Kage';

/** Mission rank/difficulty tier. */
export type MissionRank = 'D' | 'C' | 'B' | 'A' | 'S';

/** Health/injury summary shown in roster screens and simulations. */
export type HealthStatus = 'Healthy' | 'Fatigued' | 'Injured' | 'Recovering' | 'Unavailable';

/**
 * Primary ninja combat/support stats, each expected to be 0-100.
 */
export interface NinjaStats {
  taijutsu: StatValue;
  ninjutsu: StatValue;
  genjutsu: StatValue;
  stealth: StatValue;
  speed: StatValue;
  intelligence: StatValue;
  endurance: StatValue;
  teamwork: StatValue;
  chakraControl: StatValue;
  weaponSkill: StatValue;
  medicalSkill: StatValue;
}

/** Visual profile used by portrait renderer/customizer systems. */
export interface PortraitAppearance {
  hairStyle?: string;
  hairColor?: string;
  eyeColor?: string;
  skinTone?: string;
  outfitStyle?: string;
  accessoryIds?: ID[];
  scars?: string[];
  expression?: string;
}

/**
 * Passive characteristic that can modify behavior, growth, or event outcomes.
 */
export interface Trait {
  id: ID;
  name: string;
  description: string;
  /** Optional machine-readable tags (e.g. 'discipline', 'hotheaded'). */
  tags?: string[];
  /** Optional generic modifiers to be interpreted by simulation systems. */
  modifiers?: Partial<Record<keyof NinjaStats | 'morale' | 'stamina', number>>;
}

/**
 * Inherent aptitude that influences stat growth, move learning, or role fit.
 */
export interface Talent {
  id: ID;
  name: string;
  description: string;
  affinity?: keyof NinjaStats;
  growthBonus?: number;
}

/**
 * Atomic piece of a move effect used by battle/simulation resolver.
 */
export interface MoveComponent {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'status' | 'utility';
  /** Optional stat affected by this component. */
  stat?: keyof NinjaStats;
  /** Magnitude interpreted by the combat resolver. */
  power: number;
  /** Number of turns effect persists; omitted for instant effects. */
  duration?: number;
  /** Chance (0-1) for probabilistic effects. */
  chance?: number;
}

/**
 * Learnable technique/jutsu/combat action.
 */
export interface MoveDefinition {
  id: ID;
  name: string;
  description: string;
  chakraCost: number;
  staminaCost?: number;
  cooldown?: number;
  requiredRank?: NinjaRank;
  requiredStats?: Partial<NinjaStats>;
  components: MoveComponent[];
  tags?: string[];
}

/** Training school/academy that can shape stat growth and trait acquisition. */
export interface School {
  id: ID;
  name: string;
  focusStats: (keyof NinjaStats)[];
  tuition?: number;
  reputation?: number;
  talentPool?: Talent[];
}

/** Staff member who can train ninja or improve mission preparation. */
export interface Teacher {
  id: ID;
  name: string;
  specialty: keyof NinjaStats | 'strategy' | 'medical' | 'leadership';
  skill: StatValue;
  salary: number;
  traitIds?: ID[];
}

/** Long-form training offering run by village staff/facilities. */
export interface TrainingProgram {
  id: ID;
  name: string;
  description: string;
  durationWeeks: number;
  cost: number;
  focusStats: Partial<Record<keyof NinjaStats, number>>;
  moraleImpact?: number;
  staminaImpact?: number;
  requiredFacilityIds?: ID[];
}

/**
 * Injury model used for downtime and stat penalties.
 */
export interface Injury {
  id: ID;
  name: string;
  severity: 'Minor' | 'Moderate' | 'Severe' | 'Critical';
  affectedStats?: Partial<Record<keyof NinjaStats, number>>;
  recoveryWeeks: number;
  treatmentCost?: number;
}

/** Main playable ninja unit. */
export interface Ninja {
  id: ID;
  name: string;
  age: number;
  rank: NinjaRank;
  level: number;
  xp: number;
  stats: NinjaStats;
  /** Growth ceiling or long-term projection, usually 0-100. */
  potential: StatValue;
  schoolId?: ID;
  traits: Trait[];
  moves: MoveDefinition[];
  stamina: StatValue;
  morale: StatValue;
  healthStatus: HealthStatus;
  salary: number;
  value: number;
  personalityTags: string[];
  portraitAppearance: PortraitAppearance;
  talents?: Talent[];
  injuries?: Injury[];
}

/** AI/league-controlled village rival profile. */
export interface RivalVillage {
  id: ID;
  name: string;
  rank: number;
  prestige: number;
  strengthRating: number;
  rivalryLevel?: number;
}

/** Upgrade path for village performance/economy/capacity. */
export interface VillageUpgrade {
  id: ID;
  name: string;
  description: string;
  level: number;
  maxLevel?: number;
  cost: number;
  effects?: Record<string, number>;
}

/** Financial line item for weekly/monthly ledger. */
export interface FinanceRecord {
  id: ID;
  week: number;
  season: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  note?: string;
}

/** Snapshot-style weekly summary for UI/reporting/history. */
export interface WeeklyReport {
  week: number;
  season: number;
  moneyDelta: number;
  prestigeDelta: number;
  missionCount: number;
  injuries: number;
  notes?: string[];
}

/** League table row during a season. */
export interface LeagueEntry {
  villageId: ID;
  villageName: string;
  points: number;
  wins: number;
  losses: number;
  draws?: number;
  prestige: number;
}

/** Season-level progression and league context. */
export interface SeasonState {
  seasonNumber: number;
  week: number;
  totalWeeks: number;
  leagueTable: LeagueEntry[];
  rivals: RivalVillage[];
  completedMissionIds: ID[];
}

/** Mission requirements and rewards template. */
export interface MissionTemplate {
  id: ID;
  name: string;
  description: string;
  rank: MissionRank;
  baseDurationHours: number;
  recommendedTeamSize: number;
  rewardMoney: number;
  rewardPrestige: number;
  rewardXp: number;
  requiredStats?: Partial<NinjaStats>;
  riskLevel?: StatValue;
}

/** Active/instanced mission created from a template. */
export interface Mission {
  id: ID;
  templateId: ID;
  rank: MissionRank;
  assignedSquadId?: ID;
  startWeek?: number;
  endWeek?: number;
  status: 'Available' | 'Assigned' | 'InProgress' | 'Completed' | 'Failed';
  modifiers?: Record<string, number>;
}

/** Mission simulation event for logs/replay/tools. */
export interface MissionEvent {
  turn?: number;
  type: 'combat' | 'hazard' | 'discovery' | 'dialogue' | 'reward' | 'injury';
  message: string;
  impact?: {
    morale?: number;
    stamina?: number;
    health?: number;
    money?: number;
    prestige?: number;
  };
}

/** Output payload after mission resolution. */
export interface MissionResult {
  missionId: ID;
  success: boolean;
  score: number;
  moneyEarned: number;
  prestigeEarned: number;
  xpEarned: number;
  injuries: Injury[];
  events: MissionEvent[];
  ninjaUpdates?: Array<{
    ninjaId: ID;
    xpGained: number;
    statGains?: Partial<NinjaStats>;
    moraleDelta?: number;
    staminaDelta?: number;
  }>;
}

/** Tactical team assignment for missions/training. */
export interface Squad {
  id: ID;
  name: string;
  memberIds: ID[];
  leaderId?: ID;
  synergy?: StatValue;
  preferredMissionRanks?: MissionRank[];
}

/** Primary player-owned village model. */
export interface Village {
  id: ID;
  name: string;
  money: number;
  prestige: number;
  roster: Ninja[];
  teachers: Teacher[];
  upgrades: VillageUpgrade[];
  facilities: string[];
  weeklyHistory: WeeklyReport[];
  seasonHistory: SeasonState[];
  financeHistory?: FinanceRecord[];
  schools?: School[];
  squads?: Squad[];
}

/** Complete game state root. */
export interface GameState {
  seed?: string;
  tick?: number;
  village: Village;
  rivalVillages: RivalVillage[];
  availableMissions: Mission[];
  missionTemplates: MissionTemplate[];
  moveLibrary: MoveDefinition[];
  schools: School[];
  trainingPrograms: TrainingProgram[];
  currentSeason: SeasonState;
  weeklyReports: WeeklyReport[];
  finances: FinanceRecord[];
}
