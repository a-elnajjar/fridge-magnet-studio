export const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    if (src.startsWith("http")) image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
