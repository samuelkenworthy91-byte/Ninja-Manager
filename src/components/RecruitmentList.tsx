import React from 'react';
import { canAffordRecruit } from '../game/recruitmentLogic';
import { RecruitableNinja } from '../game/types';
import { getOverallRating } from '../game/ninjaCalculations';

type RecruitmentListProps = {
  money: number;
  pool: RecruitableNinja[];
  onRecruit: (ninjaId: string) => void;
};

export function RecruitmentList({ money, pool, onRecruit }: RecruitmentListProps) {
  return (
    <div>
      <h2>Weekly Recruitment Pool</h2>
      {pool.length === 0 ? <p>No recruits available this week.</p> : null}
      <ul>
        {pool.map((recruit) => {
          const affordable = canAffordRecruit(money, recruit);
          return (
            <li key={recruit.id}>
              <strong>{recruit.name}</strong> ({recruit.rank}) - Cost: {recruit.recruitmentCost}
              <div>Level {recruit.level} · {recruit.school} · OVR {getOverallRating(recruit.stats)}</div>
              <button type="button" onClick={() => onRecruit(recruit.id)} disabled={!affordable}>
                Recruit
              </button>
              {!affordable ? <span role="alert"> Not enough money</span> : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
