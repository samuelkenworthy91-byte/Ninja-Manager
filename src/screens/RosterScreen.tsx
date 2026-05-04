import React from 'react';
import { getRosterCardData } from '../game/ninjaCalculations';
import { Ninja } from '../game/types';

type RosterScreenProps = {
  roster: Ninja[];
};

export function RosterScreen({ roster }: RosterScreenProps) {
  return (
    <section>
      <h1>Village Roster</h1>
      {roster.length === 0 ? <p>No recruited ninjas yet.</p> : null}
      {roster.map((ninja) => {
        const data = getRosterCardData(ninja);
        return (
          <article key={ninja.id}>
            <h2>{data.name}</h2>
            <p>{data.rank} · Lv {data.level} · Age {data.age}</p>
            <p>School: {data.school}</p>
            <p>Overall: {data.overallRating} · Potential: {data.potential}</p>
            <p>Stamina: {data.stamina} · Morale: {data.morale}</p>
            <p>Injury Status: {data.injured ? 'Injured' : 'Healthy'}</p>
            <p>
              Top Stats: {data.topStats.map((entry) => `${entry.stat} (${entry.value})`).join(', ')}
            </p>
            <p>Traits: {data.traits.join(', ') || 'None'}</p>
          </article>
        );
      })}
    </section>
  );
}
