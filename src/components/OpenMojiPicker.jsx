import { useMemo, useState } from "react";

const PAGE_SIZE = 48;

export default function OpenMojiPicker({ presets, loading, error, onSelect, onClose }) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return presets;
    return presets.filter(
      (preset) => preset.searchText?.includes(needle) || preset.name.toLowerCase().includes(needle),
    );
  }, [presets, query]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="openmoji-picker-title"
      onPointerDown={onClose}
    >
      <div
        className="flex h-[min(720px,90dvh)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)]"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="openmoji-picker-title" className="text-base font-semibold text-[#16181c]">
              Choose an OpenMoji
            </h2>
            <p className="mt-1 text-xs text-[#63666f]">Select a graphic to add it as a new layer.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close OpenMoji picker"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-[#63666f] hover:bg-[#eef0f3]"
          >
            ×
          </button>
        </div>
        <div className="mb-3">
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Search all OpenMoji…"
            aria-label="Search OpenMoji"
            className="w-full rounded-lg border border-[#cbcfd6] bg-[#f8f9fa] px-3 py-2 text-sm text-[#16181c] outline-none focus:border-[#0d8163] focus:ring-2 focus:ring-[#0d8163]/15"
          />
          <p className="mt-1.5 px-1 text-[10px] text-[#777b83]">
            {loading
              ? "Loading the complete catalog…"
              : error || `${matches.length.toLocaleString()} graphics available`}
          </p>
        </div>
        <div
          className="min-h-0 flex-1 touch-pan-y overflow-y-scroll overscroll-contain pr-2"
          style={{ scrollbarGutter: "stable" }}
        >
          <div className="grid content-start grid-cols-4 gap-2">
            {matches.slice(0, visibleCount).map((preset) => (
              <button
                type="button"
                key={preset.src}
                onClick={() => onSelect(preset)}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-[#dfe2e7] bg-[#f8f9fa] p-2 transition hover:border-[#0d8163] hover:bg-[#0d8163]/5"
                title={`Add ${preset.name}`}
              >
                <img src={preset.src} alt="" loading="lazy" className="h-10 w-10 object-contain" />
                <span className="max-w-full truncate text-[10px] font-medium text-[#3f4147]">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
        {visibleCount < matches.length && (
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="mt-3 rounded-lg border border-[#cbcfd6] px-3 py-2 text-xs font-semibold text-[#3f4147] hover:bg-[#eef0f3]"
          >
            Load more
          </button>
        )}
        <p className="mt-4 text-center text-[10px] text-[#777b83]">Graphics by OpenMoji · CC BY-SA 4.0</p>
      </div>
    </div>
  );
}
