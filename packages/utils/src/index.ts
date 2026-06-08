/** Small, dependency-free helpers shared across the app. */

/** Clamp a number into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Format milliliters: 450 -> "450 ml". */
export function formatMl(ml: number): string {
  return `${Math.round(ml)} ml`;
}

/** Format seconds as m:ss. */
export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Capitalize the first letter. */
export function capitalize(value: string): string {
  return value.length ? value[0]!.toUpperCase() + value.slice(1) : value;
}

/** Sleep helper for simulating async work. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
