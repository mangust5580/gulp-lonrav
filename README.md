# gulp-lonrav — модульная Gulp 5 сборка для статических сайтов

Сборка предназначена для **статических сайтов** (не SPA/SSR): HTML + CSS/SCSS/Tailwind + JS/TS.

## Требования

- **Node.js >= 20**
- Любой менеджер пакетов: **pnpm / npm / yarn**
- Windows PowerShell / Git Bash или Linux/macOS shell

> Рекомендуется pnpm (быстрее и более предсказуемый lockfile). Но сборка не привязана к конкретному менеджеру.

## Установка

### pnpm (рекомендуется)

```bash
corepack enable
pnpm install

# pnpm иногда блокирует postinstall у бинарных пакетов.
# Если после установки видишь ошибки вида "missing binary" — выполни:
pnpm rebuild
```

### npm

```bash
npm install
```

### yarn

```bash
yarn install
```

## Команды

Основной интерфейс — через package scripts (работает одинаково в npm/pnpm/yarn).

```bash
npm run dev
# или
pnpm dev
# или
yarn dev
```

При желании можно запускать gulp напрямую через `npx` (без глобальной установки):

```bash
npx gulp build
```

| Команда | Назначение | Выход |
|---|---|---|
| `dev` | dev-сборка + watch + BrowserSync | `dist/` |
| `build` | production сборка (со строгими проверками) | `public/` |
| `build:fast` | production сборка **без lint** (для быстрой локальной итерации) | `public/` |
| `preview` | локальный сервер поверх `public/` | `public/` |
| `clean` | очистка `dist/` и `public/` | — |
| `check` | быстрый self-check: `lint` + `build` (удобно для CI) | `public/` |

### Профилирование (опционально)

В любой команде можно включить тайминг задач:

```bash
PROFILE=1 npm run build
# или
PROFILE=1 pnpm build
# или
PROFILE=1 yarn build
```

В логах появятся строки вида `profile: images 312.4ms`.

## Выходные директории

- `dist/` — **только dev** (быстро, с sourcemaps)
- `public/` — **build/preview** (prod-вывод, без sourcemaps)

Это принципиально: dev-артефакты не смешиваются с prod.

## Минимальная структура проекта (обязательное)

Чтобы сборка запускалась без scaffold-режима, в проекте должны существовать:

- **страницы**: `src/pages/**/*.<ext>`
- **входной скрипт**: `src/scripts/main.js`
- **входной стиль**: зависит от выбранного engine (см. ниже)

Минимальный рекомендуемый скелет:

```
src/
  pages/
    index.html
  shared/
    ... (partials/sections/head — по желанию)
  scripts/
    main.js
  styles/
    main.scss
  assets/
    images/
    fonts/
```

### Важное про entry-файлы

Пути entry-файлов зафиксированы в `config/paths.js`:

- Templates: `src/pages/**/` + расширение из выбранного engine
- Scripts: `src/scripts/main.js`
- Styles:
  - `scss` → `src/styles/main.scss`
  - `css` → `src/styles/main.css`
  - `tailwind` → `src/styles/tailwind.css`

Если entry отсутствует — `validateStructure`:

- в dev обычно выдаст **warn** (по умолчанию)
- в build/preview — **ошибка**

Политика управляется в `config/features.js` → `features.quality.validateStructure`.

## Полная структура `src/` (рекомендуемая)

Ниже — структура, под которую заточены дефолтные пути и модули:

```
src/
  pages/                 # страницы (entry для templates)
  shared/                # общий контент для include/partials/components
    head/
    partials/
    sections/
    ...
  scripts/               # JS/TS
    main.js              # entry
    modules/
  styles/                # CSS/SCSS/Tailwind
    main.scss            # entry для scss (по умолчанию)
    *.scss
  assets/
    images/              # картинки (png/jpg/webp/avif/gif/ico + svg)
    icons/               # SVG-иконки (для svgSprite)
    favicons/            # исходник favicon.svg (для генерации favicon)
    fonts/               # шрифты
    audio/               # аудио (если включено)
    video/               # видео (если включено)
  static/                # «как есть» копирование в out (если включено)
  data/
    locales/             # i18n словари (если включено)
      en.json
      ru.json
```

