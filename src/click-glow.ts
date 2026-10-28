export function installPreviewGlow() {
  const timers = new WeakMap<HTMLElement, number>();
  const targets = 'button, a, input, textarea, select, [role="button"], .preview, .project-showcase, .stat-card, .achievement-card, .skill-chip, .eco-node, .event-node, .eyebrow';

  const handleClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const clicked = target.closest<HTMLElement>(targets);
    if (!clicked) return;

    clicked.classList.add('is-click-lit');
    if (clicked.matches('.preview')) clicked.classList.add('is-lit');

    const previousTimer = timers.get(clicked);
    if (previousTimer) window.clearTimeout(previousTimer);

    const timer = window.setTimeout(() => {
      clicked.classList.remove('is-click-lit', 'is-lit');
      timers.delete(clicked);
    }, 1500);
    timers.set(clicked, timer);
  };

  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}
