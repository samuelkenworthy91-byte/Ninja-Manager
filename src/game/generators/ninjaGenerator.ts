import { createSeededRandom } from '../utils/seededRandom';
import {
  NinjaRecruit,
  NinjaSchool,
  NinjaStats,
  PotentialBand,
} from '../types/ninja';

const FIRST_NAMES = ['Rin', 'Daichi', 'Hana', 'Kaito', 'Sora', 'Yumi', 'Rei', 'Taro', 'Mei', 'Akio'];
const SURNAMES = ['Kurogane', 'Mizuno', 'Hayashi', 'Tachibana', 'Shiro', 'Fujita', 'Amano', 'Isobe'];

const STARTER_MOVES = [
  'Shadow Feint',
  'Iron Palm',
  'Mist Step',
  'Ember Needle',
  'Healing Pulse',
  'Whirling Kunai',
];

const PERSONALITY_TAGS = ['Disciplined', 'Reckless', 'Calm', 'Loyal', 'Ambitious', 'Playful', 'Stoic'];
const COMMON_TRAITS = ['Hard Worker', 'Team Player', 'Quick Learner', 'Focused'];
const RARE_TRAITS = ['Kekkei Talent', 'Battle Trance', 'Perfect Memory', 'Chakra Overflow'];

const SCHOOL_BONUSES: Record<NinjaSchool, Partial<NinjaStats>> = {
  'Taijutsu Academy': { taijutsu: 18, endurance: 12, speed: 10 },
  'Hidden Step Institute': { stealth: 18, speed: 12, intelligence: 10 },
  'Elemental Hall': { ninjutsu: 18, chakraControl: 14 },
  'Medical Lotus School': { medicalSkill: 18, intelligence: 12, teamwork: 10 },
  'Iron Weapon School': { weaponSkill: 18, endurance: 12, teamwork: 10 },
};

const ALL_SCHOOLS = Object.keys(SCHOOL_BONUSES) as NinjaSchool[];
const STAT_KEYS: (keyof NinjaStats)[] = [
  'taijutsu',
  'ninjutsu',
  'genjutsu',
  'stealth',
  'speed',
  'endurance',
  'intelligence',
  'chakraControl',
  'medicalSkill',
  'weaponSkill',
  'teamwork',
];

const clamp100 = (value: number) => Math.max(1, Math.min(100, Math.round(value)));

export const calculateOverallRating = (stats: NinjaStats): number => {
  const total = STAT_KEYS.reduce((acc, key) => acc + stats[key], 0);
  return Math.round(total / STAT_KEYS.length);
};

export const calculatePotentialBand = (potential: number): PotentialBand => {
  if (potential >= 92) return 'Anomaly';
  if (potential >= 80) return 'Prodigy';
  if (potential >= 62) return 'Promising';
  return 'Ordinary';
};

export const calculateRoleSuitability = (stats: NinjaStats): Record<string, number> => ({
  Vanguard: clamp100(stats.taijutsu * 0.35 + stats.endurance * 0.3 + stats.speed * 0.2 + stats.teamwork * 0.15),
  Assassin: clamp100(stats.stealth * 0.4 + stats.speed * 0.3 + stats.taijutsu * 0.2 + stats.intelligence * 0.1),
  Caster: clamp100(stats.ninjutsu * 0.4 + stats.chakraControl * 0.35 + stats.intelligence * 0.25),
  Medic: clamp100(stats.medicalSkill * 0.45 + stats.intelligence * 0.3 + stats.teamwork * 0.25),
  WeaponsExpert: clamp100(stats.weaponSkill * 0.45 + stats.speed * 0.25 + stats.endurance * 0.2 + stats.teamwork * 0.1),
});

export const calculateRecruitmentCost = (ninja: Pick<NinjaRecruit, 'overallRating' | 'potentialRating' | 'age' | 'traits'>): number => {
  const traitPremium = ninja.traits.length * 120;
  const youthPremium = Math.max(0, 24 - ninja.age) * 30;
  return Math.round(800 + ninja.overallRating * 35 + ninja.potentialRating * 20 + traitPremium + youthPremium);
};

