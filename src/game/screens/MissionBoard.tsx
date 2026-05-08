import React, { useMemo } from 'react';
import { generateWeeklyMissionBoard, Mission } from '../generators/missionGenerator';

type MissionBoardProps = {
  currentWeek: number;
};

function MissionCard({ mission }: { mission: Mission }) {
  return (
    <article className="mission-card" data-rank={mission.rank}>
      <header className="mission-card__header">
        <h3>{mission.title}</h3>
        <div>
          <span>Rank: {mission.rank}</span> | <span>Type: {mission.missionType}</span>
        </div>
      </header>

      <p>{mission.description}</p>

      <ul>
        <li>
          <strong>Required skills:</strong> {mission.requiredSkills.join(', ')}
        </li>
        <li>
          <strong>Recommended squad size:</strong> {mission.recommendedSquadSize}
        </li>
        <li>
          <strong>Rewards:</strong> ¥{mission.rewards.money} / Prestige {mission.rewards.prestige} / XP {mission.rewards.xp}
        </li>
        <li>
          <strong>Danger level:</strong> {mission.dangerLevel}/10
        </li>
      </ul>
    </article>
  );
}

export default function MissionBoard({ currentWeek }: MissionBoardProps) {
  const missions = useMemo(() => generateWeeklyMissionBoard(currentWeek), [currentWeek]);

  return (
    <section>
      <h2>Weekly Mission Board - Week {currentWeek}</h2>
      <div className="mission-board-grid">
        {missions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>
    </section>
  );
}
