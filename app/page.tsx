'use client';
import { useEffect, useMemo, useState } from 'react';
import StylePills from './components/StylePills';
import ModePills, { Mode } from './components/ModePills';
import TotalTimePanel from './components/TotalTimePanel';
import EditionCard from './components/EditionCard';
import BakeItEasy from './components/BakeItEasy';
import MoodyCrustMode, {
  CrustModeState,
  defaultCrustModeStateFor,
} from './components/MoodyCrustMode';
import ResultsTable from './components/ResultsTable';
import RecipeVault from './components/RecipeVault';
import {
  STYLES,
  StyleId,
  EditionId,
  findEdition,
  defaultEditionFor,
  estimateDiameterIn,
} from '@/lib/styles';
import { calculate } from '@/lib/dough';
import { convertYeast, estimateIdyPercent } from '@/lib/yeast';
import { buildSchedule } from '@/lib/schedule';
import { cToF } from '@/lib/units';

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
function snapFerm(h: number, ed: ReturnType<typeof findEdition>) {
  return clamp(h, ed.fermentation.min, ed.fermentation.max);
}
function pad2(n: number) { return n < 10 ? `0${n}` : `${n}`; }
function localDate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function localTime(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
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

  const [pizzaTime, setPizzaTime] = useState<Date>(() => {
    const d = new Date();
    d.setHours(18, 0, 0, 0);
    if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
    return d;
  });

  const [crust, setCrust] = useState<CrustModeState>(() =>
    defaultCrustModeStateFor(
      edition.hydrationDefault,
      edition.saltDefault,
      edition.oilDefault,
      edition.sugarDefault,
      edition.coldFermentDefault,
    ),
  );

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveRecipeName, setSaveRecipeName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [vaultRefreshKey, setVaultRefreshKey] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleStyleChange = (next: StyleId) => {
    setStyleId(next);
    const ed = defaultEditionFor(next);
    setEditionId(ed.id);
    setBallWeight(ed.ballWeightDefault);
    setFermentationHours(ed.fermentation.default);
    setCrust(
      defaultCrustModeStateFor(
        ed.hydrationDefault,
        ed.saltDefault,
        ed.oilDefault,
        ed.sugarDefault,
        ed.coldFermentDefault,
      ),
    );
  };

  const handleEditionChange = (id: string) => {
    const ed = findEdition(id as EditionId);
    setEditionId(ed.id);
    setBallWeight(clamp(ballWeight, ed.ballWeightRange[0], ed.ballWeightRange[1]));
    setFermentationHours(snapFerm(fermentationHours, ed));
    setCrust((prev) => ({
      ...prev,
      hydration: ed.hydrationDefault,
      saltPercent: ed.saltDefault,
      oilPercent: ed.oilDefault,
      sugarPercent: ed.sugarDefault,
      useColdFerment: ed.coldFermentDefault,
      fermentationTempC: ed.coldFermentDefault ? 4 : 22,
    }));
  };

  const effective = useMemo(() => {
    if (mode === 'easy') {
      return {
        hydration: edition.hydrationDefault,
        saltPercent: edition.saltDefault,
        oilPercent: edition.oilDefault,
        sugarPercent: edition.sugarDefault,
        yeastType: 'idy' as const,
        yeastPercentOverride: undefined as number | undefined,
        fermentationTempC: edition.coldFermentDefault ? 4 : 22,
        useColdFerment: edition.coldFermentDefault,
        useAutolyse: false,
        stretchAndFolds: 0,
        flours: [{ id: 'main', name: 'Main flour', percentage: 100 }],
        preferment: { type: 'none' as const, flourPercent: 0, hydration: 100, hours: 0, temperatureC: 22 },
        additional: [],
      };
    }
    return {
      hydration: crust.hydration,
      saltPercent: crust.saltPercent,
      oilPercent: crust.oilPercent,
      sugarPercent: crust.sugarPercent,
      yeastType: crust.yeastType,
      yeastPercentOverride: crust.yeastPercentOverride,
      fermentationTempC: crust.fermentationTempC,
      useColdFerment: crust.useColdFerment,
      useAutolyse: crust.useAutolyse,
      stretchAndFolds: crust.stretchAndFolds,
      flours: crust.flours,
      preferment: crust.preferment,
      additional: crust.additional,
    };
  }, [mode, edition, crust]);

  const autoYeastPercent = useMemo(
    () =>
      convertYeast(
        estimateIdyPercent(fermentationHours, effective.fermentationTempC),
        effective.yeastType,
      ),
    [fermentationHours, effective.fermentationTempC, effective.yeastType],
  );

  const autoPrefermentYeastPercent = useMemo(
    () =>
      convertYeast(
        estimateIdyPercent(effective.preferment.hours || 1, effective.preferment.temperatureC),
        effective.yeastType,
      ),
    [effective.preferment.hours, effective.preferment.temperatureC, effective.yeastType],
  );

  const dough = useMemo(
    () =>
      calculate({
        doughBalls,
        ballWeight,
        hydration: effective.hydration,
        saltPercent: effective.saltPercent,
        oilPercent: effective.oilPercent,
        sugarPercent: effective.sugarPercent,
        yeastType: effective.yeastType,
        yeastPercentOverride: effective.yeastPercentOverride,
        fermentationHours,
        fermentationTempC: effective.fermentationTempC,
        flours: effective.flours,
        preferment: effective.preferment,
        additional: effective.additional,
      }),
    [doughBalls, ballWeight, fermentationHours, effective],
  );

  const schedule = useMemo(() => {
    const anchorKind = mode === 'easy' ? 'end' : crust.anchorKind;
    return buildSchedule({
      styleId,
      anchor: { kind: anchorKind, at: pizzaTime },
      totalHours: fermentationHours,
      useColdFerment: effective.useColdFerment,
      prefermentHours:
        effective.preferment.type !== 'none' ? effective.preferment.hours : undefined,
      useAutolyse: effective.useAutolyse,
      stretchAndFolds: effective.stretchAndFolds,
    });
  }, [mode, crust.anchorKind, styleId, pizzaTime, fermentationHours, effective]);

  const saveRecipe = async () => {
    if (!saveRecipeName.trim()) return;
    setSaveStatus('saving');
    try {
      const anchorKind = mode === 'easy' ? 'end' : crust.anchorKind;
      const payload = {
        name: saveRecipeName.trim(),
        styleId,
        editionId,
        mode: mode === 'easy' ? 'easy' : 'moodycrustmode',
        doughBalls,
        ballWeight,
        hydration: effective.hydration,
        saltPercent: effective.saltPercent,
        oilPercent: effective.oilPercent,
        sugarPercent: effective.sugarPercent ?? undefined,
        yeastType: effective.yeastType,
        yeastPercent: effective.yeastPercentOverride ?? undefined,
        fermentationHours,
        fermentationTempC: effective.fermentationTempC,
        useColdFerment: effective.useColdFerment,
        useAutolyse: effective.useAutolyse,
        stretchAndFolds: effective.stretchAndFolds,
        preferment: effective.preferment.type !== 'none' ? effective.preferment : undefined,
        flours: effective.flours,
        additional: effective.additional.length ? effective.additional : undefined,
        anchor: { kind: anchorKind, at: pizzaTime.toISOString() },
        tags: [],
      };
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaveStatus('saved');
      setSaveRecipeName('');
      setShowSaveInput(false);
      setVaultRefreshKey((k) => k + 1);
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const ingredientsForVault = useMemo<Record<string, unknown>>(() => JSON.parse(JSON.stringify(dough)), [dough]);
  const scheduleForVault = useMemo<Record<string, unknown>>(() => JSON.parse(JSON.stringify(schedule)), [schedule]);

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
        <p className="tagline">Web-portal guide to pizza perfection</p>
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
          <>
            <section className="glass-panel mode-panel">
              <h2>{crust.anchorKind === 'end' ? 'Pizza Time' : 'Start Time'}</h2>
              <div className="row gap">
                <input
                  type="date"
                  value={localDate(pizzaTime)}
                  onChange={(e) => {
                    if (!e.target.value) return;
                    const [y, m, d] = e.target.value.split('-').map(Number);
                    const next = new Date(pizzaTime);
                    next.setFullYear(y, m - 1, d);
                    setPizzaTime(next);
                  }}
                  className="picker"
                />
                <input
                  type="time"
                  value={localTime(pizzaTime)}
                  onChange={(e) => {
                    if (!e.target.value) return;
                    const [h, m] = e.target.value.split(':').map(Number);
                    const next = new Date(pizzaTime);
                    next.setHours(h, m, 0, 0);
                    setPizzaTime(next);
                  }}
                  className="picker"
                />
              </div>
              <h3 className="sub-label">Number of Pizzas</h3>
              <input
                className="big-number"
                type="number"
                min={1}
                max={50}
                value={doughBalls}
                onChange={(e) => setDoughBalls(Math.max(1, Number(e.target.value) || 1))}
              />
              <h3 className="sub-label">Weight Per Pizza (g)</h3>
              <input
                className="big-number"
                type="number"
                min={50}
                max={1500}
                step={5}
                value={ballWeight}
                onChange={(e) => setBallWeight(Math.max(50, Number(e.target.value) || 50))}
              />
              <p className="muted small diameter-est">
                ≈ {estimateDiameterIn(ballWeight, edition).toFixed(1)} in pizza
                ({edition.diameterIn[0]}–{edition.diameterIn[1]} in range for this edition)
              </p>
              <h3 className="sub-label">Fermentation Duration (h)</h3>
              <input
                className="big-number"
                type="number"
                min={1}
                max={120}
                step={0.5}
                value={fermentationHours}
                onChange={(e) => setFermentationHours(Math.max(1, Number(e.target.value) || 1))}
              />
            </section>

            <MoodyCrustMode
              state={crust}
              onChange={setCrust}
              autoYeastPercent={autoYeastPercent}
              autoPrefermentYeastPercent={autoPrefermentYeastPercent}
            />
          </>
        )}

        <section className="glass-panel mode-panel">
          <div className="formula-header">
            <h2>Calculated Formula</h2>
            {!showSaveInput ? (
              <button
                className="btn-primary btn-sm"
                onClick={() => setShowSaveInput(true)}
              >
                Save Recipe
              </button>
            ) : (
              <div className="save-recipe-row">
                <input
                  type="text"
                  className="text-input save-name-input"
                  placeholder="Recipe name…"
                  value={saveRecipeName}
                  onChange={(e) => setSaveRecipeName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveRecipe(); if (e.key === 'Escape') { setShowSaveInput(false); setSaveRecipeName(''); } }}
                  autoFocus
                />
                <button className="btn-primary btn-sm" onClick={saveRecipe} disabled={saveStatus === 'saving' || !saveRecipeName.trim()}>
                  {saveStatus === 'saving' ? '…' : 'Save'}
                </button>
                <button className="btn-ghost btn-sm" onClick={() => { setShowSaveInput(false); setSaveRecipeName(''); }}>
                  ✕
                </button>
              </div>
            )}
          </div>
          {saveStatus === 'saved' && <p className="save-success">Recipe saved!</p>}
          {saveStatus === 'error' && <p className="save-error">Failed to save. Try again.</p>}
          <p className="muted">
            Target dough yield: {dough.targetTotal.toFixed(0)} g ({doughBalls} × {ballWeight} g)
          </p>
          <ResultsTable
            dough={dough}
            doughBalls={doughBalls}
            ballWeight={ballWeight}
          />
          <p className="muted small" style={{ marginTop: '1rem' }}>
            Yeast estimate: {dough.effective.yeastPercent.toFixed(3)} % {effective.yeastType.toUpperCase()} at{' '}
            {cToF(effective.fermentationTempC)} °F for {fermentationHours} h
            {dough.preferment && (
              <>
                {' · '}preferment yeast {dough.effective.prefermentYeastPercent.toFixed(3)} % at{' '}
                {cToF(effective.preferment.temperatureC)} °F for {effective.preferment.hours} h
              </>
            )}
          </p>
        </section>

        <RecipeVault
          currentIngredients={ingredientsForVault}
          currentSchedule={scheduleForVault}
          refreshKey={vaultRefreshKey}
        />
      </main>
    </>
  );
}
