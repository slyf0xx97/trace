/* Trace Main 2.0 player: runs the Figma prototype links in data.js without the Figma embed. */
(function(){
const $ = (q,el=document)=>el.querySelector(q);
const $$ = (q,el=document)=>[...el.querySelectorAll(q)];
const file = id => 'assets/' + id.replace(':','-');
const short = id => id.split(':')[1];
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* variant id -> its content set, and widget variant ids (handled by widgets, not hotspots) */
const VARSET = {}; for (const [sid,set] of Object.entries(DATA.C)) for (const vid of Object.keys(set.vs)) VARSET[vid] = sid;
const WVAR = new Set(); for (const w of Object.values(WIDGETS)) { WVAR.add(w.a); WVAR.add(w.b); }

const state = { cur: null, content: {}, widgets: {}, overlays: [], hot: false, fit: true };
let timer = null;
let DIR = 'f';   // next screen change: f forward (slide from right), b back (slide from left), t tab (fade)

/* ---------- scrolling (inside the phone frame on desktop, the window on phones) ---------- */
const framed = () => document.documentElement.classList.contains('framed');
const getY = () => framed() ? $('#scroller').scrollTop : scrollY;
const setY = y => { if (framed()) $('#scroller').scrollTop = y; else scrollTo(0, y); };

/* ---------- widgets ---------- */
const CHECK = c => `<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7.2l2.6 2.6L11 4.4" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
function widgetHTML(def, cur, start, label){
  const ghost = cur === start ? ' ghost' : '';
  const isB = cur === def.b;
  if (def.compact && isB && !ghost)   // same size and style as the "Connected" badges baked into the screen
    return { cls:'compact', html:`<span class="cbadge">${CHECK('#347241').replace(/14/g,'12')}${esc(def.done)}</span>` };
  switch (def.kind){
    case 'chip':   return { cls:'chip' + (isB?' on':'') + ghost, html: esc(label) };
    case 'toggle': return { cls:'tog' + (isB?' on':'') + ghost, html: '<i></i>' };
    case 'action': return { cls:'act' + (isB?' done':'') + ghost, html: isB ? CHECK('#347241') + esc(def.done) : esc(label) };
    case 'join':   return { cls:'join' + (isB?' done':'') + ghost, html: isB ? CHECK('#ffffff') + esc(def.done) : esc(label) };
    case 'singpass': return { cls:'sp' + (isB?' done':'') + ghost, html: isB ? CHECK('#347241') + esc(def.done) : '' };
  }
}
function addWidgets(host, key, list, dy){
  (list||[]).forEach((w,i)=>{
    const [x,y,ww,hh,set,start,label] = w, def = WIDGETS[set]; if (!def) return;
    const k = key + '#' + i; if (!(k in state.widgets)) state.widgets[k] = start;
    const el = document.createElement('button'); el.style.cssText = `left:${x}px;top:${y-(dy||0)}px;width:${ww}px;height:${hh}px`;
    const paint = ()=>{ const r = widgetHTML(def, state.widgets[k], start, label); el.className = 'w ' + r.cls; el.innerHTML = r.html; };
    el.setAttribute('aria-label', label || def.kind);
    el.addEventListener('click', e=>{ e.stopPropagation(); state.widgets[k] = state.widgets[k] === def.a ? def.b : def.a; paint(); });
    paint(); host.appendChild(el);
  });
}

/* ---------- hotspots ---------- */
function addHotspots(host, list, dy, skipFull){
  (list||[]).forEach(h=>{
    const [x,y,w,hh,act] = h;
    const acts = act.split('|');
    if (acts.every(a=>a.startsWith('T'))) return;                         // timers are not clickable
    if (acts.every(a=>a.startsWith('c:') && WVAR.has(short(a.slice(2))))) return; // widget handles it
    if (skipFull && x===0 && y===0 && w===402 && hh>=874) return;          // overlay scrim, handled separately
    const el = document.createElement('button'); el.className = acts.includes('b') ? 'hot isback' : 'hot';
    el.style.cssText = `left:${x}px;top:${y-(dy||0)}px;width:${w}px;height:${hh}px`;
    el.addEventListener('click', e=>{ e.stopPropagation(); run(acts); });
    host.appendChild(el);
  });
}
function run(acts){
  for (const a of acts){
    if (a.startsWith('T')) continue;
    const [k, ...rest] = a.split(':'); const dest = rest.join(':');
    if (k==='n') return go(dest);
    if (k==='o') { openOverlay(dest); continue; }
    if (k==='s') { swapOverlay(dest); continue; }
    if (k==='x') { closeOverlay(); continue; }
    if (k==='b') return back();
    if (k==='c') { changeContent(dest); continue; }
  }
}

/* ---------- screens ---------- */
function render(id, anim){
  clearTimeout(timer);
  $('#app').dataset.dir = DIR; DIR = 'f';
  const nid = window.NATIVE && NATIVE.resolve(id);
  if (nid){
    state.cur = nid;
    const view = document.createElement('div'); view.className = 'view nview' + (anim ? ' in' : '');
    const app = $('#app'); app.innerHTML = ''; app.appendChild(view);
    const meta = NATIVE.render(nid, view);
    $$('.tab').forEach(t=>t.classList.toggle('on', t.dataset.tab === meta.nav));
    $('#navwrap').style.display = '';
    if (![...pick.options].some(o=>o.value===nid)){ const o = document.createElement('option'); o.value = nid; o.textContent = meta.title + ' (app)'; pick.appendChild(o); }
    pick.value = nid;
    document.title = meta.title + ' | Trace';
    return;
  }
  const s = DATA.S[id]; if (!s) return render(START);
  state.cur = id;
  const view = document.createElement('div'); view.className = 'view' + (anim ? ' in' : '');
  let h = s.h, img = file(id) + '.jpg', vid = null;
  if (s.cs){
    const [setId, def] = s.cs; vid = state.content[id] || def;
    const v = DATA.C[setId].vs[vid]; h = Math.max(874, v.h); img = file(vid) + '.jpg';
  }
  view.style.height = h + 'px';
  view.innerHTML = `<img class="base${anim==='swap'?' swap':''}" src="${img}" alt="${esc(s.n)}" width="402">`;
  if (s.cs && HEADERS[id]){ const [t, a, b] = HEADERS[id];
    view.insertAdjacentHTML('beforeend', t === 'm'
      ? `<div class="hdr"><div class="pill logo"><img src="../assets/mark_lg.svg" alt=""><span>trace</span></div></div>`
      : `<div class="hdr"><div class="pill back"><img src="../assets/back_lg.svg" alt="">${esc(a)}</div>${b ? `<div class="pill where">${esc(b)}</div>` : ''}</div>`); }
  addHotspots(view, s.hs, 0);
  addWidgets(view, id, W[id]);
  if (vid){
    const v = DATA.C[s.cs[0]].vs[vid];
    addHotspots(view, v.hs, 0);
    addWidgets(view, vid, W[vid]);
    const t = (v.hs||[]).map(h=>h[4]).find(a=>/^T\d+>/.test(a));
    if (t){ const m = t.match(/^T(\d+)>(.*)$/); timer = setTimeout(()=>{ if (state.cur===id && (state.content[id]||s.cs[1])===vid) run([m[2]]); }, +m[1]); }
  }
  if (window.NATIVE && NATIVE.decorate) NATIVE.decorate(id, view, anim);
  const app = $('#app'); app.innerHTML = ''; app.appendChild(view);
  // nav
  $$('.tab').forEach(t=>t.classList.toggle('on', t.dataset.tab === s.nav));
  $('#navwrap').style.display = s.nav ? '' : 'none';
  $('#pick').value = id;
  document.title = s.n.replace(/^S\d+\w*\s/,'') + ' | Trace';
  preload(s, vid);
}
function changeContent(vid){
  const setId = VARSET[vid]; if (!setId) return;
  const s = DATA.S[state.cur];
  if (s && s.cs && s.cs[0] === setId){ const y = getY(); state.content[state.cur] = vid; render(state.cur, 'swap'); setY(y); }
}
function go(id, replace){
  closeAll();
  const depth = ((history.state && history.state.d) || 0) + (replace ? 0 : 1);
  history[replace ? 'replaceState' : 'pushState']({ id, d: depth }, '', '#' + (window.NATIVE && NATIVE.resolve(id) ? NATIVE.resolve(id) : id.replace(':','-')));
  render(id, true); setY(0);
}
function back(){
  if (state.overlays.length) return closeOverlay();
  if (history.state && history.state.d > 0) history.back(); else go(START, true);
}
addEventListener('popstate', e=>{ closeAll(); DIR = 'b'; const id = (e.state && e.state.id) || idFromHash() || START; render(id, true); setY(0); });
function idFromHash(){ const raw = location.hash.slice(1); if (window.NATIVE && NATIVE.resolve(raw)) return raw; const h = raw.replace('-',':'); return DATA.S[h] ? h : null; }

/* ---------- overlays ---------- */
function drawOverlays(){
  const host = $('#ovl'); host.innerHTML = '';
  host.classList.toggle('open', state.overlays.length > 0);
  state.overlays.forEach((oid, i)=>{
    const o = DATA.O[oid]; const [sx, sy, sw, sh] = o.sh;
    const scrim = document.createElement('div'); scrim.className = 'scrim';
    const full = (o.hs||[]).find(h=>h[0]===0 && h[1]===0 && h[2]===402 && h[3]>=874);
    if (full) scrim.addEventListener('click', ()=>run(full[4].split('|')));
    host.appendChild(scrim);
    const wrap = document.createElement('div'); wrap.className = 'sheetwrap';
    const box = document.createElement('div'); box.className = 'sheetbox'; box.style.height = (874 - sy) + 'px';
    box.innerHTML = `<img src="${file(SHEETS[oid])}.png" alt="${esc(o.n)}" style="height:${sh}px" width="402">`;
    addHotspots(box, o.hs, sy, true);
    addWidgets(box, oid, W[oid], sy);
    box.addEventListener('click', e=>e.stopPropagation());
    wrap.appendChild(box); host.appendChild(wrap);
  });
}
function openOverlay(id){ if (!DATA.O[id]) return; state.overlays.push(id); drawOverlays(); }
function swapOverlay(id){ if (!DATA.O[id]) return; state.overlays.pop(); state.overlays.push(id); drawOverlays(); }
function closeOverlay(){ state.overlays.pop(); drawOverlays(); }
function closeAll(){ state.overlays = []; drawOverlays(); }

/* ---------- preload the next screens so taps feel instant ---------- */
const loaded = new Set();
function pre(src){ if (loaded.has(src)) return; loaded.add(src); const i = new Image(); i.src = src; }
function preload(s, vid){
  const acts = [...(s.hs||[]), ...(vid ? DATA.C[s.cs[0]].vs[vid].hs : [])].flatMap(h=>h[4].split('|'));
  acts.forEach(a=>{ const m = a.match(/(?:^|>)(n|o|s|c):(.+)$/); if (!m) return; const d = m[2];
    if (m[1]==='n' && DATA.S[d] && !(window.NATIVE && NATIVE.resolve(d))) pre(file(DATA.S[d].cs ? (state.content[d] || DATA.S[d].cs[1]) : d) + '.jpg');
    if ((m[1]==='o'||m[1]==='s') && SHEETS[d]) pre(file(SHEETS[d]) + '.png');
    if (m[1]==='c' && VARSET[d]) pre(file(d) + '.jpg'); });
  Object.values(TABS).forEach(t=>{ const x = DATA.S[t]; if (x && !(window.NATIVE && NATIVE.resolve(t))) pre(file(x.cs ? (state.content[t] || x.cs[1]) : t) + '.jpg'); });
}

/* ---------- nav, control bar, fit ---------- */
$$('.tab').forEach(t=>t.addEventListener('click', ()=>{ DIR = 't'; go(TABS[t.dataset.tab]); }));
const pick = $('#pick');
if (window.NATIVE) NATIVE.list.forEach(([id,n])=>{ const o = document.createElement('option'); o.value = id; o.textContent = n; pick.appendChild(o); });
Object.entries(DATA.S).forEach(([id,s])=>{ const o = document.createElement('option'); o.value = id; o.textContent = s.n; pick.appendChild(o); });
pick.addEventListener('change', ()=>go(pick.value));
$('#bFit').addEventListener('click', ()=>{ state.fit = !state.fit; fit(); });
$('#bReset').addEventListener('click', ()=>{ state.content = {}; state.widgets = {}; if (window.NATIVE) NATIVE.reset(); go(START, true); });
/* phones (and phones in "desktop site" mode) always get the app edge to edge, never the desktop frame */
const isPhone = () => (matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 1) && Math.min(screen.width, screen.height) < 600;
function fit(){
  const root = document.documentElement, w = root.clientWidth, isFramed = w >= 600 && !isPhone();
  root.classList.toggle('framed', isFramed);
  root.style.setProperty('--z', (isFramed ? 1 : w/402).toFixed(4));
  const f = isFramed && state.fit ? Math.min(1, (innerHeight - $('#bar').offsetHeight - 52) / 898) : 1;
  root.style.setProperty('--fit', Math.max(.45, f).toFixed(4));
  $('#bFit').classList.toggle('on', state.fit);
}
addEventListener('resize', fit);
if (new URLSearchParams(location.search).get('debug') === '1'){ state.hot = true; document.documentElement.classList.add('debug'); }

/* ---------- start ---------- */
fit();
const first = idFromHash() || START;
history.replaceState({ id:first, d:0 }, '', '#' + ((window.NATIVE && NATIVE.resolve(first)) || first.replace(':','-')));
render(first, false);
addEventListener('load', ()=>{ fit(); if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('../sw.js').catch(()=>{}); });
window.TRACE = { state, go, render, run, back, getY, setY };   // for testing
})();
