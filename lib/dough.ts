import { YeastType, convertYeast, estimateIdyPercent } from './yeast';

export type FlourPart = { id: string; name: string; percentage: number };

export type PrefermentType = 'none' | 'poolish' | 'biga';

export type PrefermentInput = {
  type: PrefermentType;
  /** % of total flour going into the preferment (e.g. 30 means 30% of flour). */
  flourPercent: number;
  /** Hydration of the preferment itself (poolish=100, biga≈45). */
  hydration: number;
  /** Fermentation hours at temperature. */
  hours: number;
  temperatureC: number;
  /** Optional override of the preferment yeast %. If undefined, auto-estimated. */
  yeastPercentOverride?: number;
};

export type AdditionalIngredient = {
  id: string;
  name: string;
  /** % of total flour (baker's). */
  percentage: number;
};

export type DoughInput = {
  doughBalls: number;
  ballWeight: number;
  hydration: number;
  saltPercent: number;
  oilPercent: number;
  sugarPercent: number;
  yeastType: YeastType;
  /** Optional override; if undefined, computed from fermentation time + temp. */
  yeastPercentOverride?: number;
  /** Total fermentation hours used to auto-estimate yeast %. */
  fermentationHours: number;
  fermentationTempC: number;
  flours: FlourPart[];
  preferment: PrefermentInput;
  additional: AdditionalIngredient[];
};

export type CalculatedRow = {
  flour: number;
  water: number;
  salt: number;
  yeast: number;
  oil: number;
  sugar: number;
  additional: { id: string; name: string; grams: number }[];
  total: number;
};

export type DoughOutput = {
  targetTotal: number;
  total: CalculatedRow;
  preferment: CalculatedRow | null;
  finalDough: CalculatedRow;
  flourBreakdown: { id: string; name: string; grams: number }[];
  /** % of flour values actually used (after auto-estimation / overrides). */
  effective: {
    hydration: number;
    saltPercent: number;
    oilPercent: number;
    sugarPercent: number;
    yeastPercent: number;
    prefermentYeastPercent: number;
  };
};

/**
 * Solve for total flour given that every ingredient is a % of flour.
 *
 *   total = flour * (1 + h + s + o + y + Σ additional)
 *
 * so flour = total / (1 + sum_of_percents).
 */
export function calculate(input: DoughInput): DoughOutput {
  const targetTotal = input.doughBalls * input.ballWeight;

  const idy = input.yeastPercentOverride !== undefined
    ? input.yeastPercentOverride
    : convertYeast(
        estimateIdyPercent(input.fermentationHours, input.fermentationTempC),
        input.yeastType,
      );

  const h = input.hydration / 100;
  const s = input.saltPercent / 100;
  const o = input.oilPercent / 100;
  const sg = input.sugarPercent / 100;
  const y = idy / 100;
  const addSum = input.additional.reduce((acc, a) => acc + a.percentage / 100, 0);

  const denom = 1 + h + s + o + sg + y + addSum;
  const totalFlour = targetTotal / denom;

  const totalWater = totalFlour * h;
  const totalSalt = totalFlour * s;
  const totalOil = totalFlour * o;
  const totalSugar = totalFlour * sg;
  const totalYeast = totalFlour * y;
  const totalAdditional = input.additional.map((a) => ({
    id: a.id,
    name: a.name,
    grams: totalFlour * (a.percentage / 100),
  }));

  const total: CalculatedRow = {
    flour: totalFlour,
    water: totalWater,
    salt: totalSalt,
    yeast: totalYeast,
    oil: totalOil,
    sugar: totalSugar,
    additional: totalAdditional,
    total: targetTotal,
  };

  // Preferment splits flour, water, and yeast off the top.
  let preferment: CalculatedRow | null = null;
  let pYeastPercent = 0;
  if (input.preferment.type !== 'none' && input.preferment.flourPercent > 0) {
    const pFlour = totalFlour * (input.preferment.flourPercent / 100);
    const pWater = pFlour * (input.preferment.hydration / 100);
    const idyForPreferment = input.preferment.yeastPercentOverride !== undefined
      ? input.preferment.yeastPercentOverride
      : convertYeast(
          estimateIdyPercent(input.preferment.hours, input.preferment.temperatureC),
          input.yeastType,
        );
    pYeastPercent = idyForPreferment;
    const pYeast = pFlour * (idyForPreferment / 100);

    preferment = {
      flour: pFlour,
      water: pWater,
      salt: 0,
      yeast: pYeast,
      oil: 0,
      sugar: 0,
      additional: [],
      total: pFlour + pWater + pYeast,
    };
  }

  // Final dough = total minus preferment.
  const finalDough: CalculatedRow = {
    flour: totalFlour - (preferment?.flour ?? 0),
    water: totalWater - (preferment?.water ?? 0),
    salt: totalSalt,
    yeast: Math.max(0, totalYeast - (preferment?.yeast ?? 0)),
    oil: totalOil,
    sugar: totalSugar,
    additional: totalAdditional,
    total: targetTotal - (preferment?.total ?? 0),
  };

  // Flour breakdown — apply blend ratios to the *main* flour (not preferment),
  // since preferments traditionally use a neutral 00 / bread flour separately.
  const flourBreakdown = input.flours.map((f) => ({
    id: f.id,
    name: f.name,
    grams: finalDough.flour * (f.percentage / 100),
  }));

  return {
    targetTotal,
    total,
    preferment,
    finalDough,
    flourBreakdown,
    effective: {
      hydration: input.hydration,
      saltPercent: input.saltPercent,
      oilPercent: input.oilPercent,
      sugarPercent: input.sugarPercent,
      yeastPercent: idy,
      prefermentYeastPercent: pYeastPercent,
    },
  };
}
