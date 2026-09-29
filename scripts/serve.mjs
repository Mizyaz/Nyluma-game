// Minimal static file server used by the browser tests. It can mount a
// directory under a sub-path to mimic a GitHub Pages project site.
// usage: node scripts/serve.mjs <dir> <port> [basePath]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const [dir = 'dist', port = '4173', base = '/'] = process.argv.slice(2);
const root = resolve(dir);
const prefix = base.endsWith('/') ? base : base + '/';
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.m4a': 'audio/mp4',
  '.wav': 'audio/wav',
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://localhost');
    let path = decodeURIComponent(url.pathname);
    if (!path.startsWith(prefix)) {
      if (path + '/' === prefix) {
        res.writeHead(301, { Location: prefix });
        return res.end();
      }
      res.writeHead(404);
      return res.end('not found');
    }
    path = path.slice(prefix.length);
    if (path === '' || path.endsWith('/')) path += 'index.html';
    const file = normalize(join(root, path));
    if (!file.startsWith(root)) {
      res.writeHead(403);
      return res.end();
    }
    const info = await stat(file).catch(() => null);
    if (!info || !info.isFile()) {
      res.writeHead(404);
      return res.end('not found');
    }
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(await readFile(file));
  } catch (e) {
    res.writeHead(500);
    res.end(String(e));
  }
}).listen(Number(port), () => console.log(`serving ${root} at http://localhost:${port}${prefix}`));
