import { MAGNET_SIZES } from "../constants.js";

export default function Header({ magnetSize, onMagnetSizeChange, viewMode, onViewModeChange, exporting, onExport }) {
  return (
    <header className="flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#dfe2e7] bg-[#ffffff] px-3 py-2 md:px-4">
      <p className="text-[15px] font-semibold text-[#16181c]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Fridge Magnet Studio
      </p>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2">
          <span className="hidden text-[11px] font-medium text-[#63666f] sm:inline">Magnet size</span>
          <select
            value={magnetSize.id}
            onChange={(e) => onMagnetSizeChange(e.target.value)}
            aria-label="Magnet size"
            className="max-w-[170px] rounded-lg border border-[#cbcfd6] bg-white px-2 py-1.5 text-[11px] font-medium text-[#3f4147] outline-none focus:border-[#0d8163]"
          >
            {MAGNET_SIZES.map((size) => (
              <option key={size.id} value={size.id}>
                {size.label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-center rounded-lg border border-[#cbcfd6] bg-[#eef0f3] p-0.5">
          {[
            { id: "design", label: "Design" },
            { id: "fridge", label: "Fridge" },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => onViewModeChange(mode.id)}
              className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
                viewMode === mode.id ? "bg-[#0d8163] text-white" : "text-[#63666f] hover:text-[#16181c]"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onExport}
          disabled={exporting}
          className="rounded-lg bg-[#0d8163] px-3 py-2 text-[12px] font-semibold text-white disabled:cursor-wait disabled:opacity-60"
        >
          {exporting ? "Exporting…" : "Export PNG"}
        </button>
      </div>
    </header>
  );
}
