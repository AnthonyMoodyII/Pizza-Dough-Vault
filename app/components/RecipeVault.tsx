'use client';
import { memo, useCallback, useEffect, useState } from 'react';
import RecipeCard, { RecipeSummary } from './RecipeCard';

const STYLE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'neapolitan', label: 'Neapolitan' },
  { id: 'newyork', label: 'New York' },
  { id: 'roma', label: 'Roma' },
  { id: 'newhaven', label: 'New Haven' },
  { id: 'chicagothin', label: 'Chicago Thin' },
];

type Props = {
  refreshKey?: number;
  selectedId: string | null;
  onSelectId: (id: string | null) => void;
};

function RecipeVault({ refreshKey, selectedId, onSelectId }: Props) {
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [filter, setFilter] = useState('all');
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
    // Optimistic update: flip locally first, then persist in the background.
    setRecipes((prev) =>
      prev.map((r) => (r.id === recipe.id ? { ...r, isFavorite: !r.isFavorite } : r)),
    );
    try {
      await fetch(`/api/recipes/${recipe.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !recipe.isFavorite }),
      });
    } catch {
      // Revert on failure.
      setRecipes((prev) =>
        prev.map((r) => (r.id === recipe.id ? { ...r, isFavorite: recipe.isFavorite } : r)),
      );
    }
  };

  const filtered = filter === 'all' ? recipes : recipes.filter((r) => r.styleId === filter);

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
              onSelect={() => onSelectId(r.id === selectedId ? null : r.id)}
              onToggleFavorite={() => toggleFavorite(r)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default memo(RecipeVault);
