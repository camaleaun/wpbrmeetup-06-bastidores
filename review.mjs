// Review material for the latest render, in Portuguese:
//   build/review.html             the video, its subtitles and a clickable transcript
//   build/show.html               the slides on the video's timing, to present live (pausable)
//   build/presentation.pt-BR.vtt  subtitle track (mix.mjs writes the .srt)
//   build/transcript.json         every sentence with its time (the teleprompter's Vídeo mode)
//   script.pt-BR.md               scene/sentence table to ask for changes ("wxr 2: …")
//   script.md                     the narration as plain prose, to read
// Then the teleprompter (teleprompter.mjs). Run after mix.mjs (it calls this at the end).
//
// `node review.mjs --draft` (npm run draft) is the same review before any recording:
// times are estimated from the narration (tts.mjs), and the page shows each scene's
// slide (build/preview/) and plays its narration instead of the video.
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { build, named, script, versao } from './lib.mjs';

const LEAD = 0.25;   // same as mix.mjs
const TAIL = 0.6;    // same as record.mjs
const draft = process.argv.includes('--draft');
const durations = JSON.parse(readFileSync(`${build}/durations.json`, 'utf8'));
const estimate = () => {
  let t = 0;
  const scenes = script.scenes.map((s) => { const start = t; t += durations[s.id].duration + LEAD + TAIL; return { id: s.id, start, end: t }; });
  return { scenes, total: t };
};
const timeline = draft ? estimate() : JSON.parse(readFileSync(`${build}/timeline.json`, 'utf8'));

// Draft: the slide on screen in each scene (the last `slide:` so far) and its preview image.
const previews = draft ? readdirSync(`${build}/preview`) : [];
let current = null;
const slideOf = Object.fromEntries(script.scenes.map((s) => {
  for (const a of s.actions ?? []) if (a.slide) current = a.slide;
  return [s.id, previews.find((f) => f.endsWith(`-${current.replace('.html', '.png')}`))];
}));

const rows = [];
for (const s of timeline.scenes) {
  const { cues, duration } = durations[s.id];
  cues.forEach((c, i) => rows.push({
    scene: s.id, n: i + 1,
    title: script.scenes.find((x) => x.id === s.id).title,
    start: s.start + LEAD + c.at,
    end: s.start + LEAD + (i + 1 < cues.length ? cues[i + 1].at - 0.05 : duration),
    pt: c.text,
    at: c.at,
  }));
}

const stamp = (t) => {
  const ms = Math.max(0, Math.round(t * 1000)), p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)}.${p(ms % 1000, 3)}`;
};
const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
writeFileSync(`${build}/presentation.pt-BR.vtt`, 'WEBVTT\n\n' + rows.map((r) => `${stamp(r.start)} --> ${stamp(r.end)}\n${r.pt}\n`).join('\n'));
// The teleprompter's Vídeo mode needs the real times: no transcript until there is a video.
if (draft) rmSync(`${build}/transcript.json`, { force: true });
else writeFileSync(`${build}/transcript.json`, JSON.stringify(rows.map(({ at, ...r }) => r)));

// Markdown table for asking changes by scene and sentence number.
const md = [`# ${script.title} — roteiro`, '',
  '_Para pedir uma mudança, cite a cena e o número da frase, por exemplo: "wxr 2: trocar …". Gerado por review.mjs a partir de script.yaml._', ''];
rows.forEach((r, i) => {
  if (rows[i - 1]?.scene !== r.scene) md.push(`## ${r.scene} — ${r.title} (${mmss(r.start)})`, '', '| # | Tempo | Narração |', '|---|---|---|');
  md.push(`| ${r.n} | ${mmss(r.start)} | ${r.pt} |`);
  if (rows[i + 1]?.scene !== r.scene) md.push('');
});
md.push(`_Duração${draft ? ' estimada (rascunho, antes da gravação)' : ''}: ${mmss(timeline.total)}._`, '');
writeFileSync(named('script.pt-BR.md'), md.join('\n'));

// The narration as prose, scene by scene.
const prose = [`# ${script.title}`, '', '_Narração da palestra, gerada a partir de script.yaml._', ''];
for (const s of script.scenes) prose.push(`## ${s.title}`, '', s.narration.replace(/\s+/g, ' ').trim(), '');
writeFileSync(named('script.md'), prose.join('\n'));

