import { RecruitableNinja, VillageState } from './types';

export type RecruitResult =
  | { ok: true; state: VillageState }
  | { ok: false; reason: 'not-found' | 'insufficient-funds' | 'already-recruited' };

export const canAffordRecruit = (money: number, recruit: RecruitableNinja): boolean => money >= recruit.recruitmentCost;

const hasNinjaInRoster = (state: VillageState, ninjaId: string): boolean => state.roster.some((ninja) => ninja.id === ninjaId);

export const recruitNinja = (state: VillageState, ninjaId: string): RecruitResult => {
  const recruit = state.recruitmentPool.find((candidate) => candidate.id === ninjaId);

  if (!recruit) {
    return { ok: false, reason: 'not-found' };
  }

  if (hasNinjaInRoster(state, ninjaId)) {
    return { ok: false, reason: 'already-recruited' };
  }

  if (!canAffordRecruit(state.money, recruit)) {
    return { ok: false, reason: 'insufficient-funds' };
  }

  return {
    ok: true,
    state: {
      ...state,
      money: state.money - recruit.recruitmentCost,
      roster: [...state.roster, recruit],
      recruitmentPool: state.recruitmentPool.filter((candidate) => candidate.id !== ninjaId)
    }
  };
};
