# gulp-lonrav – Static Site Build System

Modern **Gulp 5**–based build system for creating static websites: landing pages, multipage sites and CMS templates.  
This project provides a structured, extensible starting point with a focus on performance, flexibility and developer experience (DX).

---

## For

- Landing pages and marketing sites
- Multipage corporate websites
- Static sites served from a CDN or simple hosting
- CMS templates (manual integration)

## Not for

- Single-page or server‑side rendered applications (React/Vue/Next.js/Nuxt and similar)
- Projects that would benefit from Vite or other framework‑oriented toolchains

---

## Requirements

This build targets **Node.js >= 20**.  
For best results ensure your environment matches this version or newer.  
If you use `pnpm` or `yarn` they must be configured to work with Node 20.

---

## Quick Start

### 1. Install dependencies

Use the package manager of your choice to install the required modules:

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Development

Launch a development server with automatic rebuilding and live reload:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

The dev command will:

- compile templates, styles and scripts on the fly;
- serve the contents of the `dist/` directory on http://localhost:3000;
- watch for file changes and update your browser using BrowserSync.

### 3. Production build

Create an optimized production build suitable for deployment:

```bash
npm run build
# or
pnpm build
# or
yarn build
```

The production build outputs to the `public/` directory by default.  
See [Configuration](#configuration) below for changing output paths.

### 4. Preview build

To locally preview the production build, run:

```bash
npm run preview
```

---

## Available Commands

- **`dev`** — development server with watch mode and live reload
- **`build`** — production build with all optimisations
- **`buildFast`** — faster build (skips heavy optimisations, see [Profiles](#profiles) below)
- **`preview`** — serve the compiled production output
- **`clean`** — remove build output (clears `dist/` and `public/`)
- **`check`** — run linters and attempt a full build (CI/self‑check)

---

## Project Structure

```text
gulp-lonrav/
├── src/        # Source files (HTML, templates, styles, scripts, assets)
├── dist/       # Build output in development mode (generated)
├── public/     # Build output in production mode (generated)
├── gulp/       # Gulp tasks implementation (broken into modules)
├── config/     # Build configuration (feature flags, paths, site settings)
├── gulpfile.js # Entrypoint that registers tasks
└── package.json
```

The **src** folder can be organised in whatever way suits your project; by default this template uses:

- `pages/` – top‑level pages (HTML/templated) that compile into individual output files
- `styles/` – Sass/SCSS/PostCSS/Tailwind source files
- `scripts/` – JavaScript modules that are bundled by esbuild
- `assets/` – static assets that should be copied to the output as‑is (images, fonts, etc.)
- `shared/` – partial templates, layouts, components and other shared markup

Feel free to adjust this structure as long as you update the corresponding patterns in `config/paths.js`.

---

## Features

### Templates

This build supports HTML templating out of the box and can be extended with multiple template engines.  
Place your entry templates under `src/pages/`.  
By default plain HTML files are compiled with includes and layouts support.  
To use a different engine, install the corresponding package (see below) and specify it in your configuration.

### Styles pipeline

Powered by [Sass/SCSS](https://sass-lang.com/) and [PostCSS](https://postcss.org/).  
You can also use [Tailwind CSS](https://tailwindcss.com/) by installing it and setting the styles engine to `'tailwind'` in your config.  
CSS output is autoprefixed and minified in production.

### JavaScript bundling

JavaScript/TypeScript modules are bundled using [esbuild](https://esbuild.github.io/) for blazing fast builds.  
Code splitting is supported when you use dynamic imports.

### Assets processing

Images, SVGs, fonts, audio and video files are optimised and copied to your build directory.  
Heavy dependencies such as `sharp` are loaded lazily only when needed, keeping development fast.

### BrowserSync with live reload

The development server uses [BrowserSync](https://browsersync.io/) for automatic browser refreshes when files change.  
CSS changes are injected without a full page reload; other changes trigger a reload.

### Quality tools

Linting and formatting are baked in.  
- **ESLint** for JavaScript/TypeScript code
- **Stylelint** for styles (SCSS/PostCSS/Tailwind)
- **Prettier** for consistent formatting

These tools run automatically when you start `npm run dev` and on the `check` script.  
You can adjust rules and strictness via `eslint.config.js` and `stylelint.config.js` in the project root.

### Optional template engines

Pipelines for the following template engines are included but not installed by default:

- [Pug](https://pugjs.org/)  
- [EJS](https://ejs.co/)  
- [Nunjucks](https://mozilla.github.io/nunjucks/)  
- [Handlebars](https://handlebarsjs.com/)

Install only what you need:

```bash
npm i -D pug        # to use Pug templates
# or
npm i -D ejs        # to use EJS templates
# or
npm i -D nunjucks   # to use Nunjucks templates
# or
npm i -D handlebars # to use Handlebars templates
```

Then set `templates.engine` in your `config/` (see below).

---

## Configuration

All build behaviour is controlled via JavaScript configuration files in the `config/` directory.  
They are plain modules you can edit to suit your project.

- **`config/features.js`** — enable/disable optional modules (e.g. favicons, i18n, SVG sprites).  
  Example: to enable localisation support, set `features.i18n.enabled = true` and provide translation files in `src/data/locales/`.

- **`config/site.js`** — global site settings like `basePath` (the subdirectory you deploy under), `linksMode` and sitemap generation.  
  The `siteUrl` property is used to generate correct absolute URLs in sitemap and robots.txt; set it to your production domain.

- **`config/paths.js`** — customise source and destination paths.  
  You can move or rename `src/pages/`, change where assets go, or alter the names of `dist/` and `public/`.

- **`config/images.js`** and **`config/svg.js`** — tune how images and SVGs are optimised; specify quality levels, formats (`webp`, `avif`) and exclusions.

You can also create a `config.js` file in the project root to override any of these defaults without modifying the template itself.  
Your custom config is merged with the base config at runtime, ensuring easy upgrades.

---

## Enabling i18n (multilanguage)

To add localisation support:

1. Create translation JSON files in `src/data/locales/`, for example `en.json` and `ru.json`.  
   Each file should contain a flat object of key‑value pairs.  
   Example `en.json`:

   ```json
   {
     "title": "Hello world",
     "description": "A modern build system"
   }
   ```

2. In `config/features.js`, enable the `i18n` module:

   ```js
   export const i18n = {
     enabled: true,
     defaultLocale: 'en',
     locales: ['en', 'ru'],
   };
   ```

3. In your templates, use the `$t('key')` helper to insert translated strings.  
   The build will generate separate versions of each page for every locale.

For more details, consult the docs page at `/docs/index.html` once you run `npm run dev`.

---

## Using Tailwind CSS

Tailwind is supported through PostCSS integration.  
To enable it:

1. Install the package:

   ```bash
   npm i -D tailwindcss
   ```

2. Create a Tailwind configuration file (`tailwind.config.js`) at the project root.  
   Refer to the [Tailwind documentation](https://tailwindcss.com/docs/configuration) for details.

3. Switch the styles engine to `'tailwind'` in your custom config:

   ```js
   // config.js
   export const styles = {
     engine: 'tailwind',
   };
   ```

You can mix Tailwind with Sass or plain CSS by importing the generated `tailwind.css` entry in your styles.

---

## Profiles

The build supports optional “profiles” that toggle groups of features.  
This is useful for controlling build time vs. quality on large projects.

- **Basic** — disables heavy optimisations like image conversion to AVIF, favicons generation and asset rev‑hashing.  
- **Full** (default) — runs all optimisations and validations.  

Specify a profile via environment variable or CLI parameter:

```bash
GULP_LONRAV_PROFILE=basic npm run build
# or
npm run build -- --profile basic
```

You can define your own profile in `config/profiles.js` to customise which modules are enabled in different scenarios.

---

## Documentation

A detailed interactive documentation is bundled with the project.  
Once you run `npm run dev` you can open `/docs/index.html` in your browser to explore:

- Full explanation of the folder structure and conventions
- Step‑by‑step guides for enabling features (i18n, Tailwind, favicons)
- FAQ with common issues and solutions
- Examples of template syntax and helpers

If you prefer to read documentation in Russian, see [README_RU.md](README_RU.md).

---

## License

MIT
