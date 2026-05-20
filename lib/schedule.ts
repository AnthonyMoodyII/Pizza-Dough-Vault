import { StyleId } from './styles';

export type Anchor = { kind: 'start' | 'end'; at: Date };

export type ScheduleInput = {
  styleId: StyleId;
  anchor: Anchor;
  totalHours: number;
  useColdFerment: boolean;
  /** Optional preferment fermentation hours (added before main schedule). */
  prefermentHours?: number;
  useAutolyse: boolean;
  stretchAndFolds: number;
};

export type Step = {
  id: string;
  label: string;
  startsAt: Date;
  durationMin: number;
  detail?: string;
};

export type Schedule = {
  steps: Step[];
  startsAt: Date;
  endsAt: Date;
  bulkEndsAt?: Date;
  coldEndsAt?: Date;
};

const MIN = 60 * 1000;

/**
 * Build a step-by-step plan. Total hours = end-to-end pizza time
 * (excluding preferment if separate). All durations sum to totalHours.
 *
 * Schedule sketch (cold-ferment example, total 48h):
 *   - Preferment (optional, off-budget)
 *   - Autolyse (off-budget, 20–40m)
 *   - Mix              ~15m
 *   - Bulk @ RT        ~2h  (with S&F)
 *   - Cold ferment     remainder
 *   - Balling          ~15m (at end of bulk or before warmup)
 *   - Final proof @ RT ~2h
 *   - Bake             0
 */
export function buildSchedule(input: ScheduleInput): Schedule {
  const steps: Omit<Step, 'startsAt'>[] = [];

  if (input.prefermentHours && input.prefermentHours > 0) {
    steps.push({
      id: 'preferment',
      label: 'Mix preferment',
      durationMin: Math.round(input.prefermentHours * 60),
      detail: 'Combine preferment flour + water + tiny yeast, cover, hold at room temperature until ripe and domed.',
    });
  }

  if (input.useAutolyse) {
    steps.push({
      id: 'autolyse',
      label: 'Autolyse',
      durationMin: 30,
      detail: 'Combine flour + most of the water (hold back ~50 g). Rest covered. No salt, no yeast yet.',
    });
  }

  steps.push({
    id: 'mix',
    label: 'Final mix',
    durationMin: 15,
    detail: 'Add preferment (if any), salt, remaining water, yeast. Knead until smooth — about 8–12 min by hand.',
  });

  const baseOverhead =
    (input.useAutolyse ? 30 : 0) + 15 /* mix */ + 15 /* balling */ + 120 /* final proof */;

  const remainingMin = Math.max(60, input.totalHours * 60 - baseOverhead);

  let bulkMin: number;
  let coldMin = 0;
  if (input.useColdFerment) {
    bulkMin = Math.min(120, remainingMin * 0.1);
    coldMin = remainingMin - bulkMin;
  } else {
    bulkMin = remainingMin;
  }

  // Distribute stretch & folds inside bulk.
  if (input.stretchAndFolds > 0) {
    const interval = bulkMin / (input.stretchAndFolds + 1);
    for (let i = 1; i <= input.stretchAndFolds; i++) {
      steps.push({
        id: `sf-${i}`,
        label: `Stretch & fold #${i}`,
        durationMin: 1,
        detail: 'Coil-fold or letter-fold in the bowl, then cover and rest.',
      });
      steps.push({
        id: `bulk-rest-${i}`,
        label: 'Bulk rest',
        durationMin: Math.round(interval - 1),
      });
    }
  } else {
    steps.push({ id: 'bulk', label: 'Bulk ferment', durationMin: Math.round(bulkMin) });
  }

  if (input.useColdFerment) {
    steps.push({
      id: 'ball-pre-cold',
      label: 'Ball & cold-retard',
      durationMin: 15,
      detail: 'Divide into balls, place in oiled containers, refrigerate.',
    });
    steps.push({
      id: 'cold',
      label: 'Cold ferment',
      durationMin: Math.round(coldMin),
      detail: 'Refrigerate at 3–5 °C.',
    });
    steps.push({
      id: 'final-proof',
      label: 'Final proof at room temp',
      durationMin: 120,
      detail: 'Pull from fridge, leave covered until doubled and pillowy.',
    });
  } else {
    steps.push({
      id: 'ball',
      label: 'Divide & ball',
      durationMin: 15,
    });
    steps.push({
      id: 'final-proof',
      label: 'Final proof',
      durationMin: 120,
      detail: 'Cover and rest until balls are slack and gassy.',
    });
  }

  steps.push({
    id: 'bake',
    label: 'Pizza time',
    durationMin: 0,
    detail: 'Shape, top, bake.',
  });

  // Resolve start/end based on anchor.
  const sumMin = steps.reduce((acc, s) => acc + s.durationMin, 0);
  const endsAt =
    input.anchor.kind === 'end'
      ? input.anchor.at
      : new Date(input.anchor.at.getTime() + sumMin * MIN);
  const startsAt =
    input.anchor.kind === 'start'
      ? input.anchor.at
      : new Date(input.anchor.at.getTime() - sumMin * MIN);

  let cursor = startsAt.getTime();
  const resolved: Step[] = steps.map((s) => {
    const step: Step = { ...s, startsAt: new Date(cursor) };
    cursor += s.durationMin * MIN;
    return step;
  });

  // Only surface bulk/cold milestones for cold-ferment schedules. Room-temp
  // schedules go straight from bulk -> ball -> final proof, so an intermediate
  // "bulk end" timestamp is just noise.
  const bulkEnd = input.useColdFerment
    ? resolved.find((s) => s.id === 'ball-pre-cold')
    : undefined;
  const coldEnd = input.useColdFerment
    ? resolved.find((s) => s.id === 'final-proof')
    : undefined;

  return {
    steps: resolved,
    startsAt,
    endsAt,
    bulkEndsAt: bulkEnd?.startsAt,
    coldEndsAt: coldEnd?.startsAt,
  };
}

