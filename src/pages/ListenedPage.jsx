import { useCallback, useMemo, useState } from "react";
import { useData } from "../useData.js";
import { useListened } from "../useListened.js";

const BASE = import.meta.env.BASE_URL;

const TIERS = [
  { id: "S", label: "S", color: "#ff4d4d" },
  { id: "A", label: "A", color: "#ff9f40" },
  { id: "B", label: "B", color: "#ffe566" },
  { id: "C", label: "C", color: "#7be87b" },
  { id: "D", label: "D", color: "#38e8ff" },
  { id: "F", label: "F", color: "#a98fd6" },
];

const TIER_KEY = "dds:tierlist";

function loadTierList() {
  try {
    return JSON.parse(localStorage.getItem(TIER_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveTierList(map) {
  localStorage.setItem(TIER_KEY, JSON.stringify(map));
}

export default function ListenedPage() {
  const { albums } = useData();
  const { has, toggle, ids } = useListened();
  const [tierMap, setTierMap] = useState(loadTierList); // albumId → tierId
  const [dragging, setDragging] = useState(null); // albumId being dragged
  const [overTier, setOverTier] = useState(null);

  const listenedAlbums = useMemo(
    () => (albums || []).filter((a) => has(a.id)),
    [albums, ids]
  );

  const untiered = useMemo(
    () => listenedAlbums.filter((a) => !tierMap[a.id]),
    [listenedAlbums, tierMap]
  );

  const setTier = useCallback((albumId, tierId) => {
    setTierMap((prev) => {
      const next = { ...prev };
      if (tierId === null) delete next[albumId];
      else next[albumId] = tierId;
      saveTierList(next);
      return next;
    });
  }, []);

  const onDragStart = (albumId) => setDragging(albumId);
  const onDragEnd = () => { setDragging(null); setOverTier(null); };
  const onDrop = (tierId) => {
    if (dragging) setTier(dragging, tierId === "untiered" ? null : tierId);
    setDragging(null);
    setOverTier(null);
  };

  if (!albums) return <div className="loading">불러오는 중…</div>;

  if (listenedAlbums.length === 0) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>들은 앨범</h1>
          <p className="page-sub">아직 체크한 앨범이 없습니다. 디스코그래피에서 앨범 카드의 <strong>+ 체크</strong>를 눌러보세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>들은 앨범</h1>
        <p className="page-sub">총 <strong>{listenedAlbums.length}</strong>개 체크됨 · 티어에 드래그해서 평가하세요</p>
      </div>

      {/* Tier rows */}
      <div className="tierlist">
        {TIERS.map((tier) => {
          const tieredAlbums = listenedAlbums.filter((a) => tierMap[a.id] === tier.id);
          return (
            <div
              key={tier.id}
              className={`tier-row ${overTier === tier.id ? "tier-over" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setOverTier(tier.id); }}
              onDragLeave={() => setOverTier(null)}
              onDrop={() => onDrop(tier.id)}
            >
              <div className="tier-label" style={{ background: tier.color }}>
                {tier.label}
              </div>
              <div className="tier-albums">
                {tieredAlbums.map((a) => (
                  <TierAlbum key={a.id} album={a} onDragStart={onDragStart} onDragEnd={onDragEnd} onRemove={() => setTier(a.id, null)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Untiered pool */}
      {untiered.length > 0 && (
        <section className="untiered-pool"
          onDragOver={(e) => { e.preventDefault(); setOverTier("untiered"); }}
          onDragLeave={() => setOverTier(null)}
          onDrop={() => onDrop("untiered")}
        >
          <h2>미분류 <span className="gcount">{untiered.length}</span></h2>
          <div className="tier-albums pool-albums">
            {untiered.map((a) => (
              <TierAlbum key={a.id} album={a} onDragStart={onDragStart} onDragEnd={onDragEnd} />
            ))}
          </div>
        </section>
      )}

      {/* Full listened list */}
      <section className="listened-list">
        <h2>전체 목록</h2>
        <div className="listened-table">
          {listenedAlbums.map((a) => (
            <div key={a.id} className="listened-row">
              {a.cover
                ? <img src={`${BASE}covers/${a.cover}`} alt="" loading="lazy" />
                : <div className="nocover sm" />
              }
              <div className="lr-info">
                <strong>{a.title}</strong>
                <span>{a.firstReleaseDate} · {a.category}</span>
              </div>
              {tierMap[a.id] && (
                <span className="tier-badge" style={{ background: TIERS.find(t => t.id === tierMap[a.id])?.color }}>
                  {tierMap[a.id]}
                </span>
              )}
              <button className="uncheck-btn" onClick={() => toggle(a.id)} title="체크 해제">✕</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function TierAlbum({ album, onDragStart, onDragEnd, onRemove }) {
  const cover = album.cover ? `${BASE}covers/${album.cover}` : null;
  return (
    <div
      className="tier-album"
      draggable
      onDragStart={() => onDragStart(album.id)}
      onDragEnd={onDragEnd}
      title={album.title}
    >
      {cover
        ? <img src={cover} alt={album.title} />
        : <div className="nocover sm" />
      }
      {onRemove && (
        <button className="tier-remove" onClick={onRemove} title="티어에서 제거">✕</button>
      )}
    </div>
  );
}
