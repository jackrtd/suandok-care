const CACHE='suandok-care-demo-shell-v32';
const ROOT=new URL('./',self.location.href);
const SHELL=['index.html','manifest.webmanifest','icon.svg'].map(x=>new URL(x,ROOT).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('suandok-care-demo-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==ROOT.origin)return;
 if(req.mode==='navigate'&&(url.pathname===ROOT.pathname||url.pathname===new URL('index.html',ROOT).pathname)){
 event.respondWith(fetch(req).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(SHELL[0],copy)));}return response;}).catch(()=>caches.match(SHELL[0]).then(r=>r||Response.error())));return;
 }
 if(SHELL.includes(url.href)&&req.mode!=='navigate')event.respondWith(caches.match(req).then(r=>r||fetch(req)));
});