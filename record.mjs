// Records the video track from script.yaml, deterministically: the slides
// (slides/*.html), stepped in time with the narration.
//
// Frames come from Chrome's DevTools screencast (sharper than Playwright's recordVideo)
// and are timestamped, so the final video keeps the real timing of every move.
// Each scene lasts at least as long as its narration (build/durations.json from tts.mjs);
// `cue: N` runs an action when sentence N of the narration starts.
// Long waits (a job running, a page loading) can be cut out with `cut: true`.
//
// Output: build/frames/*.jpg, build/frames.ffconcat (video track) and build/timeline.json
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import YAML from 'yaml';
import { build } from './lib.mjs';

const W = 1920, H = 1080;
const TAIL = 0.6;                 // seconds of breathing room after each scene's narration
const BASE = { slide: pathToFileURL('slides/').href };
const script = YAML.parse(readFileSync('script.yaml', 'utf8'));
const durations = JSON.parse(readFileSync(`${build}/durations.json`, 'utf8'));
const only = process.argv[2]?.split(',');  // `node record.mjs exportar,importar` records only those scenes, for quick iteration

rmSync(`${build}/frames`, { recursive: true, force: true });
mkdirSync(`${build}/frames`, { recursive: true });

// ---------------------------------------------------------------- clock + cuts
const now = () => Date.now() / 1000;
const cuts = [];                  // [from, to] in wall-clock seconds, removed from the video
let cutStart = null;
const startCut = () => { cutStart ??= now(); };
const endCut = () => { if (cutStart !== null) { cuts.push([cutStart, now()]); cutStart = null; } };
const cutTimeBefore = (t) => cuts.reduce((s, [a, b]) => s + Math.max(0, Math.min(b, t) - a), 0) + (cutStart !== null && t > cutStart ? t - cutStart : 0);
const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000));

// ---------------------------------------------------------------- browser
const browser = await chromium.launch({ args: ['--hide-scrollbars', '--force-color-profile=srgb'] });
const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, locale: 'pt-BR', colorScheme: 'light' });
const page = await context.newPage();

// Visible cursor and click ripple, re-injected on every navigation.
await context.addInitScript(() => {
  const css = `#__cursor{position:fixed;left:0;top:0;width:34px;height:34px;z-index:2147483647;pointer-events:none;
      transform:translate(-4px,-2px);filter:drop-shadow(0 3px 6px rgba(0,0,0,.35));transition:opacity .2s}
    .__ripple{position:fixed;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;z-index:2147483646;pointer-events:none;
      background:rgba(200,16,46,.45);animation:__rip .55s ease-out forwards}
    @keyframes __rip{from{transform:scale(.3);opacity:1}to{transform:scale(1.6);opacity:0}}
    .__spot{outline:5px solid #c8102e!important;outline-offset:6px;border-radius:8px;transition:outline-color .3s}`;
  const svg = '<svg viewBox="0 0 24 24" width="34" height="34"><path d="M4 2l15 11-6.5 1.2L16.5 21l-3 1.4-3.6-6.9L4 20z" fill="#fff" stroke="#231f20" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  // Slides are narrated, not operated: no cursor on them.
  if (location.protocol === 'file:') return;
  const mount = () => {
    if (document.getElementById('__cursor')) return;
    const st = document.createElement('style'); st.textContent = css; document.documentElement.appendChild(st);
    const c = document.createElement('div'); c.id = '__cursor'; c.innerHTML = svg; document.documentElement.appendChild(c);
    c.style.left = innerWidth * 0.62 + 'px'; c.style.top = innerHeight * 0.6 + 'px';
  };
  document.addEventListener('mousemove', (e) => { mount(); const c = document.getElementById('__cursor'); c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; }, true);
  document.addEventListener('mousedown', (e) => { const r = document.createElement('div'); r.className = '__ripple'; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px'; document.documentElement.appendChild(r); setTimeout(() => r.remove(), 700); }, true);
  if (document.readyState !== 'loading') mount(); else document.addEventListener('DOMContentLoaded', mount);
});

// Screencast: every painted frame is saved with its wall-clock timestamp.
const frames = [];
const cdp = await context.newCDPSession(page);
let frameNo = 0;
cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
  cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  const file = `${build}/frames/${String(frameNo++).padStart(6, '0')}.jpg`;
  writeFileSync(file, Buffer.from(data, 'base64'));
  frames.push({ file, t: metadata.timestamp });
});
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: W, maxHeight: H, everyNthFrame: 1 });

