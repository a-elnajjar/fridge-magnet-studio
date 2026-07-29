# Fridge Magnet Studio

A React and Vite application for creating fridge magnet designs.

## Run for development

Development requires Node.js and a package manager such as npm:

```bash
npm install
npm run dev
```

## Run without npm

The prebuilt app in `dist/` does not require npm or Node.js. Serve that
directory with any static web server; for example, using Python:

```bash
python3 -m http.server 8000 --directory dist
```

Then open <http://localhost:8000>.

Do not open `dist/index.html` directly because the generated asset URLs expect
the app to be served from a web root.

## Build

After changing the source, regenerate `dist/` with:

```bash
npm run build
```

## Graphic credits

Preset emoji graphics are from [OpenMoji](https://openmoji.org/) and are
licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
