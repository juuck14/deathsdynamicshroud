import { useMemo, useEffect, useRef } from "react";
import { useData } from "../useData.js";
import { useListened } from "../useListened.js";
import GlitchCover from "../components/GlitchCover.jsx";
import ListenDot from "../components/ListenDot.jsx";

const FEATURED_ID = "120d401b";

const CATEGORY_ORDER = ["Studio Album","NUWRLD Mixtape (.wmv)","NUWRLD Mixtape Club","Live Album","EP","Single"];
const CAT_SHORT = {
  "Studio Album": "LP","NUWRLD Mixtape (.wmv)": ".WMV",
  "NUWRLD Mixtape Club": "NMC","Live Album": "LIVE","EP": "EP","Single": "SGL",
};
const ERA_BLURB = {
  "Studio Album": "The proper albums — fully-formed and front-to-back.",
  "NUWRLD Mixtape (.wmv)": "The 2014 origin tapes that named the sound.",
  "NUWRLD Mixtape Club": "The monthly subscription series — the endless engine.",
  "Live Album": "Captured on stage, far from the bedroom.",
  "EP": "Short-form detours and concept pieces.",
  "Single": "One-off transmissions and edits.",
};
const MEMBERS = [
  { name: "James Webster", glyph: "電", role: "the .wmv architect" },
  { name: "Tech Honors",   glyph: "技", role: "the pop instinct" },
  { name: "Keith Rankin",  glyph: "爪", role: "also records as Giant Claw" },
];

function yearOf(a) { return (a.firstReleaseDate || "").slice(0, 4) || "—"; }
function isLatin(s) { return /^[\x00-\x7F\s]*$/.test(s); }
function fmtDate(d) {
  if (!d) return "DATE UNKNOWN";
  const [y, m, day] = d.split("-");
  const mo = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"][(+m || 1) - 1] || "";
  return [day, mo, y].filter(Boolean).join(" ");
}

