import { z } from 'zod';

const FlourPart = z.object({
  id: z.string(),
  name: z.string(),
  percentage: z.number().min(0).max(100),
});

const Preferment = z.object({
  type: z.enum(['none', 'poolish', 'biga']),
  flourPercent: z.number().min(0).max(100),
  hydration: z.number().min(0).max(200),
  hours: z.number().min(0),
  temperatureC: z.number(),
  yeastPercentOverride: z.number().optional(),
});

const AdditionalIngredient = z.object({
  id: z.string(),
  name: z.string(),
  percent: z.number().min(0),
});

const Anchor = z.object({
  kind: z.enum(['start', 'end']),
  at: z.string().datetime(),
});

export const RecipeCreateSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  styleId: z.string(),
  editionId: z.string(),
  mode: z.enum(['easy', 'moodycrustmode']).default('easy'),
  doughBalls: z.number().int().min(1).max(50),
  ballWeight: z.number().min(50).max(1500),
  hydration: z.number().min(40).max(100),
  saltPercent: z.number().min(0).max(5),
  oilPercent: z.number().min(0).max(20).default(0),
  sugarPercent: z.number().min(0).max(10).optional(),
  yeastType: z.enum(['idy', 'ady', 'fresh']).default('idy'),
  yeastPercent: z.number().min(0).optional(),
  fermentationHours: z.number().min(1).max(120),
  fermentationTempC: z.number().min(1).max(40).default(22),
  useColdFerment: z.boolean().default(false),
  useAutolyse: z.boolean().default(false),
  stretchAndFolds: z.number().int().min(0).max(6).default(0),
  preferment: Preferment.optional(),
  flours: z.array(FlourPart).optional(),
  additional: z.array(AdditionalIngredient).optional(),
  anchor: Anchor.optional(),
  tags: z.array(z.string()).default([]),
  isFavorite: z.boolean().default(false),
});

export const RecipeUpdateSchema = RecipeCreateSchema.partial().extend({
  name: z.string().min(1).max(120).optional(),
});

export const BakeCreateSchema = z.object({
  bakedAt: z.string().datetime(),
  ingredients: z.record(z.string(), z.unknown()),
  schedule: z.record(z.string(), z.unknown()),
  rating: z.number().int().min(1).max(5).optional(),
  tastingNotes: z.string().max(2000).optional(),
  whatChanged: z.string().max(500).optional(),
  photoUrls: z.array(z.string().url()).default([]),
  ovenType: z.string().max(50).optional(),
  ovenTempC: z.number().optional(),
  bakeTimeSec: z.number().int().optional(),
});

export const BakeUpdateSchema = BakeCreateSchema.partial();

export type RecipeCreate = z.infer<typeof RecipeCreateSchema>;
export type BakeCreate = z.infer<typeof BakeCreateSchema>;
