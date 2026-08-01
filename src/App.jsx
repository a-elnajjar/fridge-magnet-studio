import { useCallback, useRef, useState } from "react";
import { MAGNET_SIZES } from "./constants.js";
import { createImageLayer, createTextLayer } from "./lib/layers.js";
import { exportMagnetPng } from "./lib/exportPng.js";
import { loadImage } from "./lib/image.js";
import { useDeleteKey } from "./hooks/useDeleteKey.js";
import { useLayerDrag } from "./hooks/useLayerDrag.js";
import { useOpenMojiCatalog } from "./hooks/useOpenMojiCatalog.js";
import AddLayerMenu from "./components/AddLayerMenu.jsx";
import Header from "./components/Header.jsx";
import LayerInspector from "./components/LayerInspector.jsx";
import MagnetCanvas from "./components/MagnetCanvas.jsx";
import OpenMojiPicker from "./components/OpenMojiPicker.jsx";

export default function TextToolPreview() {
  const [layers, setLayers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [magnetSize, setMagnetSize] = useState(MAGNET_SIZES[0]);
  const [viewMode, setViewMode] = useState("design");
  const [presetPickerOpen, setPresetPickerOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const canvasRef = useRef(null);

  const selected = layers.find((layer) => layer.id === selectedId) || null;
  const magnetAspectRatio = magnetSize.widthMm / magnetSize.heightMm;
  const openMoji = useOpenMojiCatalog(presetPickerOpen);
  const startInteraction = useLayerDrag(canvasRef, setLayers, setSelectedId);

  const deleteSelected = useCallback(() => {
    setLayers((prev) => prev.filter((layer) => layer.id !== selectedId));
    setSelectedId(null);
  }, [selectedId]);

  useDeleteKey(Boolean(selectedId) && !presetPickerOpen, deleteSelected);

  const addLayer = (layer) => {
    setLayers((prev) => [...prev, layer]);
    setSelectedId(layer.id);
  };

  const updateSelected = (changes) => {
    setLayers((prev) => prev.map((layer) => (layer.id === selectedId ? { ...layer, ...changes } : layer)));
  };

  const toggleSelectedVisibility = () => updateSelected({ visible: !selected.visible });

  const addText = () => {
    const index = layers.filter((layer) => layer.type === "text").length;
    addLayer(createTextLayer({ index, name: `Text ${layers.length + 1}`, aspectRatio: magnetAspectRatio }));
  };

  // A file the browser cannot decode is skipped rather than added as a broken layer.
  const addFiles = (files) => {
    files.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = () => {
        loadImage(reader.result)
          .then((image) => {
            addLayer(
              createImageLayer({
                index: layers.length + idx,
                name: file.name,
                src: reader.result,
                image,
                aspectRatio: magnetAspectRatio,
                maxDim: 55,
              }),
            );
          })
          .catch(() => {});
      };
      reader.readAsDataURL(file);
    });
  };

  const addOpenMoji = (preset) => {
    loadImage(preset.src)
      .then((image) => {
        addLayer(
          createImageLayer({
            index: layers.length,
            name: `OpenMoji ${preset.name}`,
            src: preset.src,
            image,
            aspectRatio: magnetAspectRatio,
            maxDim: 42,
          }),
        );
        setPresetPickerOpen(false);
      })
      .catch(() => {});
  };

  // Layer heights are percentages of the canvas, so a new magnet shape has to
  // rescale them or every layer would stretch.
  const changeMagnetSize = (sizeId) => {
    const nextSize = MAGNET_SIZES.find((size) => size.id === sizeId);
    if (!nextSize || nextSize.id === magnetSize.id) return;
    const nextAspectRatio = nextSize.widthMm / nextSize.heightMm;
    setLayers((prev) =>
      prev.map((layer) => ({ ...layer, height: layer.height * (nextAspectRatio / magnetAspectRatio) })),
    );
    setMagnetSize(nextSize);
  };

  const exportPng = async () => {
    setExporting(true);
    try {
      await exportMagnetPng(layers, magnetSize);
    } finally {
      setExporting(false);
    }
  };

  const canvasProps = {
    canvasRef,
    magnetSize,
    layers,
    selectedId,
    onLayerPointerDown: startInteraction,
  };

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#f3f4f6] font-sans md:h-[640px] md:min-h-0">
      <Header
        magnetSize={magnetSize}
        onMagnetSizeChange={changeMagnetSize}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        exporting={exporting}
        onExport={exportPng}
      />

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <AddLayerMenu
          onAddFiles={addFiles}
          onAddText={addText}
          onOpenPresets={() => setPresetPickerOpen(true)}
        />

        <main
          className="flex min-h-[360px] min-w-0 flex-1 items-center justify-center overflow-auto bg-[#e8eaed] p-5 md:min-h-0 md:p-8"
          onPointerDown={() => setSelectedId(null)}
        >
          {viewMode === "design" ? (
            <MagnetCanvas
              {...canvasProps}
              className="w-full max-w-[560px] overflow-visible rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] md:h-full md:w-auto"
            />
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
              <MagnetCanvas
                {...canvasProps}
                className="absolute left-1/2 top-1/2 w-[46%] -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-2xl bg-white"
              />
            </div>
          )}
        </main>

        <LayerInspector
          layer={selected}
          onChange={updateSelected}
          onToggleVisibility={toggleSelectedVisibility}
        />
      </div>

      {presetPickerOpen && (
        <OpenMojiPicker
          presets={openMoji.presets}
          loading={openMoji.loading}
          error={openMoji.error}
          onSelect={addOpenMoji}
          onClose={() => setPresetPickerOpen(false)}
        />
      )}
    </div>
  );
}
