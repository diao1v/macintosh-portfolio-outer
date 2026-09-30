import type { Mode } from '../types/mode';

export default function ModeToggle({ mode, disabled, onToggle }: { mode: Mode; disabled: boolean; onToggle(): void }) {
  const next = mode === '1984' ? '2084' : '1984';
  return (
    <button
      type='button'
      onClick={onToggle}
      disabled={disabled}
      aria-label={`Switch to ${next}`}
      className={`mode-toggle ${mode === '2084' ? 'mode-toggle--neon' : ''}`}
    >
      {mode === '1984' ? '▶ 2084' : '◀ 1984'}
    </button>
  );
}
