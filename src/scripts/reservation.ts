/**
 * Formulario de solicitud de reserva.
 * Sin backend propio: por defecto prepara un mensaje de WhatsApp o un correo con los datos.
 * Si PUBLIC_RESERVATION_ENDPOINT está definido, hace POST JSON a ese endpoint.
 */

interface Config {
  endpoint: string;
  whatsapp: string;
  email: string;
  locale: string;
  closedDays: number[];
  maxGuests: number;
  intro: string;
  labels: Record<string, string>;
  areas: Record<string, string>;
  errors: Record<string, string>;
  closedNote: string;
  msg: Record<string, string>;
}

const form = document.querySelector<HTMLFormElement>('[data-rform]');
if (form) init(form, JSON.parse(form.dataset.config || '{}') as Config);

function init(form: HTMLFormElement, cfg: Config) {
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const date = form.elements.namedItem('date') as HTMLInputElement;
  const dateNote = form.querySelector<HTMLElement>('#rf-date-note')!;

  const today = new Date();
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  date.min = iso(today);
  date.addEventListener('change', () => {
    const d = date.valueAsDate;
    dateNote.textContent = d && cfg.closedDays.includes(d.getUTCDay()) ? cfg.closedNote : '';
  });

  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  const setErr = (name: string, message: string) => {
    const el = field(name);
    const out = form.querySelector<HTMLElement>(`#rf-${name}-err`);
    if (out) out.textContent = message;
    el.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  };

  function validate(): boolean {
    const v = (n: string) => (field(n).value || '').trim();
    const checks: [string, string][] = [];
    if (!v('name')) checks.push(['name', cfg.errors.required]);
    else checks.push(['name', '']);
    const phoneDigits = v('phone').replace(/[^\d]/g, '');
    if (!v('phone')) checks.push(['phone', cfg.errors.required]);
    else if (phoneDigits.length < 9 || phoneDigits.length > 15 || !/^[+\d][\d\s().-]*$/.test(v('phone'))) checks.push(['phone', cfg.errors.phone]);
    else checks.push(['phone', '']);
    if (v('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))) checks.push(['email', cfg.errors.email]);
    else checks.push(['email', '']);
    if (!v('date')) checks.push(['date', cfg.errors.required]);
    else if (v('date') < iso(today)) checks.push(['date', cfg.errors.date]);
    else checks.push(['date', '']);
    checks.push(['time', v('time') ? '' : cfg.errors.required]);
    const g = Number(v('guests'));
    checks.push(['guests', g >= 1 && g <= cfg.maxGuests ? '' : cfg.errors.guests]);
    checks.push(['consent', (field('consent') as HTMLInputElement).checked ? '' : cfg.errors.consent]);

    let firstBad: string | null = null;
    for (const [n, m] of checks) {
      const ok = setErr(n, m);
      if (!ok && !firstBad) firstBad = n;
    }
    if (firstBad) field(firstBad).focus();
    return !firstBad;
  }

  form.querySelectorAll('input, select, textarea').forEach((el) =>
    el.addEventListener('input', () => {
      if (el.getAttribute('aria-invalid') === 'true') validate();
    }),
  );

  function data() {
    const v = (n: string) => (field(n).value || '').trim();
    return {
      name: v('name'),
      phone: v('phone'),
      email: v('email'),
      date: v('date'),
      time: v('time'),
      guests: v('guests'),
      area: v('area'),
      notes: v('notes'),
      allergies: v('allergies'),
      locale: cfg.locale,
    };
  }

  function formatDate(iso: string) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat(cfg.locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(y, m - 1, d));
  }

  function message() {
    const d = data();
    const L = cfg.labels;
    const lines = [
      cfg.intro,
      '',
      `${L.name}: ${d.name}`,
      `${L.phone}: ${d.phone}`,
      d.email && `${L.email.replace(/\s*\(.*\)$/, '')}: ${d.email}`,
      `${L.date}: ${formatDate(d.date)}`,
      `${L.time}: ${d.time}`,
      `${L.guests}: ${d.guests}`,
      `${L.area}: ${cfg.areas[d.area] ?? d.area}`,
      d.allergies && `${L.allergies}: ${d.allergies}`,
      d.notes && `${L.notes}: ${d.notes}`,
    ];
    return lines.filter((l): l is string => typeof l === 'string').join('\n');
  }

  const tone = (t: 'ok' | 'error' | '', text: string) => {
    status.dataset.tone = t;
    status.textContent = text;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    tone('', '');
    if (!validate()) return;
    if ((field('website') as HTMLInputElement).value) return; // honeypot
    const submitter = (e as SubmitEvent).submitter as HTMLElement | null;
    const mode = submitter?.dataset.submit || (cfg.endpoint ? 'endpoint' : 'whatsapp');

    if (mode === 'whatsapp') {
      window.open(`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(message())}`, '_blank', 'noopener');
      tone('ok', cfg.msg.opened);
    } else if (mode === 'email') {
      const href = `mailto:${cfg.email}?subject=${encodeURIComponent(cfg.msg.subject)}&body=${encodeURIComponent(message())}`;
      window.location.href = href;
      tone('ok', cfg.msg.openedEmail);
    } else {
      const btn = submitter as HTMLButtonElement | null;
      if (btn) btn.disabled = true;
      tone('', cfg.msg.sending);
      try {
        const res = await fetch(cfg.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data()),
        });
        if (!res.ok) throw new Error(String(res.status));
        tone('ok', `${cfg.msg.sentTitle}. ${cfg.msg.sentText}`);
        form.reset();
      } catch {
        tone('error', cfg.msg.error);
      } finally {
        if (btn) btn.disabled = false;
      }
    }
  });
}

export {};
