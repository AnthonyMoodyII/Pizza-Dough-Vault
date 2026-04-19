'use client';
import { useState, useEffect } from 'react';

type Flour = { id: string; name: string; percentage: number };

type Recipe = {
  id?: string;
  name: string;
  doughBalls: number;
  ballWeight: number;
  hydration: number;
  salt: number;
  yeast: number;
  oil?: number | null;
  poolish?: number | null; // This now means poolish weight in grams structurally
  flours?: Flour[];
};

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipeName, setRecipeName] = useState('My Neapolitan Dough');
  
  // Inputs: changed to allow strings so inputs don't enforce leading 0s or break decimal entry!
  const [doughBalls, setDoughBalls] = useState<number | string>(4);
  const [ballWeight, setBallWeight] = useState<number | string>(250);
  const [hydration, setHydration] = useState<number | string>(65);
  const [salt, setSalt] = useState<number | string>(2.5);
  const [yeast, setYeast] = useState<number | string>('');
  const [oil, setOil] = useState<number | string>('');
  
  // Poolish weight in grams (fixed total)
  const [poolishWeight, setPoolishWeight] = useState<number | string>(''); 
  
  // Dynamic Flours mapping directly to 100% total
  const [flours, setFlours] = useState<Flour[]>([
    { id: '1', name: 'Tipo 00', percentage: 100 }
  ]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch recipes
  const fetchRecipes = async () => {
    try {
      const res = await fetch('/api/recipes');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRecipes(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Normalizing Auto-Adjust logic for Flours
  const handleFlourChange = (id: string, newPercentage: number) => {
    let val = Math.max(0, Math.min(100, newPercentage));
    const changedFlour = flours.find(f => f.id === id);
    if (!changedFlour) return;
    const difference = val - changedFlour.percentage;
    
    const otherFlours = flours.filter(f => f.id !== id);
    if (otherFlours.length === 0) {
      // Must equal 100% if only one flour
      if (flours[0].percentage !== 100) setFlours([{ ...flours[0], percentage: 100 }]);
      return;
    }
    
    const otherTotal = otherFlours.reduce((sum, f) => sum + f.percentage, 0);
    
    const newFlours = flours.map(f => {
      if (f.id === id) return { ...f, percentage: val };
      
      if (otherTotal === 0) {
        return { ...f, percentage: (100 - val) / otherFlours.length };
      }
      
      const proportion = f.percentage / otherTotal;
      let newFVal = f.percentage - (difference * proportion);
      // Clean float rounding
      newFVal = Math.round(newFVal * 1000) / 1000;
      return { ...f, percentage: newFVal };
    });

    setFlours(newFlours);
  };

  const addFlour = () => {
    setFlours([...flours, { id: Date.now().toString(), name: 'New Flour', percentage: 0 }]);
  };

  const removeFlour = (id: string) => {
    if (flours.length <= 1) return; // Must have at least 1 flour
    const targetFlour = flours.find(f => f.id === id);
    const difference = targetFlour ? targetFlour.percentage : 0;
    
    const remainingFlours = flours.filter(f => f.id !== id);
    if (remainingFlours.length > 0 && difference > 0) {
        // distribute the removed percentage evenly to the others
        const share = difference / remainingFlours.length;
        setFlours(remainingFlours.map(f => ({ ...f, percentage: f.percentage + share })));
    } else {
        setFlours(remainingFlours);
    }
  };

  const updateFlourName = (id: string, name: string) => {
    setFlours(flours.map(f => f.id === id ? { ...f, name } : f));
  };


  // Safe casting for calculations
  const tDoughBalls = Number(doughBalls) || 0;
  const tBallWeight = Number(ballWeight) || 0;
  const tHydration = Number(hydration) || 0;
  const tSalt = Number(salt) || 0;
  const tYeast = Number(yeast) || 0;
  const tOil = Number(oil) || 0;
  const tPoolishWeight = Number(poolishWeight) || 0;

  // Calculation Logic (Yeast and Oil are ABSOLUTE grams removed from scaling base)
  const totalWeight = tDoughBalls * tBallWeight;
  const scalableWeight = Math.max(0, totalWeight - tYeast - tOil);
  const totalPercentage = 100 + tHydration + tSalt;
  
  const totalFlour = scalableWeight / (totalPercentage / 100);
  const totalWater = totalFlour * (tHydration / 100);
  const totalSalt = totalFlour * (tSalt / 100);
  const totalYeast = tYeast; // absolute override
  const totalOil = tOil; // absolute override

  // Poolish logic (Absolute Grams = poolishWeight)
  const poolishFlour = tPoolishWeight / 2;
  const poolishWater = tPoolishWeight / 2;

  // Ensure poolish doesn't exceed total limits
  const actualPoolishWater = Math.min(poolishWater, totalWater);
  const actualPoolishFlour = Math.min(poolishFlour, totalFlour);

  const mainFlourTotal = totalFlour - actualPoolishFlour;
  const mainWater = totalWater - actualPoolishWater;

  const handleSave = async () => {
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: recipeName,
          doughBalls: tDoughBalls,
          ballWeight: tBallWeight,
          hydration: tHydration,
          salt: tSalt,
          yeast: tYeast,
          oil: tOil,
          poolish: tPoolishWeight,
          flours
        }),
      });
      if (res.ok) {
        fetchRecipes();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadRecipe = (r: Recipe) => {
    setRecipeName(r.name);
    setDoughBalls(r.doughBalls);
    setBallWeight(r.ballWeight);
    setHydration(r.hydration);
    setSalt(r.salt);
    setYeast(r.yeast || '');
    setOil(r.oil || '');
    setPoolishWeight(r.poolish || '');
    if (r.flours && r.flours.length > 0) {
      setFlours(r.flours);
    } else {
      setFlours([{ id: '1', name: 'Main Flour', percentage: 100 }]);
    }
  };

  const deleteRecipe = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
      fetchRecipes();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <header>
        <button 
          className="theme-toggle" 
          onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <h1>Dough Vault™</h1>
        <p>Premium Pizza Dough Calculator</p>
      </header>

      <main className="app-container">
        
        {/* Left pane: Inputs */}
        <section className="glass-panel">
          <h2>Ingredients</h2>
          
          <div className="form-group">
            <label>Recipe Name</label>
            <input type="text" value={recipeName} onChange={e => setRecipeName(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="form-group" style={{ flex: 1 }}>
                <label>Dough Balls</label>
                <div className="input-wrapper">
                <input type="number" value={doughBalls} onChange={e => setDoughBalls(e.target.value)} />
                <span>x</span>
                </div>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
                <label>Ball Weight</label>
                <div className="input-wrapper">
                <input type="number" value={ballWeight} onChange={e => setBallWeight(e.target.value)} />
                <span>g</span>
                </div>
            </div>
          </div>
          
          <div className="form-group">
            <label>Hydration</label>
            <div className="input-wrapper">
              <input type="number" value={hydration} onChange={e => setHydration(e.target.value)} />
              <span>%</span>
            </div>
          </div>
          <div className="form-group">
            <label>Salt</label>
            <div className="input-wrapper">
              <input type="number" step="0.1" value={salt} onChange={e => setSalt(e.target.value)} />
              <span>%</span>
            </div>
          </div>
          <div className="form-group">
            <label>Total Yeast (Fixed)</label>
            <div className="input-wrapper">
              <input type="number" step="0.1" value={yeast} onChange={e => setYeast(e.target.value)} />
              <span>g</span>
            </div>
          </div>
          <div className="form-group">
            <label>Total Oil (Fixed)</label>
            <div className="input-wrapper">
              <input type="number" step="0.1" value={oil} onChange={e => setOil(e.target.value)} />
              <span>g</span>
            </div>
          </div>
          <div className="form-group">
            <label>Total Poolish Weight (Fixed)</label>
            <div className="input-wrapper">
              <input type="number" step="1" value={poolishWeight} onChange={e => setPoolishWeight(e.target.value)} />
              <span>g</span>
            </div>
            <small style={{opacity: 0.6}}>Absolute amount of pre-ferment added (does not scale)</small>
          </div>

          <h3 className="section-title" style={{ fontSize: '1.1rem', marginTop: '1rem', width: '100%' }}>Flours (100% Target)</h3>
          {flours.map((f, i) => (
              <div key={f.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                  <input style={{ flex: 6, padding: '8px', borderRadius: '6px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-color)' }}
                      type="text" 
                      value={f.name} 
                      onChange={(e) => updateFlourName(f.id, e.target.value)} 
                      placeholder="e.g. Tipo 00" />
                  <input style={{ flex: 3, padding: '8px', borderRadius: '6px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-color)' }}
                      type="number" 
                      value={Math.round(f.percentage * 10) / 10} 
                      onChange={(e) => handleFlourChange(f.id, Number(e.target.value))} />
                  <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>%</span>
                  {flours.length > 1 && (
                      <button onClick={() => removeFlour(f.id)} className="btn-delete" style={{ padding: '0 4px', fontSize: '1.2rem' }}>×</button>
                  )}
              </div>
          ))}
          <button onClick={addFlour} style={{ background: 'transparent', border: '1px dashed var(--primary)', color: 'var(--text-color)', padding: '6px', borderRadius: '6px', cursor: 'pointer', width: '100%', marginTop: '4px' }}>
              + Add Flour Type
          </button>
        </section>

        {/* Center: Results */}
        <section className="glass-panel">
          <h2>Calculated Formula</h2>
          
          <div className="ingredient-row">
            <div className="ingredient-name">🧊 Target Dough Yield</div>
            <div className="ingredient-weight">{totalWeight.toFixed(1)} g</div>
          </div>

          <h3 className="section-title">Main Dough</h3>
          {flours.map(f => {
              const flourWeight = mainFlourTotal * (f.percentage / 100);
              return (
                  <div className="ingredient-row" key={f.id}>
                    <div className="ingredient-name">🌾 {f.name} {actualPoolishFlour > 0 && '(Remaining)'}</div>
                    <div className="ingredient-weight">{flourWeight.toFixed(1)} g</div>
                  </div>
              )
          })}
          
          <div className="ingredient-row">
            <div className="ingredient-name">💧 Water {actualPoolishWater > 0 && '(Remaining)'}</div>
            <div className="ingredient-weight">{mainWater.toFixed(1)} g</div>
          </div>
          <div className="ingredient-row">
            <div className="ingredient-name">🧂 Salt</div>
            <div className="ingredient-weight">{totalSalt.toFixed(1)} g</div>
          </div>
          <div className="ingredient-row">
            <div className="ingredient-name">🦠 Yeast</div>
            <div className="ingredient-weight">{totalYeast.toFixed(1)} g</div>
          </div>
          {totalOil > 0 && (
            <div className="ingredient-row">
              <div className="ingredient-name">🫒 Oil</div>
              <div className="ingredient-weight">{totalOil.toFixed(1)} g</div>
            </div>
          )}

          {actualPoolishFlour > 0 && (
            <>
              <h3 className="section-title">Use Poolish Pre-ferment</h3>
              <p style={{ opacity: 0.7, fontSize: '0.9rem', marginTop: 0 }}>Add the total completed poolish below into your main dough mix.</p>
              <div className="ingredient-row">
                <div className="ingredient-name">🥣 Total Poolish Quantity</div>
                <div className="ingredient-weight">{(actualPoolishFlour + actualPoolishWater).toFixed(1)} g</div>
              </div>
              <p style={{ opacity: 0.5, fontSize: '0.8rem', marginTop: '4px', marginBottom: 0 }}>Contains exactly {actualPoolishFlour.toFixed(1)}g neutral flour and {actualPoolishWater.toFixed(1)}g water equivalent subtracted from the main dough limits.</p>
            </>
          )}

          <div style={{ marginTop: '2rem' }}>
            <button className="btn" onClick={handleSave}>Save to Vault</button>
          </div>
        </section>

        {/* Right: Vault */}
        <section className="glass-panel vault-container">
          <h2>Recipe Vault</h2>
          {recipes.length === 0 ? (
            <p style={{ opacity: 0.6 }}>No recipes saved yet.</p>
          ) : (
            recipes.map(r => (
              <div key={r.id} className="recipe-card" onClick={() => loadRecipe(r)}>
                <div className="recipe-info">
                  <div className="recipe-title">{r.name}</div>
                  <div className="recipe-meta">
                    {r.doughBalls}x{r.ballWeight}g • {r.hydration}%💧
                  </div>
                </div>
                <button className="btn-delete" onClick={(e) => deleteRecipe(r.id!, e)}>
                  ×
                </button>
              </div>
            ))
          )}
        </section>
      </main>
    </>
  );
}
