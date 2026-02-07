(function(){
const cfg = window.__CAL_CONFIG__ || { timezone: 'Europe/Prague', items: [] };
const TZ = cfg.timezone || 'Europe/Prague';
const grid = document.getElementById('grid');

function todayISOInTZ(){
const parts = new Intl.DateTimeFormat('en-CA', {
timeZone: TZ, year:'numeric', month:'2-digit', day:'2-digit'
}).formatToParts(new Date());
const y = parts.find(p=>p.type==='year').value;
const m = parts.find(p=>p.type==='month').value;
const d = parts.find(p=>p.type==='day').value;
return `${y}-${m}-${d}`;
}

function formatCzDate(iso){
const [y,m,d] = iso.split('-').map(Number);
const dt = new Date(Date.UTC(y, m-1, d));
return new Intl.DateTimeFormat('cs-CZ', { timeZone: TZ, day:'numeric', month:'numeric', year:'numeric' }).format(dt);
}

function isUnlocked(iso){ return iso <= todayISOInTZ(); }

function lockBadge(){
const span = document.createElement('div');
span.className = 'lock-badge';
span.innerHTML = `
<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
<path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 016 0v3H9z"/>
</svg>
<span>Zamčeno</span>`;
return span;
}

function makeTile(item){
const unlocked = isUnlocked(item.date) || item.kind === 'intro';
const art = document.createElement('article');
art.className = 'tile';

const link = document.createElement('a');
link.href = unlocked ? item.img : '#';
if (unlocked) { link.target = '_blank'; link.rel = 'noopener'; }
link.tabIndex = 0;

const thumb = document.createElement('div'); thumb.className = 'thumb';
const img = document.createElement('img');
img.loading = 'lazy'; img.decoding = 'async';
img.alt = item.alt || item.title; img.src = item.img;

thumb.appendChild(img);
if (!unlocked) thumb.appendChild(lockBadge());

const cap = document.createElement('div'); cap.className = 'caption';
const h3 = document.createElement('h3');
h3.textContent = item.kind === 'intro' ? item.title : `${item.title} – ${formatCzDate(item.date)}`;
const p = document.createElement('p');
p.textContent = unlocked ? 'Odemčeno' : `Odemkne se ${formatCzDate(item.date)} v 00:00`;

cap.appendChild(h3); cap.appendChild(p);
link.appendChild(thumb); link.appendChild(cap);
art.appendChild(link);
return art;
}

function render(){ grid.innerHTML=''; cfg.items.forEach(it=>grid.appendChild(makeTile(it))); }
render();
setInterval(render, 60*1000);
})();
