import { useState } from "react";
import { useListened } from "../useListened.js";
import { useData } from "../useData.js";

const LINKS = [
  { path: "",           label: "Index" },
  { path: "archive",   label: "Archive" },
  { path: "producers", label: "Producers" },
  // { path: "collection",label: "Collection" },
  { path: "about",     label: "Collective" },
];

export default function Nav({ page, navigate }) {
  const { count } = useListened();
  const { albums } = useData();
  const [open, setOpen] = useState(false);
  const total = albums?.length ?? 0;
  const pct = total ? Math.round((count / total) * 100) : 0;

  function go(path) {
    navigate(path);
    setOpen(false);
  }

  return (
    <nav className="nav">
      <div className="wrap nav-in">
        <button className="brand" onClick={() => go("")} data-hot="home">
          <span className="mk">死<b>'s</b></span>
          <span className="bn">Dynamic Shroud<br />Fan Archive</span>
        </button>
        <div className="nav-links">
          {LINKS.map(({ path, label }) => (
            <button
              key={path}
              className={"nav-link" + (page === path ? " active" : "")}
              onClick={() => go(path)}
              data-hot={label}
            >
              {label}
            </button>
          ))}
        </div>
        <a
          className="nav-gh"
          href="https://github.com/juuck14/deathsdynamicshroud"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          data-hot="github"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.045.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.654 1.652.243 2.873.12 3.176.77.84 1.232 1.91 1.232 3.22 0 4.61-2.804 5.625-5.476 5.92.43.37.814 1.102.814 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.695.825.577C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
        <div className="nav-prog mono">
          <span>COLLECTED</span>
          <b>{count}</b>
          <span>/ {total || "—"}</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>{pct}%</span>
        </div>
        <button
          className={"nav-burger" + (open ? " open" : "")}
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </div>
      {open && (
        <div className="nav-mobile">
          {LINKS.map(({ path, label }) => (
            <button
              key={path}
              className={"nav-mobile-link" + (page === path ? " active" : "")}
              onClick={() => go(path)}
            >
              {label}
            </button>
          ))}
          {count > 0 && (
            <div className="nav-mobile-prog mono">
              COLLECTED <b style={{ color: "var(--cyan)" }}>{count}</b> / {total} · {pct}%
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
