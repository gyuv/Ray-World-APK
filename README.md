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

## The Download button

The **RaY-World** source repo (built by CI to the `apk-latest` release, asset
`app-universal.apk` — a universal phone + Android TV build) is **private**,
so its release assets aren't publicly downloadable. This repo keeps its own
mirrored copy under [`downloads/app-universal.apk`](downloads/app-universal.apk)
instead, and every `Download APK` button points at that local copy. It's
wired in the config block near the bottom `<script>` of `index.html`:

```js
const APK_URL = "/downloads/app-universal.apk";
const APP_VERSION = "1.0.11";
const APP_SIZE = "~ 3.2 MB";
```

### Keeping the mirror in sync

[`.github/workflows/sync-apk.yml`](.github/workflows/sync-apk.yml) checks the
source repo's latest release every 6 hours (and on-demand via
**Actions → Sync APK from RaY-World → Run workflow**). When it finds a new
release it downloads `app-universal.apk` + `version.json`, overwrites
`downloads/`, bumps `APP_VERSION`/`APP_SIZE` in `index.html`, and commits +
pushes automatically — no manual copying needed for future builds.

This requires a repo secret **`SOURCE_REPO_TOKEN`**: a GitHub token (classic
PAT with `repo` scope, or a fine-grained PAT with read-only "Contents" access
to `gyuv/RaY-World`) able to read that private repo's releases. Add it under
**Settings → Secrets and variables → Actions** on this repo. Without it the
sync job fails with a clear error instead of silently doing nothing.

`downloads/version.json` records which upstream release is currently
mirrored (`sourceTag`, `mirroredAt`) so the workflow can skip re-downloading
when there's nothing new.

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
vercel.json              # cleanUrls + cache headers for /assets and /downloads
downloads/
  app-universal.apk      # mirrored copy of the latest RaY-World release APK
  version.json           # metadata for the mirrored build (synced automatically)
.github/workflows/
  sync-apk.yml           # pulls the newest APK from the source repo on a schedule
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
