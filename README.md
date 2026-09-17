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

## The Download buttons

RaY-World's CI now publishes **two separate Android builds** on every release
instead of one universal APK: a phone/tablet build and a dedicated Android TV
(Leanback) build. The site's `Download for Phone` and `Download for Android TV`
buttons each point at their matching release asset for a true one-click
download. It's wired in the config block near the bottom `<script>` of
`index.html`:

```js
const APK_URL_MOBILE = "https://github.com/gyuv/RaY-World/releases/latest/download/app-mobile.apk";
const APK_URL_TV = "https://github.com/gyuv/RaY-World/releases/latest/download/app-tv.apk";
const APP_VERSION = "latest";
const APP_SIZE = "~ 3.3 MB";
```

Both APKs live in the **RaY-World** repo (built by CI to the `apk-latest`
release — assets `app-mobile.apk` and `app-tv.apk`). Because the asset names
are stable, `/releases/latest/download/<asset>` always fetches the newest
build of each with no page changes needed. If you rename an asset in future,
update the matching `APK_URL_*` constant to match.

Elements marked `data-dl` get wired to the phone build; elements marked
`data-dl-tv` get wired to the TV build. The Install section's platform toggle
now has three tabs — **Android Phone**, **Android TV** and **iPhone / iPad** —
each with its own install steps and download button.

## Use your real app screenshots ("A look inside" carousel)

The coverflow carousel auto-advances every 4s (centre screen large, neighbours
peeking on the sides). Each slide first tries a real screenshot and falls back
to the built-in app mockup if the file isn't there — so it looks complete now
and upgrades the moment you add images.

Drop your (portrait) screenshots into `assets/screens/` with these names:

```
assets/screens/home.png     # Home / featured
assets/screens/watch.png    # Player / servers
assets/screens/detail.png   # Movie detail
```

Commit and redeploy — the carousel shows your real screens automatically. Want
more than three slides, or different labels? Say so and I'll wire them.

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
