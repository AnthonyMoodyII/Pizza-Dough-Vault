'use client';
import { PrefermentInput, PrefermentType } from '@/lib/dough';

type Props = {
  value: PrefermentInput;
  onChange: (next: PrefermentInput) => void;
  /** Auto-estimated yeast % when the user hasn't overridden it. */
  autoYeastPercent: number;
};

export default function PrefermentForm({ value, onChange, autoYeastPercent }: Props) {
  const set = <K extends keyof PrefermentInput>(k: K, v: PrefermentInput[K]) =>
    onChange({ ...value, [k]: v });

  const handleType = (t: PrefermentType) => {
    if (t === 'poolish') onChange({ ...value, type: t, hydration: 100 });
    else if (t === 'biga') onChange({ ...value, type: t, hydration: 45 });
    else onChange({ ...value, type: t });
  };

  const enabled = value.type !== 'none';
  const yeastShown =
    value.yeastPercentOverride !== undefined
      ? value.yeastPercentOverride
      : Number(autoYeastPercent.toFixed(3));

  return (
    <div className="preferment-form">
      <label className="field-label">Preferment</label>
      <div className="pill-row mode-row pf-types">
        {(['none', 'poolish', 'biga'] as PrefermentType[]).map((t) => (
          <button
            key={t}
            className={`pill ${value.type === t ? 'pill-active' : ''}`}
            onClick={() => handleType(t)}
          >
            {t === 'none' ? 'None' : t === 'poolish' ? 'Poolish' : 'Biga'}
          </button>
        ))}
      </div>

      {enabled && (
        <>
          <div className="grid-2">
            <div className="field">
              <label className="field-label">% of total flour</label>
              <input
                className="text-input"
                type="number"
                min={5}
                max={100}
                step={1}
                value={value.flourPercent}
                onChange={(e) => set('flourPercent', Number(e.target.value))}
              />
            </div>
            <div className="field">
              <label className="field-label">Preferment hydration (%)</label>
              <input
                className="text-input"
                type="number"
                min={30}
                max={120}
                step={1}
                value={value.hydration}
                onChange={(e) => set('hydration', Number(e.target.value))}
              />
            </div>
            <div className="field">
              <label className="field-label">Preferment temperature (°C)</label>
              <input
                className="text-input"
                type="number"
                min={2}
                max={35}
                step={0.5}
                value={value.temperatureC}
                onChange={(e) => set('temperatureC', Number(e.target.value))}
              />
            </div>
            <div className="field">
              <label className="field-label">Preferment duration (h)</label>
              <input
                className="text-input"
                type="number"
                min={1}
                max={48}
                step={0.5}
                value={value.hours}
                onChange={(e) => set('hours', Number(e.target.value))}
              />
            </div>
          </div>
          <div className="field" style={{ marginTop: '0.5rem' }}>
            <label className="field-label">
              Preferment yeast (%)
              {value.yeastPercentOverride !== undefined && (
                <button
                  className="auto-reset"
                  onClick={() => set('yeastPercentOverride', undefined)}
                >reset to auto</button>
              )}
            </label>
            <input
              className="text-input"
              type="number"
              min={0}
              max={5}
              step={0.001}
              value={yeastShown}
              onChange={(e) => set('yeastPercentOverride', Number(e.target.value))}
            />
            {value.yeastPercentOverride === undefined && (
              <div className="muted small">
                Auto-calculated from temperature × duration.
              </div>
            )}
          </div>
          <div className="muted small" style={{ marginTop: '0.5rem' }}>
            Poolish = 100 % hydration · Biga = ~45 % hydration. Adjust if your starter recipe differs.
          </div>
        </>
      )}
    </div>
  );
}
