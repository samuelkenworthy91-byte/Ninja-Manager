import { Ninja, NinjaStats } from './types';

export const getOverallRating = (stats: NinjaStats): number => {
  const values = Object.values(stats);
  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.round(total / values.length);
};

export const getTopStats = (stats: NinjaStats, limit = 3): Array<{ stat: keyof NinjaStats; value: number }> => {
  return (Object.entries(stats) as Array<[keyof NinjaStats, number]>)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([stat, value]) => ({ stat, value }));
};

export const getRosterCardData = (ninja: Ninja) => ({
  ...ninja,
  overallRating: getOverallRating(ninja.stats),
  topStats: getTopStats(ninja.stats)
});
