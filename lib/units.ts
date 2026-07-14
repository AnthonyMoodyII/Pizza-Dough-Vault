/** Celsius → Fahrenheit (rounded to nearest degree) */
export function cToF(c: number): number {
  return Math.round(c * 9 / 5 + 32);
}

/** Fahrenheit → Celsius */
export function fToC(f: number): number {
  return (f - 32) * 5 / 9;
}

/** Clamp a number to the inclusive range [lo, hi]. */
export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
