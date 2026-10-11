/* 识字卡片 · Service Worker
 *
 * 目标：让「加到主屏幕」之后**完全离线可用**（飞机上、车里都能给小朋友玩）。
 * 注意：全部使用相对路径，这样部署到 GitHub Pages 的子路径（/仓库名/）也正常。
 */

const CACHE = 'hanzi-cards-v8';   // 改动资源后把版本号 +1 即可刷新缓存

/* 需要预缓存的资源：尽量小，避免首次安装太慢 */
const CORE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './data/cards.js',
  // 少数情况下的根路径（有的浏览器把 start_url 规范成目录根）
  new URL('./', self.location).href,
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // 单个文件失败不影响整体安装
    await Promise.all(CORE.map(u =>
      cache.add(new Request(u, { cache: 'reload' })).catch(() => {})
    ));
    // 立刻接管，不用等下次打开
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    // 清掉旧版本缓存
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // 外部资源不走缓存

  // 导航请求：优先用缓存的 index.html，保证离线打开不白屏
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        // GitHub Pages 会给 HTML 带 max-age=600，必须绕开 HTTP 缓存才拿得到新版
        const fresh = await fetch(req, { cache: 'no-store' });
        const cache = await caches.open(CACHE);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch (err) {
        const cache = await caches.open(CACHE);
        return (await cache.match('./index.html', { ignoreSearch: true }))
            || (await cache.match('./', { ignoreSearch: true }))
            || new Response('离线状态，请先联网打开一次。', {
                 status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
    })());
    return;
  }

  // 其它静态资源：缓存优先，同时后台更新
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) {
      fetch(req).then(res => { if (res && res.ok) cache.put(req, res.clone()); }).catch(() => {});
      return hit;
    }
    try {
      const res = await fetch(req);
      if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
      return res;
    } catch (err) {
      return new Response('', { status: 504 });
    }
  })());
});
