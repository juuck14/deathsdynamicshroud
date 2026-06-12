import { useMemo, useState } from "react";
import { useData } from "../useData.js";
import { useListened } from "../useListened.js";

const BASE = import.meta.env.BASE_URL;

const MEMBERS = ["James Webster", "Tech Honors", "Keith Rankin"];
const COLORS = {
  "James Webster": "#ff5fd2",
  "Tech Honors": "#38e8ff",
  "Keith Rankin": "#ffe566",
};

// SVG Venn — 3 overlapping circles, returns center coords for each region
const W = 700, H = 500;
const R = 160;
// circle centers
const CIRCLES = [
  { name: "James Webster", cx: W / 2,           cy: H / 2 - 110 },
  { name: "Tech Honors",   cx: W / 2 - 120,     cy: H / 2 + 65  },
  { name: "Keith Rankin",  cx: W / 2 + 120,     cy: H / 2 + 65  },
];

// Approximate label positions for each set combination
const REGION_POS = {
  "James Webster":                               { x: W / 2,       y: H / 2 - 185 },
  "Tech Honors":                                 { x: W / 2 - 195, y: H / 2 + 120 },
  "Keith Rankin":                                { x: W / 2 + 195, y: H / 2 + 120 },
  "James Webster+Tech Honors":                   { x: W / 2 - 100, y: H / 2 - 35  },
  "James Webster+Keith Rankin":                  { x: W / 2 + 100, y: H / 2 - 35  },
  "Tech Honors+Keith Rankin":                    { x: W / 2,       y: H / 2 + 140 },
  "James Webster+Keith Rankin+Tech Honors":      { x: W / 2,       y: H / 2 + 10  },
  "미상":                                        { x: 60,          y: 30          },
};

function regionKey(producers) {
  if (!producers) return "미상";
  return [...producers].sort().join("+");
}

function AlbumTooltip({ album, onClose }) {
  const cover = album.cover ? `${BASE}covers/${album.cover}` : null;
  return (
    <div className="venn-tooltip" onClick={onClose}>
      <div className="vtt-inner" onClick={(e) => e.stopPropagation()}>
        {cover && <img src={cover} alt={album.title} />}
        <div>
          <h3>{album.title}</h3>
          <p>{album.firstReleaseDate}</p>
          <p>{album.category}</p>
          {album.producers && <p>🎛 {album.producers.join(", ")}</p>}
        </div>
        <button onClick={onClose}>✕</button>
      </div>
    </div>
  );
}

function RegionDots({ albums, x, y, onSelect }) {
  const cols = Math.min(albums.length, 5);
  const size = 20;
  const gap = 4;
  return (
    <g>
      {albums.map((a, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const dx = x + (col - (cols - 1) / 2) * (size + gap);
        const dy = y + row * (size + gap);
        const cover = a.cover ? `${BASE}covers/${a.cover}` : null;
        return (
          <g key={a.id} style={{ cursor: "pointer" }} onClick={() => onSelect(a)}>
            <circle cx={dx} cy={dy} r={size / 2 + 2} fill="rgba(0,0,0,0.5)" />
            {cover ? (
              <>
                <defs>
                  <clipPath id={`cp-${a.id}`}>
                    <circle cx={dx} cy={dy} r={size / 2} />
                  </clipPath>
                </defs>
                <image
                  href={cover}
                  x={dx - size / 2} y={dy - size / 2}
                  width={size} height={size}
                  clipPath={`url(#cp-${a.id})`}
                />
              </>
            ) : (
              <circle cx={dx} cy={dy} r={size / 2} fill="#2a1844" />
            )}
          </g>
        );
      })}
    </g>
  );
}

export default function VennPage() {
  const { albums } = useData();
  const { has } = useListened();
  const [selected, setSelected] = useState(null);
  const [highlightMember, setHighlightMember] = useState(null);

  const regions = useMemo(() => {
    if (!albums) return {};
    const map = {};
    for (const a of albums) {
      const key = regionKey(a.producers);
      if (!map[key]) map[key] = [];
      map[key].push(a);
    }
    return map;
  }, [albums]);

  if (!albums) return <div className="loading">불러오는 중…</div>;

  const totalKnown = albums.filter((a) => a.producers).length;

  return (
    <div className="page venn-page">
      <div className="page-header">
        <h1>프로듀서 맵</h1>
        <p className="page-sub">각 멤버가 제작에 참여한 앨범 분포 · 커버를 클릭하면 상세정보</p>
      </div>

      <div className="venn-legend">
        {MEMBERS.map((m) => {
          const solo = (regions[m] || []).length;
          const total = albums.filter((a) => a.producers?.includes(m)).length;
          return (
            <button
              key={m}
              className={`legend-item ${highlightMember === m ? "active" : ""}`}
              style={{ "--mc": COLORS[m] }}
              onClick={() => setHighlightMember(highlightMember === m ? null : m)}
            >
              <span className="legend-dot" />
              <span>{m}</span>
              <span className="legend-count">{total}개</span>
            </button>
          );
        })}
        <span className="legend-note">Wikipedia 기준 {totalKnown}개 · 나머지 {albums.length - totalKnown}개 미상</span>
      </div>

      <div className="venn-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} className="venn-svg">
          {/* circle fills */}
          {CIRCLES.map((c) => (
            <circle
              key={c.name}
              cx={c.cx} cy={c.cy} r={R}
              fill={COLORS[c.name]}
              fillOpacity={highlightMember ? (highlightMember === c.name ? 0.22 : 0.06) : 0.14}
              stroke={COLORS[c.name]}
              strokeOpacity={highlightMember ? (highlightMember === c.name ? 0.9 : 0.25) : 0.55}
              strokeWidth={2}
            />
          ))}
          {/* circle labels */}
          {CIRCLES.map((c) => (
            <text
              key={c.name + "-label"}
              x={REGION_POS[c.name].x}
              y={REGION_POS[c.name].y}
              textAnchor="middle"
              fill={COLORS[c.name]}
              fontSize={13}
              fontWeight="bold"
              opacity={highlightMember && highlightMember !== c.name ? 0.3 : 1}
            >
              {c.name}
            </text>
          ))}
          {/* album dots per region */}
          {Object.entries(REGION_POS)
            .filter(([key]) => key !== "미상" && regions[key]?.length)
            .map(([key, pos]) => {
              const shouldFade = highlightMember && !key.includes(highlightMember);
              return (
                <g key={key} opacity={shouldFade ? 0.15 : 1}>
                  <RegionDots albums={regions[key]} x={pos.x} y={pos.y} onSelect={setSelected} />
                </g>
              );
            })}
        </svg>
      </div>

      {/* Unknown section */}
      {regions["미상"]?.length > 0 && (
        <section className="venn-unknown">
          <h2>프로듀서 미상 <span className="gcount">{regions["미상"].length}</span></h2>
          <p className="page-sub">Wikipedia 디스코그래피에 프로듀서 정보가 없는 릴리스 (주로 NUWRLD Mixtape Club)</p>
          <div className="grid mini-grid">
            {regions["미상"].map((a) => (
              <div
                key={a.id}
                className={`mini-card ${has(a.id) ? "done" : ""}`}
                onClick={() => setSelected(a)}
              >
                {a.cover
                  ? <img src={`${BASE}covers/${a.cover}`} alt={a.title} loading="lazy" />
                  : <div className="nocover">no cover</div>
                }
                <span>{a.title}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {selected && <AlbumTooltip album={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
