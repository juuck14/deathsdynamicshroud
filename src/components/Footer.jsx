import { useData } from "../useData.js";

const NAV = [
  { path: "",           label: "Index" },
  { path: "archive",   label: "Full Archive" },
  { path: "producers", label: "Producer Map" },
  { path: "collection",label: "Your Collection" },
  { path: "about",     label: "The Collective" },
];

export default function Footer({ navigate }) {
  const { artist } = useData();
  const links = artist
    ? (artist.relations || [])
        .filter(r => r.url && ["bandcamp","discogs","last.fm","wikidata","social network","streaming","free streaming"].includes(r.type))
        .reduce((acc, r) => { if (!acc.some(x => x.type === r.type)) acc.push(r); return acc; }, [])
    : [];

  return (
    <footer className="foot">
      <div className="wrap">
        <div className="big glyph-jp">死之動的屍衣</div>
        <div className="foot-grid" style={{ marginTop: 40 }}>
          <div>
            <h4>The Archive</h4>
            <p style={{ color: "var(--bone-dim)", fontSize: 13, maxWidth: "38ch", lineHeight: 1.7, margin: "0 0 14px" }}>
              An unofficial fan-maintained catalogue of the complete recorded works of
              death&rsquo;s dynamic shroud, 2014–present. Built for the devoted.
            </p>
            <p className="legal mono">
              METADATA · MUSICBRAINZ (CC0)<br />
              ARTWORK · COVER ART ARCHIVE — © RESPECTIVE HOLDERS<br />
              CLASSIFICATION · WIKIPEDIA · NON-COMMERCIAL FAN USE
            </p>
          </div>
          <div>
            <h4>Navigate</h4>
            {NAV.map(({ path, label }) => (
              <a key={path} href={"#/" + path} onClick={(e) => { e.preventDefault(); navigate(path); }}>
                {label}
              </a>
            ))}
          </div>
          <div>
            <h4>Off-site</h4>
            {links.length > 0 ? links.map(l => (
              <a key={l.url.resource} href={l.url.resource} target="_blank" rel="noreferrer" data-hot="open ↗">
                {l.type === "free streaming" ? "streaming" : l.type} ↗
              </a>
            )) : (
              <>
                <a href="https://deathsdynamicshroud.bandcamp.com" target="_blank" rel="noreferrer" data-hot="open ↗">bandcamp ↗</a>
                <a href="https://en.wikipedia.org/wiki/Death%27s_Dynamic_Shroud" target="_blank" rel="noreferrer" data-hot="open ↗">wikipedia ↗</a>
                <a href="https://musicbrainz.org/artist/2f5c8d4e-8e3a-4b2f-9f1e-6e7c8d9e0f1a" target="_blank" rel="noreferrer" data-hot="open ↗">musicbrainz ↗</a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
