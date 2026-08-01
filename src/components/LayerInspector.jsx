import { FONT_OPTIONS } from "../constants.js";

const LABEL_CLASS = "text-[11px] font-medium uppercase tracking-wide text-[#63666f]";
const FIELD_CLASS =
  "w-full rounded-md border border-[#cbcfd6] bg-[#eef0f3] px-2.5 py-1.5 text-[13px] text-[#16181c] outline-none";
const TOGGLE_CLASS = "flex-1 rounded-md border py-1.5 text-[13px]";

const toggleColors = (active) =>
  active ? "border-[#0d8163]/50 bg-[#0d8163]/10 text-[#0d8163]" : "border-[#cbcfd6] text-[#63666f]";

const ALIGN_PATHS = {
  left: "M2 2h16M2 7h11M2 12h14",
  center: "M2 2h16M4.5 7h11M3 12h14",
  right: "M2 2h16M7 7h11M4 12h14",
};

function Slider({ label, value, display, min, max, step, onChange }) {
  return (
    <label className="block">
      <span className={`mb-1.5 flex justify-between ${LABEL_CLASS}`}>
        {label} <span>{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#0d8163]"
      />
    </label>
  );
}

function ImageControls({ layer, onChange }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold text-[#16181c]">Crop image</p>
          <p className="text-[11px] text-[#63666f]">Zoom and choose the visible area</p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ cropZoom: 1, cropX: 50, cropY: 50 })}
          className="rounded-md border border-[#cbcfd6] px-2 py-1 text-[11px] text-[#3f4147]"
        >
          Reset
        </button>
      </div>
      <Slider
        label="Zoom"
        min={1}
        max={4}
        step={0.1}
        value={layer.cropZoom || 1}
        display={`${(layer.cropZoom || 1).toFixed(1)}×`}
        onChange={(cropZoom) => onChange({ cropZoom })}
      />
      <Slider
        label="Horizontal"
        min={0}
        max={100}
        value={layer.cropX ?? 50}
        display={`${layer.cropX ?? 50}%`}
        onChange={(cropX) => onChange({ cropX })}
      />
      <Slider
        label="Vertical"
        min={0}
        max={100}
        value={layer.cropY ?? 50}
        display={`${layer.cropY ?? 50}%`}
        onChange={(cropY) => onChange({ cropY })}
      />
      <p className="text-[11px] leading-relaxed text-[#63666f]">
        Resize the orange frame to set the crop shape, then use these controls to position the photo inside it.
      </p>
    </>
  );
}

function TextControls({ layer, onChange }) {
  return (
    <>
      <div>
        <label className={`mb-1.5 block ${LABEL_CLASS}`}>Text</label>
        <textarea
          value={layer.text}
          rows={2}
          onChange={(e) => onChange({ text: e.target.value })}
          className={`${FIELD_CLASS} resize-none`}
        />
      </div>
      <div>
        <label className={`mb-1.5 block ${LABEL_CLASS}`}>Font</label>
        <select
          value={layer.fontFamily}
          onChange={(e) => onChange({ fontFamily: e.target.value })}
          className={FIELD_CLASS}
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>
      <Slider
        label="Size"
        min={3}
        max={22}
        step={0.5}
        value={layer.fontSize}
        display={layer.fontSize}
        onChange={(fontSize) => onChange({ fontSize })}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange({ fontWeight: layer.fontWeight >= 700 ? 400 : 700 })}
          aria-pressed={layer.fontWeight >= 700}
          className={`${TOGGLE_CLASS} font-bold ${toggleColors(layer.fontWeight >= 700)}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => onChange({ italic: !layer.italic })}
          aria-pressed={layer.italic}
          className={`${TOGGLE_CLASS} italic ${toggleColors(layer.italic)}`}
        >
          I
        </button>
        <input
          type="color"
          value={layer.color}
          onChange={(e) => onChange({ color: e.target.value })}
          className="h-[34px] w-12 shrink-0 cursor-pointer rounded-md border border-[#cbcfd6] bg-[#eef0f3] p-1"
        />
      </div>
      <div className="flex gap-2">
        {Object.entries(ALIGN_PATHS).map(([align, path]) => (
          <button
            key={align}
            type="button"
            onClick={() => onChange({ align })}
            aria-label={`Align text ${align}`}
            title={`Align ${align}`}
            className={`flex items-center justify-center py-1.5 ${TOGGLE_CLASS} ${toggleColors(layer.align === align)}`}
          >
            <svg viewBox="0 0 20 16" aria-hidden="true" className="h-4 w-5 fill-none stroke-current stroke-[1.8]">
              <path strokeLinecap="round" d={path} />
            </svg>
          </button>
        ))}
      </div>
    </>
  );
}

export default function LayerInspector({ layer, onChange, onToggleVisibility }) {
  return (
    <aside className="flex max-h-[320px] w-full shrink-0 flex-col overflow-y-auto border-t border-[#dfe2e7] bg-[#ffffff] p-4 md:max-h-none md:w-[280px] md:border-t-0 md:border-l">
      {layer ? (
        <div className="flex flex-col gap-4">
          {layer.type === "image" && <ImageControls layer={layer} onChange={onChange} />}
          {layer.type === "text" && <TextControls layer={layer} onChange={onChange} />}
          <button
            type="button"
            onClick={onToggleVisibility}
            className="mt-1 rounded-lg border border-[#cbcfd6] bg-[#eef0f3] px-3 py-2 text-[12px] font-semibold text-[#3f4147] transition-colors hover:bg-[#e3e6ea]"
          >
            {layer.visible ? "Hide layer" : "Show layer"}
          </button>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#cbcfd6] px-4 py-10 text-center">
          <p className="text-[13px] font-medium text-[#3f4147]">Nothing selected</p>
          <p className="text-[12px] leading-relaxed text-[#63666f]">
            Use Add layer to insert an image, text, or OpenMoji graphic.
          </p>
        </div>
      )}
    </aside>
  );
}
