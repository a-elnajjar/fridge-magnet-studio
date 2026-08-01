import { useRef } from "react";

// Drives move / resize / rotate from a single pointer-down on a layer.
// Positions are percentages of the canvas, so the maths converts pixel deltas
// into percentage deltas before touching state.
export function useLayerDrag(canvasRef, setLayers, setSelectedId) {
  const dragInfo = useRef(null);

  const handleMove = (event) => {
    const info = dragInfo.current;
    if (!info) return;
    const dxPct = ((event.clientX - info.startClientX) / info.containerW) * 100;
    const dyPct = ((event.clientY - info.startClientY) / info.containerH) * 100;

    const patch = () => {
      if (info.mode === "move") {
        return { x: info.startLayer.x + dxPct, y: info.startLayer.y + dyPct };
      }
      if (info.mode === "resize") {
        return {
          width: Math.max(6, info.startLayer.width + dxPct),
          height: Math.max(6, info.startLayer.height + dyPct),
        };
      }
      const angle =
        (Math.atan2(event.clientY - info.centerClientY, event.clientX - info.centerClientX) * 180) / Math.PI;
      return { rotation: Math.round(angle + 90) };
    };

    const changes = patch();
    setLayers((prev) => prev.map((l) => (l.id === info.id ? { ...l, ...changes } : l)));
  };

  const handleUp = () => {
    dragInfo.current = null;
    window.removeEventListener("pointermove", handleMove);
    window.removeEventListener("pointerup", handleUp);
  };

  const startInteraction = (event, layer, mode) => {
    event.stopPropagation();
    event.preventDefault();
    setSelectedId(layer.id);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragInfo.current = {
      id: layer.id,
      mode,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startLayer: { ...layer },
      containerW: rect.width,
      containerH: rect.height,
      centerClientX: rect.left + (layer.x / 100) * rect.width,
      centerClientY: rect.top + (layer.y / 100) * rect.height,
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  return startInteraction;
}
