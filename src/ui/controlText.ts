// Instruction texts name keyboard keys (E, Q, R, F, Boşluk, arrows). On a
// touch device the same sentences are rewritten to name the on-screen
// buttons instead (Eylem, Nefes, Biçim, Şarkı, Zıpla, yön düğmeleri).

const RULES: [RegExp, string][] = [
  // Whole phrases first.
  [/A \/ D ya da ← →/g, 'Yön düğmeleri'],
  [/← derin, ↓ orta, → yüksek \(A, S, D\)/g, 'derin, orta ve yüksek nota düğmeleriyle'],
  [/← → ile/g, 'yön düğmeleriyle'],
  [/← →/g, 'Yön düğmeleri'],
  [/Esc \/ Boşluk/g, 'Zıpla'],
  [/Boşluk: zıpla/g, 'Zıpla düğmesi: zıpla'],
  [/\(Boşluk\)/g, '(Zıpla düğmesi)'],
  [/Boşluk/g, 'Zıpla'],
  // Keys with Turkish case endings.
  [/E’ye tekrar tekrar bas/g, 'Eylem’e tekrar tekrar dokun'],
  [/E’ye bas/g, 'Eylem’e dokun'],
  [/E’yi/g, 'Eylem’i'],
  [/Q’yu/g, 'Nefes’i'],
  [/R’ye bas/g, 'Biçim’e dokun'],
  [/F’ye bas/g, 'Şarkı’ya dokun'],
  // Bare key letters used as words: "(Q)", "E ile", "R:", "… sonra E."
  [/(^|[\s(])E(?=[\s.:,)]|$)/g, '$1Eylem'],
  [/(^|[\s(])Q(?=[\s.:,)]|$)/g, '$1Nefes'],
  [/(^|[\s(])R(?=[\s.:,)]|$)/g, '$1Biçim'],
  [/(^|[\s(])F(?=[\s.:,)]|$)/g, '$1Şarkı'],
];

/** Rewrites keyboard key references for the on-screen touch controls. */
export function forTouch(text: string): string {
  let out = text;
  for (const [re, rep] of RULES) out = out.replace(re, rep);
  return out;
}

/** The instruction as shown on this device (touch wording when touch UI is on). */
export function controlText(text: string): string {
  const touch = typeof document !== 'undefined' && document.documentElement.classList.contains('touch-ui');
  return touch ? forTouch(text) : text;
}
