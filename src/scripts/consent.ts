/**
 * CMP ligero (RGPD / LSSI-CE): nada opcional se carga antes del consentimiento.
 * Categorías: necesarias (siempre), analítica (GA4, solo si hay ID), mapas de Google (contenido embebido).
 */

export interface Consent {
  v: 1;
  analytics: boolean;
  maps: boolean;
  ts: number;
}

const KEY = 'rusticana-consent';
const EVT = 'rusticana:consent';

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    return c && c.v === 1 ? c : null;
  } catch {
    return null;
  }
}

function writeConsent(c: Omit<Consent, 'v' | 'ts'>) {
  const full: Consent = { v: 1, ts: Date.now(), ...c };
  try {
    localStorage.setItem(KEY, JSON.stringify(full));
  } catch {
    /* sin almacenamiento: el consentimiento vale solo para esta página */
  }
  document.dispatchEvent(new CustomEvent(EVT, { detail: full }));
  return full;
}

let gaLoaded = false;
function loadAnalytics(id: string) {
  if (gaLoaded || !id) return;
  gaLoaded = true;
  const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  w.gtag('js', new Date());
  w.gtag('config', id, { anonymize_ip: true });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

function init() {
  const root = document.querySelector<HTMLElement>('[data-consent]');
  if (!root) return;
  const ga4 = root.dataset.ga4 || '';
  const panel = root.querySelector<HTMLElement>('[data-consent-panel]')!;
  const details = root.querySelector<HTMLElement>('[data-consent-details]')!;
  const analyticsBox = root.querySelector<HTMLInputElement>('[data-consent-analytics]');
  const mapsBox = root.querySelector<HTMLInputElement>('[data-consent-maps]');
  const toggleDetails = root.querySelector<HTMLButtonElement>('[data-consent-toggle]');

  const apply = (c: Consent | null) => {
    if (c?.analytics) loadAnalytics(ga4);
  };

  const show = (withDetails = false) => {
    const c = readConsent();
    if (analyticsBox) analyticsBox.checked = !!c?.analytics;
    if (mapsBox) mapsBox.checked = !!c?.maps;
    root.hidden = false;
    details.hidden = !withDetails;
    toggleDetails?.setAttribute('aria-expanded', String(withDetails));
    panel.focus({ preventScroll: true });
  };
  const hide = () => {
    root.hidden = true;
  };

  root.querySelector('[data-consent-accept]')?.addEventListener('click', () => {
    apply(writeConsent({ analytics: !!ga4, maps: true }));
    hide();
  });
  root.querySelector('[data-consent-reject]')?.addEventListener('click', () => {
    writeConsent({ analytics: false, maps: false });
    hide();
  });
  root.querySelector('[data-consent-save]')?.addEventListener('click', () => {
    apply(writeConsent({ analytics: !!analyticsBox?.checked, maps: !!mapsBox?.checked }));
    hide();
  });
  toggleDetails?.addEventListener('click', () => {
    const open = details.hidden;
    details.hidden = !open;
    toggleDetails.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('[data-consent-open]').forEach((b) => b.addEventListener('click', () => show(true)));
  root.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Escape' && readConsent()) hide();
  });

  const existing = readConsent();
  if (existing) apply(existing);
  else {
    // Primera visita: se muestra en la primera interacción (o a los 8 s) para no competir con el LCP.
    // Hasta entonces no se carga nada opcional.
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      ['scroll', 'pointerdown', 'keydown', 'touchstart'].forEach((ev) => window.removeEventListener(ev, go));
      show(false);
    };
    ['scroll', 'pointerdown', 'keydown', 'touchstart'].forEach((ev) => window.addEventListener(ev, go, { passive: true, once: true }));
    window.setTimeout(go, 8000);
  }
}

init();
