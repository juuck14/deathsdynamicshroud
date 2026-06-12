import { useMemo, useRef, useState } from "react";
import { useData } from "../useData.js";
import { useReveal } from "../useReveal.js";

const BASE = import.meta.env.BASE_URL;

const CORE = ["James Webster", "Tech Honors", "Keith Rankin"];
const MEMBERS = [
  { name: "James Webster", glyph: "電", color: "var(--cyan)" },
  { name: "Tech Honors",   glyph: "技", color: "var(--magenta)" },
  { name: "Keith Rankin",  glyph: "爪", color: "var(--gold)" },
];
const PRODUCER_COLOR = {
  "James Webster": "var(--cyan)",
  "Tech Honors":   "var(--magenta)",
  "Keith Rankin":  "var(--gold)",
};
const CAT_SHORT = {
  "Studio Album": "LP", "NUWRLD Mixtape (.wmv)": ".WMV",
  "NUWRLD Mixtape Club": "NMC", "Live Album": "LIVE", "EP": "EP", "Single": "SGL",
};

const VW = 820, VH = 700, VR = 196;
const VCIRCLES = [
  { name: "James Webster", cx: 410, cy: 250 },
  { name: "Tech Honors",   cx: 270, cy: 470 },
  { name: "Keith Rankin",  cx: 550, cy: 470 },
];
const VLABEL = {
  "James Webster": { x: 410, y: 26,  anchor: "middle" },
  "Tech Honors":   { x: 96,  y: 590, anchor: "middle" },
  "Keith Rankin":  { x: 724, y: 590, anchor: "middle" },
};
const VREGION = {
  "James Webster":                          { x: 410, y: 150, bw: 152, bh: 124, cap: 20 },
  "Tech Honors":                            { x: 200, y: 520, bw: 150, bh: 150, cap: 20 },
  "Keith Rankin":                           { x: 620, y: 520, bw: 150, bh: 150, cap: 20 },
  "James Webster+Tech Honors":              { x: 300, y: 358, bw: 92,  bh: 116, cap: 12 },
  "James Webster+Keith Rankin":             { x: 520, y: 358, bw: 92,  bh: 116, cap: 12 },
  "Keith Rankin+Tech Honors":               { x: 410, y: 562, bw: 110, bh: 96,  cap: 12 },
  "James Webster+Keith Rankin+Tech Honors": { x: 410, y: 432, bw: 88,  bh: 86,  cap: 9  },
};

function coreSubset(a) {
  const p = a.producers;
  if (!p || !p.length) return null;
  const c = p.filter((x) => CORE.includes(x));
  return c.length ? c : null;
}
function regionKey(prod) { return [...prod].sort().join("+"); }
function hasGuest(a) { return (a.producers || []).some((p) => !CORE.includes(p)); }
function yearOf(a) { return (a.firstReleaseDate || "").slice(0, 4) || "—"; }
function coverUrl(a) { return a.cover ? `${BASE}covers/${a.cover}` : null; }

function packDots(n, bw, bh, cap) {
  let count = n, overflow = 0;
  if (n > cap) { overflow = n - (cap - 1); count = cap - 1; }
  const slots = count + (overflow > 0 ? 1 : 0);
  let cols = Math.max(1, Math.round(Math.sqrt(slots * bw / bh)));
  const rows = Math.ceil(slots / cols);
  let cell = Math.min(bw / cols, bh / rows);
  cell = Math.max(14, Math.min(32, cell));
  return { cols, rows, cell, count, overflow, slots };
}

