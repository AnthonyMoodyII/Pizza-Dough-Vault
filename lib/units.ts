/** Celsius → Fahrenheit (rounded to nearest degree) */
export function cToF(c: number): number {
  return Math.round(c * 9 / 5 + 32);
}

/** Fahrenheit → Celsius */
export function fToC(f: number): number {
  return (f - 32) * 5 / 9;
}
