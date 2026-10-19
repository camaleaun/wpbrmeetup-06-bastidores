// Serves build/ (review page, video, slides) on the local network and relays the video's
// playback time from the computer to any phone that opens /teleprompter.html.
//
//   node review-server.mjs [port=8765]
// Computer: http://localhost:8765/review.html   Phone (same Wi-Fi): http://<this-mac-ip>:8765/teleprompter.html
// Live talk: http://localhost:8765/show.html, the slides on their own clock (/slides/ is served too).
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { networkInterfaces } from 'node:os';
import { extname, join, normalize } from 'node:path';
import { build } from './lib.mjs';

const PORT = Number(process.argv[2] ?? 8765);
const ROOT = join(import.meta.dirname, build);
const SLIDES = join(import.meta.dirname, 'slides');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2',
  '.mp4': 'video/mp4', '.vtt': 'text/vtt', '.srt': 'text/plain; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };

let last = { t: 0, playing: false, at: Date.now() };
const listeners = new Set();
const broadcast = () => { const msg = `data: ${JSON.stringify(last)}\n\n`; for (const res of listeners) res.write(msg); };

createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/t' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => (body += c)).on('end', () => {
      try { last = { ...JSON.parse(body), at: Date.now() }; broadcast(); } catch { /* ignore bad payloads */ }
      res.writeHead(204).end();
    });
    return;
  }
  if (url.pathname === '/events') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write(`data: ${JSON.stringify(last)}\n\n`);
    listeners.add(res);
    req.on('close', () => listeners.delete(res));
    return;
  }
  // The slides live outside build/ (show.html shows them in an iframe).
  const base = url.pathname.startsWith('/slides/') ? SLIDES : ROOT;
  const rel = base === SLIDES ? url.pathname.slice('/slides'.length) : url.pathname === '/' ? '/review.html' : url.pathname;
  const path = normalize(join(base, decodeURIComponent(rel)));
  if (!path.startsWith(base) ||!existsSync(path) || statSync(path).isDirectory()) { res.writeHead(404).end('not found'); return; }
  const size = statSync(path).size;
  const type = TYPES[extname(path)] ?? 'application/octet-stream';
  // Range requests let the browser seek in the video.
  const range = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
  if (range) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Number(range[2]) : size - 1;
    res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 });
    createReadStream(path, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes' });
    createReadStream(path).pipe(res);
  }
}).listen(PORT, '0.0.0.0', () => {
  const ips = Object.values(networkInterfaces()).flat().filter((i) => i && i.family === 'IPv4' && !i.internal).map((i) => i.address);
  console.log(`computer: http://localhost:${PORT}/review.html`);
  console.log(`slides:   http://localhost:${PORT}/show.html`);
  for (const ip of ips) console.log(`phone:    http://${ip}:${PORT}/teleprompter.html`);
});
