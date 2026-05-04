/**
 * Deterministic, side-effect-free week advancement pipeline.
 */

/** @typedef {{id:string,status:'assigned'|'success'|'failed',reward?:number,prestige?:number,injuryDays?:number,xp?:number,rivalImpact?:number}} Mission */

/** @typedef {{id:string,name:string,stamina:number,maxStamina:number,injuryWeeks:number,level:number,xp:number,salary:number,upkeep:number}} Ninja */

/** @typedef {{week:number,money:number,prestige:number,roster:Ninja[],missions:Mission[],missionBoard:Mission[],recruitmentPool:any[],leagueTable:Array<{villageId:string,points:number,rank:number}>,rivals:Array<{id:string,name:string,power:number,points:number}>}} GameState */

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

function resolveAssignedMissions(state, report) {
  const resolved = [];
  for (const mission of state.missions) {
    if (mission.status !== 'assigned') {
      resolved.push(mission);
      continue;
    }

    const succeeded = (state.week + mission.id.length) % 2 === 0;
    const result = {
      ...mission,
      status: succeeded ? 'success' : 'failed',
    };
    resolved.push(result);

    report.playerMissionResults.push({
      missionId: mission.id,
      status: result.status,
      moneyDelta: succeeded ? mission.reward ?? 0 : 0,
      prestigeDelta: succeeded ? mission.prestige ?? 0 : -1,
    });

    if (succeeded) {
      state.money += mission.reward ?? 0;
      state.prestige += mission.prestige ?? 0;
    } else {
      state.prestige -= 1;
    }
  }

  state.missions = resolved;
}

function simulateRivals(state, report) {
  for (const rival of state.rivals) {
    const pointsGained = (state.week + rival.power) % 4;
    rival.points += pointsGained;
    report.rivalVillageResults.push({ rivalId: rival.id, pointsGained });
  }
}

function updateLeagueTable(state, report) {
  const previousRanks = new Map(state.leagueTable.map((row) => [row.villageId, row.rank]));
  const sorted = [...state.leagueTable].sort((a, b) => b.points - a.points);
  state.leagueTable = sorted.map((row, index) => ({ ...row, rank: index + 1 }));

  report.leagueTableMovement = state.leagueTable.map((row) => ({
    villageId: row.villageId,
    from: previousRanks.get(row.villageId) ?? row.rank,
    to: row.rank,
  }));
}

function paySalariesAndUpkeep(state, report) {
  const totalSalary = state.roster.reduce((sum, ninja) => sum + ninja.salary, 0);
  const totalUpkeep = state.roster.reduce((sum, ninja) => sum + ninja.upkeep, 0);
  const total = totalSalary + totalUpkeep;
  state.money -= total;
  report.moneyChanges.push({ label: 'Salaries', delta: -totalSalary });
  report.moneyChanges.push({ label: 'Upkeep', delta: -totalUpkeep });
}

function applyPassiveIncomeOrCosts(state, report) {
  const passive = Math.floor(state.prestige / 3) - Math.max(0, 5 - state.roster.length);
  state.money += passive;
  report.moneyChanges.push({ label: 'Passive', delta: passive });
}

function recoverStamina(state, report) {
  for (const ninja of state.roster) {
    const before = ninja.stamina;
    ninja.stamina = clamp(ninja.stamina + 15, 0, ninja.maxStamina);
    if (before !== ninja.stamina) {
      report.recoveries.push({ ninjaId: ninja.id, before, after: ninja.stamina });
    }
  }
}

function reduceInjuryTimers(state, report) {
  for (const ninja of state.roster) {
    if (ninja.injuryWeeks > 0) {
      const before = ninja.injuryWeeks;
      ninja.injuryWeeks -= 1;
      report.injuries.push({ ninjaId: ninja.id, before, after: ninja.injuryWeeks });
    }
  }
}

function applyLevelUps(state, report) {
  for (const ninja of state.roster) {
    const gained = state.missions.filter((m) => m.status === 'success').length;
    ninja.xp += gained;
    while (ninja.xp >= ninja.level * 5) {
      ninja.xp -= ninja.level * 5;
      ninja.level += 1;
      report.levelUps.push({ ninjaId: ninja.id, newLevel: ninja.level });
    }
  }
}

function generateRecruitmentPool(state, report) {
  state.recruitmentPool = [
    { id: `r-${state.week + 1}-1`, tier: 'genin' },
    { id: `r-${state.week + 1}-2`, tier: 'chunin' },
    { id: `r-${state.week + 1}-3`, tier: 'genin' },
  ];
  report.newOpportunities.push({ type: 'recruits', count: state.recruitmentPool.length });
}

function generateMissionBoard(state, report) {
  state.missionBoard = [
    { id: `m-${state.week + 1}-a`, status: 'assigned', reward: 200, prestige: 1 },
    { id: `m-${state.week + 1}-b`, status: 'assigned', reward: 350, prestige: 2 },
    { id: `m-${state.week + 1}-c`, status: 'assigned', reward: 150, prestige: 1 },
  ];
  report.newOpportunities.push({ type: 'missions', count: state.missionBoard.length });
}

function createWeeklySummaryReport(stateBefore, stateAfter, report) {
  return {
    weekAdvancedTo: stateAfter.week,
    playerMissionResults: report.playerMissionResults,
    moneyChanges: report.moneyChanges,
    prestigeChanges: [{ from: stateBefore.prestige, to: stateAfter.prestige, delta: stateAfter.prestige - stateBefore.prestige }],
    injuries: report.injuries,
    levelUps: report.levelUps,
    rivalVillageResults: report.rivalVillageResults,
    leagueTableMovement: report.leagueTableMovement,
    newOpportunities: report.newOpportunities,
    recoveries: report.recoveries,
  };
}

function createEmptyReport() {
  return {
    playerMissionResults: [],
    moneyChanges: [],
    injuries: [],
    levelUps: [],
    rivalVillageResults: [],
    leagueTableMovement: [],
    newOpportunities: [],
    recoveries: [],
  };
}

/**
 * Advances one week by applying deterministic steps in strict order.
 * Returns nextState and report payload for a weekly report screen.
 * @param {GameState} currentState
 */
function advanceWeek(currentState) {
  const state = deepClone(currentState);
  const before = deepClone(currentState);
  const reportWork = createEmptyReport();

  resolveAssignedMissions(state, reportWork);
  simulateRivals(state, reportWork);
  updateLeagueTable(state, reportWork);
  paySalariesAndUpkeep(state, reportWork);
  applyPassiveIncomeOrCosts(state, reportWork);
  recoverStamina(state, reportWork);
  reduceInjuryTimers(state, reportWork);
  applyLevelUps(state, reportWork);
  generateRecruitmentPool(state, reportWork);
  generateMissionBoard(state, reportWork);
  state.week += 1;

  const weeklyReport = createWeeklySummaryReport(before, state, reportWork);
  return {
    nextState: state,
    weeklyReport,
    ui: {
      activeScreen: 'weekly-report',
      modalOpen: true,
    },
  };
}

module.exports = { advanceWeek };
