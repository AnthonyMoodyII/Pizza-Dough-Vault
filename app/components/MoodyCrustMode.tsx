'use client';
import { AdditionalIngredient, FlourPart, PrefermentInput } from '@/lib/dough';
import { YeastType } from '@/lib/yeast';
import { cToF, fToC } from '@/lib/units';
import FlourPicker from './FlourPicker';
import PrefermentForm from './PrefermentForm';
import AdditionalIngredientsList from './AdditionalIngredients';

export type AnchorKind = 'start' | 'end';

export type CrustModeState = {
  anchorKind: AnchorKind;
  hydration: number;
  saltPercent: number;
  oilPercent: number;
  sugarPercent: number;
  yeastType: YeastType;
  /** undefined = auto. */
  yeastPercentOverride: number | undefined;
  fermentationTempC: number;
  useColdFerment: boolean;
  useAutolyse: boolean;
  stretchAndFolds: number;
  selectedFlourPreset: string;
  flours: FlourPart[];
  preferment: PrefermentInput;
  additional: AdditionalIngredient[];
};

type Props = {
  state: CrustModeState;
  onChange: (next: CrustModeState) => void;
  /** Auto-calculated yeast % the field falls back to. */
  autoYeastPercent: number;
  /** Auto-calculated preferment yeast % the field falls back to. */
  autoPrefermentYeastPercent: number;
};

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }

export default function MoodyCrustMode({
  state, onChange, autoYeastPercent, autoPrefermentYeastPercent,
}: Props) {
  const set = <K extends keyof CrustModeState>(k: K, v: CrustModeState[K]) =>
    onChange({ ...state, [k]: v });

  const yeastShown =
    state.yeastPercentOverride !== undefined
      ? state.yeastPercentOverride
      : Number(autoYeastPercent.toFixed(3));

  return (
    <section className="glass-panel mode-panel cm-panel">
      <h2>Moody-CrustMode</h2>

      {/* Planning mode */}
      <label className="field-label">Planning Mode</label>
      <div className="pill-row mode-row">
        <button
          className={`pill ${state.anchorKind === 'start' ? 'pill-active' : ''}`}
          onClick={() => set('anchorKind', 'start')}
        >Start Time</button>
        <button
          className={`pill ${state.anchorKind === 'end' ? 'pill-active' : ''}`}
          onClick={() => set('anchorKind', 'end')}
        >End Time (Pizza Time)</button>
      </div>

      {/* Dough basics */}
      <div className="cm-section">
        <label className="field-label">Hydration (%)</label>
        <input
          className="text-input" type="number" min={40} max={100} step={0.5}
          value={state.hydration}
          onChange={(e) => set('hydration', Number(e.target.value))}
        />
      </div>
      <div className="grid-2">
        <div className="field">
          <label className="field-label">Salt (%)</label>
          <input
            className="text-input" type="number" min={0} max={5} step={0.1}
            value={state.saltPercent}
            onChange={(e) => set('saltPercent', Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label className="field-label">Oil (%)</label>
          <input
            className="text-input" type="number" min={0} max={15} step={0.5}
            value={state.oilPercent}
            onChange={(e) => set('oilPercent', Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label className="field-label">Sugar (%)</label>
          <input
            className="text-input" type="number" min={0} max={10} step={0.25}
            value={state.sugarPercent}
            onChange={(e) => set('sugarPercent', Number(e.target.value))}
          />
        </div>
      </div>

      {/* Yeast */}
      <div className="cm-section">
        <label className="field-label">Yeast Type</label>
        <div className="pill-row mode-row">
          {(['idy', 'ady', 'fresh'] as YeastType[]).map((t) => (
            <button
              key={t}
              className={`pill ${state.yeastType === t ? 'pill-active' : ''}`}
              onClick={() => set('yeastType', t)}
            >
              {t === 'idy' ? 'Instant Dry' : t === 'ady' ? 'Active Dry' : 'Fresh'}
            </button>
          ))}
        </div>
        <label className="field-label" style={{ marginTop: '0.75rem' }}>
          Yeast (%)
          {state.yeastPercentOverride !== undefined && (
            <button
              className="auto-reset"
              onClick={() => set('yeastPercentOverride', undefined)}
            >reset to auto</button>
          )}
        </label>
        <input
          className="text-input" type="number" min={0} max={5} step={0.001}
          value={yeastShown}
          onChange={(e) => set('yeastPercentOverride', Number(e.target.value))}
        />
        {state.yeastPercentOverride === undefined && (
          <div className="muted small">
            Auto-calculated from temperature × duration. Edit to override.
          </div>
        )}
      </div>

      {/* Fermentation */}
      <div className="cm-section">
        <label className="field-label">Fermentation Method</label>
        <div className="pill-row mode-row">
          <button
            className={`pill ${!state.useColdFerment ? 'pill-active' : ''}`}
            onClick={() => set('useColdFerment', false)}
          >Room Temp</button>
          <button
            className={`pill ${state.useColdFerment ? 'pill-active' : ''}`}
            onClick={() => set('useColdFerment', true)}
          >Cold Ferment</button>
        </div>
        <div className="grid-2" style={{ marginTop: '0.75rem' }}>
          <div className="field">
            <label className="field-label">Bulk temperature (°F)</label>
            <input
              className="text-input" type="number" min={35} max={90} step={1}
              value={cToF(state.fermentationTempC)}
              onChange={(e) => set('fermentationTempC', fToC(Number(e.target.value)))}
            />
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="cm-section">
        <label className="field-label">Process</label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={state.useAutolyse}
            onChange={(e) => set('useAutolyse', e.target.checked)}
          />
          Autolyse (30 min flour + water rest before salt &amp; yeast)
        </label>
        <label className="field-label" style={{ marginTop: '0.6rem' }}>Stretch &amp; folds</label>
        <input
          className="text-input" type="number" min={0} max={8} step={1}
          value={state.stretchAndFolds}
          onChange={(e) => set('stretchAndFolds', Math.max(0, Number(e.target.value) || 0))}
        />
      </div>

      {/* Flour picker */}
      <div className="cm-section">
        <FlourPicker
          selectedPreset={state.selectedFlourPreset}
          onPresetChange={(id) => set('selectedFlourPreset', id)}
          flours={state.flours}
          onFloursChange={(f) => set('flours', f)}
        />
      </div>

      {/* Preferment */}
      <div className="cm-section">
        <PrefermentForm
          value={state.preferment}
          onChange={(p) => set('preferment', p)}
          autoYeastPercent={autoPrefermentYeastPercent}
        />
      </div>

      {/* Additional ingredients */}
      <div className="cm-section">
        <AdditionalIngredientsList
          items={state.additional}
          onChange={(a) => set('additional', a)}
        />
      </div>
    </section>
  );
}

export function defaultCrustModeStateFor(
  hydration: number,
  saltPercent: number,
  oilPercent: number,
  sugarPercent: number,
  useColdFerment: boolean,
): CrustModeState {
  return {
    anchorKind: 'end',
    hydration,
    saltPercent,
    oilPercent,
    sugarPercent,
    yeastType: 'idy',
    yeastPercentOverride: undefined,
    fermentationTempC: useColdFerment ? 4 : 22,
    useColdFerment,
    useAutolyse: false,
    stretchAndFolds: 0,
    selectedFlourPreset: 'caputo-pizzeria',
    flours: [{ id: 'main', name: 'Main flour', percentage: 100 }],
    preferment: {
      type: 'none',
      flourPercent: 30,
      hydration: 100,
      hours: 14,
      temperatureC: 22,
    },
    additional: [],
  };
}

export function pad2(n: number) { return pad(n); }
