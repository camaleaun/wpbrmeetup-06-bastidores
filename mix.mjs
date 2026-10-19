// Final assembly: screen frames + narration (at each scene's real start) + music that
// ducks under the voice. Also writes the subtitles.
// Output: build/presentation.mp4, build/presentation.srt
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const LEAD = 0.25;   // voice starts slightly after the scene's first frame
import { build, script } from './lib.mjs';
const durations = JSON.parse(readFileSync(`${build}/durations.json`, 'utf8'));
const timeline = JSON.parse(readFileSync(`${build}/timeline.json`, 'utf8'));
if (!existsSync(`${build}/music.wav`)) execFileSync('node', ['music.mjs'], { stdio: 'inherit' });

// ---------------------------------------------------------------- audio graph
const inputs = ['-f', 'concat', '-safe', '0', '-i', `${build}/frames.ffconcat`, '-i', `${build}/music.wav`];
const filters = [];
const voices = [];
timeline.scenes.forEach((s, i) => {
  inputs.push('-i', `${build}/audio/${s.id}.wav`);
  const ms = Math.round((s.start + LEAD) * 1000);
  filters.push(`[${i + 2}:a]aresample=48000,adelay=${ms}|${ms},apad[v${i}]`);
  voices.push(`[v${i}]`);
});
filters.push(`${voices.join('')}amix=inputs=${voices.length}:normalize=0:duration=longest,atrim=0:${timeline.total},asplit=2[voice][key]`);
// Music sits low and drops further while the voice speaks.
filters.push(`[1:a]atrim=0:${timeline.total},volume=0.32[bed]`);
filters.push(`[bed][key]sidechaincompress=threshold=0.02:ratio=10:attack=40:release=700[ducked]`);
filters.push(`[voice][ducked]amix=inputs=2:normalize=0,alimiter=limit=0.95,afade=t=out:st=${Math.max(0, timeline.total - 1.5)}:d=1.5[aout]`);

execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs,
  '-filter_complex', filters.join(';'),
  '-map', '0:v', '-map', '[aout]',
  '-vf', 'fps=30,format=yuv420p',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-tune', 'stillimage',
  '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-t', String(timeline.total),
  `${build}/presentation.mp4`], { stdio: 'inherit' });

// ---------------------------------------------------------------- subtitles
const ts = (t) => {
  const ms = Math.max(0, Math.round(t * 1000));
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};
const wrap = (text) => {
  if (text.length <= 48) return text;
  const mid = text.lastIndexOf(' ', Math.ceil(text.length / 2) + 6);
  return `${text.slice(0, mid)}\n${text.slice(mid + 1)}`;
};
const srt = [];
for (const s of timeline.scenes) {
  const { cues, duration } = durations[s.id];
  cues.forEach((c, i) => {
    const start = s.start + LEAD + c.at;
    const end = s.start + LEAD + (i + 1 < cues.length ? cues[i + 1].at - 0.05 : duration);
    srt.push(`${srt.length + 1}\n${ts(start)} --> ${ts(end)}\n${wrap(c.text)}\n`);
  });
}
writeFileSync(`${build}/presentation.srt`, srt.join('\n'));

const size = (readFileSync(`${build}/presentation.mp4`).length / 1048576).toFixed(1);
console.log(`${build}/presentation.mp4  ${timeline.total.toFixed(1)}s  ${size} MB`);
console.log(`${build}/presentation.srt  ${srt.length} subtitles`);

// Review page, subtitle track, the script table and the teleprompter.
execFileSync('node', ['review.mjs'], { stdio: 'inherit' });
