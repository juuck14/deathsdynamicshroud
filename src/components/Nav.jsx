import { useListened } from "../useListened.js";
import { useData } from "../useData.js";

const LINKS = [
  { path: "",           label: "Index" },
  { path: "archive",   label: "Archive" },
  { path: "producers", label: "Producers" },
  { path: "collection",label: "Collection" },
  { path: "about",     label: "Collective" },
];

export default function Nav({ page, navigate }) {
  const { count } = useListened();
  const { albums } = useData();
  const total = albums?.length ?? 0;
  const pct = total ? Math.round((count / total) * 100) : 0;

  return (
    <nav className="nav">
      <div className="wrap nav-in">
        <button className="brand" onClick={() => navigate("")} data-hot="home">
          <span className="mk">死<b>'s</b></span>
          <span className="bn">Dynamic Shroud<br />Fan Archive</span>
        </button>
        <div className="nav-links">
          {LINKS.map(({ path, label }) => (
            <button
              key={path}
              className={"nav-link" + (page === path ? " active" : "")}
              onClick={() => navigate(path)}
              data-hot={label}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="nav-prog mono">
          <span>COLLECTED</span>
          <b>{count}</b>
          <span>/ {total || "—"}</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>{pct}%</span>
        </div>
      </div>
    </nav>
  );
}
