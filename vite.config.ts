// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      VitePWA({
        // Manifest lives in public/manifest.webmanifest; registration lives in src/lib/safar/pwa.ts.
        manifest: false,
        injectRegister: null,
        registerType: "autoUpdate",
        filename: "sw.js",
        devOptions: { enabled: false },
        // TanStack Start serves static files from dist/client.
        outDir: "dist/client",
        includeAssets: ["offline.html", "favicon.png", "icons/*.png"],
        workbox: {
          // Only static, hashed build assets and public icons are precached.
          globPatterns: ["**/*.{js,css,woff2,png,svg,ico,webmanifest}", "offline.html"],
          globDirectory: "dist/client",
          globIgnores: ["**/*.wasm", "**/node_modules/**"],
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
          navigateFallback: null,
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              // Pages: always try the network; show the offline page when it fails.
              urlPattern: ({ request, url }) =>
                request.mode === "navigate" && !url.pathname.startsWith("/~oauth"),
              handler: "NetworkOnly",
              options: { precacheFallback: { fallbackURL: "/offline.html" } },
            },
            {
              // Map tiles are public imagery — short-lived cache so the map degrades gracefully.
              urlPattern: /^https:\/\/[a-d]?\.?basemaps\.cartocdn\.com\/.*/,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "safar-map-tiles",
                expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 7 },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
              handler: "StaleWhileRevalidate",
              options: { cacheName: "safar-fonts", expiration: { maxEntries: 20 } },
            },
          ],
        },
      }),
    ],
  },
});
