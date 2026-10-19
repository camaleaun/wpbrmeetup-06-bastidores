// Narration audio from script.yaml with macOS `say` (voice, and the version's rate), one WAV per scene;
// a version's `speed` speeds the recorded voice up with ffmpeg atempo, keeping its pitch.
// Each scene is spoken sentence by sentence so record.mjs can cue actions to the
// exact moment a sentence starts (`cue: N` in script.yaml, 1-based).
// Output: build/audio/<scene>.wav and build/durations.json
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { build, gap, rate, script, sentences, speakable, speed, voice } from './lib.mjs';

const GAP = gap / speed;   // seconds of silence between sentences, at the final tempo
const tmp = `${build}/audio/tmp`;
mkdirSync(tmp, { recursive: true });

const probe = (file) =>
  parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString());

const out = {};
for (const scene of script.scenes) {
  const parts = sentences(scene.narration);
  const list = [];
  const cues = [];
  let t = 0;
  parts.forEach((text, i) => {
    const wav = `${tmp}/${scene.id}-${i}.wav`;
    execFileSync('say', ['-v', voice, '-r', String(rate), '-o', `${tmp}/s.aiff`, speakable(text)]);
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', `${tmp}/s.aiff`, ...(speed === 1 ? [] : ['-af', `atempo=${speed}`]), '-ar', '48000', '-ac', '1', wav]);
    cues.push({ at: +t.toFixed(3), text });
    t += probe(wav) + GAP;
    list.push(`file '${wav.replace(`${build}/audio/`, '')}'`, `file 'tmp/silence.wav'`);
  });
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', `anullsrc=r=48000:cl=mono`, '-t', String(GAP), `${tmp}/silence.wav`]);
  writeFileSync(`${build}/audio/${scene.id}.txt`, list.join('\n'));
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', `${build}/audio/${scene.id}.txt`, `${build}/audio/${scene.id}.wav`]);
  out[scene.id] = { duration: +probe(`${build}/audio/${scene.id}.wav`).toFixed(3), cues };
  console.log(`${scene.id.padEnd(12)} ${out[scene.id].duration.toFixed(1)}s  ${parts.length} sentences`);
}
writeFileSync(`${build}/durations.json`, JSON.stringify(out, null, 2));
rmSync(tmp, { recursive: true, force: true });
const total = Object.values(out).reduce((s, x) => s + x.duration, 0);
console.log(`total narration ${total.toFixed(1)}s`);