const rollRarity = (rng: ReturnType<typeof createSeededRandom>): PotentialBand => {
  const roll = rng.next();
  if (roll < 0.72) return 'Ordinary';
  if (roll < 0.92) return 'Promising';
  if (roll < 0.99) return 'Prodigy';
  return 'Anomaly';
};

const generateStats = (school: NinjaSchool, rarity: PotentialBand, rng: ReturnType<typeof createSeededRandom>): NinjaStats => {
  const base = 30 + rng.int(0, 10);
  const rarityBonus = rarity === 'Anomaly' ? 24 : rarity === 'Prodigy' ? 16 : rarity === 'Promising' ? 8 : 0;

  const stats = Object.fromEntries(
    STAT_KEYS.map((key) => [key, clamp100(base + rng.int(-10, 20) + rarityBonus)]),
  ) as NinjaStats;

  for (const [key, boost] of Object.entries(SCHOOL_BONUSES[school])) {
    const statKey = key as keyof NinjaStats;
    stats[statKey] = clamp100(stats[statKey] + boost + rng.int(0, 8));
  }

  if (rarity === 'Anomaly') {
    const focusStat = rng.pick(STAT_KEYS);
    const weakStat = rng.pick(STAT_KEYS.filter((k) => k !== focusStat));
    stats[focusStat] = clamp100(stats[focusStat] + 20);
    stats[weakStat] = clamp100(stats[weakStat] - 14);
  }

  return stats;
};

const topTraitsForRarity = (rarity: PotentialBand, rng: ReturnType<typeof createSeededRandom>): string[] => {
  const traits = [rng.pick(COMMON_TRAITS)];
  if (rarity !== 'Ordinary') traits.push(rng.pick(COMMON_TRAITS));
  if (rarity === 'Anomaly' || (rarity === 'Prodigy' && rng.next() < 0.35)) traits.push(rng.pick(RARE_TRAITS));
  return [...new Set(traits)];
};

export const generateNinjaFromSchool = (school: NinjaSchool, seed: number): NinjaRecruit => {
  const rng = createSeededRandom(seed);
  const rarity = rollRarity(rng);
  const stats = generateStats(school, rarity, rng);
  const overallRating = calculateOverallRating(stats);
  const potentialRating = clamp100(overallRating + rng.int(4, 20) + (rarity === 'Anomaly' ? 10 : 0));
  const potentialBand = calculatePotentialBand(potentialRating);

  const firstName = rng.pick(FIRST_NAMES);
  const surname = rng.pick(SURNAMES);
  const age = rng.int(14, 23);
  const level = Math.max(1, Math.round(overallRating / 10));
  const xp = rng.int(0, 400) + level * 75;
  const traits = topTraitsForRarity(rarity, rng);

  const ninjaBase: NinjaRecruit = {
    id: `recruit-${seed}-${rng.int(1000, 9999)}`,
    firstName,
    surname,
    age,
    rank: age <= 16 ? 'Academy' : age <= 20 ? 'Genin' : 'Chunin',
    level,
    xp,
    stats,
    potentialRating,
    potentialBand,
    schoolOfOrigin: school,
    traits,
    starterMove: rng.pick(STARTER_MOVES),
    stamina: clamp100(stats.endurance * 0.7 + rng.int(10, 25)),
    morale: rng.int(55, 95),
    salary: Math.round(200 + level * 45 + overallRating * 4),
    value: Math.round(1500 + overallRating * 140 + potentialRating * 80),
    personalityTags: [rng.pick(PERSONALITY_TAGS), rng.pick(PERSONALITY_TAGS)].filter((v, i, arr) => arr.indexOf(v) === i),
    portraitAppearanceSeed: rng.int(100_000, 999_999),
    overallRating,
    recruitmentCost: 0,
    roleSuitability: calculateRoleSuitability(stats),
  };

  ninjaBase.recruitmentCost = calculateRecruitmentCost(ninjaBase);
  return ninjaBase;
};

export const generateWeeklyRecruitmentPool = (seed: number, count = 10): NinjaRecruit[] => {
  const rng = createSeededRandom(seed);
  return Array.from({ length: count }, (_, index) => {
    const school = rng.pick(ALL_SCHOOLS);
    return generateNinjaFromSchool(school, seed + index * 97 + rng.int(1, 5000));
  });
};
