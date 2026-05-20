'use client';
import { FLOUR_PRESETS, findFlourPreset } from '@/lib/flours';
import { FlourPart } from '@/lib/dough';

type Props = {
  selectedPreset: string;
  onPresetChange: (id: string) => void;
  flours: FlourPart[];
  onFloursChange: (next: FlourPart[]) => void;
};

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function normalise(current: FlourPart[], changedId: string, newPct: number): FlourPart[] {
  const val = clamp(newPct, 0, 100);
  if (current.length === 1) return [{ ...current[0], percentage: 100 }];

  const others = current.filter((f) => f.id !== changedId);
  const otherTotal = others.reduce((a, f) => a + f.percentage, 0);
  const remaining = 100 - val;

  return current.map((f) => {
    if (f.id === changedId) return { ...f, percentage: val };
    if (otherTotal === 0) {
      return { ...f, percentage: remaining / others.length };
    }
    const share = f.percentage / otherTotal;
    return { ...f, percentage: Math.round(remaining * share * 1000) / 1000 };
  });
}

export default function FlourPicker({
  selectedPreset,
  onPresetChange,
  flours,
  onFloursChange,
}: Props) {
  const preset = findFlourPreset(selectedPreset);

  const updateName = (id: string, name: string) => {
    onFloursChange(flours.map((f) => (f.id === id ? { ...f, name } : f)));
  };
  const updatePct = (id: string, pct: number) => {
    onFloursChange(normalise(flours, id, pct));
  };
  const addFlour = () => {
    onFloursChange([
      ...flours,
      { id: `f-${Date.now()}`, name: 'Blend flour', percentage: 0 },
    ]);
  };
  const removeFlour = (id: string) => {
    if (flours.length <= 1) return;
    const removed = flours.find((f) => f.id === id);
    const remaining = flours.filter((f) => f.id !== id);
    if (removed && removed.percentage > 0) {
      const share = removed.percentage / remaining.length;
      onFloursChange(remaining.map((f) => ({ ...f, percentage: f.percentage + share })));
    } else {
      onFloursChange(remaining);
    }
  };

  return (
    <div className="flour-picker">
      <label className="field-label">Flour Selection</label>
      <select
        className="select-input"
        value={selectedPreset}
        onChange={(e) => onPresetChange(e.target.value)}
      >
        {FLOUR_PRESETS.map((p) => (
          <option key={p.id} value={p.id}>{p.label}</option>
        ))}
      </select>
      {preset && (
        <div className="flour-meta">
          {preset.description}
          <div className="flour-meta-small">
            Hydration band: {preset.hydrationBand[0]}–{preset.hydrationBand[1]} %
            {preset.fermentationBand && (
              <> · Ferment: {preset.fermentationBand[0]}–{preset.fermentationBand[1]} h</>
            )}
          </div>
        </div>
      )}

      <label className="field-label" style={{ marginTop: '1rem' }}>
        Blend (auto-normalises to 100 %)
      </label>
      {flours.map((f) => (
        <div key={f.id} className="flour-row">
          <input
            className="text-input flour-name"
            value={f.name}
            onChange={(e) => updateName(f.id, e.target.value)}
            placeholder="Flour label"
          />
          <input
            className="text-input flour-pct"
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={Math.round(f.percentage * 10) / 10}
            onChange={(e) => updatePct(f.id, Number(e.target.value))}
          />
          <span className="suffix">%</span>
          {flours.length > 1 && (
            <button
              className="row-remove"
              onClick={() => removeFlour(f.id)}
              aria-label={`Remove ${f.name}`}
            >×</button>
          )}
        </div>
      ))}
      <button className="row-add" onClick={addFlour}>+ Add blend flour</button>
    </div>
  );
}
