import { useMemo } from "react";
import { useData } from "../useData.js";
import { useReveal } from "../useReveal.js";

const MEMBERS = [
  {
    name: "James Webster",
    glyph: "電",
    role: "the .wmv architect",
    note: "Drove the 2014 mixtape run that named the sound. Sole or co-producer across more of the catalogue than anyone — the group's most constant hand.",
    pc: "var(--cyan)",
  },
  {
    name: "Tech Honors",
    glyph: "技",
    role: "the pop instinct",
    note: "Behind CLASSROOM SEXXTAPE and much of the group's turn toward melody, art-pop and outright maximalism.",
    pc: "var(--magenta)",
  },
  {
    name: "Keith Rankin",
    glyph: "爪",
    role: "also records as Giant Claw",
    note: "Brings the visual identity and a separate solo practice as Giant Claw. Mostly appears on the collaborative, fully-formed studio statements.",
    pc: "var(--gold)",
  },
];

export default function About({ navigate }) {
  const { artist, albums } = useData();
  const ref = useReveal();

  const byYear = useMemo(() => {
    const m = {};
    (albums || []).forEach((a) => {
      const y = (a.firstReleaseDate || "").slice(0, 4);
      if (/^\d{4}$/.test(y)) m[y] = (m[y] || 0) + 1;
    });
    const years = Object.keys(m).sort();
    const max = Math.max(1, ...Object.values(m));
    return { years, m, max };
  }, [albums]);

  const tags = useMemo(() => (artist?.tags || [])
    .filter((t) => t.name && !/sillyname|file\/path/.test(t.name))
    .sort((a, b) => b.count - a.count), [artist]);
  const links = useMemo(() => (artist?.relations || [])
    .filter((r) => r.url && ["bandcamp","discogs","last.fm","wikidata","social network","streaming","free streaming"].includes(r.type))
    .reduce((acc, r) => { if (!acc.some((x) => x.type === r.type)) acc.push(r); return acc; }, []), [artist]);

  const memberAlbumCounts = useMemo(() => {
    const m = {};
    (albums || []).forEach((a) => {
      (a.producers || []).forEach((p) => { m[p] = (m[p] || 0) + 1; });
    });
    return m;
  }, [albums]);

  return (
    <main ref={ref}>
      <div className="wrap about">
        <div className="about-hero fade-up">
          <div className="kicker">THE COLLECTIVE — DAYTON, OHIO · <span style={{ color: "var(--magenta)" }}>EST. 2014</span></div>
          <h1 className="about-title">death&rsquo;s<br />dynamic<br /><span className="chrome-text">shroud</span></h1>
          <p className="about-lead serif">
            Three producers turning the wreckage of digital nostalgia into something monumental.
          </p>
        </div>

        <div className="about-body fade-up">
          <div>
            <p>Formed in 2014 as <em>death&rsquo;s dynamic shroud.wmv</em>, the group emerged from the
              deepest end of the vaporwave underground — chopping pop songs, anime soundtracks and
              forgotten software into dense, emotional collages.</p>
            <p>What began as a flood of <em>.wmv</em> mixtapes hardened into a singular body of work.
              Their 2015 statement <em>I&rsquo;ll Try Living Like This</em> is now widely regarded as one
              of the defining records the genre ever produced.</p>
          </div>
          <div>
            <p>Rather than disappear, they accelerated. The trio has since pushed from plunderphonics
              into glitch, ambient, hyperpop and outright maximalist electronic music — releasing a
              new transmission, most months, for over a decade.</p>
            <p>The ongoing <em>NUWRLD MIXTAPE CLUB</em> — a monthly subscription series — turned their
              catalogue into one of the largest and most restless in the medium. This archive exists
              to hold all <em>{albums?.length ?? "—"}</em> of those works in one place.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="about-stats fade-up">
          {[
            { k: "Total works",   v: String(albums?.length ?? 0).padStart(3, "0") },
            { k: "Studio albums", v: String((albums || []).filter((a) => a.category === "Studio Album").length).padStart(2, "0") },
            { k: "Mixtape club",  v: String((albums || []).filter((a) => a.category === "NUWRLD Mixtape Club").length).padStart(2, "0") },
            { k: "Architects",    v: "03" },
          ].map(({ k, v }) => (
            <div key={k} className="fact">
              <div className="k">{k}</div>
              <div className="v serif">{v}</div>
            </div>
          ))}
        </div>

        {/* Members */}
        <div className="kicker" style={{ marginBottom: 24 }}>THE ARCHITECTS</div>
        <div className="about-members fade-up">
          {MEMBERS.map((m) => (
            <div key={m.name} className="am-card" style={{ "--pc": m.pc }}>
              <div className="am-glyph glyph-jp">{m.glyph}</div>
              <div className="am-name">{m.name}</div>
              <div className="am-role" style={{ color: m.pc }}>{m.role}</div>
              <p className="am-note">{m.note}</p>
              <div className="am-tally mono">
                {memberAlbumCounts[m.name] ?? 0} credited works
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        {byYear.years.length > 0 && (
          <div className="about-timeline fade-up">
            <div className="kicker" style={{ marginBottom: 28 }}>RELEASE ACTIVITY — A DECADE OF SIGNAL</div>
            <div className="tl-bars">
              {byYear.years.map((y) => (
                <div key={y} className="tl-col" title={`${y}: ${byYear.m[y]} releases`}>
                  <span className="tl-n mono">{byYear.m[y]}</span>
                  <div className="tl-bar" style={{ height: `${Math.round((byYear.m[y] / byYear.max) * 160) + 6}px` }} />
                  <span className="tl-y mono">{y.slice(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tag cloud */}
        {tags.length > 0 && (
          <div className="about-tags fade-up">
            <div className="kicker" style={{ marginBottom: 24 }}>THE SIGNAL — GENRE &amp; TAGS</div>
            <div className="tagcloud">
              {tags.map((t) => (
                <span
                  key={t.name}
                  className="tagword"
                  style={{ fontSize: `clamp(14px, ${0.9 + t.count * 0.5}vw, ${28 + t.count * 8}px)` }}
                >
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* External links */}
        {links.length > 0 && (
          <div style={{ marginTop: 72 }}>
            <div className="kicker" style={{ marginBottom: 18 }}>FIND THEM</div>
            <div className="about-links">
              {links.map((r) => (
                <a key={r.url.resource} className="btn" href={r.url.resource} target="_blank" rel="noreferrer" data-hot="open ↗">
                  {(r.type === "free streaming" ? "streaming" : r.type)} ↗
                </a>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 64, marginBottom: 40 }}>
          <button className="btn solid" onClick={() => navigate("archive")} data-hot="enter">
            Enter the Archive <span className="arr">→</span>
          </button>
        </div>
      </div>
    </main>
  );
}
