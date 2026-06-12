import { useState } from "react";

const BASE = import.meta.env.BASE_URL;

const CAT_SHORT = {
  "Studio Album": "LP", "NUWRLD Mixtape (.wmv)": ".WMV",
  "NUWRLD Mixtape Club": "NMC", "Live Album": "LIVE", "EP": "EP", "Single": "SGL",
};

export default function GlitchCover({ album, cover, title, eager }) {
  const [hot, setHot] = useState(false);
  const [broken, setBroken] = useState(false);

  // support both album object (new) and flat cover/title props (legacy)
  const coverFile = album ? album.cover : cover;
  const displayTitle = album ? album.title : title;
  const category = album?.category;

  const src = (!broken && coverFile) ? `${BASE}covers/${coverFile}` : null;

  return (
    <div
      className={"plate" + (hot ? " glitch" : "")}
      style={{ aspectRatio: "1" }}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
    >
      {src ? (
        <>
          <img src={src} alt={displayTitle} loading={eager ? "eager" : "lazy"} onError={() => setBroken(true)} />
          <div className="gl a" style={{ backgroundImage: `url(${src})` }} />
          <div className="gl b" style={{ backgroundImage: `url(${src})` }} />
        </>
      ) : (
        <div className="noart">
          <div className="g glyph-jp">死</div>
          <div className="l">{CAT_SHORT[category] || "REL"} · NO ARTWORK ARCHIVED</div>
        </div>
      )}
    </div>
  );
}
