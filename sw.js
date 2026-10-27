const V='text-v2',A=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(A)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!='GET')return;
e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(m=>{
const n=fetch(e.request).then(r=>{if(r.ok&&new URL(e.request.url).origin==location.origin){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}return r}).catch(()=>m||caches.match('index.html'));
return m||n}))});
