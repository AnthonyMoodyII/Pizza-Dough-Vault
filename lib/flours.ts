export type FlourPreset = {
  id: string;
  label: string;
  /** Approximate Italian W value (strength) — undefined when not commonly published. */
  wValue?: number;
  /** Protein % on a typical lot. */
  protein?: number;
  /** Recommended hydration band when used as the main flour. */
  hydrationBand: [number, number];
  /** Total fermentation hours the flour can comfortably handle. */
  fermentationBand: [number, number];
  description: string;
};

export const FLOUR_PRESETS: FlourPreset[] = [
  {
    id: 'caputo-pizzeria',
    label: 'Caputo Pizzeria (00)',
    wValue: 280,
    protein: 12.5,
    hydrationBand: [60, 68],
    fermentationBand: [8, 24],
    description: 'Medium-strength 00 for Neapolitan ovens. Soft crumb, classic charring.',
  },
  {
    id: 'caputo-cuoco',
    label: 'Caputo Cuoco / Chef (00)',
    wValue: 320,
    protein: 13.0,
    hydrationBand: [62, 72],
    fermentationBand: [24, 72],
    description: 'Stronger 00 for long fermentations and higher hydration.',
  },
  {
    id: 'caputo-saccorosso',
    label: 'Caputo Sacco Rosso (00)',
    wValue: 350,
    protein: 13.5,
    hydrationBand: [63, 75],
    fermentationBand: [24, 72],
    description: 'Premium long-ferment 00. Holds 48–72 h cold ferments well.',
  },
  {
    id: 'ka-bread',
    label: 'King Arthur Bread Flour',
    wValue: 300,
    protein: 12.7,
    hydrationBand: [60, 70],
    fermentationBand: [12, 72],
    description: 'Workhorse for NY-style and New Haven Apizza. Chewy crumb.',
  },
  {
    id: 'ka-ap',
    label: 'King Arthur All-Purpose',
    protein: 11.7,
    hydrationBand: [55, 65],
    fermentationBand: [12, 48],
    description: 'Lower protein — good for tavern-style and crackery bases.',
  },
  {
    id: 'gold-medal-ap',
    label: 'Gold Medal All-Purpose',
    protein: 10.5,
    hydrationBand: [50, 60],
    fermentationBand: [12, 48],
    description: 'Classic Chicago Thin / tavern-style choice. Tender, easy to roll.',
  },
  {
    id: 'durum-semolina',
    label: 'Durum Semolina',
    protein: 13.5,
    hydrationBand: [55, 65],
    fermentationBand: [12, 48],
    description: 'Use as a 10–20 % blend for nutty flavour and toothy crumb.',
  },
  {
    id: 'whole-wheat',
    label: 'Whole Wheat',
    protein: 13.5,
    hydrationBand: [65, 75],
    fermentationBand: [8, 48],
    description: 'Use as a 10–30 % blend. Drinks water and ferments faster.',
  },
];

export function findFlourPreset(id: string): FlourPreset | undefined {
  return FLOUR_PRESETS.find((f) => f.id === id);
}