// Review page: the video with subtitles and a transcript that seeks on click. It also
// sends the playback time to the teleprompter: to a phone through review-server.mjs
// (POST /t) and to a teleprompter tab on this computer (BroadcastChannel).
// Draft: a click shows the scene's slide and plays its narration from that sentence.
const draftPlayer = `  const a = document.getElementById('a'), img = document.getElementById('slide');
  document.querySelectorAll('.row').forEach((r) => r.onclick = () => {
    document.querySelectorAll('.row.now').forEach((x) => x.classList.remove('now'));
    r.classList.add('now');
    img.src = 'preview/' + r.dataset.slide;
    a.src = 'audio/' + r.dataset.scene + '.wav'; a.currentTime = +r.dataset.at; a.play();
  });
`;
const videoPlayer = `  const v = document.getElementById('v');
  const rows = [...document.querySelectorAll('.row')];
  rows.forEach((r) => r.onclick = () => { v.currentTime = +r.dataset.s; v.play(); });
  v.ontimeupdate = () => rows.forEach((r) => {
    const on = v.currentTime >= +r.dataset.s && v.currentTime < +r.dataset.e;
    if (on && !r.classList.contains('now')) r.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    r.classList.toggle('now', on);
  });
  const canal = 'BroadcastChannel' in window ? new BroadcastChannel('teleprompter-bastidores') : null;
  const send = () => {
    const state = { t: v.currentTime, playing: !v.paused };
    canal?.postMessage(state);
    if (location.protocol.startsWith('http')) fetch('/t', { method: 'POST', body: JSON.stringify(state) }).catch(() => {});
  };
  ['play', 'pause', 'seeked'].forEach((e) => v.addEventListener(e, send));
  setInterval(() => { if (!v.paused) send(); }, 500);
  document.getElementById('leg').onclick = (e) => {
    const t = v.textTracks[0]; t.mode = t.mode === 'showing' ? 'disabled' : 'showing';
    e.target.classList.toggle('on', t.mode === 'showing');
  };
`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Revisão · ${esc(script.title)}</title>
<style>
  :root { --ink:#1e1e1e; --paper:#f6f6f6; --accent:#3858e9; --muted:#656a71; --line:#d9d9d9; --card:#fff; }  /* WordPress.org palette */
  @media (prefers-color-scheme: dark) { :root { --ink:#f6f6f6; --paper:#1e1e1e; --accent:#9fb1ff; --muted:#979aa1; --line:#40464d; --card:#23282d; } }
  * { box-sizing: border-box; } body { margin:0; background:var(--paper); color:var(--ink); font:16px/1.45 -apple-system, system-ui, sans-serif; }
  main { display:grid; grid-template-columns: minmax(0,1.6fr) minmax(320px,1fr); gap:24px; padding:24px; height:100vh; }
  @media (max-width: 1000px) { main { grid-template-columns:1fr; height:auto; } }
  video { width:100%; border-radius:12px; background:#000; }
  .bar { display:flex; gap:12px; align-items:center; margin:12px 0; flex-wrap:wrap; }
  a.button, button { font:inherit; border:1px solid var(--line); background:var(--card); color:var(--ink); padding:6px 12px; border-radius:8px; cursor:pointer; text-decoration:none; }
  button.on { background:var(--accent); color:#fff; border-color:var(--accent); }
  .list { overflow:auto; border:1px solid var(--line); border-radius:12px; background:var(--card); }
  .scene { position:sticky; top:0; background:var(--card); padding:10px 14px; font-weight:700; border-bottom:1px solid var(--line); }
  .row { display:grid; grid-template-columns: 54px 1fr; gap:4px 10px; padding:10px 14px; border-bottom:1px solid var(--line); cursor:pointer; }
  .row:hover { background:color-mix(in srgb, var(--accent) 12%, transparent); }
  .row.now { background:color-mix(in srgb, var(--accent) 28%, transparent); }
  .t { color:var(--muted); font-variant-numeric:tabular-nums; } .id { color:var(--muted); font-size:13px; }
  h1 { font-size:20px; margin:0 0 4px; } p.hint { color:var(--muted); margin:0; }
</style></head><body><main>
<section>
  <h1>${esc(script.title)} <small style="color:var(--muted);font-weight:400">· ${mmss(timeline.total)}</small></h1>
  <p class="hint">${draft ? 'Rascunho para aprovação, antes da gravação: clique numa frase para ver o slide e ouvir a narração.' : 'Clique numa frase para pular até ela.'} Para pedir uma mudança, cite cena e número, por exemplo <b>wxr 2</b>.</p>
  ${draft ? `<img id="slide" alt="" style="width:100%;border-radius:12px;border:1px solid var(--line)" src="preview/${slideOf[script.scenes[0].id]}">
  <audio id="a" controls style="width:100%;margin-top:12px"></audio>
  <div class="bar"><a class="button" href="teleprompter.html" target="teleprompter">Abrir o teleprompter</a> <a class="button" href="${build.replace(/[^/]+/g, '..')}/slides/index.html" target="slides">Abrir os slides</a></div>` : `<video id="v" controls preload="metadata" src="presentation.mp4">
    <track kind="subtitles" srclang="pt-BR" label="Português" src="presentation.pt-BR.vtt" default>
  </video>
  <div class="bar">
    <button id="leg" class="on">Legenda</button>
    <a class="button" href="teleprompter.html" target="teleprompter">Abrir o teleprompter</a>
    <a class="button" href="show.html" target="show">Apresentar os slides</a>
  </div>`}
</section>
<section class="list" id="list">
${rows.map((r, i) => `${rows[i - 1]?.scene !== r.scene ? `<div class="scene">${esc(r.scene)} — ${esc(r.title)}</div>` : ''}<div class="row" data-s="${r.start.toFixed(2)}" data-e="${r.end.toFixed(2)}" data-scene="${r.scene}" data-at="${r.at}" data-slide="${slideOf[r.scene] ?? ''}"><span class="t">${mmss(r.start)}</span><span><span class="id">${r.scene} ${r.n}</span> ${esc(r.pt)}</span></div>`).join('\n')}
</section></main>
<script>
${draft ? draftPlayer : videoPlayer}</script></body></html>`;
writeFileSync(`${build}/review.html`, html);
console.log(`${build}/review.html · ${named('script.pt-BR.md')} · ${rows.length} frases`);

// Live talk: show.html steps the slides on the video's timing (same rules as record.mjs:
// `cue` waits for sentence N, `pause` adds seconds) on a clock that can stop for questions,
// and sends that time to the teleprompter like the review page does.
if (!draft) {
  const events = [];
  let slide = null;
  for (const s of timeline.scenes) {
    const { cues } = durations[s.id];
    let cur = 0;
    for (const a of script.scenes.find((x) => x.id === s.id).actions ?? []) {
      if (a.cue) cur = Math.max(cur, cues[a.cue - 1]?.at ?? 0);
      if (a.pause) cur += a.pause;
      const t = +(s.start + cur).toFixed(3);
      if (a.slide) events.push({ t, slide: (slide = a.slide), step: 0 });
      if (a.step !== undefined) events.push({ t, slide, step: a.step });
    }
  }
  const show = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Apresentar · ${esc(script.title)}</title>
<style>
  html, body { margin:0; height:100%; background:#000; overflow:hidden; cursor:pointer; }
  iframe { position:fixed; inset:0; width:100vw; height:100vh; border:0; pointer-events:none; }
  #hud { position:fixed; right:16px; bottom:14px; padding:6px 12px; border-radius:6px; background:rgba(30,30,30,.82); color:#f6f6f6;
    font:15px/1.3 -apple-system, system-ui, sans-serif; font-variant-numeric:tabular-nums; transition:opacity .3s; }
  #hud.off { opacity:0; }
</style></head><body>
<iframe id="f" title="Slides"></iframe>
<div id="hud">Espaço para começar</div>
<script>
  // Space or click: pause / continue · → / ←: next / previous step · Home: start · F: full screen.
  const EV = ${JSON.stringify(events)}, TOTAL = ${timeline.total};
  const base = location.protocol.startsWith('http') ? '/slides/' : '${build.replace(/[^/]+/g, '..')}/slides/';
  const f = document.getElementById('f'), hud = document.getElementById('hud');
  const mmss = (t) => Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0');
  let t0 = 0, w0 = performance.now(), playing = false, started = false, shown = '';
  const now = () => Math.min(TOTAL, t0 + (playing ? (performance.now() - w0) / 1000 : 0));
  const at = (t) => { let i = 0; while (i + 1 < EV.length && EV[i + 1].t <= t + 0.001) i++; return i; };
  const canal = 'BroadcastChannel' in window ? new BroadcastChannel('teleprompter-bastidores') : null;
  const send = () => {
    const state = { t: now(), playing };
    canal?.postMessage(state);
    if (location.protocol.startsWith('http')) fetch('/t', { method: 'POST', body: JSON.stringify(state) }).catch(() => {});
  };
  const set = (t, play) => {
    t0 = Math.max(0, Math.min(TOTAL, t)); w0 = performance.now(); playing = play && t0 < TOTAL;
    started ||= playing; send(); draw();
  };
  const draw = () => {
    const t = now(), e = EV[at(t)], src = base + e.slide + '#' + e.step;
    if (src !== shown) { shown = src; f.src = src; }
    if (playing && t >= TOTAL) set(TOTAL, false);
    hud.textContent = (started ? '⏸ pausado · ' : 'Espaço para começar · ') + mmss(t) + ' / ' + mmss(TOTAL);
    hud.classList.toggle('off', playing);
  };
  const toggle = () => set(now(), !playing);
  document.addEventListener('click', toggle);
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ') { e.preventDefault(); toggle(); }
    else if (e.key === 'ArrowRight') { const i = at(now()); if (i + 1 < EV.length) set(EV[i + 1].t, playing); }
    else if (e.key === 'ArrowLeft') { const i = at(now()); set(EV[Math.max(0, i - 1)].t, playing); }
    else if (e.key === 'Home') set(0, false);
    else if (e.key === 'f' || e.key === 'F') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  });
  setInterval(draw, 100);
  setInterval(() => { if (playing) send(); }, 500);
  draw();
</script></body></html>`;
  writeFileSync(`${build}/show.html`, show);
  console.log(`${build}/show.html · ${events.length} passos`);
}

execFileSync('node', ['teleprompter.mjs'], { stdio: 'inherit' });
