// A tiny dependency-free confetti burst. Spawns coloured bits that fall and
// fade, then clean themselves up. Respects prefers-reduced-motion.
const COLORS = ['#3f9d5b', '#e0583b', '#2f6bd8', '#7a5af0', '#d98a2b', '#1d9e93'];

export function confetti({ count = 90, duration = 2200 } = {}) {
  if (typeof document === 'undefined') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  const root = document.createElement('div');
  root.style.cssText =
    'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden';
  document.body.appendChild(root);

  for (let i = 0; i < count; i++) {
    const bit = document.createElement('div');
    const size = 6 + Math.random() * 8;
    const left = Math.random() * 100;
    const delay = Math.random() * 300;
    const rotate = Math.random() * 360;
    const drift = (Math.random() - 0.5) * 240;
    bit.style.cssText = `
      position:absolute; top:-20px; left:${left}vw;
      width:${size}px; height:${size * 0.5}px;
      background:${COLORS[i % COLORS.length]};
      border-radius:2px; opacity:1;
      transform:rotate(${rotate}deg);
      animation: d2o-fall ${duration}ms cubic-bezier(.3,.6,.4,1) ${delay}ms forwards;
      --drift:${drift}px;`;
    root.appendChild(bit);
  }

  if (!document.getElementById('d2o-confetti-kf')) {
    const style = document.createElement('style');
    style.id = 'd2o-confetti-kf';
    style.textContent =
      '@keyframes d2o-fall{to{transform:translate(var(--drift),105vh) rotate(720deg);opacity:0}}';
    document.head.appendChild(style);
  }

  setTimeout(() => root.remove(), duration + 400);
}
