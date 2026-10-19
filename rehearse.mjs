// Training audio with the same voice and pronunciation as the video, in build/rehearsal/:
//   NN-<scene>-normal.m4a / -lento.m4a   one per scene (script.yaml)
//   00-palestra-normal.m4a / -lento.m4a  the whole talk, a pause between scenes
//   99-perguntas.m4a                     PERGUNTAS.md: each question, a pause, its answer
// Listen, pause, repeat each sentence out loud (shadowing). Normal is the video's pace.
//
//   node rehearse.mjs   (npm run rehearse)
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import { build, rate, script, speakable, voice } from './lib.mjs';

const OUT = `${build}/rehearsal`;
const SPEEDS = { normal: rate, lento: Math.round(rate * 0.72) };
mkdirSync(OUT, { recursive: true });

// `say` writes AIFF; AAC (.m4a) plays on any phone.
const say = (text, file, wpm) => {
  execFileSync('say', ['-v', voice, '-r', String(wpm), '-o', `${OUT}/tmp.aiff`, text]);
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', `${OUT}/tmp.aiff`, '-c:a', 'aac', '-b:a', '96k', `${OUT}/${file}`]);
};
const pause = (ms) => ` [[slnc ${ms}]] `;

const full = [];
script.scenes.forEach((scene, i) => {
  const text = speakable(scene.narration.replace(/\s+/g, ' ').trim());
  full.push(text);
  for (const [name, wpm] of Object.entries(SPEEDS)) say(text, `${String(i + 1).padStart(2, '0')}-${scene.id}-${name}.m4a`, wpm);
});
for (const [name, wpm] of Object.entries(SPEEDS)) say(full.join(pause(1200)), `00-palestra-${name}.m4a`, wpm);

const qa = readFileSync('PERGUNTAS.md', 'utf8').split(/^## /m).slice(1).map((part) => {
  const [q, ...a] = part.split('\n');
  return `${q.trim()}${pause(1500)}${a.join(' ').replace(/\s+/g, ' ').trim()}`;
});
say(speakable(qa.join(pause(2500))), '99-perguntas.m4a', SPEEDS.normal);
rmSync(`${OUT}/tmp.aiff`, { force: true });

const words = full.join(' ').split(/\s+/).length;
console.log(`${OUT}/: ${script.scenes.length} cenas × 2 ritmos, a palestra inteira e as perguntas · ${words} palavras, cerca de ${(words / rate).toFixed(1)} min no ritmo do vídeo`);
