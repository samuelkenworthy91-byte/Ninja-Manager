import React, { useMemo, useState } from 'react';
import { generateWeeklyRecruitmentPool } from '../generators/ninjaGenerator';
import { NinjaRecruit } from '../types/ninja';

const statEntries = (stats: NinjaRecruit['stats']) => Object.entries(stats).sort((a, b) => b[1] - a[1]);

export const RecruitmentScreen: React.FC = () => {
  const [seed, setSeed] = useState<number>(Date.now());

  const recruits = useMemo(() => generateWeeklyRecruitmentPool(seed, 10), [seed]);

  const regenerate = () => setSeed(Date.now() + Math.floor(Math.random() * 9999));

  return (
    <section style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Weekly Recruitment Pool</h2>
        <button onClick={regenerate}>Regenerate Pool</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {recruits.map((ninja) => {
          const topThree = statEntries(ninja.stats).slice(0, 3);

          return (
            <article key={ninja.id} style={{ border: '1px solid #ddd', borderRadius: 10, padding: 12, background: '#fff' }}>
              <h3 style={{ margin: '0 0 6px' }}>{ninja.firstName} {ninja.surname}</h3>
              <div>Age: {ninja.age}</div>
              <div>School: {ninja.schoolOfOrigin}</div>
              <div>Overall: {ninja.overallRating}</div>
              <div>Potential: {ninja.potentialBand} ({ninja.potentialRating})</div>
              <div style={{ marginTop: 8 }}>
                <strong>Top Stats:</strong>
                <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                  {topThree.map(([key, value]) => (
                    <li key={key}>{key}: {value}</li>
                  ))}
                </ul>
              </div>
              <div>Traits: {ninja.traits.join(', ')}</div>
              <div>Cost: {ninja.recruitmentCost.toLocaleString()} ryo</div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default RecruitmentScreen;
