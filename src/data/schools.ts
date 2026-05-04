export type StatKey = 'strength' | 'speed' | 'chakra' | 'intelligence' | 'stamina' | 'precision';

export type StatBiases = Record<StatKey, number>;

export type VisualStyleBias = {
  palette: 'warm' | 'cool' | 'neutral' | 'high-contrast';
  silhouette: 'light' | 'balanced' | 'heavy';
  accessories: Array<'bandages' | 'mask' | 'scrolls' | 'medical-kit' | 'weapon-rack' | 'charms'>;
};

export type NinjaSchool = {
  id: string;
  name: string;
  description: string;
  statBiases: StatBiases;
  commonTraits: string[];
  rareTraits: string[];
  recruitmentCostModifier: number;
  visualStyleBias: VisualStyleBias;
};

export const schools: NinjaSchool[] = [
  {
    id: 'taijutsu-academy',
    name: 'Taijutsu Academy',
    description: 'A school focused on body conditioning, close combat form, and relentless drills.',
    statBiases: { strength: 3, speed: 2, chakra: -1, intelligence: 0, stamina: 2, precision: 1 },
    commonTraits: ['Iron Will', 'Team Player', 'Quick Learner'],
    rareTraits: ['Prodigy', 'Calm Under Pressure'],
    recruitmentCostModifier: 0.95,
    visualStyleBias: { palette: 'warm', silhouette: 'heavy', accessories: ['bandages', 'charms'] },
  },
  {
    id: 'hidden-step-institute',
    name: 'Hidden Step Institute',
    description: 'Specialists in stealth, infiltration, and silent reconnaissance operations.',
    statBiases: { strength: 0, speed: 3, chakra: 1, intelligence: 2, stamina: 0, precision: 2 },
    commonTraits: ['Silent Step', 'Lone Wolf', 'Calm Under Pressure'],
    rareTraits: ['Prodigy', 'Chakra Savant'],
    recruitmentCostModifier: 1.05,
    visualStyleBias: { palette: 'cool', silhouette: 'light', accessories: ['mask', 'scrolls'] },
  },
  {
    id: 'elemental-hall',
    name: 'Elemental Hall',
    description: 'An old institution where chakra nature training is taught from day one.',
    statBiases: { strength: -1, speed: 1, chakra: 4, intelligence: 2, stamina: 0, precision: 1 },
    commonTraits: ['Chakra Savant', 'Quick Learner', 'Fragile Genius'],
    rareTraits: ['Prodigy', 'Iron Will'],
    recruitmentCostModifier: 1.15,
    visualStyleBias: { palette: 'high-contrast', silhouette: 'balanced', accessories: ['scrolls', 'charms'] },
  },
  {
    id: 'medical-lotus-school',
    name: 'Medical Lotus School',
    description: 'A disciplined school producing battlefield medics and support tacticians.',
    statBiases: { strength: -1, speed: 0, chakra: 2, intelligence: 3, stamina: 1, precision: 2 },
    commonTraits: ['Calm Under Pressure', 'Team Player', 'Iron Will'],
    rareTraits: ['Chakra Savant', 'Prodigy'],
    recruitmentCostModifier: 1.1,
    visualStyleBias: { palette: 'neutral', silhouette: 'light', accessories: ['medical-kit', 'charms'] },
  },
  {
    id: 'iron-weapon-school',
    name: 'Iron Weapon School',
    description: 'Weapon masters who train with blades, chains, and specialist tools.',
    statBiases: { strength: 2, speed: 1, chakra: -1, intelligence: 1, stamina: 2, precision: 3 },
    commonTraits: ['Reckless', 'Iron Will', 'Lone Wolf'],
    rareTraits: ['Silent Step', 'Prodigy'],
    recruitmentCostModifier: 1,
    visualStyleBias: { palette: 'cool', silhouette: 'heavy', accessories: ['weapon-rack', 'bandages'] },
  },
];
