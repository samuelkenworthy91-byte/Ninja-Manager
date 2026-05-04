/**
 * Deterministic seeded random utilities.
 * Use createSeededRandom(seed) to get stable results for the same seed.
 */

export type SeededRng = () => number;

/**
 * Converts a string into a deterministic 32-bit seed.
 */
function stringToSeed(value: string): number {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

/**
 * Creates a deterministic random number generator.
 *
 * Example:
 * const rng = createSeededRandom("ninja-001");
 * const n = rng(); // 0 <= n < 1, same value order every run for the same seed
 */
export function createSeededRandom(seed: string | number): SeededRng {
  let state =
    typeof seed === "number"
      ? (seed >>> 0) || 0x6d2b79f5
      : stringToSeed(seed) || 0x6d2b79f5;

  // Mulberry32 PRNG: fast and deterministic for simulation/content generation.
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Clamp a number to an inclusive [min, max] range.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Returns a random integer from min to max (inclusive).
 */
export function randomInt(rng: SeededRng, min: number, max: number): number {
  const low = Math.ceil(Math.min(min, max));
  const high = Math.floor(Math.max(min, max));
  return Math.floor(rng() * (high - low + 1)) + low;
}

/**
 * Returns a random float from min to max (exclusive max).
 */
export function randomFloat(rng: SeededRng, min = 0, max = 1): number {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return rng() * (high - low) + low;
}

/**
 * Picks one item from a non-empty array.
 */
export function pickOne<T>(rng: SeededRng, items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error("pickOne requires a non-empty array.");
  }

  return items[randomInt(rng, 0, items.length - 1)];
}

/**
 * Weighted random pick.
 *
 * Example:
 * weightedPick(rng, [
 *   { value: "genin", weight: 70 },
 *   { value: "chunin", weight: 25 },
 *   { value: "jonin", weight: 5 },
 * ]);
 */
export function weightedPick<T>(
  rng: SeededRng,
  entries: readonly { value: T; weight: number }[]
): T {
  if (entries.length === 0) {
    throw new Error("weightedPick requires a non-empty entries array.");
  }

  let totalWeight = 0;
  for (const entry of entries) {
    if (entry.weight > 0) {
      totalWeight += entry.weight;
    }
  }

  if (totalWeight <= 0) {
    throw new Error("weightedPick requires at least one positive weight.");
  }

  let roll = randomFloat(rng, 0, totalWeight);

  for (const entry of entries) {
    if (entry.weight <= 0) {
      continue;
    }

    roll -= entry.weight;
    if (roll < 0) {
      return entry.value;
    }
  }

  // Fallback for floating-point edge cases.
  return entries[entries.length - 1].value;
}

/**
 * Returns a new shuffled copy of the array (does not mutate input).
 */
export function shuffle<T>(rng: SeededRng, items: readonly T[]): T[] {
  const result = [...items];

  // Fisher-Yates shuffle.
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = randomInt(rng, 0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/**
 * Returns true with the provided probability from 0 to 1.
 */
export function chance(rng: SeededRng, probability: number): boolean {
  return rng() < clamp(probability, 0, 1);
}
