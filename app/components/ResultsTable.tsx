'use client';
import { DoughOutput } from '@/lib/dough';

type Props = {
  dough: DoughOutput;
  doughBalls: number;
  ballWeight: number;
};

function gram(n: number, digits = 1): string {
  return `${n.toFixed(digits)} g`;
}

export default function ResultsTable({ dough, doughBalls, ballWeight }: Props) {
  const { total, preferment, finalDough, flourBreakdown } = dough;

  return (
    <div className="results-stack">
      {/* Totals */}
      <div className="result-table">
        <div className="result-head">Total (incl. preferment)</div>
        <div className="result-row">
          <span>Flour (100 %)</span>
          <span className="mono">{gram(total.flour, 0)}</span>
        </div>
        <div className="result-row">
          <span>Water</span>
          <span className="mono">{gram(total.water, 0)}</span>
        </div>
        <div className="result-row">
          <span>Yeast</span>
          <span className="mono">{gram(total.yeast, 2)}</span>
        </div>
      </div>

      {/* Preferment */}
      {preferment && (
        <div className="result-table">
          <div className="result-head">Preferment</div>
          <div className="result-row">
            <span>Flour</span>
            <span className="mono">{gram(preferment.flour, 0)}</span>
          </div>
          <div className="result-row">
            <span>Water</span>
            <span className="mono">{gram(preferment.water, 0)}</span>
          </div>
          <div className="result-row">
            <span>Yeast</span>
            <span className="mono">{gram(preferment.yeast, 3)}</span>
          </div>
        </div>
      )}

      {/* Final dough */}
      <div className="result-table">
        <div className="result-head">Final Dough</div>
        {flourBreakdown.length > 1 ? (
          flourBreakdown.map((f) => (
            <div className="result-row" key={f.id}>
              <span>{f.name}{preferment ? ' (remaining)' : ''}</span>
              <span className="mono">{gram(f.grams, 0)}</span>
            </div>
          ))
        ) : (
          <div className="result-row">
            <span>Flour{preferment ? ' (remaining)' : ''}</span>
            <span className="mono">{gram(finalDough.flour, 0)}</span>
          </div>
        )}
        <div className="result-row">
          <span>Water{preferment ? ' (remaining)' : ''}</span>
          <span className="mono">{gram(finalDough.water, 0)}</span>
        </div>
        <div className="result-row">
          <span>Salt</span>
          <span className="mono">{gram(finalDough.salt, 1)}</span>
        </div>
        <div className="result-row">
          <span>Yeast{preferment ? ' (remaining)' : ''}</span>
          <span className="mono">{gram(finalDough.yeast, 3)}</span>
        </div>
        {finalDough.oil > 0 && (
          <div className="result-row">
            <span>Oil</span>
            <span className="mono">{gram(finalDough.oil, 1)}</span>
          </div>
        )}
        {finalDough.sugar > 0 && (
          <div className="result-row">
            <span>Sugar</span>
            <span className="mono">{gram(finalDough.sugar, 1)}</span>
          </div>
        )}
        {finalDough.additional.map((a) => (
          <div className="result-row" key={a.id}>
            <span>{a.name}</span>
            <span className="mono">{gram(a.grams, 1)}</span>
          </div>
        ))}
        <div className="result-row result-total">
          <span>Total dough</span>
          <span className="mono">{gram(dough.targetTotal, 0)}</span>
        </div>
        <div className="result-row">
          <span>Single ball ({doughBalls} ×)</span>
          <span className="mono">{gram(ballWeight, 0)}</span>
        </div>
      </div>
    </div>
  );
}
