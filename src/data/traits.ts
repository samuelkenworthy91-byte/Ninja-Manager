export type TraitCategory = 'combat' | 'personality' | 'support' | 'chakra' | 'strategy' | 'risk';

export type Trait = {
  id: string;
  name: string;
  description: string;
  category: TraitCategory;
  rarity: 'common' | 'uncommon' | 'rare';
};

export const traits: Trait[] = [
  { id: 'prodigy', name: 'Prodigy', description: 'Starts with higher growth potential in all stats.', category: 'strategy', rarity: 'rare' },
  { id: 'reckless', name: 'Reckless', description: 'Deals more damage but is easier to counter.', category: 'risk', rarity: 'common' },
  { id: 'calm-under-pressure', name: 'Calm Under Pressure', description: 'Maintains effectiveness when injured.', category: 'personality', rarity: 'uncommon' },
  { id: 'team-player', name: 'Team Player', description: 'Gets bonuses when adjacent to allies.', category: 'support', rarity: 'common' },
  { id: 'lone-wolf', name: 'Lone Wolf', description: 'Gets bonuses when no allies are nearby.', category: 'personality', rarity: 'common' },
  { id: 'chakra-savant', name: 'Chakra Savant', description: 'Reduced chakra costs for techniques.', category: 'chakra', rarity: 'rare' },
  { id: 'iron-will', name: 'Iron Will', description: 'Higher resistance to fear and stun effects.', category: 'personality', rarity: 'uncommon' },
  { id: 'fragile-genius', name: 'Fragile Genius', description: 'Huge technique power, lower durability.', category: 'risk', rarity: 'rare' },
  { id: 'silent-step', name: 'Silent Step', description: 'Improved stealth and reduced detection range.', category: 'combat', rarity: 'uncommon' },
  { id: 'quick-learner', name: 'Quick Learner', description: 'Gains experience faster.', category: 'strategy', rarity: 'common' },
  { id: 'battle-instinct', name: 'Battle Instinct', description: 'Small evasion boost after taking damage.', category: 'combat', rarity: 'common' },
  { id: 'guard-breaker', name: 'Guard Breaker', description: 'Basic attacks chip extra guard.', category: 'combat', rarity: 'uncommon' },
  { id: 'deep-reserves', name: 'Deep Reserves', description: 'Increases maximum chakra pool.', category: 'chakra', rarity: 'common' },
  { id: 'field-medic', name: 'Field Medic', description: 'Support actions restore additional health.', category: 'support', rarity: 'uncommon' },
  { id: 'tactician', name: 'Tactician', description: 'Improved mission planning rewards.', category: 'strategy', rarity: 'uncommon' },
  { id: 'hot-headed', name: 'Hot Headed', description: 'Acts early but suffers reduced defense.', category: 'risk', rarity: 'common' },
  { id: 'unshakable-focus', name: 'Unshakable Focus', description: 'Reduced accuracy loss from status effects.', category: 'personality', rarity: 'rare' },
  { id: 'trap-sense', name: 'Trap Sense', description: 'Higher chance to detect hidden hazards.', category: 'strategy', rarity: 'common' },
  { id: 'weapon-adept', name: 'Weapon Adept', description: 'Increased damage with tools and blades.', category: 'combat', rarity: 'common' },
  { id: 'swift-recovery', name: 'Swift Recovery', description: 'Recovers from injuries between missions faster.', category: 'support', rarity: 'uncommon' },
  { id: 'counter-specialist', name: 'Counter Specialist', description: 'Counterattacks gain bonus precision.', category: 'combat', rarity: 'uncommon' },
];
