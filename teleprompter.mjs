// The teleprompter (build/teleprompter.html), from teleprompter/modelo.html with:
//   - the talk: script.yaml, one block per scene, one span per sentence, with each
//     sentence's time in the video when build/transcript.json exists (Vídeo mode);
//   - the questions: PERGUNTAS.md, counted down from 5 minutes.
// Opens straight from the file (Livre mode) or from review-server.mjs (follows the video).
//
//   node teleprompter.mjs   (review.mjs runs it after every render)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { build, script, sentences, versao } from './lib.mjs';

const transcript = existsSync(`${build}/transcript.json`) ? JSON.parse(readFileSync(`${build}/transcript.json`, 'utf8')) : [];
const timed = (scene, n) => transcript.find((r) => r.scene === scene && r.n === n);
const words = (blocks) => blocks.reduce((sum, b) => sum + b.frases.reduce((s, f) => s + f.texto.split(/\s+/).length, 0), 0);

const palestra = script.scenes.map((scene) => ({
  titulo: scene.title,
  frases: sentences(scene.narration).map((texto, i) => {
    const t = timed(scene.id, i + 1);
    return t ? { texto, s: +t.start.toFixed(2), e: +t.end.toFixed(2) } : { texto };
  }),
}));

// PERGUNTAS.md: each "## " is a question, the paragraph under it the answer.
const perguntas = readFileSync('PERGUNTAS.md', 'utf8')
  .split(/^## /m).slice(1)
  .map((part) => {
    const [titulo, ...rest] = part.split('\n');
    const resposta = rest.join(' ').replace(/\s+/g, ' ').trim();
    return { titulo: titulo.trim(), pergunta: true, frases: sentences(resposta).map((texto) => ({ texto })) };
  });

const roteiros = [
  { nome: `Palestra ${versao}`, blocos: palestra },
  { nome: 'Perguntas (5 min)', limite: 300, blocos: perguntas },
].map((r) => ({ ...r, palavras: words(r.blocos) }));

mkdirSync(`${build}`, { recursive: true });
writeFileSync(`${build}/teleprompter.html`, readFileSync('teleprompter/modelo.html', 'utf8').replace('/*ROTEIROS*/', JSON.stringify(roteiros)));
console.log(`${build}/teleprompter.html · ${roteiros.map((r) => `${r.nome}: ${r.palavras} palavras`).join(' · ')}${transcript.length ? ' · com os tempos do vídeo' : ' · sem vídeo ainda (só o modo Livre)'}`);
