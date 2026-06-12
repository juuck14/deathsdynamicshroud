import { useMemo, useState } from "react";
import { useData } from "../useData.js";
import { useListened } from "../useListened.js";
import GlitchCover from "../components/GlitchCover.jsx";
import ListenDot from "../components/ListenDot.jsx";

const BASE = import.meta.env.BASE_URL;
const CATEGORY_ORDER = ["Studio Album", "NUWRLD Mixtape (.wmv)", "NUWRLD Mixtape Club", "Live Album", "EP", "Single"];
const CAT_SHORT = {
  "Studio Album": "LP", "NUWRLD Mixtape (.wmv)": ".WMV",
  "NUWRLD Mixtape Club": "NMC", "Live Album": "LIVE", "EP": "EP", "Single": "SGL",
};

export default function Archive({ navigate }) {
  const { albums } = useData();
  const { has, toggle } = useListened();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("date");
  const [catFilter, setCatFilter] = useState(null);

  const counts = useMemo(() => {
    const m = {};
    (albums || []).forEach((a) => { m[a.category] = (m[a.category] || 0) + 1; });
    return m;
  }, [albums]);

  const filtered = useMemo(() => {
    let list = albums || [];
    if (q) list = list.filter((a) => a.title.toLowerCase().includes(q.toLowerCase()));
    if (catFilter) list = list.filter((a) => a.category === catFilter);
    if (sort === "date") list = [...list].sort((a, b) => (b.firstReleaseDate || "").localeCompare(a.firstReleaseDate || ""));
    else if (sort === "az") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "cat") {
      list = [...list].sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category));
    }
    return list;
  }, [albums, q, sort, catFilter]);

  const groups = useMemo(() => {
    if (sort !== "cat" && !catFilter) {
      const byYear = {};
      filtered.forEach((a) => { const y = a.year || "Unknown"; if (!byYear[y]) byYear[y] = []; byYear[y].push(a); });
      return Object.entries(byYear).sort(([a], [b]) => b.localeCompare(a)).map(([y, list]) => ({ key: y, label: y, list }));
    }
    if (catFilter) return [{ key: catFilter, label: catFilter, list: filtered }];
    const byCat = {};
    filtered.forEach((a) => { if (!byCat[a.category]) byCat[a.category] = []; byCat[a.category].push(a); });
    return CATEGORY_ORDER.filter((c) => byCat[c]).map((c) => ({ key: c, label: c, list: byCat[c] }));
  }, [filtered, sort, catFilter]);

  return (
    <main>
      <div className="wrap">
        <div className="archive-head">
          <div className="ah-row">
            <div>
              <div className="kicker">全カタログ</div>
              <h1 className="ah-title">Arch<span className="serif-i">i</span>ve</h1>
            </div>
            <span className="ah-count"><b>{filtered.length}</b> / {albums?.length ?? "—"} releases</span>
          </div>
        </div>

        <div className="controls">
          <div className="controls-in">
            <div className="search-wrap">
              <span className="search-ic">⌕</span>
              <input
                className="search"
                placeholder="Search releases…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div>
              <span className="ctrl-label">Sort</span>
              <div className="seg">
                {[["date","Date"],["az","A–Z"],["cat","Category"]].map(([v,l]) => (
                  <button key={v} className={sort === v ? "on" : ""} onClick={() => setSort(v)} data-hot>{l}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="catbar">
            <button className={`catchip ${!catFilter ? "on" : ""}`} onClick={() => setCatFilter(null)} data-hot>
              All <span className="c">{albums?.length}</span>
            </button>
            {CATEGORY_ORDER.filter((c) => counts[c]).map((c) => (
              <button key={c} className={`catchip ${catFilter === c ? "on" : ""}`} onClick={() => setCatFilter(catFilter === c ? null : c)} data-hot>
                {CAT_SHORT[c]} <span className="c">{counts[c]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="archive-body">
          {groups.length === 0 && <div className="empty">No releases found</div>}
          {groups.map(({ key, label, list }) => (
            <div key={key} className="grp">
              <div className="grp-head">
                <h3 className={/[　-鿿]/.test(label) ? "glyph-jp" : ""}>{label}</h3>
                <span className="gc">{list.length}</span>
              </div>
              <div className="arc-grid">
                {list.map((a) => (
                  <ArcCard key={a.id} album={a} heard={has(a.id)} onToggle={() => toggle(a.id)} navigate={navigate} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function ArcCard({ album: a, heard, onToggle, navigate }) {
  const catS = CAT_SHORT[a.category] || a.category;
  const isJp = /[　-鿿]/.test(a.title);
  return (
    <article className={`arc-card ${heard ? "heard" : ""}`} data-hot="open" onClick={() => navigate(`album/${a.id}`)}>
      <span className="arc-cap">{catS}</span>
      <div className="arc-listen"><ListenDot on={heard} onClick={onToggle} /></div>
      <GlitchCover album={a} />
      <div className="arc-meta">
        <h4 className={`arc-name ${isJp ? "glyph-jp" : ""}`}>{a.title}</h4>
        <div className="arc-tags">
          <span className="pill cat">{catS}</span>
          <span className="mono">{(a.firstReleaseDate || "").slice(0, 4) || "—"}</span>
          {a.primaryGenre && <span className="mono">· {a.primaryGenre}</span>}
        </div>
      </div>
    </article>
  );
}
