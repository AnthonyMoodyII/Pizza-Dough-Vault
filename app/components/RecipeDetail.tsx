'use client';
import { useCallback, useEffect, useState } from 'react';
import BakeHistory, { Bake } from './BakeHistory';
import BakeLogForm from './BakeLogForm';

type FullRecipe = {
  id: string;
  name: string;
  description: string | null;
  styleId: string;
  editionId: string;
  mode: string;
  doughBalls: number;
  ballWeight: number;
  hydration: number;
  saltPercent: number;
  oilPercent: number;
  sugarPercent: number | null;
  yeastType: string;
  fermentationHours: number;
  fermentationTempC: number;
  useColdFerment: boolean;
  tags: string[];
  bakes: Bake[];
};

type Props = {
  recipeId: string;
  currentIngredients: Record<string, unknown>;
  currentSchedule: Record<string, unknown>;
  onClose: () => void;
  onDeleted: () => void;
};

export default function RecipeDetail({
  recipeId,
  currentIngredients,
  currentSchedule,
  onClose,
  onDeleted,
}: Props) {
  const [recipe, setRecipe] = useState<FullRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogForm, setShowLogForm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/recipes/${recipeId}`);
      if (res.ok) setRecipe(await res.json());
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  useEffect(() => { load(); }, [load]);

  const handleDeleteBake = async (bakeId: string) => {
    if (!recipe) return;
    await fetch(`/api/recipes/${recipeId}/bakes/${bakeId}`, { method: 'DELETE' });
    load();
  };

  const handleDeleteRecipe = async () => {
    if (!confirm('Delete this recipe and all its bakes?')) return;
    setDeleting(true);
    await fetch(`/api/recipes/${recipeId}`, { method: 'DELETE' });
    onDeleted();
  };

  if (loading) return <div className="recipe-detail-loading">Loading…</div>;
  if (!recipe) return null;

  const rated = recipe.bakes.filter((b) => b.rating != null);
  const avgRating = rated.length
    ? rated.reduce((a, b) => a + (b.rating as number), 0) / rated.length
    : null;

  return (
    <div className="recipe-detail">
      <div className="recipe-detail-header">
        <div>
          <div className="recipe-detail-name">{recipe.name}</div>
          {recipe.description && <p className="recipe-detail-desc">{recipe.description}</p>}
          <div className="recipe-detail-stats">
            {recipe.doughBalls} × {recipe.ballWeight} g · {recipe.hydration} % hydr · {recipe.fermentationHours} h
            {avgRating !== null && ` · ★ ${avgRating.toFixed(1)} avg`}
          </div>
        </div>
        <div className="recipe-detail-actions">
          <button className="btn-ghost btn-sm" onClick={handleDeleteRecipe} disabled={deleting}>
            Delete
          </button>
          <button className="btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="recipe-detail-params">
        {[
          `${recipe.saltPercent} % salt`,
          recipe.oilPercent ? `${recipe.oilPercent} % oil` : null,
          recipe.sugarPercent ? `${recipe.sugarPercent} % sugar` : null,
          recipe.useColdFerment ? 'cold ferment' : 'room temp',
          recipe.yeastType.toUpperCase(),
        ].filter(Boolean).join(' · ')}
      </div>

      {recipe.tags.length > 0 && (
        <div className="tag-row">
          {recipe.tags.map((t) => <span key={t} className="tag-chip">{t}</span>)}
        </div>
      )}

      <div className="recipe-detail-section">
        <div className="recipe-detail-section-header">
          <h3>Bake History</h3>
          {!showLogForm && (
            <button className="btn-primary btn-sm" onClick={() => setShowLogForm(true)}>
              Log This Bake
            </button>
          )}
        </div>

        {showLogForm ? (
          <BakeLogForm
            recipeId={recipeId}
            ingredients={currentIngredients}
            schedule={currentSchedule}
            onSaved={() => { setShowLogForm(false); load(); }}
            onCancel={() => setShowLogForm(false)}
          />
        ) : (
          <BakeHistory bakes={recipe.bakes} onDelete={handleDeleteBake} />
        )}
      </div>
    </div>
  );
}
