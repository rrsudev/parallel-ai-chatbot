// Self-destroying service worker.
//
// This project previously shipped a next-pwa (Workbox) service worker that
// precached navigation / React Server Component responses. After a redeploy it
// served stale documents whose chunks no longer matched the server, surfacing in
// the browser as "An error occurred in the Server Components render". next-pwa has
// been removed; this file exists only so browsers that still have the old worker
// registered will fetch it, replace the old worker, unregister, and clear caches.

self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map(key => caches.delete(key)))

      await self.registration.unregister()

      const clients = await self.clients.matchAll({ type: "window" })
      for (const client of clients) {
        client.navigate(client.url)
      }
    })()
  )
})
