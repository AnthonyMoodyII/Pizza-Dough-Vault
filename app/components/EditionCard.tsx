'use client';
import { Edition, Style } from '@/lib/styles';

type Props = {
  style: Style;
  edition: Edition;
  onChange: (editionId: string) => void;
};

export default function EditionCard({ style, edition, onChange }: Props) {
  return (
    <div className="edition-card">
      {style.editions.length > 1 ? (
        <select
          className="edition-select"
          value={edition.id}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Edition"
        >
          {style.editions.map((e) => (
            <option key={e.id} value={e.id}>
              {e.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="edition-title">{edition.label}</div>
      )}
      <div className="edition-diameter">
        Ø {edition.diameterCm[0]}–{edition.diameterCm[1]} cm
      </div>
      <div className="edition-desc">{edition.description}</div>
      <div className="edition-rec">Recommendation: {edition.recommendation}</div>
    </div>
  );
}
