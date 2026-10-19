// Royalty-free background pad, synthesized with ffmpeg: four soft chords
// (Cmaj7 - Am7 - Fmaj7 - G6) crossfaded and looped to the length of the video.
// Output: build/music.wav
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { build } from './lib.mjs';

const timeline = existsSync(`${build}/timeline.json`) ? JSON.parse(readFileSync(`${build}/timeline.json`, 'utf8')) : null;
const length = Math.ceil((timeline?.total ?? 200) + 4);
const CHORD = 9;   // seconds per chord
const FADE = 3;    // crossfade between chords
const chords = [
  [130.81, 196.0, 246.94, 329.63],  // Cmaj7
  [110.0, 164.81, 196.0, 261.63],   // Am7
  [87.31, 174.61, 220.0, 329.63],   // Fmaj7
  [98.0, 146.83, 196.0, 246.94],    // G6
];
mkdirSync(`${build}/music`, { recursive: true });

// Each chord: soft sines with a slow tremolo, plus an octave-up shimmer at low volume.
chords.forEach((freqs, i) => {
  const voices = freqs.map((f, n) => `0.16*sin(2*PI*${f}*t)*(0.85+0.15*sin(2*PI*${0.11 + n * 0.03}*t))`);
  const shimmer = `0.03*sin(2*PI*${freqs[3] * 2}*t)`;
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi',
    '-i', `aevalsrc='${[...voices, shimmer].join('+')}':s=48000:d=${CHORD + FADE}`,
    '-ac', '2', `${build}/music/c${i}.wav`]);
});

// Chain the four chords with crossfades, then loop that phrase to cover the video.
const inputs = chords.flatMap((_, i) => ['-i', `${build}/music/c${i}.wav`]);
const xf = `[0][1]acrossfade=d=${FADE}[a1];[a1][2]acrossfade=d=${FADE}[a2];[a2][3]acrossfade=d=${FADE}[phrase]`;
execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', xf, '-map', '[phrase]', `${build}/music/phrase.wav`]);

const loops = Math.ceil(length / (4 * CHORD)) + 1;
writeFileSync(`${build}/music/loop.txt`, Array(loops).fill("file 'phrase.wav'").join('\n'));
execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', `${build}/music/loop.txt`,
  '-af', `lowpass=f=1800,aecho=0.8:0.7:60|120:0.25|0.15,afade=t=in:d=3,afade=t=out:st=${length - 4}:d=4,volume=0.9`,
  '-t', String(length), `${build}/music.wav`]);
console.log(`music ${length}s → ${build}/music.wav`);
