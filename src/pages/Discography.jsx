import { useMemo, useState } from "react";
import { useData } from "../useData.js";
import { useListened } from "../useListened.js";
import AlbumCard from "../components/AlbumCard.jsx";

const CATEGORY_ORDER = [
  "Studio Album",
  "NUWRLD Mixtape (.wmv)",
  "NUWRLD Mixtape Club",
  "Live Album",
  "EP",
  "Single",
];

export default function Discography() {
  const { albums } = useData();
  const { has, count } = useListened();

  const [groupBy, setGroupBy] = useState("category");
  const [sortDir, setSortDir] = useState("asc");
  const [query, setQuery] = useState("");
  const [onlyListened, setOnlyListened] = useState(false);
  const [catFilter, setCatFilter] = useState("all");

  const filtered = useMemo(() => {
    if (!albums) return [];
    let out = albums.filter((a) => {
      if (catFilter !== "all" && a.category !== catFilter) return false;
      if (onlyListened && !has(a.id)) return false;
      if (query && !a.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    return [...out].sort((a, b) => {
      const d = (a.firstReleaseDate || "").localeCompare(b.firstReleaseDate || "");
      return sortDir === "asc" ? d : -d;
    });
  }, [albums, catFilter, onlyListened, query, sortDir, has, count]);

  const groups = useMemo(() => {
    const map = new Map();
    for (const a of filtered) {
      let keys;
      if (groupBy === "category") keys = [a.category];
      else if (groupBy === "year") keys = [a.year];
      else if (groupBy === "producer") keys = a.producers || ["프로듀서 미상"];
      else keys = [a.primaryGenre || "기타"];
      for (const key of keys) {
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(a);
      }
    }
    let keys = [...map.keys()];
    if (groupBy === "category") {
      keys.sort((a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b));
    } else if (groupBy === "year") {
      keys.sort((a, b) => sortDir === "asc" ? a.localeCompare(b) : b.localeCompare(a));
    } else if (groupBy === "producer") {
      const ORDER = ["James Webster", "Tech Honors", "Keith Rankin", "프로듀서 미상"];
      keys.sort((a, b) => {
        const ia = ORDER.indexOf(a) >= 0 ? ORDER.indexOf(a) : ORDER.length - 1;
        const ib = ORDER.indexOf(b) >= 0 ? ORDER.indexOf(b) : ORDER.length - 1;
        return ia !== ib ? ia - ib : map.get(b).length - map.get(a).length;
      });
    } else {
      keys.sort((a, b) => map.get(b).length - map.get(a).length);
    }
    return keys.map((k) => [k, map.get(k)]);
  }, [filtered, groupBy, sortDir]);

  if (!albums) return <div className="loading">불러오는 중…</div>;

  const categories = ["all", ...CATEGORY_ORDER.filter((c) => albums.some((a) => a.category === c))];

  return (
    <div className="page">
      <div className="controls">
        <input
          className="search"
          placeholder="앨범 검색…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="ctl">
          <label>분류 기준</label>
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
            <option value="category">카테고리별</option>
            <option value="year">연도별</option>
            <option value="producer">프로듀서별</option>
            <option value="genre">장르별</option>
          </select>
        </div>
        <div className="ctl">
          <label>정렬</label>
          <select value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
            <option value="asc">오래된순</option>
            <option value="desc">최신순</option>
          </select>
        </div>
        <div className="ctl">
          <label>카테고리</label>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>{c === "all" ? "전체" : c}</option>
            ))}
          </select>
        </div>
        <label className="toggle">
          <input type="checkbox" checked={onlyListened} onChange={(e) => setOnlyListened(e.target.checked)} />
          들은 것만
        </label>
      </div>

      <main>
        {groups.map(([key, items]) => (
          <section key={key} className="group">
            <h2>{key} <span className="gcount">{items.length}</span></h2>
            <div className="grid">
              {items.map((a) => <AlbumCard key={a.id} album={a} />)}
            </div>
          </section>
        ))}
        {filtered.length === 0 && <p className="empty">결과 없음.</p>}
      </main>
    </div>
  );
}
