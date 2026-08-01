export const FONT_OPTIONS = ["Inter", "Space Grotesk", "Playfair Display", "Caveat", "Poppins"];

export const MAGNET_SIZES = [
  { id: "50x50", widthMm: 50, heightMm: 50, label: '50 × 50 mm (2″ × 2″)' },
  { id: "63.5x63.5", widthMm: 63.5, heightMm: 63.5, label: '63.5 × 63.5 mm (2.5″ × 2.5″)' },
  { id: "80x53", widthMm: 80, heightMm: 53, label: '80 × 53 mm (3″ × 2″)' },
  { id: "90x65", widthMm: 90, heightMm: 65, label: '90 × 65 mm (3.5″ × 2.5″)' },
  { id: "80x80", widthMm: 80, heightMm: 80, label: '80 × 80 mm (3″ × 3″)' },
];

export const OPENMOJI_VERSION = "17.0.0";
export const OPENMOJI_CDN = `https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@${OPENMOJI_VERSION}`;

// Bundled presets live in public/, so they resolve against the deployed base
// path (e.g. /fridge-magnet-studio/ on GitHub Pages), not always the web root.
const localPreset = (name, file) => ({
  name,
  src: `${import.meta.env.BASE_URL}presets/openmoji/${file}`,
});

export const OPENMOJI_PRESETS = [
  localPreset("Heart", "heart.svg"),
  localPreset("Star", "star.svg"),
  localPreset("Smile", "smile.svg"),
  localPreset("Sunflower", "sunflower.svg"),
  localPreset("Pizza", "pizza.svg"),
  localPreset("Rocket", "rocket.svg"),
  localPreset("Butterfly", "butterfly.svg"),
  localPreset("Cat", "cat.svg"),
  localPreset("Dog", "dog.svg"),
  localPreset("Fire", "fire.svg"),
  localPreset("Sparkles", "sparkles.svg"),
  localPreset("Sun", "sun.svg"),
  localPreset("Moon", "moon.svg"),
  localPreset("Lightning", "lightning.svg"),
  localPreset("Music", "music.svg"),
  localPreset("Camera", "camera.svg"),
  localPreset("Gift", "gift.svg"),
  localPreset("Party", "party.svg"),
  localPreset("Globe", "globe.svg"),
  localPreset("Ice cream", "ice-cream.svg"),
  localPreset("Avocado", "avocado.svg"),
  localPreset("Soccer", "soccer.svg"),
  localPreset("Car", "car.svg"),
];
