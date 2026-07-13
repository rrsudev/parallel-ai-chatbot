const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
})

// NOTE: next-pwa (v5.x) has been removed. Its service worker precaches
// navigation / React Server Component responses, and after a redeploy it serves
// a stale document whose chunks no longer match the server. In the browser this
// surfaces as "An error occurred in the Server Components render" on authenticated
// pages (e.g. /setup right after signup) — even though the server renders fine.
// Its own `disable: true` flag is unreliable in v5 (it still emitted a full
// precaching sw.js), so the wrapper is dropped entirely. If PWA support is wanted
// later, adopt an RSC-aware setup such as Serwist instead.

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost"
      },
      {
        protocol: "http",
        hostname: "127.0.0.1"
      },
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ["sharp", "onnxruntime-node"]
  }
})
