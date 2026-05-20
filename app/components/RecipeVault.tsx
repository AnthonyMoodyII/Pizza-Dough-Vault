'use client';
import { useCallback, useEffect, useState } from 'react';
import RecipeCard, { RecipeSummary } from './RecipeCard';
import RecipeDetail from './RecipeDetail';

const STYLE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'neapolitan', label: 'Neapolitan' },
  { id: 'newyork', label: 'New York' },
  { id: 'roma', label: 'Roma' },
  { id: 'newhaven', label: 'New Haven' },
  { id: 'chicagothin', label: 'Chicago Thin' },
];

type Props = {
  currentIngredients: Record<string, unknown>;
  currentSchedule: Record<string, unknown>;
  refreshKey?: number;
};

export default function RecipeVault({ currentIngredients, currentSchedule, refreshKey }: Props) {
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/recipes');
      if (res.ok) setRecipes(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load, refreshKey]);

  const toggleFavorite = async (recipe: RecipeSummary) => {
    await fetch(`/api/recipes/${recipe.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFavorite: !recipe.isFavorite }),
    });
    load();
  };

  const filtered = filter === 'all' ? recipes : recipes.filter((r) => r.styleId === filter);
  const selected = recipes.find((r) => r.id === selectedId) ?? null;

  return (
    <section className="glass-panel vault-panel">
      <h2>Vault</h2>

      <div className="chip-row vault-filters">
        {STYLE_FILTERS.map((f) => (
          <button
            key={f.id}
            className={`chip ${filter === f.id ? 'chip-active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <p className="muted">Loading…</p>}

      {!loading && filtered.length === 0 && (
        <p className="placeholder-note">
          {recipes.length === 0
            ? 'No saved recipes yet. Hit "Save Recipe" to capture your first formula.'
            : 'No recipes match this filter.'}
        </p>
      )}

      {filtered.length > 0 && (
        <div className="recipe-list">
          {filtered.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              selected={r.id === selectedId}
              onSelect={() => setSelectedId(r.id === selectedId ? null : r.id)}
              onToggleFavorite={() => toggleFavorite(r)}
            />
          ))}
        </div>
      )}

      {selected && (
        <RecipeDetail
          recipeId={selected.id}
          currentIngredients={currentIngredients}
          currentSchedule={currentSchedule}
          onClose={() => setSelectedId(null)}
          onDeleted={() => { setSelectedId(null); load(); }}
        />
      )}
    </section>
  );
}
