// Cache is namespaced and scoped to this app only, so other PWAs on the same origin are never read, served or deleted.
const P='text-pwa-',V=P+'v5',SC=new URL('./',location).pathname,A=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(A.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith(P)&&x!=V||x=='text-v4'&&SC=='/').map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
if(r.method!='GET'||u.origin!=location.origin||!u.pathname.startsWith(SC)||r.headers.has('range'))return;
const nav=r.mode=='navigate';
e.respondWith(caches.open(V).then(async c=>{const m=await c.match(nav?'index.html':r,{ignoreSearch:true});
const n=fetch(r).then(x=>{if(x.ok&&x.type=='basic')c.put(nav?'index.html':r,x.clone());return x}).catch(()=>m||(nav?c.match('index.html'):Response.error()));
e.waitUntil(n.catch(()=>0));return m||n}))});
