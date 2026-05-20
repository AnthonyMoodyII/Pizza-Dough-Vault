'use client';

export type RecipeSummary = {
  id: string;
  name: string;
  styleId: string;
  editionId: string;
  mode: string;
  doughBalls: number;
  ballWeight: number;
  hydration: number;
  isFavorite: boolean;
  bakeCount: number;
  avgRating: number | null;
  updatedAt: string;
};

const STYLE_LABELS: Record<string, string> = {
  neapolitan: 'Neapolitan',
  newyork: 'New York',
  roma: 'Roma',
  newhaven: 'New Haven',
  chicagothin: 'Chicago Thin',
};

type Props = {
  recipe: RecipeSummary;
  selected: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
};

export default function RecipeCard({ recipe, selected, onSelect, onToggleFavorite }: Props) {
  return (
    <div
      className={`recipe-card ${selected ? 'recipe-card-selected' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
    >
      <div className="recipe-card-top">
        <span className={`style-badge style-badge-${recipe.styleId}`}>
          {STYLE_LABELS[recipe.styleId] ?? recipe.styleId}
        </span>
        <button
          className={`fav-btn ${recipe.isFavorite ? 'fav-btn-on' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          aria-label={recipe.isFavorite ? 'Unstar recipe' : 'Star recipe'}
        >
          {recipe.isFavorite ? '★' : '☆'}
        </button>
      </div>
      <div className="recipe-card-name">{recipe.name}</div>
      <div className="recipe-card-meta">
        {recipe.doughBalls} × {recipe.ballWeight} g · {recipe.hydration} %{recipe.mode === 'moodycrustmode' ? ' · CrustMode' : ''}
      </div>
      <div className="recipe-card-footer">
        <span className="recipe-bake-count">
          {recipe.bakeCount === 0 ? 'No bakes yet' : `${recipe.bakeCount} bake${recipe.bakeCount > 1 ? 's' : ''}`}
          {recipe.avgRating !== null && ` · ★${recipe.avgRating.toFixed(1)}`}
        </span>
      </div>
    </div>
  );
}
