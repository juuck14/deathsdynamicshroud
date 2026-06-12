import { useMemo } from "react";
import { useData } from "../useData.js";
import { useListened } from "../useListened.js";
import GlitchCover from "../components/GlitchCover.jsx";
import ListenDot from "../components/ListenDot.jsx";

const CAT_SHORT = {
  "Studio Album": "LP", "NUWRLD Mixtape (.wmv)": ".WMV",
  "NUWRLD Mixtape Club": "NMC", "Live Album": "LIVE", "EP": "EP", "Single": "SGL",
};
function fmtDate(d) {
  if (!d) return "DATE UNKNOWN";
  const [y, m, day] = d.split("-");
  const mo = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"][(+m || 1) - 1] || "";
  return [day, mo, y].filter(Boolean).join(" ");
}

const PRODUCER_COLOR = {
  "James Webster": "oklch(0.70 0.23 352)",
  "Tech Honors": "oklch(0.76 0.18 200)",
  "Keith Rankin": "oklch(0.85 0.17 95)",
};

export default function AlbumDetail({ id, navigate }) {
  const { albums } = useData();
  const { has, toggle } = useListened();

  const album = useMemo(() => (albums || []).find((a) => a.id === id || a.id.startsWith(id)), [albums, id]);
  const related = useMemo(() => {
    if (!album || !albums) return [];
    return albums.filter((a) => a.id !== album.id && a.category === album.category).slice(0, 8);
  }, [album, albums]);

  if (!albums) return (
    <div className="loader">
      <span className="loader-glyph">死</span>
      <div className="loader-bar"><div className="loader-fill" /></div>
      <span className="loader-label">Loading…</span>
    </div>
  );

  if (!album) return (
    <main><div className="wrap album">
      <button className="back" onClick={() => navigate("archive")} data-hot>← Back to Archive</button>
      <p style={{ color: "var(--bone-dim)" }}>Album not found.</p>
    </div></main>
  );

  const isJp = /[　-鿿]/.test(album.title);
  const catS = CAT_SHORT[album.category] || album.category;
  const heard = has(album.id);

  return (
    <main>
      <div className="wrap album">
        <button className="back" onClick={() => navigate("archive")} data-hot>← Back to Archive</button>
        <div className="album-grid">
          <div className="album-cover">
            <GlitchCover album={album} eager />
            <div className="ac-meta">
              <span>{catS}</span>
              <span>{album.cover ? "COVER ART ARCHIVE" : "NO ARTWORK"}</span>
            </div>
          </div>

          <div className="album-info">
            <div className="kicker">{catS} · {album.category.toUpperCase()}</div>
            <h1 className={`album-title ${isJp ? "glyph-jp" : ""}`}>{album.title}</h1>
            {album.disambiguation && <p className="album-sub">{album.disambiguation}</p>}

            <div className="album-actions">
              <button className={"btn" + (heard ? " solid" : "")} onClick={() => toggle(album.id)} data-hot={heard ? "heard" : "mark"}>
                {heard ? "✦ In your collection" : "+ Mark as listened"}
              </button>
            </div>

            <div className="album-facts">
              <div className="fact"><div className="k">Released</div><div className="v">{album.firstReleaseDate ? fmtDate(album.firstReleaseDate) : "—"}</div></div>
              <div className="fact"><div className="k">Format</div><div className="v">{album.category}</div></div>
              <div className="fact"><div className="k">Primary genre</div><div className="v">{album.primaryGenre || "—"}</div></div>
            </div>

            {album.producers && album.producers.length > 0 && (
              <div className="album-producers">
                <span className="ap-k mono">PRODUCED BY</span>
                <div className="ap-chips">
                  {album.producers.map((p) => (
                    <button key={p} className="prod-chip" style={{ "--pc": PRODUCER_COLOR[p] || "var(--bone-dim)" }}
                      onClick={() => navigate("producers")} data-hot="map">
                      <span className="pc-dot" />{p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {album.genres && album.genres.length > 0 && (
              <div className="album-genres">
                {album.genres.map((g) => <span key={g.id || g.name || g} className="pill genre">{g.name || g}</span>)}
              </div>
            )}

            {album.urls && album.urls.length > 0 && (
              <div className="album-links">
                {album.urls.map((u, i) => (
                  <a key={u.resource || i} href={u.resource} target="_blank" rel="noreferrer" data-hot="open ↗">{u.type || "Link"} ↗</a>
                ))}
              </div>
            )}

            <p className="album-sub" style={{ marginTop: 36, fontSize: 13, color: "var(--bone-faint)" }}>
              Metadata via MusicBrainz. This archive is an unofficial, non-commercial resource maintained by fans.
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <div className="related">
            <h4>More {album.category}</h4>
            <div className="rel-grid">
              {related.map((a) => (
                <div key={a.id} className="rel-card" data-hot="open" onClick={() => navigate(`album/${a.id}`)}>
                  <GlitchCover album={a} />
                  <div className={`rn ${/[　-鿿]/.test(a.title) ? "glyph-jp" : ""}`}>{a.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
