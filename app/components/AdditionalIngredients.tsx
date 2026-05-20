'use client';
import { AdditionalIngredient } from '@/lib/dough';

type Props = {
  items: AdditionalIngredient[];
  onChange: (next: AdditionalIngredient[]) => void;
};

export default function AdditionalIngredients({ items, onChange }: Props) {
  const updateName = (id: string, name: string) =>
    onChange(items.map((i) => (i.id === id ? { ...i, name } : i)));
  const updatePct = (id: string, pct: number) =>
    onChange(items.map((i) => (i.id === id ? { ...i, percentage: pct } : i)));
  const remove = (id: string) => onChange(items.filter((i) => i.id !== id));
  const add = () =>
    onChange([
      ...items,
      { id: `a-${Date.now()}`, name: 'Diastatic malt', percentage: 0.5 },
    ]);

  return (
    <div className="additional-ingredients">
      <label className="field-label">Additional ingredients (% of flour)</label>
      {items.length === 0 && (
        <div className="muted small">
          Add things like malt, milk powder, honey, or olive oil overrides. Each line is a % of total flour.
        </div>
      )}
      {items.map((i) => (
        <div key={i.id} className="flour-row">
          <input
            className="text-input flour-name"
            value={i.name}
            onChange={(e) => updateName(i.id, e.target.value)}
            placeholder="Ingredient"
          />
          <input
            className="text-input flour-pct"
            type="number"
            min={0}
            max={20}
            step={0.1}
            value={i.percentage}
            onChange={(e) => updatePct(i.id, Number(e.target.value))}
          />
          <span className="suffix">%</span>
          <button className="row-remove" onClick={() => remove(i.id)} aria-label="Remove">×</button>
        </div>
      ))}
      <button className="row-add" onClick={add}>+ Add ingredient</button>
    </div>
  );
}
