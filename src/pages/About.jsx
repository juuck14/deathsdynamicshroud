import { useMemo } from "react";
import { useData } from "../useData.js";

const MEMBERS = [
  {
    name: "James Webster",
    glyph: "電",
    role: "Producer / Composer",
    note: "Spearheaded the early .wmv mixtape series and has produced or co-produced the majority of the group's studio albums.",
    pc: "oklch(0.70 0.23 352)",
  },
  {
    name: "Tech Honors",
    glyph: "技",
    role: "Producer / Composer",
    note: "Sole producer of CLASSROOM SEXXTAPE (2016) and several other releases. Drives the group's art-pop and hypnagogic direction.",
    pc: "oklch(0.76 0.18 200)",
  },
  {
    name: "Keith Rankin",
    glyph: "爪",
    role: "Producer (Giant Claw)",
    note: "Also records as Giant Claw. Contributes primarily on collaborative productions, bringing fractured electronica sensibilities.",
    pc: "oklch(0.85 0.17 95)",
  },
];

export default function About({ navigate }) {
  const { artist, albums } = useData();

  const byYear = useMemo(() => {
    const m = {};
    (albums || []).forEach((a) => { if (a.year) m[a.year] = (m[a.year] || 0) + 1; });
    return m;
  }, [albums]);
  const years = Object.keys(byYear).sort();
  const maxCount = Math.max(1, ...Object.values(byYear));

  const tags = useMemo(() => (artist?.tags || []).sort((a, b) => b.count - a.count).slice(0, 40), [artist]);
  const links = useMemo(() => (artist?.relations || []).filter((r) => r.url), [artist]);

  const memberAlbumCounts = useMemo(() => {
    const m = {};
    (albums || []).forEach((a) => {
      (a.producers || []).forEach((p) => { m[p] = (m[p] || 0) + 1; });
    });
    return m;
  }, [albums]);

  return (
    <main>
      <div className="wrap about">
        <div className="about-hero">
          <div className="kicker">The Collective</div>
          <h1 className="about-title">death's<br />dynamic<br />shroud</h1>
          <p className="about-lead">
            Architects of vaporwave, hypnagogic pop, and digital hauntology since 2012.
          </p>
        </div>

        <div className="about-body">
          <div>
            <p>
              <em>death's dynamic shroud</em> is an American music collective from Dayton, Ohio, formed around 2012.
              Operating at the intersection of vaporwave, hypnagogic pop, and art electronics, the trio has built
              one of the most expansive discographies in contemporary internet music.
            </p>
            <p>
              Their work spans lo-fi Windows 95 aesthetics, classical sampling, bedroom pop production,
              and elaborate ambient architecture — often within a single release.
            </p>
          </div>
          <div>
            <p>
              James Webster, Tech Honors, and Keith Rankin have worked both collaboratively and independently,
              releasing under the aliases death's dynamic shroud, death's dynamic shroud.wmv, and 死's Dynamic Shroud.
            </p>
            <p>
              Keith Rankin also maintains a separate profile as <em>Giant Claw</em>, releasing experimental
              electronic music that shares aesthetic DNA with the collective's output.
            </p>
          </div>
        </div>

        {/* Members */}
        <div className="about-members">
          {MEMBERS.map((m) => (
            <div key={m.name} className="am-card" style={{ "--pc": m.pc }}>
              <div className="am-glyph">{m.glyph}</div>
              <div className="am-name">{m.name}</div>
              <div className="am-role">{m.role}</div>
              <p className="am-note">{m.note}</p>
              {memberAlbumCounts[m.name] && (
                <div className="am-tally">{memberAlbumCounts[m.name]} attributed releases</div>
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="about-stats">
          {[
            { k: "Total Releases", v: albums?.length ?? "—" },
            { k: "Studio Albums", v: (albums || []).filter((a) => a.category === "Studio Album").length },
            { k: "Active Since", v: "2012" },
            { k: "Origin", v: "Dayton, OH" },
          ].map(({ k, v }) => (
            <div key={k} className="fact">
              <span className="k">{k}</span>
              <span className="v serif">{v}</span>
            </div>
          ))}
        </div>

        {/* External links */}
        {links.length > 0 && (
          <div className="about-links">
            {links.map((r) => (
              <a key={r.url.resource} href={r.url.resource} target="_blank" rel="noreferrer">
                {r.type}
              </a>
            ))}
          </div>
        )}

        {/* Timeline */}
        {years.length > 0 && (
          <div className="about-timeline">
            <div className="tl-head">Release Timeline</div>
            <div className="tl-bars">
              {years.map((y) => (
                <div key={y} className="tl-col">
                  <span className="tl-n">{byYear[y]}</span>
                  <div className="tl-bar" style={{ height: `${Math.round((byYear[y] / maxCount) * 160)}px` }} />
                  <span className="tl-y">{y.slice(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tag cloud */}
        {tags.length > 0 && (
          <div className="about-tags">
            <div className="tl-head" style={{ marginBottom: 24 }}>Genres &amp; Tags</div>
            <div className="tagcloud">
              {tags.map((t) => (
                <span
                  key={t.name}
                  className="tagword"
                  style={{ fontSize: `${Math.max(14, Math.min(40, 14 + t.count * 2))}px` }}
                >
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
