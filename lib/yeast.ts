import { clamp } from './units';

export type YeastType = 'idy' | 'ady' | 'fresh';

/**
 * Conversion factors relative to Instant Dry Yeast (IDY).
 * Fresh ≈ 3× IDY; ADY ≈ 1.25× IDY.
 */
export const YEAST_FACTOR: Record<YeastType, number> = {
  idy: 1,
  ady: 1.25,
  fresh: 3,
};

/**
 * Estimate IDY percentage of flour for a target fermentation time and temperature.
 *
 * Empirical model fitted to common reference values (PizzaBlab, Forkish, Reinhart):
 *   IDY% = K / (hours * exp(B * (T_c - T_ref)))
 *
 * Calibrated against:
 *   22°C / 8h  → ~0.28%
 *   22°C / 24h → ~0.09%
 *   4°C  / 48h → ~0.14%
 *   20°C / 4h  → ~0.63%
 */
export function estimateIdyPercent(hours: number, temperatureC: number): number {
  if (hours <= 0) return 0;
  const K = 2.5;
  const B = 0.06;
  const tRef = 20;
  const pct = K / (hours * Math.exp(B * (temperatureC - tRef)));
  return clampLocal(pct, 0.01, 5);
}

/**
 * Convert IDY % to the chosen yeast type's %.
 */
export function convertYeast(idyPercent: number, type: YeastType): number {
  return idyPercent * YEAST_FACTOR[type];
}

/**
 * Inverse: given a yeast % and type, return equivalent IDY %.
 */
export function toIdyPercent(percent: number, type: YeastType): number {
  return percent / YEAST_FACTOR[type];
}

function clampLocal(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
