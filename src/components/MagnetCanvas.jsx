const SELECTED_SHADOW = "drop-shadow(0 6px 10px rgba(0,0,0,0.28)) drop-shadow(0 16px 24px rgba(0,0,0,0.18))";
const IMAGE_SHADOW = "drop-shadow(0 2px 3px rgba(0,0,0,0.18)) drop-shadow(0 8px 14px rgba(0,0,0,0.12))";
const HANDLE_CLASS =
  "absolute h-5 w-5 touch-none rounded-full border-2 border-[#0d8163] bg-white md:h-3.5 md:w-3.5";

// Scales the photo to cover its frame at the current zoom, then offsets it so
// the chosen crop focus point lands in the middle of the frame.
function cropStyle(layer, magnetAspectRatio) {
  if (!layer.naturalWidth || !layer.naturalHeight) {
    return { width: "100%", height: "100%", left: 0, top: 0 };
  }
  const imageAspect = layer.naturalWidth / layer.naturalHeight;
  const frameAspect = (layer.width / layer.height) * magnetAspectRatio;
  const zoom = layer.cropZoom || 1;
  const width = (imageAspect >= frameAspect ? (imageAspect / frameAspect) * 100 : 100) * zoom;
  const height = (imageAspect >= frameAspect ? 100 : (frameAspect / imageAspect) * 100) * zoom;

  return {
    width: `${width}%`,
    height: `${height}%`,
    left: `${-(width - 100) * ((layer.cropX ?? 50) / 100)}%`,
    top: `${-(height - 100) * ((layer.cropY ?? 50) / 100)}%`,
  };
}

function Layer({ layer, isSelected, magnetAspectRatio, onPointerDown }) {
  return (
    <div
      onPointerDown={(e) => onPointerDown(e, layer, "move")}
      className="absolute cursor-move touch-none select-none"
      style={{
        left: `${layer.x - layer.width / 2}%`,
        top: `${layer.y - layer.height / 2}%`,
        width: `${layer.width}%`,
        height: `${layer.height}%`,
        transform: `rotate(${layer.rotation}deg)`,
        opacity: layer.opacity,
        filter: isSelected ? SELECTED_SHADOW : layer.type === "image" ? IMAGE_SHADOW : "none",
      }}
    >
      <div
        className="h-full w-full"
        style={{ transform: `scaleX(${layer.flipX ? -1 : 1}) scaleY(${layer.flipY ? -1 : 1})` }}
      >
        {layer.type === "image" ? (
          <div className="h-full w-full overflow-hidden">
            <img
              src={layer.src}
              alt=""
              draggable={false}
              className="absolute max-w-none object-cover"
              style={cropStyle(layer, magnetAspectRatio)}
            />
          </div>
        ) : (
          <div
            className="flex h-full w-full items-center whitespace-pre-wrap break-words"
            style={{
              fontFamily: `'${layer.fontFamily}', sans-serif`,
              fontSize: `${layer.fontSize}cqw`,
              fontWeight: layer.fontWeight,
              fontStyle: layer.italic ? "italic" : "normal",
              color: layer.color,
              textAlign: layer.align,
              justifyContent:
                layer.align === "center" ? "center" : layer.align === "right" ? "flex-end" : "flex-start",
            }}
          >
            <span className="w-full">{layer.text}</span>
          </div>
        )}
      </div>
      {isSelected && (
        <>
          <div className="pointer-events-none absolute inset-0 outline outline-2 outline-offset-2 outline-[#0d8163]" />
          <div
            onPointerDown={(e) => onPointerDown(e, layer, "resize")}
            className={`${HANDLE_CLASS} -right-2 -bottom-2 cursor-se-resize`}
          />
          <div
            onPointerDown={(e) => onPointerDown(e, layer, "rotate")}
            className={`${HANDLE_CLASS} top-0 left-1/2 -translate-x-1/2 -translate-y-7 cursor-grab md:-translate-y-6`}
          />
          <div className="pointer-events-none absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 -translate-y-6 bg-[#0d8163]" />
        </>
      )}
    </div>
  );
}

export default function MagnetCanvas({ canvasRef, className, magnetSize, layers, selectedId, onLayerPointerDown }) {
  const magnetAspectRatio = magnetSize.widthMm / magnetSize.heightMm;

  return (
    <div
      ref={canvasRef}
      className={className}
      style={{ containerType: "inline-size", aspectRatio: `${magnetSize.widthMm} / ${magnetSize.heightMm}` }}
      onPointerDown={(e) => e.stopPropagation()}
    >
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
        {layers
          .filter((layer) => layer.visible)
          .map((layer) => (
            <Layer
              key={layer.id}
              layer={layer}
              isSelected={selectedId === layer.id}
              magnetAspectRatio={magnetAspectRatio}
              onPointerDown={onLayerPointerDown}
            />
          ))}
      </div>
    </div>
  );
}
