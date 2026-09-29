// Packages deliverables into release/: the committed source tree (git
// archive) and the ready-to-host production build.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const name = `${pkg.name}-${pkg.version}`;
mkdirSync('release', { recursive: true });
if (!existsSync('dist/index.html')) {
  console.error('dist/ is missing — run `npm run build` first.');
  process.exit(1);
}
execFileSync('git', ['archive', '--format=zip', `--prefix=${name}/`, '-o', `release/${name}-source.zip`, 'HEAD'], { stdio: 'inherit' });
execFileSync('zip', ['-qr', `../release/${name}-dist.zip`, '.'], { cwd: 'dist', stdio: 'inherit' });
console.log(`release/${name}-source.zip\nrelease/${name}-dist.zip`);
