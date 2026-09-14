# RaY World — APK download page

The official Android download page for **[RaY World](https://rayworld.vercel.app/)** —
a Tamil-first, universal entertainment discovery platform. **Discover • Watch • Enjoy.**

A single, self-contained static site (no build step) styled around the RaY World
brand — chrome + neon magenta/violet on pure black — with premium motion:
an animated ray/particle canvas, aurora glow, cursor spotlight, 3D phone tilt,
magnetic buttons, scroll reveals, count-up stats and an accordion FAQ.

## Deploy (Vercel)

Zero config. Import this repo into Vercel and deploy — it's served as a static
site straight from the repo root. `index.html` is the whole page; `/assets`
holds the brand images.

## Point the Download button at your APK

Open `index.html` and edit the config block near the bottom `<script>`:

```js
const APK_URL = "https://github.com/gyuv/ray-world-apk/releases";
const APP_VERSION = "1.0";
const APP_SIZE = "~ 28 MB";
```

- **Right now** the button opens the GitHub **Releases** page (never 404s and
  always lists your latest APK).
- **For true one-click download**, publish a Release with an asset named
  `RayWorld.apk`, then switch `APK_URL` to:
  ```js
  const APK_URL = "https://github.com/gyuv/ray-world-apk/releases/latest/download/RayWorld.apk";
  ```
  Every `Download APK` button on the page updates automatically.

## Show real movie posters (TMDB)

The **Trending now** row pulls live posters from TMDB through a tiny serverless
function (`api/trending.js`) so your API key stays on the server — never in the
repo or the browser. To turn it on:

1. In Vercel → your project → **Settings → Environment Variables**, add **one**
   (the same credential RaY-World uses):
   - `TMDB_ACCESS_TOKEN` — a TMDB **v4** read access token (recommended), or
   - `TMDB_API_KEY` — a TMDB **v3** API key
2. Redeploy.

The page calls `/api/trending` (same origin) and renders real posters. Until a
key is set — or if TMDB is unreachable — it falls back to branded gradient
cards, so it never looks broken. Locally (opening `index.html` as a file) there's
no server, so you'll see the gradient fallback; deploy to Vercel to see posters.

## Structure

```
index.html               # the entire page (HTML + CSS + JS inline)
api/trending.js          # serverless: TMDB trending posters (key stays server-side)
vercel.json              # cleanUrls + long-cache headers for /assets
assets/
  app-icon.png           # 512² app icon (hero orbit, CTA, apple-touch-icon)
  favicon.png            # 180² browser tab icon
  logo.png               # horizontal RAYWORLD lockup
  logo-stacked.png       # stacked lockup (footer)
  wordmark.png           # compact wordmark
```

Brand assets are the official RaY World artwork, resized for the web.

---

_This product uses the TMDB API but is not endorsed or certified by TMDB._
