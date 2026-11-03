/* Phone app mode: full screen, install to home screen, live status bar, quick reset. Desktop keeps the phone frame. */
(function(){
const root = document.documentElement;
const isFramed = () => root.classList.contains('framed');
const standalone = () => matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || navigator.standalone;
const fs = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
let installEvt = null;

const ICON = {
  full:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
  reset:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.6M4 4v4.6h4.6"/></svg>',
  dl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>'
};
const fab = document.createElement('div'); fab.id = 'mfab';
fab.innerHTML = `<button class="mf-go" aria-label="Full screen">${ICON.full}<span>Full screen</span></button>
  <button class="mf-ver" aria-label="Switch Discover version"><b>A</b><span>List</span></button>
  <button class="mf-ic mf-reset" aria-label="Reset demo">${ICON.reset}</button>
  <button class="mf-ic mf-install" aria-label="Install app" hidden>${ICON.dl}</button>
  <button class="mf-ic mf-hide" aria-label="Hide">${ICON.x}</button>`;
document.body.appendChild(fab);

async function goFull(){
  const el = root;
  try {
    if (el.requestFullscreen) await el.requestFullscreen({ navigationUI:'hide' });
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    try { await screen.orientation.lock('portrait'); } catch(e){}
  } catch(e){ hint('Full screen is blocked here. Use the browser menu, "Add to Home screen", then open Trace from your home screen.'); }
}
function hint(msg){ const t = document.getElementById('ntoast'); if (t){ t.innerHTML = '<div><span>'+msg+'</span></div>'; setTimeout(()=>t.innerHTML='', 4200); } else alert(msg); }

fab.querySelector('.mf-go').addEventListener('click', goFull);
const verBtn = fab.querySelector('.mf-ver');
const paintV = ()=>{ const v = window.NATIVE ? NATIVE.getVer() : 'a'; verBtn.innerHTML = `<b>${v.toUpperCase()}</b><span>${v==='a'?'List':'Swipe'}</span>`; };
verBtn.addEventListener('click', ()=>{ const v = NATIVE.getVer()==='a' ? 'b' : 'a'; NATIVE.setVer(v); paintV(); if (window.paintVer) window.paintVer(); TRACE.go('d/discover'); hint(v==='a' ? 'Version A: Discover as a list' : 'Version B: Discover as a swipe deck'); });
setTimeout(paintV, 0);
fab.querySelector('.mf-reset').addEventListener('click', ()=>{
  if (!confirmReset()) return;
  if (window.NATIVE) NATIVE.reset();
  if (window.TRACE){ TRACE.state.content = {}; TRACE.state.widgets = {}; TRACE.go('3071:1070', true); }
  hint('Demo reset');
});
let armed = 0;
function confirmReset(){ const now = Date.now(); if (now - armed < 2500) return true; armed = now; hint('Tap reset again to clear the demo data'); return false; }
fab.querySelector('.mf-hide').addEventListener('click', ()=>{ root.classList.add('fabhidden'); hint('Controls hidden. Reload the page to bring them back.'); });
const inst = fab.querySelector('.mf-install');
addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); installEvt = e; inst.hidden = false; });
inst.addEventListener('click', async ()=>{ if (!installEvt) return; installEvt.prompt(); try { await installEvt.userChoice; } catch(e){} installEvt = null; inst.hidden = true; });

