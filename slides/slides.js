// record.mjs calls setStep(n): data-show <= n becomes visible, data-focus == n glows.
// Opening a slide with #3 in the URL jumps to step 3, handy when editing by hand.
window.setStep = (n) => {
  document.querySelectorAll('[data-show]').forEach((el) => el.classList.toggle('on', +el.dataset.show <= n));
  document.querySelectorAll('[data-focus]').forEach((el) => el.classList.toggle('focus', el.dataset.focus.split(' ').includes(String(n))));
};
window.setStep(+location.hash.slice(1) || 0);

// Slides are drawn at 1920x1080; in a smaller window they shrink to fit instead of being cut.
const fit = () => {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  document.body.style.zoom = s < 0.999 || s > 1.001 ? s : '';
};
addEventListener('resize', fit);
fit();

// Presenting by hand (the recorder doesn't use this): → / space next step, ← previous step,
// PageDown / PageUp next / previous slide, Esc back to the index.
// A slide's last step is its highest data-show.
const ORDER = ['title.html', 'contexto.html', 'dupla.html', 'problema.html', 'versao.html', 'ideia.html', 'wxr.html', 'decisao.html', 'ia.html', 'processo.html', 'configuracoes.html', 'automacao.html', 'padroes.html', 'wporg.html', 'licoes.html', 'perguntas.html'];
const MAX = Math.max(0, ...[...document.querySelectorAll('[data-show]')].map((el) => +el.dataset.show));
const here = location.pathname.split('/').pop();
let step = +location.hash.slice(1) || 0;
const go = (i) => { if (ORDER[i]) location.href = ORDER[i]; };
document.addEventListener('keydown', (e) => {
  const i = ORDER.indexOf(here);
  if (['ArrowRight', ' '].includes(e.key)) { if (step < MAX) { window.setStep(++step); history.replaceState(null, '', '#' + step); } else go(i + 1); }
  if (e.key === 'ArrowLeft') { if (step > 0) { window.setStep(--step); history.replaceState(null, '', '#' + step); } else go(i - 1); }
  if (e.key === 'PageDown') go(i + 1);
  if (e.key === 'PageUp') go(i - 1);
  if (e.key === 'Escape') location.href = 'index.html';
});
// The auto presentation (show.html) moves through steps by changing the #step.
addEventListener('hashchange', () => { step = +location.hash.slice(1) || 0; window.setStep(step); });
