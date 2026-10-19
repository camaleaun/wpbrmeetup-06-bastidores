// Shared by every step: the script, its sentences, what the voice reads and the
// version being built. VERSAO=curta (default) reads each scene's `narration` into
// build/; VERSAO=completa reads `completa` into build/completa/.
import { readFileSync } from 'node:fs';
import YAML from 'yaml';

export const script = YAML.parse(readFileSync(new URL('script.yaml', import.meta.url), 'utf8'));
export const voice = script.voice ?? 'Luciana';
export const versao = process.env.VERSAO ?? 'curta';
const conf = script.versoes?.[versao];
if (!conf) throw new Error(`VERSAO=${versao}: use ${Object.keys(script.versoes ?? {}).join(' ou ')}`);
if (versao === 'completa') for (const s of script.scenes) s.narration = s.completa ?? s.narration;
export const rate = conf.rate ?? script.rate ?? 178;
export const gap = conf.gap ?? 0.35;       // seconds of silence between sentences
export const speed = conf.speed ?? 1;      // tempo applied to the recorded voice
export const build = versao === 'curta' ? 'build' : `build/${versao}`;
// Generated scripts: script.md for the default, script.<versao>.md otherwise.
export const named = (file) => (versao === 'curta' ? file : file.replace(/^script\./, `script.${versao}.`));

/** Sentences end in . ? or ! followed by a space or the end ("WordPress.org" stays whole). */
export const sentences = (text) =>
  text.replace(/\s+/g, ' ').trim().match(/.+?[.?!]+(?=\s|$)/g).map((s) => s.trim());

// Longer keys first, so "translate.wordpress.org" wins over "WordPress.org" and "WXRZ" over "WXR".
const words = Object.entries(script.pronuncia ?? {}).sort(([a], [b]) => b.length - a.length);
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pattern = words.length ? new RegExp(`(?<![\\p{L}\\p{N}])(${words.map(([w]) => escape(w)).join('|')})(?![\\p{L}\\p{N}])`, 'giu') : null;
const lookup = Object.fromEntries(words.map(([w, say]) => [w.toLowerCase(), say]));

/** What the voice reads: the text with script.pronuncia applied (whole words, any case). */
export const speakable = (text) => (pattern ? text.replace(pattern, (m) => lookup[m.toLowerCase()] ?? m) : text);
