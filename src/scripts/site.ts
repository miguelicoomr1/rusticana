/** Comportamiento global mínimo: cabecera, menú móvil, revelado, preferencia de idioma. */

const LANG_KEY = 'rusticana-lang';

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* almacenamiento bloqueado: se ignora */
  }
}

/* ---- Cabecera sólida al hacer scroll (solo aplica al modo overlay) ---- */
function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const sentinel = document.querySelector('[data-header-sentinel]');
  if (!header) return;
  if (header.dataset.overlay !== 'true' || !sentinel || !('IntersectionObserver' in window)) {
    header.classList.add('is-solid');
    return;
  }
  const io = new IntersectionObserver(
    ([entry]) => header.classList.toggle('is-solid', !entry.isIntersecting),
    { threshold: 0 },
  );
  io.observe(sentinel);
}

/* ---- Menús <details>: cerrar con Escape / clic fuera / al navegar ---- */
function initDisclosures() {
  const all = () => document.querySelectorAll<HTMLDetailsElement>('details[data-lang-menu], details[data-mnav]');
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    all().forEach((d) => {
      if (d.open) {
        d.open = false;
        d.querySelector<HTMLElement>('summary')?.focus();
      }
    });
  });
  document.addEventListener('click', (e) => {
    all().forEach((d) => {
      if (d.open && !d.contains(e.target as Node)) d.open = false;
    });
  });
  document.querySelectorAll<HTMLAnchorElement>('details[data-mnav] a').forEach((a) =>
    a.addEventListener('click', () => {
      const d = a.closest('details');
      if (d) d.open = false;
    }),
  );
}

/* ---- Revelado al hacer scroll (visible por defecto sin JS) ---- */
function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  els.forEach((el) => io.observe(el));
}

/* ---- Idioma: guardar preferencia al cambiar manualmente + sugerencia discreta ---- */
function initLanguage() {
  document.querySelectorAll<HTMLAnchorElement>('[data-lang-link]').forEach((a) =>
    a.addEventListener('click', () => {
      const code = a.dataset.langLink;
      if (code) safeSet(LANG_KEY, code);
    }),
  );

  const bar = document.querySelector<HTMLElement>('[data-lang-suggest]');
  if (!bar || safeGet(LANG_KEY)) return;
  const current = document.documentElement.lang.slice(0, 2);
  const supported: Record<string, string> = JSON.parse(bar.dataset.targets || '{}');
  const preferred = (navigator.languages?.length ? navigator.languages : [navigator.language])
    .map((l) => l.slice(0, 2).toLowerCase())
    .find((l) => l in supported);
  if (!preferred || preferred === current) return;
  const target = supported[preferred];
  const messages: Record<string, string> = JSON.parse(bar.dataset.messages || '{}');
  const link = bar.querySelector<HTMLAnchorElement>('[data-lang-suggest-link]');
  const text = bar.querySelector<HTMLElement>('[data-lang-suggest-text]');
  if (!link || !text || !messages[preferred]) return;
  link.href = target;
  link.setAttribute('hreflang', preferred);
  link.lang = preferred;
  link.dataset.langLink = preferred;
  link.addEventListener('click', () => safeSet(LANG_KEY, preferred));
  text.textContent = messages[preferred];
  text.lang = preferred;
  bar.hidden = false;
  bar.querySelector('[data-lang-suggest-close]')?.addEventListener('click', () => {
    safeSet(LANG_KEY, current);
    bar.hidden = true;
  });
}

initHeader();
initDisclosures();
initReveal();
initLanguage();
