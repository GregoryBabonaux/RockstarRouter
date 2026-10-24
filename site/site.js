document.documentElement.classList.add('js');

// Languages: English is the page itself; the others come from i18n.js. The choice comes from
// ?lang=, then the last one picked, then the browser's languages.
const LANGS = ['en', 'fr', 'es', 'de', 'pt', 'zh', 'ja', 'ko'];
const README_FILE = { fr: 'README.fr.md', es: 'README.es.md', de: 'README.de.md', pt: 'README.pt-BR.md', zh: 'README.zh-CN.md', ja: 'README.ja.md', ko: 'README.ko.md' };
const README = 'https://github.com/GregoryBabonaux/RockstarRouter/blob/main/';
const HTML_LANG = { zh: 'zh-CN', pt: 'pt-BR' };
const english = {
  title: document.title,
  description: document.querySelector('meta[name="description"]').content,
  copied: 'Copied',
};
for (const el of document.querySelectorAll('[data-i18n]')) english[el.dataset.i18n] = el.innerHTML;
let words = english;

function setLanguage(lang) {
  const t = window.I18N?.[lang];
  words = t ? { ...english, ...t } : english;
  document.documentElement.lang = t ? (HTML_LANG[lang] ?? lang) : 'en';
  document.title = words['meta.title'] ?? english.title;
  document.querySelector('meta[name="description"]').content = words['meta.description'] ?? english.description;
  for (const el of document.querySelectorAll('[data-i18n]')) {
    const v = words[el.dataset.i18n];
    if (v !== undefined) el.innerHTML = v;
  }
  document.getElementById('readme').href = `${README}${t ? README_FILE[lang] : 'README.md'}`;
  document.getElementById('lang').value = t ? lang : 'en';
}

function pickLanguage() {
  const asked = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(asked)) return asked;
  try {
    const saved = localStorage.getItem('rockstar-router-lang');
    if (LANGS.includes(saved)) return saved;
  } catch { /* storage blocked: fall through */ }
  for (const l of navigator.languages ?? []) {
    const short = l.slice(0, 2).toLowerCase();
    if (LANGS.includes(short)) return short;
  }
  return 'en';
}

setLanguage(pickLanguage());
document.getElementById('lang').addEventListener('change', (e) => {
  setLanguage(e.target.value);
  try { localStorage.setItem('rockstar-router-lang', e.target.value); } catch { /* ignore */ }
});

// Copy buttons
for (const box of document.querySelectorAll('[data-copy]')) {
  const btn = box.querySelector('.copy');
  const text = box.querySelector('code').textContent;
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(text); } catch { return; }
    const label = btn.innerHTML;
    btn.innerHTML = words.copied;
    btn.classList.add('done');
    setTimeout(() => { btn.innerHTML = words[btn.dataset.i18n] ?? label; btn.classList.remove('done'); }, 1400);
  });
}

// Install tabs, with arrow-key navigation
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab) {
  for (const t of tabs) {
    const on = t === tab;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  }
}
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', (e) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    const next = tabs[(i + step + tabs.length) % tabs.length];
    selectTab(next);
    next.focus();
  });
});

// Tone switch: shows the skip message in each tone
const toneButtons = [...document.querySelectorAll('[data-tone]')];
for (const b of toneButtons) {
  b.addEventListener('click', () => {
    for (const x of toneButtons) {
      const on = x === b;
      x.classList.toggle('on', on);
      x.setAttribute('aria-pressed', String(on));
    }
    for (const line of document.querySelectorAll('[data-tone-line]')) line.hidden = line.dataset.toneLine !== b.dataset.tone;
  });
}
