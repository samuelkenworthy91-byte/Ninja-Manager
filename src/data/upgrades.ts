export type UpgradeCategory = 'economy' | 'training' | 'defence' | 'medical' | 'intel';

export type VillageUpgrade = {
  id: string;
  name: string;
  category: UpgradeCategory;
  description: string;
  costRyo: number;
  level: 1 | 2 | 3;
};

export const villageUpgrades: VillageUpgrade[] = [
  { id: 'training-yard-i', name: 'Training Yard I', category: 'training', description: 'Basic equipment for daily drills.', costRyo: 600, level: 1 },
  { id: 'training-yard-ii', name: 'Training Yard II', category: 'training', description: 'Advanced dummies and sparring rigs.', costRyo: 1200, level: 2 },
  { id: 'chakra-dojo', name: 'Chakra Control Dojo', category: 'training', description: 'Improves chakra efficiency for trainees.', costRyo: 1500, level: 2 },
  { id: 'watchtower-network', name: 'Watchtower Network', category: 'defence', description: 'Increases early warning range.', costRyo: 900, level: 1 },
  { id: 'perimeter-seals', name: 'Perimeter Seals', category: 'defence', description: 'Hidden seal traps around the village edge.', costRyo: 1800, level: 3 },
  { id: 'field-clinic', name: 'Field Clinic', category: 'medical', description: 'Speeds recovery for injured ninja.', costRyo: 1000, level: 1 },
  { id: 'surgical-wing', name: 'Surgical Wing', category: 'medical', description: 'Enables treatment of severe injuries.', costRyo: 2200, level: 3 },
  { id: 'market-district', name: 'Market District', category: 'economy', description: 'Generates higher passive income.', costRyo: 800, level: 1 },
  { id: 'trade-office', name: 'Trade Office', category: 'economy', description: 'Improves mission payout negotiations.', costRyo: 1400, level: 2 },
  { id: 'cipher-bureau', name: 'Cipher Bureau', category: 'intel', description: 'Unlocks stronger investigation rewards.', costRyo: 1700, level: 2 },
];
