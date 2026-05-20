'use client';
import { useEffect, useMemo, useState } from 'react';
import StylePills from './components/StylePills';
import ModePills, { Mode } from './components/ModePills';
import TotalTimePanel from './components/TotalTimePanel';
import EditionCard from './components/EditionCard';
import BakeItEasy from './components/BakeItEasy';
import {
  STYLES,
  StyleId,
  EditionId,
  findEdition,
  defaultEditionFor,
} from '@/lib/styles';
import { calculate } from '@/lib/dough';
import { buildSchedule } from '@/lib/schedule';

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function snapToEdition(initialFermHours: number, ed: ReturnType<typeof findEdition>) {
  return clamp(initialFermHours, ed.fermentation.min, ed.fermentation.max);
}

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [styleId, setStyleId] = useState<StyleId>('neapolitan');
  const [editionId, setEditionId] = useState<EditionId>('neapolitan-home');
  const [mode, setMode] = useState<Mode>('easy');

  const style = STYLES.find((s) => s.id === styleId)!;
  const edition = findEdition(editionId);

  const [doughBalls, setDoughBalls] = useState(4);
  const [ballWeight, setBallWeight] = useState(edition.ballWeightDefault);
  const [fermentationHours, setFermentationHours] = useState(edition.fermentation.default);

  // Default pizza time: today at 18:00 if it's still in the future, otherwise tomorrow 18:00.
  const [pizzaTime, setPizzaTime] = useState<Date>(() => {
    const d = new Date();
    d.setHours(18, 0, 0, 0);
    if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
    return d;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // When style changes, default to its first edition.
  const handleStyleChange = (next: StyleId) => {
    setStyleId(next);
    const ed = defaultEditionFor(next);
    setEditionId(ed.id);
    setBallWeight(ed.ballWeightDefault);
    setFermentationHours(ed.fermentation.default);
  };

  // When edition changes, snap weight + ferm to that edition's range.
  const handleEditionChange = (id: string) => {
    const ed = findEdition(id as EditionId);
    setEditionId(ed.id);
    setBallWeight(clamp(ballWeight, ed.ballWeightRange[0], ed.ballWeightRange[1]));
    setFermentationHours(snapToEdition(fermentationHours, ed));
  };

  // Use edition defaults for hydration/salt/oil/sugar in Easy mode (advanced controls live in Phase 3).
  const dough = useMemo(
    () =>
      calculate({
        doughBalls,
        ballWeight,
        hydration: edition.hydrationDefault,
        saltPercent: edition.saltDefault,
        oilPercent: edition.oilDefault,
        sugarPercent: edition.sugarDefault,
        yeastType: 'idy',
        fermentationHours,
        fermentationTempC: edition.coldFermentDefault ? 4 : 22,
        flours: [{ id: '1', name: 'Main flour', percentage: 100 }],
        preferment: { type: 'none', flourPercent: 0, hydration: 100, hours: 0, temperatureC: 22 },
        additional: [],
      }),
    [doughBalls, ballWeight, edition, fermentationHours],
  );

  const schedule = useMemo(
    () =>
      buildSchedule({
        styleId,
        anchor: { kind: 'end', at: pizzaTime },
        totalHours: fermentationHours,
        useColdFerment: edition.coldFermentDefault,
        useAutolyse: false,
        stretchAndFolds: 0,
      }),
    [styleId, pizzaTime, fermentationHours, edition.coldFermentDefault],
  );

  return (
    <>
      <header className="mc-header">
        <button
          className="theme-toggle"
          onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <h1>MoodyCrust</h1>
        <p className="tagline">Your pocket-sized weapon for pizza perfection</p>
      </header>

      <main className="mc-shell">
        <StylePills value={styleId} onChange={handleStyleChange} />
        <ModePills value={mode} onChange={setMode} />

        <TotalTimePanel schedule={schedule} />

        <EditionCard style={style} edition={edition} onChange={handleEditionChange} />

        {mode === 'easy' ? (
          <BakeItEasy
            edition={edition}
            pizzaTime={pizzaTime}
            onPizzaTimeChange={setPizzaTime}
            fermentationHours={fermentationHours}
            onFermentationChange={setFermentationHours}
            doughBalls={doughBalls}
            onDoughBallsChange={setDoughBalls}
            ballWeight={ballWeight}
            onBallWeightChange={setBallWeight}
          />
        ) : (
          <section className="glass-panel mode-panel">
            <h2>Moody-CrustMode</h2>
            <p className="placeholder-note">
              Full control over preferments, autolyse, stretch &amp; folds, additional ingredients,
              and a planning-mode anchor toggle lands in Phase 3.
            </p>
            <p className="placeholder-note">
              For now, switch back to <strong>Bake It Easy</strong> to dial in {style.label} {edition.label}.
            </p>
          </section>
        )}

        <section className="glass-panel mode-panel">
          <h2>Calculated Formula</h2>
          <p className="muted">
            Target dough yield: {dough.targetTotal.toFixed(0)} g
            ({doughBalls} × {ballWeight} g)
          </p>
          <div className="ingredient-row">
            <div className="ingredient-name">🌾 Flour</div>
            <div className="ingredient-weight">{dough.total.flour.toFixed(0)} g</div>
          </div>
          <div className="ingredient-row">
            <div className="ingredient-name">💧 Water</div>
            <div className="ingredient-weight">{dough.total.water.toFixed(0)} g</div>
          </div>
          <div className="ingredient-row">
            <div className="ingredient-name">🧂 Salt</div>
            <div className="ingredient-weight">{dough.total.salt.toFixed(1)} g</div>
          </div>
          {dough.total.oil > 0 && (
            <div className="ingredient-row">
              <div className="ingredient-name">🫒 Oil</div>
              <div className="ingredient-weight">{dough.total.oil.toFixed(1)} g</div>
            </div>
          )}
          {dough.total.sugar > 0 && (
            <div className="ingredient-row">
              <div className="ingredient-name">🍬 Sugar</div>
              <div className="ingredient-weight">{dough.total.sugar.toFixed(1)} g</div>
            </div>
          )}
          <div className="ingredient-row">
            <div className="ingredient-name">🦠 Yeast (IDY)</div>
            <div className="ingredient-weight">{dough.total.yeast.toFixed(2)} g</div>
          </div>
          <p className="muted small">
            Auto-yeast: {dough.effective.yeastPercent.toFixed(3)}% IDY at{' '}
            {edition.coldFermentDefault ? '4°C cold' : '22°C room'} for {fermentationHours}h.
          </p>
        </section>

        <section className="glass-panel mode-panel">
          <h2>Vault</h2>
          <p className="placeholder-note">
            Saved recipes (with bake history, tasting notes, and photos) return in <strong>Phase 4</strong>.
          </p>
        </section>
      </main>
    </>
  );
}
