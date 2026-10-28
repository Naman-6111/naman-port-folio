export function installPreviewGlow() {
  const timers = new WeakMap<HTMLElement, number>();

  const handleClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const preview = target.closest<HTMLElement>('.preview');
    if (!preview) return;

    preview.classList.add('is-lit');
    const previousTimer = timers.get(preview);
    if (previousTimer) window.clearTimeout(previousTimer);

    const timer = window.setTimeout(() => preview.classList.remove('is-lit'), 900);
    timers.set(preview, timer);
  };

  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}
