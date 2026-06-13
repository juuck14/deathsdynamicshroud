import { useEffect, useState } from "react";

const BASE = import.meta.env.BASE_URL;
let cache = null;

export function useData() {
  const [data, setData] = useState(cache);

  useEffect(() => {
    if (cache) return;
    Promise.all([
      fetch(`${BASE}data/artist.json`).then((r) => r.json()),
      fetch(`${BASE}data/albums.json`).then((r) => r.json()),
    ]).then(([artist, rawAlbums]) => {
      const sorted = [...rawAlbums].sort((a, b) => (a.firstReleaseDate || "").localeCompare(b.firstReleaseDate || ""));
      sorted.forEach((rec, i) => { rec._cat = "DDS-" + String(i + 1).padStart(3, "0"); });
      const albums = sorted;
      cache = { artist, albums };
      setData(cache);
    });
  }, []);

  return data ?? { artist: null, albums: null };
}
