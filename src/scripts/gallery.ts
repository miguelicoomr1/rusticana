/** Filtros de categoría + visor (lightbox) accesible con <dialog>. */

function init() {
  const grid = document.querySelector<HTMLElement>('.gal__grid');
  if (!grid) return;

  /* ---- filtros ---- */
  const chips = document.querySelectorAll<HTMLButtonElement>('[data-gal-filters] .chip');
  chips.forEach((chip) =>
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter || 'all';
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      grid.querySelectorAll<HTMLElement>('.gal__item').forEach((li) => {
        li.hidden = !(f === 'all' || li.dataset.cat === f);
      });
    }),
  );

  /* ---- visor ---- */
  const dlg = document.querySelector<HTMLDialogElement>('[data-lightbox]');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  const img = dlg.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const cap = dlg.querySelector<HTMLElement>('[data-lb-caption]')!;
  const count = dlg.querySelector<HTMLElement>('[data-lb-count]')!;
  const tpl: string = (window as unknown as { __lbCounter?: string }).__lbCounter || '{n} / {total}';
  const openers = [...grid.querySelectorAll<HTMLButtonElement>('.gal__open')];
  let current = 0;
  let last: HTMLElement | null = null;

  const visible = () => openers.filter((b) => !b.closest<HTMLElement>('.gal__item')!.hidden);
  const show = (btn: HTMLButtonElement) => {
    const list = visible();
    current = Math.max(0, list.indexOf(btn));
    img.src = btn.dataset.full || '';
    img.alt = btn.dataset.alt || '';
    cap.textContent = btn.dataset.alt || '';
    count.textContent = tpl.replace('{n}', String(current + 1)).replace('{total}', String(list.length));
  };
  const step = (d: number) => {
    const list = visible();
    if (!list.length) return;
    show(list[(current + d + list.length) % list.length]);
  };

  openers.forEach((b) =>
    b.addEventListener('click', () => {
      last = b;
      show(b);
      dlg.showModal();
    }),
  );
  dlg.querySelector('[data-lb-close]')?.addEventListener('click', () => dlg.close());
  dlg.querySelector('[data-lb-prev]')?.addEventListener('click', () => step(-1));
  dlg.querySelector('[data-lb-next]')?.addEventListener('click', () => step(1));
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) dlg.close();
  });
  dlg.addEventListener('close', () => last?.focus());

  let x0 = 0;
  dlg.addEventListener('touchstart', (e) => (x0 = e.changedTouches[0].clientX), { passive: true });
  dlg.addEventListener(
    'touchend',
    (e) => {
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) step(dx > 0 ? -1 : 1);
    },
    { passive: true },
  );
}

init();

export {};
