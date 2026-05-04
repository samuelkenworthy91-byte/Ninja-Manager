export type NinjaSchool =
  | 'Taijutsu Academy'
  | 'Hidden Step Institute'
  | 'Elemental Hall'
  | 'Medical Lotus School'
  | 'Iron Weapon School';

export type NinjaRank = 'Academy' | 'Genin' | 'Chunin';

export type PotentialBand = 'Ordinary' | 'Promising' | 'Prodigy' | 'Anomaly';

export interface NinjaStats {
  taijutsu: number;
  ninjutsu: number;
  genjutsu: number;
  stealth: number;
  speed: number;
  endurance: number;
  intelligence: number;
  chakraControl: number;
  medicalSkill: number;
  weaponSkill: number;
  teamwork: number;
}

export interface NinjaRecruit {
  id: string;
  firstName: string;
  surname: string;
  age: number;
  rank: NinjaRank;
  level: number;
  xp: number;
  stats: NinjaStats;
  potentialRating: number;
  potentialBand: PotentialBand;
  schoolOfOrigin: NinjaSchool;
  traits: string[];
  starterMove: string;
  stamina: number;
  morale: number;
  salary: number;
  value: number;
  personalityTags: string[];
  portraitAppearanceSeed: number;
  overallRating: number;
  recruitmentCost: number;
  roleSuitability: Record<string, number>;
}
