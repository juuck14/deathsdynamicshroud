import { useMemo, useState } from "react";
import { useData } from "../useData.js";
import { useListened } from "../useListened.js";
import GlitchCover from "../components/GlitchCover.jsx";
import ListenDot from "../components/ListenDot.jsx";

const CATEGORY_ORDER = ["Studio Album", "NUWRLD Mixtape (.wmv)", "NUWRLD Mixtape Club", "Live Album", "EP", "Single"];
const CAT_SHORT = {
  "Studio Album": "LP", "NUWRLD Mixtape (.wmv)": ".WMV",
  "NUWRLD Mixtape Club": "NMC", "Live Album": "LIVE", "EP": "EP", "Single": "SGL",
};
const CORE = ["James Webster", "Tech Honors", "Keith Rankin"];
function yearOf(a) { return (a.firstReleaseDate || "").slice(0, 4) || "—"; }
function isLatin(s) { return /^[\x00-\x7F\s]*$/.test(s); }

export default function Archive({ navigate }) {
  const { albums } = useData();
  const { has, toggle, count: listenedCount } = useListened();
  const [groupBy, setGroupBy] = useState("category");
  const [sortDir, setSortDir] = useState("desc");
  const [query, setQuery] = useState("");
  const [onlyHeard, setOnlyHeard] = useState(false);
  const [cat, setCat] = useState("all");

  const cats = useMemo(() => (
    ["all", ...CATEGORY_ORDER.filter((c) => (albums || []).some((a) => a.category === c))]
  ), [albums]);

  const filtered = useMemo(() => {
    let out = (albums || []).filter((a) => {
      if (cat !== "all" && a.category !== cat) return false;
      if (onlyHeard && !has(a.id)) return false;
      if (query && !a.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    out = [...out].sort((a, b) => {
      const d = (a.firstReleaseDate || "").localeCompare(b.firstReleaseDate || "");
      return sortDir === "asc" ? d : -d;
    });
    return out;
  }, [albums, cat, onlyHeard, query, sortDir, listenedCount]);

  const groups = useMemo(() => {
    const map = new Map();
    for (const a of filtered) {
      let keys;
      if (groupBy === "category") keys = [a.category];
      else if (groupBy === "year") keys = [yearOf(a)];
      else if (groupBy === "producer") {
        const prods = (a.producers || []).filter((p) => CORE.includes(p));
        keys = prods.length ? prods : ["Unattributed"];
      } else keys = [a.primaryGenre || "Uncategorised"];

      for (const key of keys) {
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(a);
      }
    }
    let keys = [...map.keys()];
    if (groupBy === "category") keys.sort((a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b));
    else if (groupBy === "year") keys.sort((a, b) => sortDir === "asc" ? a.localeCompare(b) : b.localeCompare(a));
    else if (groupBy === "producer") {
      const ORDER = ["James Webster", "Tech Honors", "Keith Rankin", "Unattributed"];
      keys.sort((a, b) => {
        const ia = ORDER.indexOf(a) < 0 ? 99 : ORDER.indexOf(a);
        const ib = ORDER.indexOf(b) < 0 ? 99 : ORDER.indexOf(b);
        return ia !== ib ? ia - ib : map.get(b).length - map.get(a).length;
      });
    } else keys.sort((a, b) => map.get(b).length - map.get(a).length);
    return keys.map((k) => [k, map.get(k)]);
  }, [filtered, groupBy, sortDir]);

  return (
    <main>
      <div className="wrap archive-head">
        <div className="ah-row">
          <div>
            <div className="kicker">THE COMPLETE WORKS · 2014 — PRESENT</div>
            <h1 className="ah-title">The <span className="serif-i">Archive</span></h1>
          </div>
          <div className="ah-count">
            SHOWING <b>{filtered.length}</b> OF {albums?.length ?? "—"} · COLLECTED <b>{listenedCount}</b>
          </div>
        </div>
      </div>

      <div className="controls">
        <div className="wrap">
          <div className="controls-in">
            <div className="search-wrap">
              <span className="search-ic">⌕</span>
              <input
                className="search"
                placeholder="SEARCH TITLES…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="seg" title="Group by">
              {[["category","Category"],["year","Year"],["producer","Producer"],["genre","Genre"]].map(([k, l]) => (
                <button key={k} className={groupBy === k ? "on" : ""} onClick={() => setGroupBy(k)}>{l}</button>
              ))}
            </div>
            <div className="seg" title="Sort">
              {[["desc","Newest"],["asc","Oldest"]].map(([k, l]) => (
                <button key={k} className={sortDir === k ? "on" : ""} onClick={() => setSortDir(k)}>{l}</button>
              ))}
            </div>
            <button
              className={"catchip" + (onlyHeard ? " on" : "")}
              onClick={() => setOnlyHeard((v) => !v)}
              data-hot="filter"
            >
              ✦ Collected only
            </button>
          </div>
          <div className="catbar">
            {cats.map((c) => (
              <button key={c} className={"catchip" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>
                {c === "all" ? "All" : c}
                <span className="c">{c === "all" ? albums?.length : (albums || []).filter((a) => a.category === c).length}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap archive-body">
        {groups.map(([key, items]) => (
          <section key={key} className="grp">
            <div className="grp-head">
              <h3 className={isLatin(String(key)) ? "" : "glyph-jp"}>{key}</h3>
              <span className="gc">{String(items.length).padStart(2, "0")}</span>
            </div>
            <div className="arc-grid">
              {items.map((a) => (
                <article
                  key={a.id}
                  className={"arc-card" + (has(a.id) ? " heard" : "")}
                  onClick={() => navigate(`album/${a.id}`)}
                  data-hot="open"
                >
                  <div className="arc-cap">{a._cat}</div>
                  <div className="arc-listen">
                    <ListenDot on={has(a.id)} onClick={(e) => { e.stopPropagation(); toggle(a.id); }} />
                  </div>
                  <GlitchCover album={a} />
                  <div className="arc-meta">
                    <h4 className={"arc-name" + (isLatin(a.title) ? "" : " glyph-jp")}>{a.title}</h4>
                    <div className="arc-tags">
                      <span className="pill cat">{CAT_SHORT[a.category] || a.category}</span>
                      <span className="mono">{yearOf(a)}</span>
                      {a.primaryGenre && <span className="mono">· {a.primaryGenre}</span>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
        {filtered.length === 0 && <p className="empty">NO RECORDS MATCH THE QUERY.</p>}
      </div>
    </main>
  );
}
