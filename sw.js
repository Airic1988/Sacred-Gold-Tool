const V='bb2r-v1';
const SHELL=['./','index.html','app.js','data.json','manifest.json','icon-180.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  // Eigene Dateien: sofort aus dem Cache, im Hintergrund aktualisieren
  if(u.origin===location.origin){
    e.respondWith(caches.open(V).then(async c=>{
      const hit=await c.match(e.request,{ignoreSearch:true});
      const net=fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>hit);
      return hit||net;
    }));
  }
});
