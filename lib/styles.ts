export type StyleId = 'neapolitan' | 'newyork' | 'roma' | 'newhaven' | 'chicagothin';
export type EditionId =
  | 'neapolitan-home'
  | 'neapolitan-classic'
  | 'newyork-classic'
  | 'newyork-thin'
  | 'roma-teglia'
  | 'roma-tonda'
  | 'newhaven-classic'
  | 'chicagothin-tavern';

export type Edition = {
  id: EditionId;
  styleId: StyleId;
  label: string;
  diameterIn: [number, number];
  ballWeightRange: [number, number];
  ballWeightDefault: number;
  hydrationRange: [number, number];
  hydrationDefault: number;
  saltDefault: number;
  oilDefault: number;
  sugarDefault: number;
  /** Recommended total fermentation hours (lower, upper, default). */
  fermentation: { min: number; max: number; default: number };
  /** Whether style normally uses a cold-ferment phase. */
  coldFermentDefault: boolean;
  description: string;
  recommendation: string;
};

export type Style = {
  id: StyleId;
  label: string;
  editions: Edition[];
};

export const STYLES: Style[] = [
  {
    id: 'neapolitan',
    label: 'Neapolitan',
    editions: [
      {
        id: 'neapolitan-home',
        styleId: 'neapolitan',
        label: 'Home Edition',
        diameterIn: [11, 12],
        ballWeightRange: [180, 280],
        ballWeightDefault: 250,
        hydrationRange: [60, 70],
        hydrationDefault: 65,
        saltDefault: 2.8,
        oilDefault: 0,
        sugarDefault: 0,
        fermentation: { min: 8, max: 24, default: 12 },
        coldFermentDefault: false,
        description: 'More dough for better stability & Napoli-feeling at home.',
        recommendation: '12–24 h fermentation',
      },
      {
        id: 'neapolitan-classic',
        styleId: 'neapolitan',
        label: 'Classic AVPN',
        diameterIn: [11, 13],
        ballWeightRange: [200, 280],
        ballWeightDefault: 250,
        hydrationRange: [58, 65],
        hydrationDefault: 60,
        saltDefault: 3.0,
        oilDefault: 0,
        sugarDefault: 0,
        fermentation: { min: 8, max: 24, default: 24 },
        coldFermentDefault: false,
        description: 'Traditional Napoli style for high-temperature ovens (430–480 °C).',
        recommendation: '8–24 h room-temperature bulk',
      },
    ],
  },
  {
    id: 'newyork',
    label: 'New York',
    editions: [
      {
        id: 'newyork-classic',
        styleId: 'newyork',
        label: 'Classic Slice',
        diameterIn: [12, 14],
        ballWeightRange: [250, 350],
        ballWeightDefault: 300,
        hydrationRange: [60, 65],
        hydrationDefault: 62,
        saltDefault: 2.0,
        oilDefault: 2.0,
        sugarDefault: 1.0,
        fermentation: { min: 24, max: 72, default: 48 },
        coldFermentDefault: true,
        description: 'Foldable slice with light chew, baked 270–300 °C on steel/stone.',
        recommendation: '24–72 h cold ferment for flavour',
      },
      {
        id: 'newyork-thin',
        styleId: 'newyork',
        label: 'Thin & Crispy',
        diameterIn: [12, 14],
        ballWeightRange: [200, 300],
        ballWeightDefault: 250,
        hydrationRange: [55, 60],
        hydrationDefault: 58,
        saltDefault: 2.0,
        oilDefault: 3.0,
        sugarDefault: 1.0,
        fermentation: { min: 24, max: 72, default: 48 },
        coldFermentDefault: true,
        description: 'Lower hydration + extra oil for a crackery base.',
        recommendation: '24–72 h cold ferment',
      },
    ],
  },
  {
    id: 'roma',
    label: 'Roma',
    editions: [
      {
        id: 'roma-teglia',
        styleId: 'roma',
        label: 'Teglia (Pan)',
        diameterIn: [12, 14],
        ballWeightRange: [220, 320],
        ballWeightDefault: 260,
        hydrationRange: [75, 85],
        hydrationDefault: 80,
        saltDefault: 2.5,
        oilDefault: 3.0,
        sugarDefault: 0,
        fermentation: { min: 24, max: 72, default: 48 },
        coldFermentDefault: true,
        description: 'High-hydration rectangular pan pizza. Open crumb, crisp base.',
        recommendation: '24–72 h cold ferment, then 2 h room proof',
      },
      {
        id: 'roma-tonda',
        styleId: 'roma',
        label: 'Tonda (Thin Round)',
        diameterIn: [12, 14],
        ballWeightRange: [210, 300],
        ballWeightDefault: 250,
        hydrationRange: [55, 62],
        hydrationDefault: 58,
        saltDefault: 2.5,
        oilDefault: 2.0,
        sugarDefault: 0,
        fermentation: { min: 24, max: 48, default: 24 },
        coldFermentDefault: true,
        description: 'Cracker-thin Roman round, rolled not stretched.',
        recommendation: '24–48 h cold ferment',
      },
    ],
  },
  {
    id: 'newhaven',
    label: 'New Haven',
    editions: [
      {
        id: 'newhaven-classic',
        styleId: 'newhaven',
        label: 'Apizza (Classic)',
        diameterIn: [12, 14],
        ballWeightRange: [320, 450],
        ballWeightDefault: 380,
        hydrationRange: [62, 70],
        hydrationDefault: 65,
        saltDefault: 2.0,
        oilDefault: 1.0,
        sugarDefault: 0,
        fermentation: { min: 48, max: 72, default: 60 },
        coldFermentDefault: true,
        description: 'Oblong, char-spotted, chewy New Haven Apizza. Bread-flour base, very hot bake (450–500 °C).',
        recommendation: '48–72 h cold ferment for deep flavour',
      },
    ],
  },
  {
    id: 'chicagothin',
    label: 'Chicago Thin',
    editions: [
      {
        id: 'chicagothin-tavern',
        styleId: 'chicagothin',
        label: 'Tavern (Party Cut)',
        diameterIn: [12, 14],
        ballWeightRange: [280, 420],
        ballWeightDefault: 350,
        hydrationRange: [45, 52],
        hydrationDefault: 48,
        saltDefault: 2.0,
        oilDefault: 4.0,
        sugarDefault: 1.0,
        fermentation: { min: 24, max: 48, default: 36 },
        coldFermentDefault: true,
        description: 'Cracker-thin tavern style, rolled to ~3 mm and docked. Cut in squares, no significant rise.',
        recommendation: '24–48 h cold ferment, roll thin, dock before topping',
      },
    ],
  },
];

