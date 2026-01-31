# Changelog

All notable changes to **gulp-lonrav** will be documented in this file.

The format is based on *Keep a Changelog* and the project follows *Semantic Versioning*.

## 1.0.0-rc.1 — 2026-01-28

### Added
- Gulp 5 modular build system for static sites (non-SPA/SSR), Node >= 24, Win/Linux.
- Core commands:
  - `gulp` (dev) → output `dist/`
  - `gulp build` (prod) → output `public/`
  - `gulp build:fast` → production output without heavy optimizations
  - `gulp preview` → serve production output
- Config-driven architecture:
  - `config/features.js` for feature flags (optional modules)
  - `config/site.js` for `basePath` and `linksMode`
  - `config/paths.js` for project paths
- Stage-aware quality gates:
  - Lint runs once on `dev` start and on `build` variants; not on `preview`.
  - `validateStructure` and `validateAssets` warn in dev and fail in build/preview.
- Optional modules with consistent behavior (enabled/disabled; warn/error when disabled but inputs exist): `static`, `favicons`, `audio/video`, `svgSprite`.
- Lazy-loading of heavy dependencies via `gulp/utils/lazy.js`.
- Smoke dev-tools (not required for typical project usage): `gulp smoke*`.

### Fixed
- Cross-platform path normalization for globs and URL/basePath handling.
- Asset validation: do not treat route-like links (e.g. `/`) as file assets in `linksMode=off`.
