/* Wellbeing Compass service worker — offline shell + push notifications */
const CACHE = "wb-compass-v1";
const SHELL = ["/", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = e.request.url;
  // Only handle same-origin GET, skip non-http, skip API/auth
  if (e.request.method !== "GET" || !url.startsWith(self.location.origin)) return;
  if (url.includes("/api/") || url.includes("/_next/image")) return;

  // Network-first for pages, cache-first fallback for offline
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() =>
        caches.match(e.request).then(
          (hit) => hit || caches.match("/")
        )
      )
  );
});

// Push notifications
self.addEventListener("push", (e) => {
  let data = { title: "Wellbeing Compass", body: "New health article available", url: "/" };
  try { data = e.data ? e.data.json() : data; } catch (err) {}
  e.waitUntil(
    self.registration.showNotification(data.title || "Wellbeing Compass", {
      body: data.body || "New health article available",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "/";
  e.waitUntil(clients.openWindow(url));
});
