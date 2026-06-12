import { useState, useCallback } from "react";

const KEY = "dds:tierlist";

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
  catch { return {}; }
}

export function useTierList() {
  const [map, setMap] = useState(load);

  const set = useCallback((albumId, tierId) => {
    setMap((prev) => {
      const next = { ...prev };
      if (tierId === null) delete next[albumId];
      else next[albumId] = tierId;
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const get = useCallback((albumId) => map[albumId] ?? null, [map]);

  return { map, set, get };
}