/* live status bar on the phone when running full screen or installed */
const status = document.getElementById('status');
const timeEl = status && status.querySelector('span');
function clock(){ if (!timeEl) return; const d = new Date(); timeEl.textContent = d.getHours() + ':' + String(d.getMinutes()).padStart(2,'0'); }
function sync(){
  const app = !isFramed() && !!(fs() || standalone());
  root.classList.toggle('appmode', app);
  if (app) clock();
  else if (timeEl) timeEl.textContent = '9:41';
}
document.addEventListener('fullscreenchange', sync);
document.addEventListener('webkitfullscreenchange', sync);
addEventListener('resize', sync);
setInterval(()=>{ if (root.classList.contains('appmode')) clock(); }, 15000);
sync();
})();
/* subtle confetti on tap, a light breeze of leaves while swiping */
(function(){
  const SEL = 'button,[data-go],[data-act],.hot,.w,.tab,a,.nx-scard';
  const COLS = ['#6ea862','#9ed08b','#3a6ea5','#f4c84a','#e4eef8','#d23e1b'];
  const zf = ()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--z')) || 1;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  document.addEventListener('touchstart', ()=>{}, { passive:true });
  function burst(x, y){
    if (reduce.matches) return; const z = zf();
    for (let i=0;i<7;i++){
      const p = document.createElement('span'); p.className = 'nx-conf';
      const a = (Math.PI*2*i/7) + Math.random()*.6, d = (14 + Math.random()*12)*z;
      p.style.cssText = `left:${x}px;top:${y}px;background:${COLS[i%COLS.length]};--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d - 6*z}px;--r:${Math.random()*220-110}deg;width:${(3+Math.random()*3)*z}px;height:${(4+Math.random()*3)*z}px`;
      document.body.appendChild(p); setTimeout(()=>p.remove(), 700);
    }
  }
  let down = null, last = 0;
  document.addEventListener('pointerdown', e=>{
    down = { x:e.clientX, y:e.clientY };
    if (e.target.closest && e.target.closest(SEL) && !e.target.closest('.nx-back,.isback')){ burst(e.clientX, e.clientY);
      if (navigator.vibrate && matchMedia('(pointer: coarse)').matches) { try { navigator.vibrate(6); } catch(err){} } }
  }, { passive:true });
  document.addEventListener('pointermove', e=>{
    if (!down || reduce.matches) return; const now = performance.now(); if (now - last < 70) return;
    const dx = e.clientX - down.x, dy = e.clientY - down.y; if (Math.hypot(dx, dy) < 24) return; last = now;
    const z = zf(), ang = Math.atan2(e.movementY || dy, e.movementX || dx);
    for (let i=0;i<2;i++){
      const l = document.createElement('span'); l.className = 'nx-leaf';
      const sp = (40 + Math.random()*40)*z;
      l.style.cssText = `left:${e.clientX + (Math.random()*30-15)*z}px;top:${e.clientY + (Math.random()*30-15)*z}px;--dx:${Math.cos(ang)*sp}px;--dy:${Math.sin(ang)*sp + 10*z}px;--r:${Math.random()*360}deg;width:${8*z}px;height:${4*z}px;background:${i%2?'#9ed08b':'#6ea862'}`;
      document.body.appendChild(l); setTimeout(()=>l.remove(), 900);
    }
  }, { passive:true });
  ['pointerup','pointercancel'].forEach(t=>document.addEventListener(t, ()=>{ down = null; }, { passive:true }));
})();
/* long press: the item lifts out, a ring pulses, a short buzz; vault tiles open their menu */
(function(){
  const SEL = 'button,[data-go],[data-act],.hot,.w,.tab,.nx-card.nx-post';
  let timer = null, held = null, sx = 0, sy = 0;
  const clear = ()=>{ clearTimeout(timer); timer = null; if (held){ const h = held; held = null; setTimeout(()=>h.classList.remove('nx-held'), 120); } };
  document.addEventListener('pointerdown', e=>{
    const el = e.target.closest && e.target.closest(SEL); if (!el || el.closest('.nx-back,.isback')) return;
    sx = e.clientX; sy = e.clientY; clearTimeout(timer);
    timer = setTimeout(()=>{
      held = el; el.classList.add('nx-held');
      if (navigator.vibrate) { try { navigator.vibrate(18); } catch(err){} }
      const menu = el.classList.contains('nx-tile') && el.querySelector('[data-act="tileMenu"]');
      if (menu){ menu.click(); el.dataset.longpressed = '1'; }
    }, 420);
  }, { passive:true });
  document.addEventListener('pointermove', e=>{ if (timer && Math.hypot(e.clientX-sx, e.clientY-sy) > 10) clear(); }, { passive:true });
  ['pointerup','pointercancel','pointerleave'].forEach(t=>document.addEventListener(t, clear, { passive:true }));
  document.addEventListener('contextmenu', e=>{ if (e.target.closest && e.target.closest('#app, .nview')) e.preventDefault(); });
  // a long press that opened a menu should not also open the file
  document.addEventListener('click', e=>{ const t = e.target.closest && e.target.closest('.nx-tile[data-longpressed]'); if (t){ delete t.dataset.longpressed; e.stopPropagation(); e.preventDefault(); } }, true);
})();
