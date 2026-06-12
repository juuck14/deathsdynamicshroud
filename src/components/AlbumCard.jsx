import { useListened } from "../useListened.js";

const BASE = import.meta.env.BASE_URL;

export default function AlbumCard({ album, minimal = false }) {
  const { toggle, has } = useListened();
  const listened = has(album.id);
  const cover = album.cover ? `${BASE}covers/${album.cover}` : null;

  return (
    <div className={`card ${listened ? "done" : ""}`}>
      <div className="cover">
        {cover ? (
          <img src={cover} alt={album.title} loading="lazy" />
        ) : (
          <div className="nocover">no cover</div>
        )}
        <button
          className="check"
          title={listened ? "들음 — 클릭해 해제" : "안 들음 — 클릭해 체크"}
          onClick={() => toggle(album.id)}
        >
          {listened ? "✓ 들음" : "+ 체크"}
        </button>
      </div>
      {!minimal && (
        <div className="info">
          <h3>{album.title}</h3>
          <div className="tags">
            <span className="pill cat">{album.category}</span>
            <span className="pill">{album.firstReleaseDate || "????"}</span>
            {album.primaryGenre && <span className="pill genre">{album.primaryGenre}</span>}
          </div>
          {album.producers && (
            <p className="producers">🎛 {album.producers.join(", ")}</p>
          )}
          {album.urls?.length > 0 && (
            <div className="albumlinks">
              {album.urls.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.type}</a>
              ))}
            </div>
          )}
        </div>
      )}
      {minimal && (
        <div className="info">
          <h3>{album.title}</h3>
          <span className="pill" style={{ fontSize: ".65rem" }}>{album.year}</span>
        </div>
      )}
    </div>
  );
}
