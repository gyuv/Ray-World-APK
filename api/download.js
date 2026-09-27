// Vercel serverless function — serves the APKs from the PRIVATE RaY-World repo.
//
// Visitors can't download release assets from a private repo, so the page links
// to /api/download?device=mobile|tv instead. This function looks up the newest
// release that carries the asset (pre-releases included) and redirects the
// visitor to a short-lived signed GitHub download URL. The token never reaches
// the browser.
//
// Set in your Vercel project (Settings → Environment Variables):
//   GITHUB_TOKEN — a fine-grained token with read-only "Contents" access to
//                  gyuv/RaY-World (nothing else needed)

const REPO = "gyuv/RaY-World";
const ASSETS = { mobile: "rayworld-mobile.apk", tv: "rayworld-tv.apk" };

module.exports = async function handler(req, res) {
  const name = ASSETS[req.query.device];
  if (!name) {
    res.status(400).send("Unknown device. Use ?device=mobile or ?device=tv");
    return;
  }
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    res.status(503).send("Download is not configured yet (GITHUB_TOKEN missing).");
    return;
  }
  const gh = { Authorization: "Bearer " + token, "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "rayworld-site" };

  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=20`, {
      headers: { ...gh, Accept: "application/vnd.github+json" },
    });
    if (!r.ok) throw new Error("releases " + r.status);
    const releases = await r.json();
    let asset;
    for (const rel of releases) {
      if (rel.draft) continue;
      asset = (rel.assets || []).find((a) => a.name === name);
      if (asset) break;
    }
    if (!asset) {
      res.status(404).send(name + " not found in any release.");
      return;
    }

    // Asking for the binary returns a 302 to a signed, time-limited URL.
    const d = await fetch(asset.url, { headers: { ...gh, Accept: "application/octet-stream" }, redirect: "manual" });
    const loc = d.headers.get("location");
    if (!loc) throw new Error("asset " + d.status);

    res.setHeader("Cache-Control", "no-store");
    res.redirect(302, loc);
  } catch (e) {
    res.status(502).send("Could not fetch the download right now. Please try again.");
  }
};
