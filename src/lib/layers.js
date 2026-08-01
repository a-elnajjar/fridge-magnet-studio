let nextId = 1;

// New layers are nudged down-right in a repeating 5-step staircase so a stack
// of them stays visible instead of hiding behind each other.
const baseLayer = (index) => {
  const offset = (index % 5) * 2.4;
  return {
    id: nextId++,
    x: 50 + offset,
    y: 50 + offset,
    rotation: 0,
    flipX: false,
    flipY: false,
    opacity: 1,
    visible: true,
  };
};

export const createTextLayer = ({ index, name, aspectRatio }) => ({
  ...baseLayer(index),
  type: "text",
  name,
  text: "Your text here",
  fontFamily: "Inter",
  fontSize: 8,
  fontWeight: 600,
  italic: false,
  color: "#1b1d21",
  align: "center",
  width: 56,
  height: 16 * aspectRatio,
});

export const createImageLayer = ({ index, name, src, image, aspectRatio, maxDim }) => {
  const ratio = image.naturalWidth / image.naturalHeight;
  return {
    ...baseLayer(index),
    type: "image",
    name,
    src,
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
    cropZoom: 1,
    cropX: 50,
    cropY: 50,
    width: ratio >= 1 ? maxDim : maxDim * ratio,
    height: (ratio >= 1 ? maxDim / ratio : maxDim) * aspectRatio,
  };
};
