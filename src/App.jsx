import { useRef, useState } from "react";

let nextId = 1;
const FONT_OPTIONS = ["Inter", "Space Grotesk", "Playfair Display", "Caveat", "Poppins"];
const OPENMOJI_PRESETS = [
  { name: "Heart", src: "/presets/openmoji/heart.svg" },
  { name: "Star", src: "/presets/openmoji/star.svg" },
  { name: "Smile", src: "/presets/openmoji/smile.svg" },
  { name: "Sunflower", src: "/presets/openmoji/sunflower.svg" },
  { name: "Pizza", src: "/presets/openmoji/pizza.svg" },
  { name: "Rocket", src: "/presets/openmoji/rocket.svg" },
  { name: "Butterfly", src: "/presets/openmoji/butterfly.svg" },
  { name: "Cat", src: "/presets/openmoji/cat.svg" },
  { name: "Dog", src: "/presets/openmoji/dog.svg" },
  { name: "Fire", src: "/presets/openmoji/fire.svg" },
  { name: "Sparkles", src: "/presets/openmoji/sparkles.svg" },
  { name: "Sun", src: "/presets/openmoji/sun.svg" },
  { name: "Moon", src: "/presets/openmoji/moon.svg" },
  { name: "Lightning", src: "/presets/openmoji/lightning.svg" },
  { name: "Music", src: "/presets/openmoji/music.svg" },
  { name: "Camera", src: "/presets/openmoji/camera.svg" },
  { name: "Gift", src: "/presets/openmoji/gift.svg" },
  { name: "Party", src: "/presets/openmoji/party.svg" },
  { name: "Globe", src: "/presets/openmoji/globe.svg" },
  { name: "Ice cream", src: "/presets/openmoji/ice-cream.svg" },
  { name: "Avocado", src: "/presets/openmoji/avocado.svg" },
  { name: "Soccer", src: "/presets/openmoji/soccer.svg" },
  { name: "Car", src: "/presets/openmoji/car.svg" },
];

