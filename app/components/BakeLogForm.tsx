'use client';
import { useState } from 'react';

export type BakeFormData = {
  bakedAt: string;
  rating?: number;
  tastingNotes?: string;
  whatChanged?: string;
  ovenType?: string;
  ovenTempC?: number;
  bakeTimeSec?: number;
};

type Props = {
  recipeId: string;
  ingredients: Record<string, unknown>;
  schedule: Record<string, unknown>;
  onSaved: () => void;
  onCancel: () => void;
};

const OVEN_TYPES = ['Home oven', 'Pizza steel', 'Pizza stone', 'Gozney', 'Ooni', 'Wood fired'];

export default function BakeLogForm({ recipeId, ingredients, schedule, onSaved, onCancel }: Props) {
  const now = new Date();
  const [bakedAt, setBakedAt] = useState(now.toISOString().slice(0, 16));
  const [rating, setRating] = useState<number | undefined>();
  const [tastingNotes, setTastingNotes] = useState('');
  const [whatChanged, setWhatChanged] = useState('');
  const [ovenType, setOvenType] = useState('');
  const [ovenTempC, setOvenTempC] = useState('');
  const [bakeTimeSec, setBakeTimeSec] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        bakedAt: new Date(bakedAt).toISOString(),
        ingredients,
        schedule,
        rating: rating ?? undefined,
        tastingNotes: tastingNotes || undefined,
        whatChanged: whatChanged || undefined,
        ovenType: ovenType || undefined,
        ovenTempC: ovenTempC ? Number(ovenTempC) : undefined,
        bakeTimeSec: bakeTimeSec ? Math.round(Number(bakeTimeSec) * 60) : undefined,
      };
      const res = await fetch(`/api/recipes/${recipeId}/bakes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save bake');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="bake-log-form" onSubmit={handleSubmit}>
      <h3>Log This Bake</h3>

      <div className="field">
        <label className="field-label">Baked at</label>
        <input
          type="datetime-local"
          className="text-input"
          value={bakedAt}
          onChange={(e) => setBakedAt(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label className="field-label">Rating</label>
        <div className="star-row">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              className={`star-btn ${rating !== undefined && s <= rating ? 'star-btn-on' : ''}`}
              onClick={() => setRating(rating === s ? undefined : s)}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label className="field-label">Oven type</label>
          <select
            className="select-input"
            value={ovenType}
            onChange={(e) => setOvenType(e.target.value)}
          >
            <option value="">— optional —</option>
            {OVEN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field-label">Oven temp (°C)</label>
          <input
            type="number"
            className="text-input"
            placeholder="e.g. 480"
            value={ovenTempC}
            onChange={(e) => setOvenTempC(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Bake time (min)</label>
        <input
          type="number"
          className="text-input"
          placeholder="e.g. 90"
          value={bakeTimeSec}
          onChange={(e) => setBakeTimeSec(e.target.value)}
        />
      </div>

      <div className="field">
        <label className="field-label">What changed?</label>
        <input
          type="text"
          className="text-input"
          placeholder="e.g. bumped hydration 2%, added 24h cold"
          value={whatChanged}
          onChange={(e) => setWhatChanged(e.target.value)}
        />
      </div>

      <div className="field">
        <label className="field-label">Tasting notes</label>
        <textarea
          className="text-input"
          rows={3}
          placeholder="Crumb, char, flavour..."
          value={tastingNotes}
          onChange={(e) => setTastingNotes(e.target.value)}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="bake-form-actions">
        <button type="button" className="btn-ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save Bake'}
        </button>
      </div>
    </form>
  );
}
