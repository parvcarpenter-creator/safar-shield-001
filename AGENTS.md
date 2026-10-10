<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## SAFAR SHIELD architecture
- Keep each product screen in its own TanStack leaf route with route-specific metadata so navigation and sharing remain reliable.
- Keep safety data, validation and geofence distance logic in browser-safe modules; use the typed REST adapter to switch explicitly from demo fixtures to an external service.
- Import Leaflet dynamically from an effect because map imports must not access the DOM during SSR.
- Keep demo location and conversations in memory only; do not add persistent personal-data storage without a connected service and privacy review.
- Use AI Elements for the assistant transcript and composer; the current assistant uses deterministic demo replies, not a live LLM.
- The hosted app uses the supported TanStack stack; document external FastAPI and PostgreSQL contracts without pretending a Python service runs in the app’s Worker runtime.

- Run free-text translation on-device (NLLB-200 via transformers.js in a Web Worker, cached in the browser) because translation must work offline without a translation API.
- Keep voice recognition and synthesis behind browser event handlers, with session-only translation history and bundled emergency phrases, because speech support varies and traveler text must not be silently persisted or sent to a translation API.
- Use Lovable Cloud auth built-in TOTP MFA for 2FA; account state lives in AuthProvider so screens can require the second step.
- Register the app-shell service worker only via src/lib/safar/pwa.ts (vite-plugin-pwa generateSW, NetworkOnly pages with offline.html fallback) because private data, auth and live safety data must never be cached and previews must stay uncached.
