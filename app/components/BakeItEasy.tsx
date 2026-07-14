'use client';
import {
  Edition,
  estimateDiameterIn,
  ballWeightForSize,
  PIZZA_SIZE_OPTIONS,
  COUNT_OPTIONS,
  THICKNESS_OPTIONS,
  Thickness,
} from '@/lib/styles';

type Props = {
  edition: Edition;
  pizzaTime: Date;
  onPizzaTimeChange: (d: Date) => void;
  fermentationHours: number;
  onFermentationChange: (h: number) => void;
  doughBalls: number;
  onDoughBallsChange: (n: number) => void;
  ballWeight: number;
  onBallWeightChange: (g: number) => void;
  /** Finished pizza diameter (in) the ball weight currently implies. */
  diameterIn: number;
  /** Active thickness preset. */
  thickness: Thickness;
  onThicknessChange: (t: Thickness) => void;
};

const ALL_CHIPS = [4, 6, 8, 10, 12, 16, 24, 48, 72];

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}
function toLocalDate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function toLocalTime(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export default function BakeItEasy({
  edition,
  pizzaTime,
  onPizzaTimeChange,
  fermentationHours,
  onFermentationChange,
  doughBalls,
  onDoughBallsChange,
  ballWeight,
  onBallWeightChange,
  diameterIn,
  thickness,
  onThicknessChange,
}: Props) {
  const chips = ALL_CHIPS.filter(
    (h) => h >= edition.fermentation.min && h <= edition.fermentation.max,
  );

  const handleSize = (d: number) =>
    onBallWeightChange(ballWeightForSize(d, thickness, edition));
  const handleCount = (n: number) => onDoughBallsChange(n);

  const handleDate = (s: string) => {
    if (!s) return;
    const [y, m, d] = s.split('-').map(Number);
    const next = new Date(pizzaTime);
    next.setFullYear(y, m - 1, d);
    onPizzaTimeChange(next);
  };
  const handleTime = (s: string) => {
    if (!s) return;
    const [h, m] = s.split(':').map(Number);
    const next = new Date(pizzaTime);
    next.setHours(h, m, 0, 0);
    onPizzaTimeChange(next);
  };

  return (
    <section className="glass-panel mode-panel">
      <h2>Pizza Time</h2>
      <div className="row gap">
        <input
          type="date"
          value={toLocalDate(pizzaTime)}
          onChange={(e) => handleDate(e.target.value)}
          className="picker"
          aria-label="Pizza date"
        />
        <input
          type="time"
          value={toLocalTime(pizzaTime)}
          onChange={(e) => handleTime(e.target.value)}
          className="picker"
          aria-label="Pizza time"
        />
      </div>

      <h3 className="sub-label">Fermentation Time</h3>
      <div className="chip-row">
        {chips.map((h) => (
          <button
            key={h}
            className={`chip ${fermentationHours === h ? 'chip-active' : ''}`}
            onClick={() => onFermentationChange(h)}
          >
            {h}h
          </button>
        ))}
      </div>

      <h3 className="sub-label">Number of Pizzas</h3>
      <div className="chip-row">
        {COUNT_OPTIONS.map((n) => (
          <button
            key={n}
            className={`chip ${doughBalls === n ? 'chip-active' : ''}`}
            onClick={() => handleCount(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <input
        type="number"
        min={1}
        max={50}
        value={doughBalls}
        onChange={(e) => onDoughBallsChange(Math.max(1, Number(e.target.value) || 1))}
        className="big-number"
      />

      <h3 className="sub-label">Pizza Size</h3>
      <div className="chip-row">
        {PIZZA_SIZE_OPTIONS.map((d) => (
          <button
            key={d}
            className={`chip ${Math.round(diameterIn) === d ? 'chip-active' : ''}`}
            onClick={() => handleSize(d)}
          >
            {d}&quot;
          </button>
        ))}
      </div>

      <h3 className="sub-label">Thickness</h3>
      <div className="chip-row">
        {THICKNESS_OPTIONS.map((t) => (
          <button
            key={t.id}
            className={`chip ${thickness === t.id ? 'chip-active' : ''}`}
            onClick={() => {
              onThicknessChange(t.id);
              onBallWeightChange(ballWeightForSize(diameterIn, t.id, edition));
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <h3 className="sub-label">Weight Per Pizza (g)</h3>
      <div className="slider-track">
        <span className="slider-min">{edition.ballWeightRange[0]} g</span>
        <span className="slider-value">{ballWeight} g</span>
        <span className="slider-max">{edition.ballWeightRange[1]} g</span>
      </div>
      <input
        type="range"
        min={edition.ballWeightRange[0]}
        max={edition.ballWeightRange[1]}
        step={5}
        value={ballWeight}
        onChange={(e) => onBallWeightChange(Number(e.target.value))}
        className="weight-slider"
        aria-label="Weight per pizza"
      />
      <p className="muted small diameter-est">
        ≈ {estimateDiameterIn(ballWeight, edition).toFixed(1)} in pizza
        ({edition.diameterIn[0]}–{edition.diameterIn[1]} in range for this edition)
      </p>
    </section>
  );
}
