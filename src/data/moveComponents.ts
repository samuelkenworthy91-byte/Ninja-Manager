export type MoveRangeShape = 'self' | 'line' | 'cone' | 'single-target' | 'area';

export type MoveComponent = {
  id: string;
  name: string;
  kind: 'delivery' | 'effect' | 'scaling' | 'cost' | 'status';
  description: string;
  tags: string[];
};

export type StarterMoveLibrary = {
  rangeShapes: MoveRangeShape[];
  components: MoveComponent[];
};

export const starterMoveComponents: StarterMoveLibrary = {
  rangeShapes: ['self', 'line', 'cone', 'single-target', 'area'],
  components: [
    { id: 'delivery-melee-strike', name: 'Melee Strike', kind: 'delivery', description: 'Adjacent physical hit delivery.', tags: ['taijutsu'] },
    { id: 'delivery-thrown-kunai', name: 'Thrown Kunai', kind: 'delivery', description: 'Mid-range piercing tool attack.', tags: ['weapons'] },
    { id: 'delivery-chakra-wave', name: 'Chakra Wave', kind: 'delivery', description: 'Ranged chakra burst delivery.', tags: ['ninjutsu'] },
    { id: 'effect-direct-damage', name: 'Direct Damage', kind: 'effect', description: 'Applies immediate HP damage.', tags: ['damage'] },
    { id: 'effect-guard-damage', name: 'Guard Damage', kind: 'effect', description: 'Applies extra guard break pressure.', tags: ['damage', 'guard'] },
    { id: 'effect-heal', name: 'Heal', kind: 'effect', description: 'Restores HP to ally targets.', tags: ['support', 'medical'] },
    { id: 'status-bleed', name: 'Bleed', kind: 'status', description: 'Deals damage over time.', tags: ['status'] },
    { id: 'status-stun', name: 'Stun', kind: 'status', description: 'Chance to skip target action.', tags: ['status', 'control'] },
    { id: 'cost-low-chakra', name: 'Low Chakra Cost', kind: 'cost', description: 'Move uses minimal chakra.', tags: ['resource'] },
    { id: 'scaling-speed', name: 'Speed Scaling', kind: 'scaling', description: 'Effectiveness scales with speed stat.', tags: ['scaling'] },
    { id: 'scaling-chakra', name: 'Chakra Scaling', kind: 'scaling', description: 'Effectiveness scales with chakra stat.', tags: ['scaling'] },
  ],
};
