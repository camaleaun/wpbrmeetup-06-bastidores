// Publishes the short version on GitHub Pages: the video and its subtitles
// (build/watch.html, from review.mjs) as index.html, plus the slides.
// Run after `npm run video`. The gh-pages branch is one commit, replaced on every run.
//
//   node pages.mjs            builds build/pages/ and force-pushes it to gh-pages
//   node pages.mjs --dry-run  only builds build/pages/
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';

const OUT = 'build/pages';
const remote = execFileSync('git', ['remote', 'get-url', 'origin'], { encoding: 'utf8' }).trim();

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync('build/watch.html', `${OUT}/index.html`);
for (const f of ['presentation.mp4', 'presentation.pt-BR.vtt']) cpSync(`build/${f}`, `${OUT}/${f}`);
cpSync('slides', `${OUT}/slides`, { recursive: true });
writeFileSync(`${OUT}/.nojekyll`, '');

if (!process.argv.includes('--dry-run')) {
  const git = (...args) => execFileSync('git', args, { cwd: OUT, stdio: 'inherit' });
  git('init', '-q', '-b', 'gh-pages');
  git('add', '-A');
  git('commit', '-q', '-m', 'GitHub Pages: the talk video with subtitles.');
  git('push', '-q', '-f', remote, 'gh-pages');
  rmSync(`${OUT}/.git`, { recursive: true, force: true });
}
console.log(`${OUT}/ ${process.argv.includes('--dry-run') ? 'built' : `pushed to ${remote} gh-pages`}`);
