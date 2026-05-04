const TRAINING_PROGRAMMES = {
  taijutsuDrills: {
    name: 'Taijutsu Drills',
    staminaCost: 18,
    moneyCost: 0,
    intensity: 'normal',
    gains: { strength: 4, speed: 2, agility: 2 },
  },
  chakraControl: {
    name: 'Chakra Control',
    staminaCost: 14,
    moneyCost: 40,
    intensity: 'normal',
    gains: { chakra: 5, focus: 2, intelligence: 1 },
  },
  stealthExercises: {
    name: 'Stealth Exercises',
    staminaCost: 16,
    moneyCost: 15,
    intensity: 'normal',
    gains: { stealth: 5, speed: 1, focus: 2 },
  },
  weaponPractice: {
    name: 'Weapon Practice',
    staminaCost: 20,
    moneyCost: 65,
    intensity: 'intense',
    injuryRisk: 0.05,
    gains: { strength: 2, precision: 5, speed: 1 },
  },
  tacticalStudy: {
    name: 'Tactical Study',
    staminaCost: 12,
    moneyCost: 25,
    intensity: 'normal',
    gains: { intelligence: 5, focus: 2, teamwork: 1 },
  },
  enduranceConditioning: {
    name: 'Endurance Conditioning',
    staminaCost: 22,
    moneyCost: 20,
    intensity: 'intense',
    injuryRisk: 0.06,
    gains: { vitality: 5, strength: 1, willpower: 2 },
  },
  medicalPractice: {
    name: 'Medical Practice',
    staminaCost: 15,
    moneyCost: 80,
    intensity: 'normal',
    gains: { medical: 6, chakra: 1, focus: 1 },
  },
  teamworkExercises: {
    name: 'Teamwork Exercises',
    staminaCost: 17,
    moneyCost: 10,
    intensity: 'intense',
    injuryRisk: 0.04,
    gains: { teamwork: 6, communication: 2, speed: 1 },
  },
};

function getTeacherTrainingBonus(teacher = {}, trainingType) {
  const directBonus = teacher.trainingSpecialties?.[trainingType] ?? 0;
  const globalBonus = teacher.globalTrainingBonus ?? 0;
  return directBonus + globalBonus;
}

function getUpgradeTrainingBonus(upgrades = {}, trainingType) {
  const directBonus = upgrades.trainingBonuses?.[trainingType] ?? 0;
  const globalBonus = upgrades.globalTrainingBonus ?? 0;
  return directBonus + globalBonus;
}

function calculateTrainingGain(ninja, trainingType, context = {}) {
  const programme = TRAINING_PROGRAMMES[trainingType];
  if (!programme) throw new Error(`Unknown training type: ${trainingType}`);
  if (ninja.injured) throw new Error(`${ninja.name} is injured and cannot train.`);

  const teacherBonus = getTeacherTrainingBonus(context.teacher, trainingType);
  const upgradeBonus = getUpgradeTrainingBonus(context.upgrades, trainingType);
  const trainingModifier = 1 + (teacherBonus + upgradeBonus) / 100;

  const projectedGains = Object.fromEntries(
    Object.entries(programme.gains).map(([stat, value]) => [stat, Math.max(1, Math.round(value * trainingModifier))])
  );

  return {
    trainingType,
    programmeName: programme.name,
    staminaCost: programme.staminaCost,
    moneyCost: programme.moneyCost,
    injuryRisk: programme.intensity === 'intense' ? (programme.injuryRisk ?? 0.03) : 0,
    projectedGains,
    teacherBonus,
    upgradeBonus,
  };
}

function applyTraining(state, assignments) {
  const report = [];
  assignments.forEach(({ ninjaId, trainingType }) => {
    const ninja = state.ninjas.find((n) => n.id === ninjaId);
    if (!ninja) {
      report.push({ ninjaId, success: false, reason: 'Ninja not found' });
      return;
    }
    if (ninja.injured) {
      report.push({ ninjaId, ninjaName: ninja.name, success: false, reason: 'Injured ninjas cannot train' });
      return;
    }

    const projection = calculateTrainingGain(ninja, trainingType, {
      teacher: state.teacher,
      upgrades: state.villageUpgrades,
    });

    if (ninja.stamina < projection.staminaCost) {
      report.push({ ninjaId, ninjaName: ninja.name, success: false, reason: 'Not enough stamina' });
      return;
    }
    if (state.money < projection.moneyCost) {
      report.push({ ninjaId, ninjaName: ninja.name, success: false, reason: 'Not enough money' });
      return;
    }

    ninja.stamina -= projection.staminaCost;
    state.money -= projection.moneyCost;

    for (const [stat, gain] of Object.entries(projection.projectedGains)) {
      ninja.stats[stat] = (ninja.stats[stat] ?? 0) + gain;
    }

    const injured = Math.random() < projection.injuryRisk;
    ninja.injured = injured;

    report.push({
      ninjaId,
      ninjaName: ninja.name,
      success: true,
      training: projection.programmeName,
      gains: projection.projectedGains,
      staminaSpent: projection.staminaCost,
      moneySpent: projection.moneyCost,
      injuryRisk: projection.injuryRisk,
      injured,
    });
  });

  return { updatedState: state, report };
}

if (typeof module !== 'undefined') {
  module.exports = {
    TRAINING_PROGRAMMES,
    calculateTrainingGain,
    applyTraining,
    getTeacherTrainingBonus,
    getUpgradeTrainingBonus,
  };
}
