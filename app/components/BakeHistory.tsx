'use client';
import { cToF } from '@/lib/units';

export type Bake = {
  id: string;
  bakedAt: string;
  rating: number | null;
  tastingNotes: string | null;
  whatChanged: string | null;
  ovenType: string | null;
  ovenTempC: number | null;
  bakeTimeSec: number | null;
};

type Props = {
  bakes: Bake[];
  onDelete: (bakeId: string) => void;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function stars(rating: number | null) {
  if (!rating) return null;
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export default function BakeHistory({ bakes, onDelete }: Props) {
  if (bakes.length === 0) {
    return <p className="placeholder-note" style={{ marginTop: '0.5rem' }}>No bakes logged yet. Hit "Log This Bake" after your next pizza!</p>;
  }

  return (
    <div className="bake-history">
      {bakes.map((b) => (
        <div key={b.id} className="bake-entry">
          <div className="bake-entry-header">
            <span className="bake-date">{formatDate(b.bakedAt)}</span>
            {b.rating !== null && <span className="bake-stars">{stars(b.rating)}</span>}
            <button
              className="bake-delete"
              onClick={() => onDelete(b.id)}
              aria-label="Delete bake"
            >
              ×
            </button>
          </div>
          {b.whatChanged && <p className="bake-changed">"{b.whatChanged}"</p>}
          {b.tastingNotes && <p className="bake-notes">{b.tastingNotes}</p>}
          {(b.ovenType || b.ovenTempC || b.bakeTimeSec) && (
            <p className="bake-oven">
              {[
                b.ovenType,
                b.ovenTempC ? `${cToF(b.ovenTempC)} °F` : null,
                b.bakeTimeSec ? `${Math.round(b.bakeTimeSec / 60)} min` : null,
              ].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