export function findEdition(id: EditionId): Edition {
  for (const s of STYLES) {
    const e = s.editions.find((ed) => ed.id === id);
    if (e) return e;
  }
  throw new Error(`Unknown edition: ${id}`);
}

export function defaultEditionFor(styleId: StyleId): Edition {
  const s = STYLES.find((x) => x.id === styleId);
  if (!s) throw new Error(`Unknown style: ${styleId}`);
  return s.editions[0];
}

export type Thickness = 'thin' | 'regular' | 'thick';

/** Relative dough density vs. a regular-thickness pie of the same diameter. */
export const THICKNESS_FACTORS: Record<Thickness, number> = {
  thin: 0.8,
  regular: 1,
  thick: 1.25,
};

export const THICKNESS_OPTIONS: { id: Thickness; label: string }[] = [
  { id: 'thin', label: 'Thin' },
  { id: 'regular', label: 'Regular' },
  { id: 'thick', label: 'Thick' },
];

/** Quick-toggle pizza diameters (inches), à la doughguy.co. */
export const PIZZA_SIZE_OPTIONS = [10, 12, 14, 16, 18, 20];

/** Quick-toggle pizza counts. */
export const COUNT_OPTIONS = [1, 2, 4, 6, 8, 12];

/**
 * Dough density (grams per square inch) at *regular* thickness, anchored to the
 * edition's published default ball weight and the midpoint of its diameter band.
 * Used as the bridge between a finished pizza diameter and its dough-ball weight.
 */
function doughDensity(edition: Edition): number {
  const [dMin, dMax] = edition.diameterIn;
  const midDiameter = (dMin + dMax) / 2;
  const area = Math.PI * (midDiameter / 2) ** 2;
  return edition.ballWeightDefault / area;
}

/**
 * Dough-ball weight (g) for a pizza of the given finished diameter and thickness.
 * Derived from the edition's density so it stays consistent with the style's
 * published defaults; clamped to the edition's allowed ball-weight range and
 * snapped to the nearest 5 g.
 */
export function ballWeightForSize(
  diameterIn: number,
  thickness: Thickness,
  edition: Edition,
): number {
  const area = Math.PI * (diameterIn / 2) ** 2;
  const raw = doughDensity(edition) * area * THICKNESS_FACTORS[thickness];
  const [wMin, wMax] = edition.ballWeightRange;
  return Math.max(wMin, Math.min(wMax, Math.round(raw / 5) * 5));
}

/**
 * Inverse of {@link ballWeightForSize}: the finished diameter (inches) implied
 * by a ball weight at a given thickness.
 */
export function diameterForBallWeight(
  ballWeight: number,
  thickness: Thickness,
  edition: Edition,
): number {
  const area = ballWeight / THICKNESS_FACTORS[thickness] / doughDensity(edition);
  return Math.sqrt(area / Math.PI) * 2;
}

/**
 * Approximate finished pizza diameter (inches) for a given ball weight, assuming
 * a regular thickness. Area-based (not linear) so it agrees with the size
 * quick-toggle in easy mode.
 */
export function estimateDiameterIn(ballWeight: number, edition: Edition): number {
  return diameterForBallWeight(ballWeight, 'regular', edition);
}