function VennDots({ albums, x, y, bw, bh, cap, onPick, onHover, onMore, onMoreHover }) {
  const { cols, rows, cell, count, overflow } = packDots(albums.length, bw, bh, cap);
  const slots = count + (overflow > 0 ? 1 : 0);
  const r = cell * 0.42;

  const place = (i) => {
    const row = Math.floor(i / cols);
    const rowCount = (row === rows - 1) ? (slots - row * cols) : cols;
    const col = i % cols;
    const dx = x + (col - (rowCount - 1) / 2) * cell;
    const dy = y + (row - (rows - 1) / 2) * cell;
    return { dx, dy };
  };

  const out = [];
  for (let i = 0; i < count; i++) {
    const a = albums[i];
    const { dx, dy } = place(i);
    const cover = coverUrl(a);
    const guest = hasGuest(a);
    out.push(
      <g key={a.id} className="venn-dot"
        onClick={() => onPick(a)}
        onMouseEnter={() => onHover(a)}
        onMouseLeave={() => onHover(null)}>
        <circle cx={dx} cy={dy} r={r + 2} fill="#060509"
          stroke={guest ? "var(--gold)" : "rgba(236,230,221,0.25)"}
          strokeDasharray={guest ? "2.5 2" : "0"}
          strokeWidth={guest ? 1.5 : 1} />
        {cover ? (
          <>
            <clipPath id={"vc-" + a.id}><circle cx={dx} cy={dy} r={r} /></clipPath>
            <image href={cover} x={dx - r} y={dy - r} width={r * 2} height={r * 2}
              clipPath={"url(#vc-" + a.id + ")"} preserveAspectRatio="xMidYMid slice" />
          </>
        ) : (
          <circle cx={dx} cy={dy} r={r} fill="#1a1326" />
        )}
      </g>
    );
  }
  if (overflow > 0) {
    const { dx, dy } = place(count);
    out.push(
      <g key="more" className="venn-more" onClick={onMore}
        onMouseEnter={() => onMoreHover && onMoreHover(albums, dx, dy, true)}
        onMouseLeave={() => onMoreHover && onMoreHover(null, dx, dy, false)}>
        <circle cx={dx} cy={dy} r={r + 2} fill="rgba(236,230,221,0.07)" stroke="rgba(236,230,221,0.4)" />
        <text x={dx} y={dy} textAnchor="middle" dominantBaseline="central"
          style={{ fill: "var(--bone)", fontFamily: "var(--font-mono)", fontSize: Math.max(8.5, r * 0.6) }}>
          +{overflow}
        </text>
      </g>
    );
  }
  return out;
}

