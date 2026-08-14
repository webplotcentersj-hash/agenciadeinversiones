export default function PatternBanner({ position }: { position: 'top' | 'bottom' }) {
  return (
    <div
      className={`pattern-banner pattern-banner--${position} decade-band decade-band--${position} relative z-20`}
      aria-hidden="true"
    >
      <span>2016</span>
      <i />
      <em>10 años</em>
      <i />
      <span>2026</span>
    </div>
  );
}