// ---------------------------------------------------------------- cursor helpers
let cursor = [W * 0.62, H * 0.6];
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
async function moveTo(x, y, speed = 1) {
  const [x0, y0] = cursor;
  const dist = Math.hypot(x - x0, y - y0);
  const steps = Math.max(8, Math.round(dist / (28 * speed)));
  for (let i = 1; i <= steps; i++) {
    const k = ease(i / steps);
    await page.mouse.move(x0 + (x - x0) * k, y0 + (y - y0) * k);
    await sleep(0.012);
  }
  cursor = [x, y];
}
// A selector or a Playwright locator.
const find = (target) => (typeof target === 'string' ? page.locator(target) : target).first();
async function center(target) {
  const el = find(target);
  await el.waitFor({ state: 'visible', timeout: 20000 });
  await el.scrollIntoViewIfNeeded();
  const b = await el.boundingBox();
  return [b.x + b.width / 2, b.y + b.height / 2];
}
async function click(selector) {
  const [x, y] = await center(selector);
  await moveTo(x, y);
  await sleep(0.15);
  await page.mouse.down(); await page.mouse.up();
  await sleep(0.25);
}
async function typeInto(selector, text, delay = 55) {
  await click(selector);
  await find(selector).fill('');
  await page.keyboard.type(text, { delay });
}
async function settle() {
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.mouse.move(...cursor);
}
async function goto(target) {
  const [base, path] = target.includes(':') && !target.startsWith('http') ? target.split(/:(.*)/s) : ['', target];
  const url = BASE[base] ? BASE[base].replace(/\/$/, '') + (base === 'slide' ? '/' : '') + path.replace(/^\//, base === 'slide' ? '' : '/') : target;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await settle();
}

// ---------------------------------------------------------------- actions
async function run(action) {
  const [kind] = Object.keys(action).filter((k) => !['cue', 'cut'].includes(k));
  const raw = action[kind];
  const arg = raw;
  if (action.cut) startCut();
  switch (kind) {
    case 'slide': await goto(`slide:${arg}`); break;
    case 'step': await page.evaluate((n) => window.setStep(n), arg); break;
    case 'goto': await goto(arg); break;
    case 'click': await click(arg); break;
    case 'hover': await moveTo(...(await center(arg)), 0.8); break;
    case 'type': await typeInto(arg.into, arg.text, arg.delay); break;
    case 'press': await page.keyboard.press(arg); break;
    case 'select': await page.locator(arg.in).first().selectOption(arg.value); break;
    case 'waitFor': {
      // `waitFor: selector` or `waitFor: { sel, timeout }` (seconds) for long waits like a job.
      const { sel, timeout = 180 } = typeof arg === 'string' ? { sel: arg } : arg;
      await page.locator(sel).first().waitFor({ state: 'visible', timeout: timeout * 1000 });
      await settle();
      break;
    }
    // Waits until an element disappears (e.g. a 'pending' badge while a job runs); use with cut: true.
    case 'waitGone': await page.locator(arg).first().waitFor({ state: 'hidden', timeout: 1200000 }); await settle(); break;
    case 'scrollTo': {
      const { sel, block } = typeof arg === 'string' ? { sel: arg } : arg;
      await page.locator(sel).first().evaluate((el, b) => el.scrollIntoView({ behavior: 'smooth', block: b }), block ?? 'center');
      await sleep(1.1);
      break;
    }
    case 'scrollBy': await page.mouse.wheel(0, arg); await sleep(0.9); break;
    case 'spotlight': {
      const { sel, closest } = typeof arg === 'string' ? { sel: arg } : arg;
      await page.locator(sel).first().evaluate((el, c) => (c ? el.closest(c) : el).classList.add('__spot'), closest ?? null);
      break;
    }
    case 'drag': {
      // Drags across an element, from/to as fractions of its width (e.g. the compare slider).
      const el = page.locator(arg.on).first();
      await el.scrollIntoViewIfNeeded();
      const b = await el.boundingBox();
      const y = b.y + b.height * (arg.y ?? 0.5);
      await moveTo(b.x + b.width * arg.from, y);
      await page.mouse.down();
      for (const to of [].concat(arg.to)) await moveTo(b.x + b.width * to, y, 0.25);
      await page.mouse.up();
      break;
    }
    case 'unspotlight': await page.evaluate(() => document.querySelectorAll('.__spot').forEach((el) => el.classList.remove('__spot'))); break;
    case 'pause': await sleep(arg); break;
    case 'css': await page.addStyleTag({ content: arg }); break;
    case 'eval': await page.evaluate(arg); break;
    default: throw new Error(`unknown action: ${kind}`);
  }
  if (action.cut) endCut();
}

// ---------------------------------------------------------------- scenes
const timeline = { scenes: [] };

// Pre-roll (cut from the video): anything listed in script.preroll.
startCut();
for (const action of script.preroll ?? []) await run(action);
endCut();

for (const scene of script.scenes) {
  if (only && !only.includes(scene.id)) continue;
  const { duration, cues } = durations[scene.id] ?? { duration: 3, cues: [] };
  const t0 = now();
  const sceneTime = () => now() - t0 - (cutTimeBefore(now()) - cutTimeBefore(t0));
  for (const action of scene.actions ?? []) {
    if (action.cue) {
      const at = cues[action.cue - 1]?.at ?? 0;
      while (sceneTime() < at) await sleep(0.02);
    }
    await run(action);
  }
  const wanted = duration + TAIL;
  if (sceneTime() > wanted) console.warn(`! ${scene.id}: actions took ${sceneTime().toFixed(1)}s, narration is ${duration.toFixed(1)}s`);
  while (sceneTime() < wanted) await sleep(0.02);
  timeline.scenes.push({ id: scene.id, wallStart: t0, wallEnd: now() });
  console.log(`${scene.id.padEnd(12)} ${sceneTime().toFixed(1)}s`);
}
const wallEnd = now();
await sleep(0.3);
await cdp.send('Page.stopScreencast');
await browser.close();

// ---------------------------------------------------------------- video track
// Map wall-clock to video time (cuts removed), keep frames that fall inside scenes,
// and give each frame the duration until the next one.
const firstWall = timeline.scenes[0].wallStart;
const toVideo = (t) => t - firstWall - (cutTimeBefore(t) - cutTimeBefore(firstWall));
const inCut = (t) => cuts.some(([a, b]) => t >= a && t < b);
// The last frame painted before the first scene starts is the opening image.
const opening = frames.filter((f) => f.t <= firstWall).at(-1);
const kept = [...(opening ? [{ ...opening, t: firstWall }] : []), ...frames.filter((f) => f.t > firstWall && f.t <= wallEnd && !inCut(f.t))];
// A frame painted during a cut stays on screen until the next kept frame.
const lines = ['ffconcat version 1.0'];
kept.forEach((f, i) => {
  const next = i + 1 < kept.length ? toVideo(kept[i + 1].t) : toVideo(wallEnd);
  lines.push(`file '${f.file.replace(`${build}/`, '')}'`, `duration ${Math.max(0.001, next - toVideo(f.t)).toFixed(4)}`);
});
lines.push(`file '${kept.at(-1).file.replace(`${build}/`, '')}'`);
writeFileSync(`${build}/frames.ffconcat`, lines.join('\n'));

timeline.scenes = timeline.scenes.map((s) => ({ id: s.id, start: +toVideo(s.wallStart).toFixed(3), end: +toVideo(s.wallEnd).toFixed(3) }));
timeline.total = +toVideo(wallEnd).toFixed(3);
writeFileSync(`${build}/timeline.json`, JSON.stringify(timeline, null, 2));
console.log(`video ${timeline.total.toFixed(1)}s, ${kept.length} frames, ${cuts.length} cuts`);
