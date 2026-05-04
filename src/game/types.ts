export type NinjaRank = 'Genin' | 'Chunin' | 'Jonin' | 'Anbu';

export type NinjaStats = {
  taijutsu: number;
  ninjutsu: number;
  genjutsu: number;
  speed: number;
  strength: number;
  intelligence: number;
};

export type Ninja = {
  id: string;
  name: string;
  rank: NinjaRank;
  level: number;
  age: number;
  school: string;
  potential: number;
  stamina: number;
  morale: number;
  injured: boolean;
  traits: string[];
  stats: NinjaStats;
};

export type RecruitableNinja = Ninja & {
  recruitmentCost: number;
};

export type VillageState = {
  money: number;
  roster: Ninja[];
  recruitmentPool: RecruitableNinja[];
};
