export type MissionType =
  | 'escort'
  | 'infiltration'
  | 'bounty'
  | 'patrol'
  | 'rescue'
  | 'investigation'
  | 'defence'
  | 'assassination'
  | 'tournament'
  | 'resource run';

export type MissionTemplate = {
  id: string;
  name: string;
  type: MissionType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  description: string;
  baseRewardRyo: number;
  risk: number;
};

export const missionTemplates: MissionTemplate[] = [
  { id: 'escort-merchant-road', name: 'Merchant Road Escort', type: 'escort', difficulty: 1, description: 'Protect a merchant caravan through bandit territory.', baseRewardRyo: 300, risk: 0.2 },
  { id: 'escort-envoy-night', name: 'Night Envoy Escort', type: 'escort', difficulty: 2, description: 'Guard a diplomatic envoy during a night transit.', baseRewardRyo: 450, risk: 0.3 },
  { id: 'infiltration-border-post', name: 'Border Post Infiltration', type: 'infiltration', difficulty: 2, description: 'Enter an enemy post and retrieve coded orders.', baseRewardRyo: 500, risk: 0.45 },
  { id: 'infiltration-archive', name: 'Silent Archive Entry', type: 'infiltration', difficulty: 3, description: 'Extract records from a guarded archive unseen.', baseRewardRyo: 700, risk: 0.55 },
  { id: 'bounty-missing-nin', name: 'Missing-Nin Bounty', type: 'bounty', difficulty: 3, description: 'Track and capture a rogue shinobi alive.', baseRewardRyo: 900, risk: 0.6 },
  { id: 'bounty-bandit-chief', name: 'Bandit Chief Bounty', type: 'bounty', difficulty: 2, description: 'Defeat the leader of a mountain raider clan.', baseRewardRyo: 650, risk: 0.5 },
  { id: 'patrol-forest-route', name: 'Forest Route Patrol', type: 'patrol', difficulty: 1, description: 'Survey trade routes and deter small threats.', baseRewardRyo: 250, risk: 0.15 },
  { id: 'patrol-border-tension', name: 'Tense Border Patrol', type: 'patrol', difficulty: 2, description: 'Maintain peace in a contested border area.', baseRewardRyo: 420, risk: 0.35 },
  { id: 'rescue-lost-scouts', name: 'Lost Scout Rescue', type: 'rescue', difficulty: 2, description: 'Locate and evacuate scouts trapped behind lines.', baseRewardRyo: 550, risk: 0.4 },
  { id: 'rescue-hostage-camp', name: 'Hostage Camp Rescue', type: 'rescue', difficulty: 4, description: 'Free hostages from a fortified encampment.', baseRewardRyo: 1200, risk: 0.7 },
  { id: 'investigation-poison-source', name: 'Poison Source Investigation', type: 'investigation', difficulty: 2, description: 'Identify the source of tainted village supplies.', baseRewardRyo: 480, risk: 0.3 },
  { id: 'investigation-shrine-omens', name: 'Shrine Omens Investigation', type: 'investigation', difficulty: 3, description: 'Uncover who is staging supernatural incidents.', baseRewardRyo: 760, risk: 0.5 },
  { id: 'defence-gate-hold', name: 'Gate Hold Defence', type: 'defence', difficulty: 3, description: 'Hold the eastern gate against repeated assaults.', baseRewardRyo: 800, risk: 0.55 },
  { id: 'defence-river-fort', name: 'River Fort Defence', type: 'defence', difficulty: 4, description: 'Protect the river fort until reinforcements arrive.', baseRewardRyo: 1150, risk: 0.65 },
  { id: 'assassination-warlord-advisor', name: 'Warlord Advisor Assassination', type: 'assassination', difficulty: 4, description: 'Eliminate a strategist destabilizing the region.', baseRewardRyo: 1300, risk: 0.75 },
  { id: 'assassination-shadow-fixer', name: 'Shadow Fixer Elimination', type: 'assassination', difficulty: 5, description: 'Remove an underground broker under heavy guard.', baseRewardRyo: 1600, risk: 0.85 },
  { id: 'tournament-spring-bracket', name: 'Spring Bracket Tournament', type: 'tournament', difficulty: 2, description: 'Compete in a formal village tournament bracket.', baseRewardRyo: 520, risk: 0.25 },
  { id: 'tournament-championship', name: 'Regional Championship', type: 'tournament', difficulty: 4, description: 'Face elite teams in a high-profile championship.', baseRewardRyo: 1400, risk: 0.6 },
  { id: 'resource-run-herb-expedition', name: 'Medic Herb Resource Run', type: 'resource run', difficulty: 1, description: 'Gather rare medicinal herbs in nearby wilds.', baseRewardRyo: 280, risk: 0.2 },
  { id: 'resource-run-iron-caravan', name: 'Iron Caravan Resource Run', type: 'resource run', difficulty: 3, description: 'Secure a shipment of weapon-grade iron ore.', baseRewardRyo: 740, risk: 0.5 },
];
