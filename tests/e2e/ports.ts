// Ports of the local servers the browser tests run against (the production
// build at the domain root and under a sub-path, and the e2e build).
// KD_E2E_PORTS="5401,5402,5403" moves them, e.g. when these are taken.
const [root = 4173, sub = 4174, e2e = 4175] = (process.env.KD_E2E_PORTS ?? '').split(',').filter(Boolean).map(Number);

export const PORTS = { root, sub, e2e } as const;
