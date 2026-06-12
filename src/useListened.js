import { useCallback, useEffect, useState } from "react";

const KEY = "dds:listened";

// Tracks which album ids the user has listened to, persisted to localStorage.
export function useListened() {
  const [ids, setIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify([...ids]));
  }, [ids]);

  const toggle = useCallback((id) => {
    setIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const has = useCallback((id) => ids.has(id), [ids]);

  return { ids, toggle, has, count: ids.size };
}
