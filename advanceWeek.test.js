const assert = require('assert');
const { advanceWeek } = require('./advanceWeek');

const initial = {
  week: 1,
  money: 1000,
  prestige: 4,
  roster: [
    { id: 'n1', name: 'A', stamina: 50, maxStamina: 100, injuryWeeks: 2, level: 1, xp: 3, salary: 100, upkeep: 25 },
  ],
  missions: [{ id: 'missionX', status: 'assigned', reward: 200, prestige: 2 }],
  missionBoard: [],
  recruitmentPool: [],
  leagueTable: [{ villageId: 'player', points: 10, rank: 1 }, { villageId: 'r1', points: 9, rank: 2 }],
  rivals: [{ id: 'r1', name: 'Rival', power: 2, points: 9 }],
};

const result = advanceWeek(initial);

assert.strictEqual(result.nextState.week, 2);
assert.strictEqual(result.ui.activeScreen, 'weekly-report');
assert.ok(Array.isArray(result.weeklyReport.playerMissionResults));
assert.strictEqual(initial.week, 1, 'input state must not mutate');
assert.strictEqual(result.nextState.missionBoard.length, 3);
assert.strictEqual(result.nextState.recruitmentPool.length, 3);

console.log('advanceWeek tests passed');