export default function ProducerMap({ navigate }) {
  const { albums } = useData();
  const bodyRef = useReveal();
  const [highlight, setHighlight] = useState(null);
  const [hover, setHover] = useState(null);
  const [more, setMore] = useState(null);
  const svgRef = useRef(null);
  const stageRef = useRef(null);
  const hideT = useRef(null);

  const regionLabel = (k) => k.split("+").join(" ∩ ");
  const handleMoreHover = (list, dx, dy, entering, k) => {
    if (!entering) { hideT.current = setTimeout(() => setMore(null), 130); return; }
    clearTimeout(hideT.current);
    const svg = svgRef.current, stage = stageRef.current;
    if (!svg || !stage) return;
    const ctm = svg.getScreenCTM(); if (!ctm) return;
    const pt = svg.createSVGPoint(); pt.x = dx; pt.y = dy;
    const sp = pt.matrixTransform(ctm);
    const sr = stage.getBoundingClientRect();
    const sorted = [...list].sort((a, b) => (a.firstReleaseDate || "").localeCompare(b.firstReleaseDate || ""));
    setMore({ albums: sorted, label: regionLabel(k), left: sp.x - sr.left, top: sp.y - sr.top });
  };

  const { regions, guestRoster } = useMemo(() => {
    if (!albums) return { regions: {}, guestRoster: [] };
    const m = {};
    const guests = {};
    for (const a of albums) {
      const c = coreSubset(a);
      if (c) { const k = regionKey(c); (m[k] = m[k] || []).push(a); }
      for (const p of (a.producers || [])) {
        if (!CORE.includes(p)) guests[p] = (guests[p] || 0) + 1;
      }
    }
    return { regions: m, guestRoster: Object.entries(guests).sort((a, b) => b[1] - a[1]) };
  }, [albums]);

  if (!albums) return (
    <div className="loader">
      <span className="loader-glyph">死</span>
      <div className="loader-bar"><div className="loader-fill" /></div>
      <span className="loader-label">Loading…</span>
    </div>
  );

  const attributed = albums.filter((a) => a.producers);
  const unattributed = albums.filter((a) => !a.producers);
  const unattribCovered = unattributed.filter((a) => a.cover);

  return (
    <main ref={bodyRef}>
      <div className="wrap producers">
        <div className="ah-row fade-up">
          <div>
            <div className="kicker">
              CREDITS VIA WIKIPEDIA · {attributed.length} OF {albums.length} ATTRIBUTED
              {guestRoster.length ? ` · ${guestRoster.length} GUESTS` : ""}
            </div>
            <h1 className="ah-title">Producer <span className="serif-i">Map</span></h1>
          </div>
          <p className="sec-note">Who built what. Every confirmed credit, mapped across the three
            architects and their overlaps.</p>
        </div>

        <div className="venn-legend fade-up">
          {MEMBERS.map((m) => {
            const tot = albums.filter((a) => (a.producers || []).includes(m.name)).length;
            return (
              <button
                key={m.name}
                className={"vleg" + (highlight === m.name ? " on" : "")}
                style={{ "--pc": m.color }}
                onClick={() => setHighlight(highlight === m.name ? null : m.name)}
                data-hot
              >
                <span className="vleg-dot" />
                <span className="vleg-name">{m.name}</span>
                <span className="vleg-n mono">{String(tot).padStart(2, "0")}</span>
              </button>
            );
          })}
          {guestRoster.length > 0 && (
            <div className="vleg-guest mono">
              <span className="vg-ring" />
              <span>GUESTS&nbsp;·&nbsp;</span>
              {guestRoster.map(([g, n], i) => (
                <span key={g} className="vg-name">
                  {g}<i>{n}</i>{i < guestRoster.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="venn-stage fade-up" ref={stageRef}>
          <svg viewBox={`0 0 ${VW} ${VH}`} className="venn-svg" preserveAspectRatio="xMidYMid meet" ref={svgRef}>
            {VCIRCLES.map((c) => {
              const m = MEMBERS.find((x) => x.name === c.name);
              return (
                <circle key={c.name} cx={c.cx} cy={c.cy} r={VR}
                  style={{
                    fill: m.color,
                    fillOpacity: highlight ? (highlight === c.name ? 0.16 : 0.03) : 0.08,
                    stroke: m.color,
                    strokeOpacity: (!highlight || highlight === c.name) ? 0.8 : 0.2,
                    strokeWidth: 1.5,
                    transition: "all .35s",
                  }} />
              );
            })}
            {VCIRCLES.map((c) => {
              const m = MEMBERS.find((x) => x.name === c.name);
              const L = VLABEL[c.name];
              return (
                <text key={c.name + "l"} x={L.x} y={L.y} textAnchor={L.anchor || "middle"}
                  style={{
                    fill: m.color,
                    fontFamily: "var(--font-mono)",
                    fontSize: 15,
                    letterSpacing: "0.14em",
                    fontWeight: 700,
                    opacity: highlight && highlight !== c.name ? 0.3 : 1,
                    transition: "opacity .35s",
                  }}>
                  {c.name}
                </text>
              );
            })}
            {Object.entries(VREGION)
              .filter(([k]) => regions[k] && regions[k].length)
              .map(([k, pos]) => {
                const fade = highlight && !k.includes(highlight);
                return (
                  <g key={k} style={{ opacity: fade ? 0.12 : 1, transition: "opacity .35s" }}>
                    <VennDots
                      albums={regions[k]}
                      x={pos.x} y={pos.y} bw={pos.bw} bh={pos.bh} cap={pos.cap}
                      onPick={(a) => navigate(`album/${a.id}`)}
                      onHover={setHover}
                      onMore={() => navigate("archive")}
                      onMoreHover={(list, dx, dy, ent) => handleMoreHover(list, dx, dy, ent, k)}
                    />
                  </g>
                );
              })}
          </svg>
          <div className={"venn-readout" + (hover ? " show" : "")}>
            {hover ? (
              <>
                <span className="vr-cat mono">
                  {CAT_SHORT[hover.category] || hover.category} · {yearOf(hover)}
                </span>
                <span className={"vr-title" + (/[　-鿿]/.test(hover.title) ? " glyph-jp" : "")}>
                  {hover.title}
                </span>
                <span className="vr-prod mono">{(hover.producers || []).join(" + ")}</span>
              </>
            ) : (
              <span className="vr-hint mono">HOVER A WORK TO INSPECT · CLICK TO OPEN</span>
            )}
          </div>
          {more && (
            <div className="venn-more-pop" style={{ left: more.left, top: more.top }}
              onMouseEnter={() => clearTimeout(hideT.current)}
              onMouseLeave={() => { hideT.current = setTimeout(() => setMore(null), 130); }}>
              <div className="vmp-head mono">{more.label} <b>· {more.albums.length}</b></div>
              <div className="vmp-grid" style={{ gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(more.albums.length))}, 42px)` }}>
                {more.albums.map((a) => (
                  <button key={a.id} className={"vmp-dot" + (hasGuest(a) ? " guest" : "")} title={a.title}
                    onClick={() => navigate(`album/${a.id}`)} data-hot>
                    {coverUrl(a)
                      ? <img src={coverUrl(a)} alt={a.title} loading="lazy" />
                      : <span className="glyph-jp">死</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="venn-unattrib fade-up">
          <div className="grp-head">
            <h3>Unattributed</h3>
            <span className="gc">{String(unattributed.length).padStart(2, "0")}</span>
          </div>
          <p className="sec-note" style={{ maxWidth: "60ch", marginBottom: 24 }}>
            The deep archive — overwhelmingly the monthly{" "}
            <b style={{ color: "var(--bone)" }}>NUWRLD MIXTAPE CLUB</b> — carries no structured
            producer credit. {unattributed.length} works sit outside the map.
          </p>
          <div className="unattrib-mosaic">
            {unattribCovered.slice(0, 22).map((a) => (
              <div key={a.id} className="um-tile" onClick={() => navigate(`album/${a.id}`)}
                title={a.title} data-hot>
                <img src={coverUrl(a)} alt={a.title} loading="lazy" />
              </div>
            ))}
            <button className="um-more" onClick={() => navigate("archive")} data-hot>
              Browse all<br />in archive →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
