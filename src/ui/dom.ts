type Child = Node | string | null | undefined | false;

/** Tiny element builder. `on*` attributes become listeners. */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, unknown> = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') {
      el.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
    } else if (k === 'class') {
      el.className = String(v);
    } else if (k === 'html') {
      el.innerHTML = String(v);
    } else if (k === 'text') {
      el.textContent = String(v);
    } else if (v === true) {
      el.setAttribute(k, '');
    } else {
      el.setAttribute(k, String(v));
    }
  }
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue;
    el.append(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return el;
}

export function svgIcon(markup: string, viewBox = '0 0 24 24'): string {
  return `<svg viewBox="${viewBox}" aria-hidden="true" focusable="false">${markup}</svg>`;
}

export const ICONS = {
  pause: svgIcon('<rect x="6" y="4" width="4" height="16" rx="1.5" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1.5" fill="currentColor"/>'),
  left: svgIcon('<path d="M15 4L7 12l8 8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'),
  right: svgIcon('<path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'),
  jump: svgIcon('<path d="M12 4v14M6 10l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'),
  action: svgIcon('<path d="M12 3l3 6 6 1-4.5 4.5L18 21l-6-3-6 3 1.5-6.5L3 10l6-1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'),
  focus: svgIcon('<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/>'),
  form: svgIcon('<path d="M4 8h13l-3-3M20 16H7l3 3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'),
  song: svgIcon('<path d="M2 12c2-5 4-5 6 0s4 5 6 0 4-5 6 0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'),
  close: svgIcon('<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'),
  fullscreen: svgIcon('<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'),
};

/** Shape + color per whale note; shape is the primary cue (not colour). */
export const NOTE_SVG: Record<'low' | 'mid' | 'high', string> = {
  low: svgIcon('<circle cx="12" cy="12" r="8.5" fill="#548CD6" stroke="#191728" stroke-width="2.6"/><path d="M7 13c2 2 8 2 10 0" fill="none" stroke="#191728" stroke-width="1.6"/>'),
  mid: svgIcon('<path d="M12 2.5l8.5 9.5-8.5 9.5-8.5-9.5z" fill="#53BFAF" stroke="#191728" stroke-width="2.6" stroke-linejoin="round"/>'),
  high: svgIcon('<path d="M12 3l9.5 17h-19z" fill="#DE9960" stroke="#191728" stroke-width="2.6" stroke-linejoin="round"/>'),
};

/** Arrow/Tab focus navigation among the focusable controls of a container. */
export function focusables(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), [tabindex="0"]')].filter(
    (el) => el.offsetParent !== null,
  );
}

/**
 * Buttons of keyboard-driven panels: a mouse click must not leave focus on
 * them, or a later Space/Enter meant for the panel would re-press them.
 */
export function noClickFocus<T extends HTMLElement>(el: T): T {
  el.addEventListener('mousedown', (e) => e.preventDefault());
  return el;
}
