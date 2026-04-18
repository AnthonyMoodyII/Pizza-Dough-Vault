'use client';
import { useState, useEffect } from 'react';

type Recipe = {
  id?: string;
  name: string;
  doughBalls: number;
  ballWeight: number;
  hydration: number;
  salt: number;
  yeast: number;
  oil?: number | null;
  poolish?: number | null;
};

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipeName, setRecipeName] = useState('My Neapolitan Dough');
  
  // Inputs
  const [doughBalls, setDoughBalls] = useState<number>(4);
  const [ballWeight, setBallWeight] = useState<number>(250);
  const [hydration, setHydration] = useState<number>(65);
  const [salt, setSalt] = useState<number>(2.5);
  const [yeast, setYeast] = useState<number>(0.5);
  const [oil, setOil] = useState<number>(0);
  const [poolish, setPoolish] = useState<number>(0); // Percentage of total flour

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

  // Calculation Logic
  const totalWeight = doughBalls * ballWeight;
  const totalPercentage = 100 + hydration + salt + yeast + (oil || 0);
  
  const totalFlour = totalWeight / (totalPercentage / 100);
  const totalWater = totalFlour * (hydration / 100);
  const totalSalt = totalFlour * (salt / 100);
  const totalYeast = totalFlour * (yeast / 100);
  const totalOil = oil ? totalFlour * (oil / 100) : 0;

  // Poolish deductions (Poolish is equal parts flour and water, and its size is based on % of total flour)
  const poolishFlour = poolish ? totalFlour * (poolish / 100) : 0;
  const poolishWater = poolishFlour;

  // Ensure poolish doesn't exceed total water
  const actualPoolishWater = Math.min(poolishWater, totalWater);
  const actualPoolishFlour = actualPoolishWater; // Keep 100% hydration in poolish safely

  const mainFlour = totalFlour - actualPoolishFlour;
  const mainWater = totalWater - actualPoolishWater;

  const handleSave = async () => {
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: recipeName,
          doughBalls,
          ballWeight,
          hydration,
          salt,
          yeast,
          oil,
          poolish
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
    setYeast(r.yeast);
    setOil(r.oil || 0);
    setPoolish(r.poolish || 0);
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
          <h2>Parameters</h2>
          
          <div className="form-group">
            <label>Recipe Name</label>
            <input type="text" value={recipeName} onChange={e => setRecipeName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Dough Balls</label>
            <div className="input-wrapper">
              <input type="number" value={doughBalls} onChange={e => setDoughBalls(Number(e.target.value))} />
              <span>x</span>
            </div>
          </div>
          <div className="form-group">
            <label>Ball Weight</label>
            <div className="input-wrapper">
              <input type="number" value={ballWeight} onChange={e => setBallWeight(Number(e.target.value))} />
              <span>g</span>
            </div>
          </div>
          <div className="form-group">
            <label>Hydration</label>
            <div className="input-wrapper">
              <input type="number" value={hydration} onChange={e => setHydration(Number(e.target.value))} />
              <span>%</span>
            </div>
          </div>
          <div className="form-group">
            <label>Salt</label>
            <div className="input-wrapper">
              <input type="number" step="0.1" value={salt} onChange={e => setSalt(Number(e.target.value))} />
              <span>%</span>
            </div>
          </div>
          <div className="form-group">
            <label>Yeast</label>
            <div className="input-wrapper">
              <input type="number" step="0.1" value={yeast} onChange={e => setYeast(Number(e.target.value))} />
              <span>%</span>
            </div>
          </div>
          <div className="form-group">
            <label>Oil (Optional)</label>
            <div className="input-wrapper">
              <input type="number" step="0.1" value={oil} onChange={e => setOil(Number(e.target.value))} />
              <span>%</span>
            </div>
          </div>
          <div className="form-group">
            <label>Poolish (Optional)</label>
            <div className="input-wrapper">
              <input type="number" step="1" value={poolish} onChange={e => setPoolish(Number(e.target.value))} />
              <span>%</span>
            </div>
          </div>
        </section>

        {/* Center: Results */}
        <section className="glass-panel">
          <h2>Calculated Formula</h2>
          
          <div className="ingredient-row">
            <div className="ingredient-name">🧊 Total Dough Weight</div>
            <div className="ingredient-weight">{totalWeight.toFixed(1)} g</div>
          </div>

          <h3 className="section-title">Main Dough</h3>
          <div className="ingredient-row">
            <div className="ingredient-name">🌾 Flour {actualPoolishFlour > 0 && '(Remaining)'}</div>
            <div className="ingredient-weight">{mainFlour.toFixed(1)} g</div>
          </div>
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
              <h3 className="section-title">Poolish (Pre-ferment)</h3>
              <p style={{ opacity: 0.7, fontSize: '0.9rem', marginTop: 0 }}>Mix 12-24 hours ahead</p>
              <div className="ingredient-row">
                <div className="ingredient-name">🌾 Flour</div>
                <div className="ingredient-weight">{actualPoolishFlour.toFixed(1)} g</div>
              </div>
              <div className="ingredient-row">
                <div className="ingredient-name">💧 Water</div>
                <div className="ingredient-weight">{actualPoolishWater.toFixed(1)} g</div>
              </div>
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
