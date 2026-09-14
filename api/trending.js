// Vercel serverless function — returns TMDB "trending this week" as poster cards.
//
// Set ONE of these in your Vercel project (Settings → Environment Variables) —
// the SAME credential RaY-World already uses. Nothing is exposed to the browser:
//   TMDB_ACCESS_TOKEN  — a TMDB v4 read access token (recommended), or
//   TMDB_API_KEY       — a TMDB v3 API key
//
// The page calls this same-origin at /api/trending, so the key never leaves
// the server. Without a key it returns an empty list and the page falls back
// to its branded gradient posters (so it never looks broken).

module.exports = async function handler(req, res) {
  const v3 = process.env.TMDB_API_KEY;
  const v4 = process.env.TMDB_ACCESS_TOKEN;

  // cache at the edge: refresh hourly, serve stale up to a day while revalidating
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");

  if (!v3 && !v4) {
    res.status(200).json({ results: [], configured: false });
    return;
  }

  try {
    const url =
      "https://api.themoviedb.org/3/trending/all/week?language=en-US" +
      (v4 ? "" : "&api_key=" + encodeURIComponent(v3));
    const r = await fetch(url, v4 ? { headers: { Authorization: "Bearer " + v4 } } : undefined);
    if (!r.ok) {
      res.status(200).json({ results: [], configured: true, error: r.status });
      return;
    }
    const data = await r.json();
    const results = (data.results || [])
      .filter((x) => x.poster_path)
      .slice(0, 20)
      .map((x) => ({
        title: x.title || x.name || "",
        poster: "https://image.tmdb.org/t/p/w342" + x.poster_path,
      }));
    res.status(200).json({ results, configured: true });
  } catch (e) {
    res.status(200).json({ results: [], configured: true, error: "fetch_failed" });
  }
};
