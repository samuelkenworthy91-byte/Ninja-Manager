export interface SeededRandom {
  seed: number;
  next: () => number;
  int: (min: number, max: number) => number;
  pick: <T>(items: readonly T[]) => T;
}

export const createSeededRandom = (seed: number): SeededRandom => {
  let state = seed >>> 0;

  const next = (): number => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };

  const int = (min: number, max: number): number => {
    const low = Math.ceil(min);
    const high = Math.floor(max);
    return Math.floor(next() * (high - low + 1)) + low;
  };

  const pick = <T>(items: readonly T[]): T => {
    return items[int(0, items.length - 1)];
  };

  return { seed, next, int, pick };
};
