import { useEffect, useState } from "react";
import { OPENMOJI_CDN, OPENMOJI_PRESETS } from "../constants.js";

// Fetches the full OpenMoji catalog the first time the picker opens, then
// keeps it. Until it arrives (or if it fails) the bundled presets stand in.
export function useOpenMojiCatalog(enabled) {
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled || catalog) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch(`${OPENMOJI_CDN}/data/openmoji.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`OpenMoji request failed (${response.status})`);
        return response.json();
      })
      .then((items) => {
        setCatalog(
          items.map((item) => ({
            name: item.annotation || item.hexcode,
            src: `${OPENMOJI_CDN}/color/svg/${item.hexcode}.svg`,
            searchText: `${item.annotation} ${item.tags} ${item.openmoji_tags} ${item.group}`.toLowerCase(),
          })),
        );
      })
      .catch((error) => {
        if (error.name !== "AbortError") setError("Could not load the full catalog. Showing downloaded presets.");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [enabled, catalog]);

  return { presets: catalog || OPENMOJI_PRESETS, loading, error };
}
