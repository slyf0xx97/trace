// Caches the app shell and images after the first visit so every later screen opens instantly.
const CACHE = 'trace-v6';
const FILES = ['./','index.html','manifest.webmanifest',
  'assets/home.jpg','assets/discover-end.jpg','assets/session-a.jpg','assets/review.jpg',
  'assets/photo_watercolour.jpg','assets/photo_acrylic.jpg','assets/photo_tablet.jpg','assets/photo_pottery.jpg','assets/review-watercolour.jpg','assets/review-acrylic.jpg','assets/review-pottery.jpg','assets/logo_culturepass.png',
  'assets/mark_lg.svg','assets/back_lg.svg','assets/i_clock.svg','assets/i_pin.svg','assets/i_check.svg','assets/pin_sm.svg',
  'assets/n_home.svg','assets/n_home_on.svg','assets/n_prog.svg','assets/n_disc.svg','assets/n_disc_on.svg','assets/n_net.svg',
  'assets/swipe_left.svg','assets/swipe_right.svg'];
self.addEventListener('install', e=>{ self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).catch(()=>{})); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e=>{
  const u = new URL(e.request.url);
  if (e.request.method!=='GET' || u.origin!==location.origin) return;   // never touch Maze or font requests
  if (e.request.mode==='navigate' || /\.(js|css|webmanifest)$/.test(u.pathname)){ // HTML, scripts, styles: network first so updates show, cache as fallback
    e.respondWith(fetch(e.request).then(r=>{ const c=r.clone(); caches.open(CACHE).then(x=>x.put(e.request,c)); return r; }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit || fetch(e.request).then(r=>{ const c=r.clone(); caches.open(CACHE).then(x=>x.put(e.request,c)); return r; })));
});
