import { useData } from "../useData.js";

const MEMBER_NOTES = {
  "James Webster": { role: "프로듀서 / 작곡", note: "그룹의 초기 .wmv 믹스테이프 시리즈를 주도했으며, 다수의 스튜디오 앨범을 단독 혹은 공동 제작했습니다." },
  "Tech Honors":   { role: "프로듀서 / 작곡", note: "CLASSROOM SEXXTAPE(2016) 등 여러 앨범을 단독 제작. 그룹의 아트팝 방향을 이끌었습니다." },
  "Keith Rankin":  { role: "프로듀서 (Giant Claw)", note: "Giant Claw라는 이름으로도 활동하는 멤버. 주로 공동 제작 앨범에 참여합니다." },
};

const LINK_ICONS = {
  bandcamp: "🎵",
  discogs: "💿",
  "last.fm": "📻",
  wikidata: "🌐",
  "social network": "🐦",
  streaming: "▶",
  "official homepage": "🏠",
  wikipedia: "📖",
};

export default function ArtistPage() {
  const { artist, albums } = useData();

  if (!artist) return <div className="loading">불러오는 중…</div>;

  const members = (artist.relations || []).filter((r) => r.type === "member of band");
  const links = (artist.relations || []).filter((r) => r.url);
  const genres = artist.genres || [];
  const tags = (artist.tags || []).sort((a, b) => b.count - a.count);

  const byYear = {};
  (albums || []).forEach((a) => { byYear[a.year] = (byYear[a.year] || 0) + 1; });
  const years = Object.keys(byYear).sort();
  const maxCount = Math.max(...Object.values(byYear));

  return (
    <div className="page artist-page">
      <div className="artist-hero">
        <div className="artist-title">
          <h1>death's dynamic shroud</h1>
          <p className="artist-aka">死's Dynamic Shroud · death's dynamic shroud.wmv</p>
        </div>
        <div className="artist-meta-grid">
          <div className="am-item">
            <span className="am-label">결성</span>
            <span>{artist["life-span"]?.begin ?? "불명"}</span>
          </div>
          <div className="am-item">
            <span className="am-label">활동</span>
            <span>{artist["life-span"]?.ended ? `${artist["life-span"].begin}–${artist["life-span"].end}` : `${artist["life-span"]?.begin}–현재`}</span>
          </div>
          <div className="am-item">
            <span className="am-label">출신</span>
            <span>Dayton, Ohio, US</span>
          </div>
          <div className="am-item">
            <span className="am-label">장르</span>
            <span>{genres.map((g) => g.name).join(", ")}</span>
          </div>
          <div className="am-item">
            <span className="am-label">총 릴리스</span>
            <span>{albums?.length ?? "—"}개</span>
          </div>
        </div>
      </div>

      {/* Members */}
      <section className="artist-section">
        <h2>멤버</h2>
        <div className="members-grid">
          {members.map((r) => {
            const note = MEMBER_NOTES[r.artist.name];
            return (
              <div key={r.artist.id} className="member-card">
                <h3>{r.artist.name}</h3>
                {note && <>
                  <p className="member-role">{note.role}</p>
                  <p className="member-note">{note.note}</p>
                </>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Activity timeline */}
      {years.length > 0 && (
        <section className="artist-section">
          <h2>연도별 릴리스</h2>
          <div className="timeline-bars">
            {years.map((y) => (
              <div key={y} className="tbar-item">
                <div
                  className="tbar"
                  style={{ height: `${Math.round((byYear[y] / maxCount) * 100)}px` }}
                  title={`${y}: ${byYear[y]}개`}
                />
                <span className="tbar-label">{y.slice(2)}</span>
                <span className="tbar-count">{byYear[y]}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tags / genres */}
      {tags.length > 0 && (
        <section className="artist-section">
          <h2>태그 / 장르</h2>
          <div className="tags-cloud">
            {tags.map((t) => (
              <span
                key={t.name}
                className="pill genre"
                style={{ fontSize: `${Math.max(0.75, Math.min(1.4, 0.75 + t.count * 0.15))}rem` }}
              >
                {t.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* External links */}
      <section className="artist-section">
        <h2>외부 링크</h2>
        <div className="ext-links">
          {links.map((r) => (
            <a
              key={r.url.resource}
              href={r.url.resource}
              target="_blank"
              rel="noreferrer"
              className="ext-link"
            >
              {LINK_ICONS[r.type] ?? "🔗"} {r.type}
            </a>
          ))}
        </div>
      </section>

      {/* MusicBrainz credit */}
      <p className="artist-credit">
        데이터: <a href={`https://musicbrainz.org/artist/${artist.id}`} target="_blank" rel="noreferrer">MusicBrainz</a>
      </p>
    </div>
  );
}
