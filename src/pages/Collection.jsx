import { useMemo, useState } from "react";
import { useData } from "../useData.js";
import { useListened } from "../useListened.js";
import { useTierList } from "../useTierList.js";

const BASE = import.meta.env.BASE_URL;

const TIERS = [
  { id: "S", color: "#ff4f7a" },
  { id: "A", color: "#ff9f5a" },
  { id: "B", color: "var(--gold)" },
  { id: "C", color: "#7be8a0" },
  { id: "D", color: "var(--cyan)" },
  { id: "F", color: "#8b8496" },
];

export default function Collection({ navigate }) {
  const { albums } = useData();
  const { has, toggle, ids, count } = useListened();
  const { map: tierMap, set: setTier, get: getTier } = useTierList();
  const [dragging, setDragging] = useState(null);
  const [overZone, setOverZone] = useState(null);

  const listened = useMemo(() => (albums || []).filter((a) => has(a.id)), [albums, ids]);
  const untiered = useMemo(() => listened.filter((a) => !tierMap[a.id]), [listened, tierMap]);
  const total = albums?.length ?? 0;

  const onDragStart = (id) => setDragging(id);
  const onDragEnd = () => { setDragging(null); setOverZone(null); };
  const onDrop = (zone) => {
    if (dragging) setTier(dragging, zone === "pool" ? null : zone);
    setDragging(null); setOverZone(null);
  };

  if (!albums) return (
    <div className="loader">
      <span className="loader-glyph">死</span>
      <div className="loader-bar"><div className="loader-fill" /></div>
      <span className="loader-label">Loading…</span>
    </div>
  );

  if (listened.length === 0) {
    return (
      <main>
        <div className="wrap collection">
          <div className="coll-empty">
            <span className="ce-glyph">死</span>
            <h2 className="ce-title">Your collection is empty</h2>
            <p className="ce-sub">
              Mark albums as heard from the Archive — they'll appear here for tier ranking.
            </p>
            <button className="btn btn-solid" onClick={() => navigate("archive")} data-hot>→ Go to Archive</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="wrap collection">
        <div className="ah-row" style={{ marginBottom: 44, alignItems: "center" }}>
          <div>
            <div className="kicker">Heard &amp; Ranked</div>
            <h1 className="ah-title" style={{ fontSize: "clamp(40px,7vw,96px)" }}>
              Coll<span style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontStyle: "italic" }}>e</span>ction
            </h1>
          </div>
          <div className="coll-prog">
            <div className="cp-row">
              <span className="cp-n">{count}</span>
              <span className="cp-label">/ {total} heard</span>
            </div>
            <div className="cp-bar">
              <div style={{ width: `${Math.round((count / total) * 100)}%` }} />
            </div>
            <span className="cp-label">{Math.round((count / total) * 100)}% of archive</span>
          </div>
        </div>

        {/* Tier rows */}
        <div className="tierlist">
          {TIERS.map((tier) => {
            const items = listened.filter((a) => tierMap[a.id] === tier.id);
            return (
              <div
                key={tier.id}
                className={`tier ${overZone === tier.id ? "over" : ""}`}
                style={{ "--tc": tier.color }}
                onDragOver={(e) => { e.preventDefault(); setOverZone(tier.id); }}
                onDragLeave={() => setOverZone(null)}
                onDrop={() => onDrop(tier.id)}
              >
                <div className="tier-tag">{tier.id}</div>
                <div className="tier-slot">
                  {items.length === 0 && <span className="tier-empty">Drop here</span>}
                  {items.map((a) => (
                    <TChip key={a.id} album={a}
                      onDragStart={() => onDragStart(a.id)}
                      onDragEnd={onDragEnd}
                      onRemove={() => setTier(a.id, null)}
                      onOpen={() => navigate(`album/${a.id}`)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Untiered pool */}
        {untiered.length > 0 && (
          <div
            className={`pool ${overZone === "pool" ? "over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setOverZone("pool"); }}
            onDragLeave={() => setOverZone(null)}
            onDrop={() => onDrop("pool")}
          >
            <div className="grp-head">
              <h3>Unranked</h3>
              <span className="gc">{untiered.length}</span>
            </div>
            <div className="pool-slot">
              {untiered.map((a) => (
                <TChip key={a.id} album={a}
                  onDragStart={() => onDragStart(a.id)}
                  onDragEnd={onDragEnd}
                  onOpen={() => navigate(`album/${a.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Full table */}
        <div className="coll-list">
          <div className="grp-head" style={{ marginBottom: 0 }}>
            <h3>All Heard</h3>
            <span className="gc">{listened.length}</span>
          </div>
          <div className="cl-table">
            {listened.map((a) => {
              const tier = TIERS.find((t) => t.id === tierMap[a.id]);
              return (
                <div key={a.id} className="cl-row" data-hot onClick={() => navigate(`album/${a.id}`)}>
                  <div className="cl-cover">
                    {a.cover
                      ? <img src={`${BASE}covers/${a.cover}`} alt={a.title} loading="lazy" />
                      : <span style={{ fontSize: 18, color: "var(--bone-faint)" }}>死</span>
                    }
                  </div>
                  <div className="cl-info">
                    <span className="cl-name">{a.title}</span>
                    <span className="mono">{a.year} · {a.category}</span>
                  </div>
                  {tier && (
                    <div className="cl-tier" style={{ "--tc": tier.color }}>{tier.id}</div>
                  )}
                  <button
                    className="cl-x"
                    onClick={(e) => { e.stopPropagation(); toggle(a.id); }}
                    title="Remove from collection"
                    data-hot
                  >✕</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

function TChip({ album, onDragStart, onDragEnd, onRemove, onOpen }) {
  const src = album.cover ? `${BASE}covers/${album.cover}` : null;
  return (
    <div className="tchip" draggable onDragStart={onDragStart} onDragEnd={onDragEnd} title={album.title}>
      {src ? <img src={src} alt={album.title} /> : <span className="tchip-no">死</span>}
      {onOpen && (
        <button className="tchip-open" onClick={(e) => { e.stopPropagation(); onOpen(); }} data-hot>↗</button>
      )}
      {onRemove && (
        <button className="tchip-x" onClick={(e) => { e.stopPropagation(); onRemove(); }} data-hot>✕</button>
      )}
    </div>
  );
}