## Настройка engines

Выбор движков делается через `config/engines.js` и/или конкретные конфиги:

- Templates: `config/templates.js` (`engine: html | pug | nunjucks | ejs | hbs`)
- Styles: `config/styles.js` (`engine: css | scss | tailwind`)
- Scripts: `config/scripts.js` (сейчас `engine: esbuild`)

Важно: при смене templates engine меняется **расширение файлов в `src/pages/`**. Например:

- `html` → `.html`
- `pug` → `.pug`
- `nunjucks` → `.njk`
- `ejs` → `.ejs`
- `hbs` → `.hbs`

`validateStructure` проверяет наличие хотя бы одной страницы соответствующего расширения.

## Опциональные модули (features) и требования к структуре

Управление — через `config/features.js`. Принцип:

- **модуль выключен** → его пайплайн не включается в registry/pipeline
- **модуль выключен, но файлы присутствуют** → stage-aware реакция
  - dev: обычно **warn**
  - build/preview: обычно **error**

### `static`

- Папка: `src/static/**`
- Назначение: копирование файлов «как есть» в out

### `favicons`

- Файл-источник: `src/assets/favicons/favicon.svg`
- Назначение: генерация набора фавиконок в out

Если `favicons.enabled = true`, но `favicon.svg` отсутствует — `validateStructure` сработает (dev warn / build fail по настройке).

### `svgSprite`

- Иконки: `src/assets/icons/**/*.svg`
- Назначение: сборка SVG-спрайта

Если `svgSprite` выключен, но в `src/assets/icons/` есть файлы — dev warn / build error (настраивается политикой в `features.svgSprite.policy`).

### `media.audio` / `media.video`

- Аудио: `src/assets/audio/**/*.{wav,mp3,ogg,opus,m4a,aac,flac}`
- Видео: `src/assets/video/**/*.{mp4,mov,m4v,webm}`

Если соответствующая фича выключена, но файлы лежат в `src/assets/` — `validateStructure` сообщит об этом (dev warn / build error по политике `features.media.policy`).

### `i18n`

Включение: `config/features.js` → `features.i18n.enabled = true`.

Требуемая структура:

- `config/i18n.js`: `locales`, `defaultLocale`
- Словари: `src/data/locales/<locale>.json` для каждой локали из `config/i18n.js`

Особенность: **i18n-ошибки всегда строгие** — сборка падает и в dev, и в build/preview.

Рендер:

- i18n выключен → страницы рендерятся в корень out
- i18n включён → рендер по локалям в `out/<locale>/...`

## Проверки качества

### Lint

- Запускается **один раз на старте** `gulp` и на `gulp build`.
- Не запускается на `gulp preview`.
- `gulp build:fast` — без lint.

Конфиг: `config/lint.js`.

### validateStructure (структура проекта)

Проверяет наличие entry-файлов и обязательных директорий/файлов для включённых модулей.

Конфиг: `config/features.js` → `features.quality.validateStructure`.

Политика по умолчанию:

- dev: warn
- build/build:fast/preview: fail

### validateAssets (ссылки/ресурсы)

Проверяет, что ссылки на ассеты (`src`, `href`, `poster`, `xlink:href` и т.п.) указывают на существующие файлы.

Дополнительно умеет проверять **внутренние роуты** (например `/about`) через `linksMode`.

Конфиг: `config/features.js` → `features.quality.validateAssets`:

- `linksMode: 'off' | 'pretty' | 'html' | 'mixed'`
  - `off` — выключено (дефолт)
  - `pretty` — `/about` → `/about/index.html`
  - `html` — `/about` → `/about.html`
  - `mixed` — допускает оба варианта
- `basePath` — базовый префикс для ссылок (полезно при деплое в подкаталог (subdirectory hosting))
- `ignore: []` — исключения (подстроки или RegExp-строки вида `/.../`)

