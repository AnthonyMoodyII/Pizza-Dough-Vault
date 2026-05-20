'use client';

export type Mode = 'easy' | 'moodycrustmode';

type Props = {
  value: Mode;
  onChange: (m: Mode) => void;
};

export default function ModePills({ value, onChange }: Props) {
  return (
    <div className="pill-row mode-row" role="tablist" aria-label="Mode">
      <button
        role="tab"
        aria-selected={value === 'easy'}
        className={`pill ${value === 'easy' ? 'pill-active' : ''}`}
        onClick={() => onChange('easy')}
      >
        Bake It Easy
      </button>
      <button
        role="tab"
        aria-selected={value === 'moodycrustmode'}
        className={`pill ${value === 'moodycrustmode' ? 'pill-active' : ''}`}
        onClick={() => onChange('moodycrustmode')}
      >
        Moody-CrustMode
      </button>
    </div>
  );
}
