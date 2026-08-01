import { loadImage } from "./image.js";

const MAX_OUTPUT_SIZE = 1200;

// Redraws the layers onto an off-screen canvas at print resolution and hands
// the result to the browser as a download.
export async function exportMagnetPng(layers, magnetSize) {
  await document.fonts?.ready;
  const aspectRatio = magnetSize.widthMm / magnetSize.heightMm;
  const outputWidth = aspectRatio >= 1 ? MAX_OUTPUT_SIZE : Math.round(MAX_OUTPUT_SIZE * aspectRatio);
  const outputHeight = aspectRatio >= 1 ? Math.round(MAX_OUTPUT_SIZE / aspectRatio) : MAX_OUTPUT_SIZE;

  const output = document.createElement("canvas");
  output.width = outputWidth;
  output.height = outputHeight;
  const ctx = output.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, outputWidth, outputHeight);

  for (const layer of layers) {
    if (!layer.visible) continue;
    const width = (layer.width / 100) * outputWidth;
    const height = (layer.height / 100) * outputHeight;

    ctx.save();
    ctx.translate((layer.x / 100) * outputWidth, (layer.y / 100) * outputHeight);
    ctx.rotate((layer.rotation * Math.PI) / 180);
    ctx.scale(layer.flipX ? -1 : 1, layer.flipY ? -1 : 1);
    ctx.globalAlpha = layer.opacity;

    if (layer.type === "image") {
      await drawImageLayer(ctx, layer, width, height);
    } else {
      drawTextLayer(ctx, layer, width, outputWidth);
    }
    ctx.restore();
  }

  const link = document.createElement("a");
  link.download = `fridge-magnet-${magnetSize.id}.png`;
  link.href = output.toDataURL("image/png");
  link.click();
}

async function drawImageLayer(ctx, layer, width, height) {
  const image = await loadImage(layer.src);
  const coverScale =
    Math.max(width / image.naturalWidth, height / image.naturalHeight) * (layer.cropZoom || 1);
  const imageWidth = image.naturalWidth * coverScale;
  const imageHeight = image.naturalHeight * coverScale;
  const imageX = -width / 2 - (imageWidth - width) * ((layer.cropX ?? 50) / 100);
  const imageY = -height / 2 - (imageHeight - height) * ((layer.cropY ?? 50) / 100);

  ctx.beginPath();
  ctx.rect(-width / 2, -height / 2, width, height);
  ctx.clip();
  ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight);
}

function drawTextLayer(ctx, layer, width, outputWidth) {
  const fontSize = (layer.fontSize / 100) * outputWidth;
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