По стадиям:

- dev — warn
- build / build:fast / preview — fail

## Scaffold режима (опционально)

По умолчанию сборка **ничего не создаёт автоматически** и ругается на недостающую структуру.

Если хочется, чтобы при первом запуске в dev недостающие минимальные файлы создавались автоматически — включи `auto` в `config/scaffold.js`:

```js
export const scaffold = {
  mode: 'auto',
  devOnly: true,
  verbose: false,
}
```

Это влияет **только на dev** (в build/CI автосоздание запрещено).

## Опциональные зависимости (если включаешь соответствующие возможности)

Сборка стремится не тащить лишние пакеты в базовую установку. Некоторые вещи требуют установки дополнительных devDependencies.

| Возможность | Когда нужно | Что поставить |
|---|---|---|
| EJS templates | `templates.engine = 'ejs'` | `pnpm i -D gulp-ejs ejs gulp-rename` |
| Handlebars templates | `templates.engine = 'hbs'` | `pnpm i -D gulp-hb handlebars gulp-rename` |
| Nunjucks templates | `templates.engine = 'nunjucks'` | `pnpm i -D gulp-nunjucks-render nunjucks` |
| Pug templates | `templates.engine = 'pug'` | `pnpm i -D gulp-pug-3 pug` |
| Tailwind (PostCSS) | `styles.engine = 'tailwind'` | `pnpm i -D tailwindcss @tailwindcss/postcss postcss-import` |
| FFmpeg as binary | если в конфиге media выбран режим с ffmpeg-static | `pnpm i -D ffmpeg-static` |

Если включить возможность без зависимости, сборка упадёт с **явным сообщением** и подсказкой команды установки.

## Как устроена сборка (коротко)

- `gulp/core/registry.js` — единый реестр модулей (что включено, зависимости, watch)
- `gulp/core/pipeline.js` — построение пайплайнов по стадиям `dev/build/build:fast/preview`
- `gulp/core/quality.js` — правила запуска lint/validation
- `gulp/tasks/*` — gulp-задачи (оркестрация)
- `gulp/pipelines/*` — чистые пайплайны обработки (templates/styles/scripts)
- `gulp/utils/lazy.js` — ленивая загрузка тяжёлых зависимостей
- `config/*` — все настройки и переключатели

## Troubleshooting

### 1) «Missing styles entry …» / «Missing scripts entry …»

Проверь, что существуют:

- `src/scripts/main.js`
- `src/styles/main.scss` (или `main.css` / `tailwind.css` в зависимости от engine)

И что engine в `config/styles.js` соответствует тому, что лежит в `src/styles/`.

### 2) Ошибка `No pages found …`

Проверь `config/templates.js` / `config/engines.js` и расширения файлов в `src/pages/`.

### 3) Выключил модуль, но сборка ругается

Это ожидаемо: если модуль выключен, но файлы для него присутствуют, `validateStructure` сообщает о потенциальной рассинхронизации пайплайна.

Решения:

- включить модуль в `config/features.js`
- либо удалить/перенести соответствующие файлы

### 4) Разные пути на Windows

Сборка нормализует пути в большинстве мест, но если пишешь свои globs/скрипты — используй POSIX-формат в glob-шаблонах (`/`), либо helper `toPosix()`.

## Деплой

Сборка выводит production артефакты в `public/`. Любой хостинг статических сайтов должен работать.

При деплое в подкаталог обычно требуется корректный `basePath` (см. `validateAssets` и `config/site.js`).

## Release checklist

Если ты разрабатываешь саму сборку (а не просто используешь её в проекте), прогони чек-лист из `docs/release.md`.

## Версионирование

- Текущая версия хранится в `package.json`.
- История изменений — в `CHANGELOG.md`.

## Exit-mode checks (CI / stability)

These tasks run and exit immediately (no server/watch):

```bash
npx gulp devCheck
npx gulp previewCheck
```