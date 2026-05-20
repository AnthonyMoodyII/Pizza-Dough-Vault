'use client';
import { STYLES, StyleId } from '@/lib/styles';

type Props = {
  value: StyleId;
  onChange: (id: StyleId) => void;
};

export default function StylePills({ value, onChange }: Props) {
  return (
    <div className="pill-row" role="tablist" aria-label="Pizza style">
      {STYLES.map((s) => (
        <button
          key={s.id}
          role="tab"
          aria-selected={value === s.id}
          className={`pill ${value === s.id ? 'pill-active' : ''}`}
          onClick={() => onChange(s.id)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
