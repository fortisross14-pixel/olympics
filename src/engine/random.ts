// Pure random helpers. Wrapped in a module so we can later swap to a
// seeded RNG (for reproducible cycles / deterministic tests) without
// touching consumer code.

export function pickRandom<T>(arr: readonly T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

export function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function round1(v: number): number {
  return Math.round(v * 10) / 10;
}
