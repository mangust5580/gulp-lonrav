# gulp-lonrav

Modern **Gulp 5** build system for static websites: landing pages, multipage sites and CMS templates (manual integration).

---

## For
- Landing pages
- Multipage websites
- Static sites
- CMS templates (manual integration)

## Not for
- SPA / SSR applications
- Framework-based projects (Vite, Next.js, Nuxt, etc.)

---

## Requirements
- **Node.js >= 20**

---

## Quick start

### Install dependencies
```bash
npm install
# or
pnpm install
# or
yarn
```

### Development
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

### Production build
```bash
npm run build
# or
pnpm build
# or
yarn build
```

### Preview build
```bash
npm run preview
# or
pnpm preview
# or
yarn preview
```

---

## Available commands

- `dev` — development server with watch mode  
- `build` — production build  
- `build:fast` — faster build (with reduced checks)  
- `preview` — preview compiled `dist` directory  
- `clean` — remove build output  
- `check` — lint + build (CI / self-check)

---

## Project structure

```text
gulp-lonrav/
├── src/        # Source files
├── dist/       # Build output (generated)
├── gulp/       # Gulp tasks implementation
├── config/     # Build configuration
├── gulpfile.js
└── package.json
```

---

## Features

- Templating support
- Styles pipeline:
  - Sass / SCSS
  - PostCSS
  - TailwindCSS
- JavaScript bundling via **esbuild**
- Assets processing:
  - images
  - SVG
  - fonts
- Live reload via **BrowserSync**
- Code quality tools:
  - ESLint
  - Stylelint
  - Prettier

---

## Optional template engines

This build includes pipelines for multiple template engines, but they are **not installed by default** to keep the template minimal.

Install only what you use:

```bash
npm i -D pug
# or
npm i -D ejs
# or
npm i -D nunjucks
# or
npm i -D handlebars
```

---

## Notes

This build is intentionally focused on **classic frontend workflows**:
- static sites
- multipage layouts
- CMS-oriented markup

It does **not** aim to replace modern framework-based toolchains.  
For complex SPA / SSR projects, a separate **Vite-based** setup is recommended.

---

## License

MIT