export default function TextToolPreview() {
  const [layers, setLayers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [presetPickerOpen, setPresetPickerOpen] = useState(false);
  const [viewMode, setViewMode] = useState("design");
  const [exporting, setExporting] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const dragInfo = useRef(null);

  const selected = layers.find((l) => l.id === selectedId) || null;
  const isDesign = viewMode === "design";

  const addText = () => {
    const id = nextId++;
    const offset = (layers.filter((l) => l.type === "text").length % 5) * 2.4;
    setLayers((prev) => [
      ...prev,
      {
        id,
        type: "text",
        name: `Text ${prev.length + 1}`,
        text: "Your text here",
        fontFamily: "Inter",
        fontSize: 8,
        fontWeight: 600,
        italic: false,
        color: "#1b1d21",
        align: "center",
        width: 56,
        height: 16,
        x: 50 + offset,
        y: 50 + offset,
        rotation: 0,
        flipX: false,
        flipY: false,
        opacity: 1,
      },
    ]);
    setSelectedId(id);
    setAddMenuOpen(false);
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    files.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const ratio = img.naturalWidth / img.naturalHeight;
          const maxDim = 55;
          const width = ratio >= 1 ? maxDim : maxDim * ratio;
          const height = ratio >= 1 ? maxDim / ratio : maxDim;
          const offset = ((layers.length + idx) % 5) * 2.4;
          const id = nextId++;
          setLayers((prev) => [
            ...prev,
            {
              id,
              type: "image",
              name: file.name,
              src: reader.result,
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
              cropZoom: 1,
              cropX: 50,
              cropY: 50,
              width,
              height,
              x: 50 + offset,
              y: 50 + offset,
              rotation: 0,
              flipX: false,
              flipY: false,
              opacity: 1,
            },
          ]);
          setSelectedId(id);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const addOpenMoji = (preset) => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      const maxDim = 42;
      const width = ratio >= 1 ? maxDim : maxDim * ratio;
      const height = ratio >= 1 ? maxDim / ratio : maxDim;
      const offset = (layers.length % 5) * 2.4;
      const id = nextId++;
      setLayers((prev) => [
        ...prev,
        {
          id,
          type: "image",
          name: `OpenMoji ${preset.name}`,
          src: preset.src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          cropZoom: 1,
          cropX: 50,
          cropY: 50,
          width,
          height,
          x: 50 + offset,
          y: 50 + offset,
          rotation: 0,
          flipX: false,
          flipY: false,
          opacity: 1,
        },
      ]);
      setSelectedId(id);
      setPresetPickerOpen(false);
    };
    img.src = preset.src;
  };

  const containerRect = () => canvasRef.current?.getBoundingClientRect();

  const startInteraction = (e, layer, mode) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedId(layer.id);
    const rect = containerRect();
    if (!rect) return;
    dragInfo.current = {
      id: layer.id,
      mode,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startLayer: { ...layer },
      containerW: rect.width,
      containerH: rect.height,
      centerClientX: rect.left + (layer.x / 100) * rect.width,
      centerClientY: rect.top + (layer.y / 100) * rect.height,
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const handleMove = (e) => {
    const info = dragInfo.current;
    if (!info) return;
    const dxPct = ((e.clientX - info.startClientX) / info.containerW) * 100;
    const dyPct = ((e.clientY - info.startClientY) / info.containerH) * 100;
    if (info.mode === "move") {
      setLayers((prev) =>
        prev.map((l) => (l.id === info.id ? { ...l, x: info.startLayer.x + dxPct, y: info.startLayer.y + dyPct } : l)),
      );
    } else if (info.mode === "resize") {
      const newWidth = Math.max(6, info.startLayer.width + dxPct);
      const newHeight = Math.max(6, info.startLayer.height + dyPct);
      setLayers((prev) => prev.map((l) => (l.id === info.id ? { ...l, width: newWidth, height: newHeight } : l)));
    } else if (info.mode === "rotate") {
      const angle = (Math.atan2(e.clientY - info.centerClientY, e.clientX - info.centerClientX) * 180) / Math.PI;
      setLayers((prev) => prev.map((l) => (l.id === info.id ? { ...l, rotation: Math.round(angle + 90) } : l)));
    }
  };

  const handleUp = () => {
    dragInfo.current = null;
    window.removeEventListener("pointermove", handleMove);
    window.removeEventListener("pointerup", handleUp);
  };

  const updateSelected = (changes) => {
    if (!selectedId) return;
    setLayers((prev) => prev.map((layer) => (layer.id === selectedId ? { ...layer, ...changes } : layer)));
  };

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });

  const exportPng = async () => {
    setExporting(true);
    try {
      await document.fonts?.ready;
      const size = 1200;
      const output = document.createElement("canvas");
      output.width = size;
      output.height = size;
      const ctx = output.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      for (const layer of layers) {
        const width = (layer.width / 100) * size;
        const height = (layer.height / 100) * size;
        const centerX = (layer.x / 100) * size;
        const centerY = (layer.y / 100) * size;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((layer.rotation * Math.PI) / 180);
        ctx.scale(layer.flipX ? -1 : 1, layer.flipY ? -1 : 1);
        ctx.globalAlpha = layer.opacity;

        if (layer.type === "image") {
          const image = await loadImage(layer.src);
          const zoom = layer.cropZoom || 1;
          const coverScale = Math.max(width / image.naturalWidth, height / image.naturalHeight) * zoom;
          const imageWidth = image.naturalWidth * coverScale;
          const imageHeight = image.naturalHeight * coverScale;
          const focusX = (layer.cropX ?? 50) / 100;
          const focusY = (layer.cropY ?? 50) / 100;
          const imageX = -width / 2 - (imageWidth - width) * focusX;
          const imageY = -height / 2 - (imageHeight - height) * focusY;

          ctx.beginPath();
          ctx.rect(-width / 2, -height / 2, width, height);
          ctx.clip();
          ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight);
        } else {
          const fontSize = (layer.fontSize / 100) * size;
          ctx.font = `${layer.italic ? "italic " : ""}${layer.fontWeight} ${fontSize}px "${layer.fontFamily}"`;
          ctx.fillStyle = layer.color;
          ctx.textAlign = layer.align;
          ctx.textBaseline = "middle";
          const textX = layer.align === "left" ? -width / 2 : layer.align === "right" ? width / 2 : 0;
          const lines = layer.text.split("\n");
          const lineHeight = fontSize * 1.2;
          lines.forEach((line, index) => {
            ctx.fillText(line, textX, (index - (lines.length - 1) / 2) * lineHeight, width);
          });
        }
        ctx.restore();
      }

      const link = document.createElement("a");
      link.download = "fridge-magnet-design.png";
      link.href = output.toDataURL("image/png");
      link.click();
    } finally {
      setExporting(false);
    }
  };

  const renderCanvasLayers = () => (
    <div className="relative h-full w-full overflow-hidden rounded-[inherit]">
      {layers.length === 0 && (
        <div className="flex h-full w-full items-center justify-center">
          <p className="px-4 text-center text-sm text-[#63666f]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Add text or an image
            <br />
            to get started
          </p>
        </div>
      )}
      {layers.map((l) => {
        const left = l.x - l.width / 2;
        const top = l.y - l.height / 2;
        const flip = `scaleX(${l.flipX ? -1 : 1}) scaleY(${l.flipY ? -1 : 1})`;
        const isSelected = selectedId === l.id;
        let imageStyle;
        if (l.type === "image" && l.naturalWidth && l.naturalHeight) {
          const imageAspect = l.naturalWidth / l.naturalHeight;
          const frameAspect = l.width / l.height;
          const baseWidth = imageAspect >= frameAspect ? (imageAspect / frameAspect) * 100 : 100;
          const baseHeight = imageAspect >= frameAspect ? 100 : (frameAspect / imageAspect) * 100;
          const displayWidth = baseWidth * (l.cropZoom || 1);
          const displayHeight = baseHeight * (l.cropZoom || 1);
          imageStyle = {
            width: `${displayWidth}%`,
            height: `${displayHeight}%`,
            left: `${-(displayWidth - 100) * ((l.cropX ?? 50) / 100)}%`,
            top: `${-(displayHeight - 100) * ((l.cropY ?? 50) / 100)}%`,
          };
        }
        return (
          <div
            key={l.id}
            onPointerDown={(e) => startInteraction(e, l, "move")}
            className="absolute cursor-move touch-none select-none"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${l.width}%`,
              height: `${l.height}%`,
              transform: `rotate(${l.rotation}deg)`,
              opacity: l.opacity,
              filter: isSelected
                ? "drop-shadow(0 6px 10px rgba(0,0,0,0.28)) drop-shadow(0 16px 24px rgba(0,0,0,0.18))"
                : l.type === "image"
                  ? "drop-shadow(0 2px 3px rgba(0,0,0,0.18)) drop-shadow(0 8px 14px rgba(0,0,0,0.12))"
                  : "none",
            }}
          >
            <div className="h-full w-full" style={{ transform: flip }}>
              {l.type === "image" && (
                <div className="h-full w-full overflow-hidden">
                  <img
                    src={l.src}
                    alt=""
                    draggable={false}
                    className="absolute max-w-none object-cover"
                    style={imageStyle || { width: "100%", height: "100%", left: 0, top: 0 }}
                  />
                </div>
              )}
              {l.type === "text" && (
                <div
                  className="flex h-full w-full items-center whitespace-pre-wrap break-words"
                  style={{
                    fontFamily: `'${l.fontFamily}', sans-serif`,
                    fontSize: `${l.fontSize}cqw`,
                    fontWeight: l.fontWeight,
                    fontStyle: l.italic ? "italic" : "normal",
                    color: l.color,
                    textAlign: l.align,
                    justifyContent: l.align === "center" ? "center" : l.align === "right" ? "flex-end" : "flex-start",
                  }}
                >
                  <span className="w-full">{l.text}</span>
                </div>
              )}
            </div>
            {isSelected && (
              <>
                <div className="pointer-events-none absolute inset-0 outline outline-2 outline-offset-2 outline-[#0d8163]" />
                <div
                  onPointerDown={(e) => startInteraction(e, l, "resize")}
                  className="absolute -right-2 -bottom-2 h-5 w-5 touch-none cursor-se-resize rounded-full border-2 border-[#0d8163] bg-white md:h-3.5 md:w-3.5"
                />
                <div
                  onPointerDown={(e) => startInteraction(e, l, "rotate")}
                  className="absolute top-0 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-7 touch-none cursor-grab rounded-full border-2 border-[#0d8163] bg-white md:h-3.5 md:w-3.5 md:-translate-y-6"
                />
                <div className="pointer-events-none absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 -translate-y-6 bg-[#0d8163]" />
              </>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#f3f4f6] font-sans md:h-[640px] md:min-h-0">
      <header className="flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#dfe2e7] bg-[#ffffff] px-3 py-2 md:px-4">
        <p className="text-[15px] font-semibold text-[#16181c]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Fridge Magnet Studio
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-[#cbcfd6] bg-[#eef0f3] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("design")}
              className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
                isDesign ? "bg-[#0d8163] text-white" : "text-[#63666f] hover:text-[#16181c]"
              }`}
            >
              Design
            </button>
            <button
              type="button"
              onClick={() => setViewMode("fridge")}
              className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
                !isDesign ? "bg-[#0d8163] text-white" : "text-[#63666f] hover:text-[#16181c]"
              }`}
            >
              Fridge
            </button>
          </div>
          <button
            type="button"
            onClick={exportPng}
            disabled={exporting}
            className="rounded-lg bg-[#0d8163] px-3 py-2 text-[12px] font-semibold text-white disabled:cursor-wait disabled:opacity-60"
          >
            {exporting ? "Exporting…" : "Export PNG"}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <nav className="relative flex h-16 shrink-0 flex-row items-center justify-center gap-2 border-b border-[#dfe2e7] bg-[#ffffff] px-3 md:h-auto md:w-16 md:flex-col md:justify-start md:border-r md:border-b-0 md:px-0 md:py-4">
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
          <button
            type="button"
            onClick={() => setAddMenuOpen((open) => !open)}
            aria-expanded={addMenuOpen}
            aria-haspopup="menu"
            aria-label="Add a layer"
            className={`flex w-20 flex-col items-center gap-1 rounded-lg py-2 transition-colors md:w-12 ${
              addMenuOpen ? "bg-[#0d8163] text-white" : "bg-[#0d8163]/15 text-[#0d8163] hover:bg-[#0d8163]/25"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center text-2xl font-light leading-none">+</span>
            <span className="text-[10px] font-semibold">
              <span className="md:hidden">Add layer</span>
              <span className="hidden md:inline">Add</span>
            </span>
          </button>
          {addMenuOpen && (
            <div
              role="menu"
              aria-label="Choose layer type"
              className="absolute left-1/2 top-full z-30 mt-2 flex w-44 -translate-x-1/2 flex-col gap-1 rounded-xl border border-[#dfe2e7] bg-white p-2 shadow-[0_12px_30px_rgba(0,0,0,0.18)] md:left-full md:top-2 md:mt-0 md:ml-2 md:translate-x-0"
            >
              <p className="px-2 pb-1 pt-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#63666f]">Add layer</p>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setAddMenuOpen(false);
                  fileInputRef.current?.click();
                }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[#3f4147] hover:bg-[#eef0f3]"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-sm border border-current text-[10px]">▧</div>
                <span className="text-[12px] font-medium">Image layer</span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={addText}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[#3f4147] hover:bg-[#eef0f3]"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-sm border border-current text-xs font-semibold">T</div>
                <span className="text-[12px] font-medium">Text layer</span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setAddMenuOpen(false);
                  setPresetPickerOpen(true);
                }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[#3f4147] hover:bg-[#eef0f3]"
              >
                <div className="flex h-5 w-5 items-center justify-center text-base">🙂</div>
                <span className="text-[12px] font-medium">OpenMoji</span>
              </button>
            </div>
          )}
        </nav>

        <main
          className="flex min-h-[360px] min-w-0 flex-1 items-center justify-center overflow-auto bg-[#e8eaed] p-5 md:min-h-0 md:p-8"
          onPointerDown={() => setSelectedId(null)}
        >
          {isDesign ? (
            <div
              ref={canvasRef}
              className="aspect-square w-full max-w-[560px] overflow-visible rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] md:h-full md:w-auto"
              style={{ containerType: "inline-size" }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {renderCanvasLayers()}
            </div>
          ) : (
            <div className="relative aspect-[4/5] h-[320px] max-h-[560px] w-auto md:h-full">
              <div
                className="absolute inset-0 rounded-[28px] shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(100deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px), linear-gradient(160deg, #e7e9ec 0%, #c9cdd3 55%, #d6d9dd 100%)",
                }}
              >
                <div className="absolute right-3 top-1/2 h-40 w-3 -translate-y-1/2 rounded-full bg-[#45474e]/70 shadow-inner" />
              </div>

              <div
                ref={canvasRef}
                className="absolute left-1/2 top-1/2 aspect-square w-[46%] -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-2xl bg-white"
                style={{ containerType: "inline-size" }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {renderCanvasLayers()}
              </div>
            </div>
          )}
        </main>

        <aside className="flex max-h-[320px] w-full shrink-0 flex-col overflow-y-auto border-t border-[#dfe2e7] bg-[#ffffff] p-4 md:max-h-none md:w-[280px] md:border-t-0 md:border-l">
          {selected ? (
            <div className="flex flex-col gap-4">
              {selected.type === "image" && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-[#16181c]">Crop image</p>
                      <p className="text-[11px] text-[#63666f]">Zoom and choose the visible area</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSelected({ cropZoom: 1, cropX: 50, cropY: 50 })}
                      className="rounded-md border border-[#cbcfd6] px-2 py-1 text-[11px] text-[#3f4147]"
                    >
                      Reset
                    </button>
                  </div>
                  <label className="block">
                    <span className="mb-1.5 flex justify-between text-[11px] font-medium uppercase tracking-wide text-[#63666f]">
                      Zoom <span>{(selected.cropZoom || 1).toFixed(1)}×</span>
                    </span>
                    <input
                      type="range"
                      min={1}
                      max={4}
                      step={0.1}
                      value={selected.cropZoom || 1}
                      onChange={(e) => updateSelected({ cropZoom: Number(e.target.value) })}
                      className="w-full accent-[#0d8163]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 flex justify-between text-[11px] font-medium uppercase tracking-wide text-[#63666f]">
                      Horizontal <span>{selected.cropX ?? 50}%</span>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={selected.cropX ?? 50}
                      onChange={(e) => updateSelected({ cropX: Number(e.target.value) })}
                      className="w-full accent-[#0d8163]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 flex justify-between text-[11px] font-medium uppercase tracking-wide text-[#63666f]">
                      Vertical <span>{selected.cropY ?? 50}%</span>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={selected.cropY ?? 50}
                      onChange={(e) => updateSelected({ cropY: Number(e.target.value) })}
                      className="w-full accent-[#0d8163]"
                    />
                  </label>
                  <p className="text-[11px] leading-relaxed text-[#63666f]">
                    Resize the orange frame to set the crop shape, then use these controls to position the photo inside it.
                  </p>
                </>
              )}
              {selected.type === "text" && (
                <>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-[#63666f]">Text</label>
                    <textarea
                      value={selected.text}
                      rows={2}
                      onChange={(e) =>
                        setLayers((prev) => prev.map((l) => (l.id === selected.id ? { ...l, text: e.target.value } : l)))
                      }
                      className="w-full resize-none rounded-md border border-[#cbcfd6] bg-[#eef0f3] px-2.5 py-1.5 text-[13px] text-[#16181c] outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-[#63666f]">Font</label>
                    <select
                      value={selected.fontFamily}
                      onChange={(e) =>
                        setLayers((prev) => prev.map((l) => (l.id === selected.id ? { ...l, fontFamily: e.target.value } : l)))
                      }
                      className="w-full rounded-md border border-[#cbcfd6] bg-[#eef0f3] px-2.5 py-1.5 text-[13px] text-[#16181c] outline-none"
                    >
                      {FONT_OPTIONS.map((f) => (
                        <option key={f} value={f} style={{ fontFamily: f }}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-[11px] font-medium uppercase tracking-wide text-[#63666f]">Size</label>
                      <span className="text-[11px] text-[#63666f]">{selected.fontSize}</span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={22}
                      step={0.5}
                      value={selected.fontSize}
                      onChange={(e) =>
                        setLayers((prev) =>
                          prev.map((l) => (l.id === selected.id ? { ...l, fontSize: Number(e.target.value) } : l)),
                        )
                      }
                      className="w-full accent-[#0d8163]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setLayers((prev) =>
                          prev.map((l) => (l.id === selected.id ? { ...l, fontWeight: l.fontWeight >= 700 ? 400 : 700 } : l)),
                        )
                      }
                      className={`flex-1 rounded-md border py-1.5 text-[13px] font-bold ${
                        selected.fontWeight >= 700 ? "border-[#0d8163]/50 bg-[#0d8163]/10 text-[#0d8163]" : "border-[#cbcfd6] text-[#63666f]"
                      }`}
                    >
                      B
                    </button>
                    <button
                      onClick={() =>
                        setLayers((prev) => prev.map((l) => (l.id === selected.id ? { ...l, italic: !l.italic } : l)))
                      }
                      className={`flex-1 rounded-md border py-1.5 text-[13px] italic ${
                        selected.italic ? "border-[#0d8163]/50 bg-[#0d8163]/10 text-[#0d8163]" : "border-[#cbcfd6] text-[#63666f]"
                      }`}
                    >
                      I
                    </button>
                    <input
                      type="color"
                      value={selected.color}
                      onChange={(e) =>
                        setLayers((prev) => prev.map((l) => (l.id === selected.id ? { ...l, color: e.target.value } : l)))
                      }
                      className="h-[34px] w-12 shrink-0 cursor-pointer rounded-md border border-[#cbcfd6] bg-[#eef0f3] p-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    {["left", "center", "right"].map((align) => (
                      <button
                        key={align}
                        onClick={() =>
                          setLayers((prev) => prev.map((l) => (l.id === selected.id ? { ...l, align } : l)))
                        }
                        className={`flex-1 rounded-md border py-1.5 text-[12px] font-medium capitalize ${
                          selected.align === align ? "border-[#0d8163]/50 bg-[#0d8163]/10 text-[#0d8163]" : "border-[#cbcfd6] text-[#63666f]"
                        }`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#cbcfd6] px-4 py-10 text-center">
              <p className="text-[13px] font-medium text-[#3f4147]">Nothing selected</p>
              <p className="text-[12px] leading-relaxed text-[#63666f]">Use Add layer to insert an image, text, or OpenMoji graphic.</p>
            </div>
          )}
        </aside>
      </div>
      {presetPickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="openmoji-picker-title"
          onPointerDown={() => setPresetPickerOpen(false)}
        >
          <div
            className="flex max-h-[90dvh] w-full max-w-md flex-col rounded-2xl bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)]"
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
                onClick={() => setPresetPickerOpen(false)}
                aria-label="Close OpenMoji picker"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-[#63666f] hover:bg-[#eef0f3]"
              >
                ×
              </button>
            </div>
            <div className="grid min-h-0 grid-cols-4 gap-2 overflow-y-auto pr-1">
              {OPENMOJI_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => addOpenMoji(preset)}
                  className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-[#dfe2e7] bg-[#f8f9fa] p-2 transition hover:border-[#0d8163] hover:bg-[#0d8163]/5"
                  title={`Add ${preset.name}`}
                >
                  <img src={preset.src} alt="" className="h-10 w-10 object-contain" />
                  <span className="max-w-full truncate text-[10px] font-medium text-[#3f4147]">{preset.name}</span>
                </button>
              ))}
            </div>
            <p className="mt-4 text-center text-[10px] text-[#777b83]">
              Graphics by OpenMoji · CC BY-SA 4.0
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