function useReveal(ref) {
  useEffect(() => {
    if (!ref?.current) return;
    const els = ref.current.querySelectorAll(".fade-up:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

export default function Home({ navigate }) {
  const { albums } = useData();
  const { has, toggle } = useListened();
  const bodyRef = useRef(null);
  useReveal(bodyRef);

  const featured = useMemo(() => {
    if (!albums) return null;
    return albums.find(a => a.id.startsWith(FEATURED_ID)) || albums.find(a => a.category === "Studio Album") || albums[0];
  }, [albums]);

  const studioAlbums = useMemo(() =>
    [...(albums || [])].filter(a => a.category === "Studio Album")
      .sort((x, y) => (x.firstReleaseDate || "").localeCompare(y.firstReleaseDate || "")),
  [albums]);

  const latest8 = useMemo(() =>
    [...(albums || [])].sort((a, b) => (b.firstReleaseDate || "").localeCompare(a.firstReleaseDate || "")).slice(0, 8),
  [albums]);

  const eras = useMemo(() => {
    const map = {};
    (albums || []).forEach(a => { if (!map[a.category]) map[a.category] = []; map[a.category].push(a); });
    return CATEGORY_ORDER.filter(c => map[c]).map(c => {
      const items = map[c];
      const ys = items.map(yearOf).filter(y => /^\d{4}$/.test(y)).map(Number);
      const span = ys.length ? `${Math.min(...ys)}–${Math.max(...ys)}` : "—";
      return { cat: c, count: items.length, span };
    });
  }, [albums]);

  const totalYears = useMemo(() => {
    if (!albums) return 0;
    const ys = albums.map(yearOf).filter(y => /^\d{4}$/.test(y)).map(Number);
    return ys.length ? Math.max(...ys) - Math.min(...ys) : 0;
  }, [albums]);

  const TICKER = ["VAPORWAVE","PLUNDERPHONICS","ECCOJAMS","死","AMBIENT","EXPERIMENTAL","神世紀","DECONSTRUCTED CLUB","ART POP","NUWRLD","CYBER METAL","電"];

  return (
    <main className="home" ref={bodyRef}>
      {/* ── Hero ── */}
      <header className="hero">
        <div className="hero-glyph glyph-jp spin-slow" aria-hidden="true">死</div>
        <div className="wrap hero-in">
          <div className="hero-copy">
            <div className="kicker">EST. DAYTON, OHIO · <span style={{ color: "var(--magenta)" }}>MMXIV</span> — THE COMPLETE WORKS</div>
            <h1 className="hero-title">
              <span className="l1 serif-i">death&rsquo;s</span>
              <span className="l2">DYNAMIC</span>
              <span className="l3 chrome-text">SHROUD</span>
            </h1>
            <p className="hero-sub">
              A fan-built monument to the most prolific architects of the vaporwave
              era — <em>{albums?.length ?? "—"} recorded works</em> and counting, catalogued in full.
            </p>
            <div className="hero-cta">
              <button className="btn solid" data-hot="enter" onClick={() => navigate("archive")}>
                Enter the Archive <span className="arr">→</span>
              </button>
              <button className="btn" data-hot="collective" onClick={() => navigate("about")}>
                The Collective
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-n serif">{albums?.length ?? "—"}</div>
                <div className="stat-l">CATALOGUED WORKS</div>
              </div>
              <div className="stat">
                <div className="stat-n serif">{totalYears}</div>
                <div className="stat-l">YEARS ACTIVE</div>
              </div>
              <div className="stat">
                <div className="stat-n serif">03</div>
                <div className="stat-l">ARCHITECTS</div>
              </div>
            </div>
          </div>

          {featured && (
            <div className="hero-feature">
              <div className="hero-plate" data-hot="open work" onClick={() => navigate(`album/${featured.id}`)}>
                <GlitchCover album={featured} eager />
              </div>
              <div className="hero-feat-meta">
                <span className="mono-cat mono">{CAT_SHORT[featured.category]}</span>
                <span className="mono-title mono">{featured.title}</span>
                <span className="mono-date mono">{fmtDate(featured.firstReleaseDate)} — DEFINING STATEMENT</span>
              </div>
            </div>
          )}
        </div>

        {/* Ticker */}
        <div className="hero-ticker">
          <div className="ticker-track">
            {[0, 1].flatMap((k) =>
              TICKER.map((t, i) => (
                <span key={k + "-" + i} className="tick mono">
                  {t}<i style={{ color: "var(--magenta)", fontStyle: "normal" }}>✦</i>
                </span>
              ))
            )}
          </div>
        </div>
      </header>

      {/* ── Stature band ── */}
      {albums && (
        <section className="stature fade-up">
          <div className="wrap">
            <div className="stature-grid">
              <div className="stature-num serif chrome-text">{String(albums.length).padStart(3, "0")}</div>
              <div className="stature-copy">
                <div className="kicker">ON SCALE</div>
                <p className="serif" style={{ fontSize: "clamp(22px, 2.6vw, 38px)", lineHeight: 1.28, margin: "14px 0 0", color: "var(--bone)", maxWidth: "26ch" }}>
                  Between a bedroom in Dayton and the farthest edge of the internet,
                  three producers built one of the largest, strangest, and most devoted catalogues in electronic music.
                </p>
                <p className="stature-foot mono" style={{ fontSize: 12, letterSpacing: "0.05em", color: "var(--bone-dim)", lineHeight: 1.8, marginTop: 22 }}>
                  {albums.length} official releases · {albums.filter(a => a.category === "NUWRLD Mixtape Club").length} entries in the ongoing NUWRLD MIXTAPE CLUB ·
                  a new transmission, most months, for over a decade.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Landmark works ── */}
      {studioAlbums.length > 0 && (
        <section className="section fade-up">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="kicker">SECTION I — <span style={{ color: "var(--magenta)" }}>CANON</span></div>
                <h2 className="sec-title">Landmark <span className="serif-i">Works</span></h2>
              </div>
              <p className="sec-note">The studio statements. Each one a thesis on memory, decay, and the sound of a half-remembered future.</p>
            </div>
            <div className="land-grid">
              {studioAlbums.map((a, i) => (
                <article key={a.id} className="land-card" onClick={() => navigate(`album/${a.id}`)} data-hot="open">
                  <div className="land-idx mono">{String(i + 1).padStart(2, "0")}</div>
                  <GlitchCover album={a} />
                  <div className="land-meta">
                    <div className="land-top">
                      <span className="pill cat">{CAT_SHORT[a.category]}</span>
                      <span className="mono dim">{yearOf(a)}</span>
                    </div>
                    <h3 className={"land-name" + (isLatin(a.title) ? "" : " glyph-jp")}>{a.title}</h3>
                    <div className="land-foot">
                      <ListenDot on={has(a.id)} onClick={() => toggle(a.id)} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest strip ── */}
      {latest8.length > 0 && (
        <section className="section fade-up">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="kicker">SECTION II — <span style={{ color: "var(--magenta)" }}>TRANSMISSIONS</span></div>
                <h2 className="sec-title">Most <span className="serif-i">Recent</span></h2>
              </div>
              <button className="btn" onClick={() => navigate("archive")} data-hot="all">All releases →</button>
            </div>
          </div>
          <div className="latest-scroll">
            <div className="latest-track">
              {latest8.map(a => (
                <div key={a.id} className="latest-card" onClick={() => navigate(`album/${a.id}`)} data-hot="open">
                  <GlitchCover album={a} />
                  <div className="latest-meta">
                    <span className="mono dim" style={{ fontSize: 10, letterSpacing: "0.1em" }}>{fmtDate(a.firstReleaseDate)}</span>
                    <span className={"latest-name" + (isLatin(a.title) ? "" : " glyph-jp")}>{a.title}</span>
                    <span className="pill genre">{a.primaryGenre || "uncategorised"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Eras index ── */}
      {eras.length > 0 && (
        <section className="section fade-up">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="kicker">SECTION III — <span style={{ color: "var(--magenta)" }}>STRATA</span></div>
                <h2 className="sec-title">The <span className="serif-i">Eras</span></h2>
              </div>
              <p className="sec-note">Six bodies of work, one continuous signal. Jump into any stratum of the archive.</p>
            </div>
            <div className="eras">
              {eras.map((r, i) => (
                <button key={r.cat} className="era-row" onClick={() => navigate("archive")} data-hot="browse">
                  <span className="era-no mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="era-name">{r.cat}</span>
                  <span className="era-blurb">{ERA_BLURB[r.cat]}</span>
                  <span className="era-span mono dim">{r.span}</span>
                  <span className="era-count serif">{String(r.count).padStart(2, "0")}</span>
                  <span className="era-arr">→</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Collective teaser ── */}
      <section className="section fade-up">
        <div className="wrap">
          <div className="collective">
            <div className="coll-head">
              <div className="kicker">SECTION IV — <span style={{ color: "var(--magenta)" }}>THE COLLECTIVE</span></div>
              <h2 className="sec-title">Three <span className="serif-i">Architects</span></h2>
            </div>
            <div className="coll-grid">
              {MEMBERS.map(m => (
                <div key={m.name} className="coll-card" data-hot="">
                  <div className="coll-glyph glyph-jp">{m.glyph}</div>
                  <div className="coll-name">{m.name}</div>
                  <div className="coll-role mono dim">{m.role}</div>
                </div>
              ))}
            </div>
            <button className="btn" onClick={() => navigate("about")} data-hot="read">Read the full record →</button>
          </div>
        </div>
      </section>
    </main>
  );
}
