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
  diameterCm: [number, number];
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
        diameterCm: [28, 30],
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
        diameterCm: [28, 32],
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
        diameterCm: [40, 46],
        ballWeightRange: [400, 600],
        ballWeightDefault: 500,
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
        diameterCm: [40, 50],
        ballWeightRange: [350, 500],
        ballWeightDefault: 420,
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
        diameterCm: [30, 40],
        ballWeightRange: [500, 900],
        ballWeightDefault: 700,
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
        diameterCm: [30, 34],
        ballWeightRange: [180, 230],
        ballWeightDefault: 200,
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
        diameterCm: [30, 35],
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
        diameterCm: [30, 35],
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
