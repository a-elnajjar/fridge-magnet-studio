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

## Deploy to GitHub Pages

`.github/workflows/deploy-pages.yml` builds and publishes the site on every
push to `main`, and can also be run manually from the Actions tab. The first
successful run enables Pages for the repository automatically; the site is then
served from <https://a-elnajjar.github.io/fridge-magnet-studio/>.

If your account or organization blocks workflows from enabling Pages, set it up
once under **Settings → Pages → Build and deployment → Source: GitHub Actions**
and re-run the workflow.

Because the site is served from a subdirectory, the CI build sets
`VITE_BASE_PATH=/fridge-magnet-studio/`. A plain `npm run build` still targets
the web root, so serving `dist/` locally works unchanged.

## Graphic credits

Preset emoji graphics are from [OpenMoji](https://openmoji.org/) and are
licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
