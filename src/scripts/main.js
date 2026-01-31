// src/scripts/main.js
// Starter script for gulp-lonrav (RU/EN switch, default: RU).

const STORAGE_KEY = 'gulp-lonrav.lang';

const dict = {
  ru: {
    hero_title: 'Стартовый скелет проекта',
    hero_lead: 'Эта страница — краткая документация по ожидаемой структуре <code>src/</code>. Замените её своим HTML.',
    nav_structure: 'Структура',
    nav_commands: 'Команды',
    nav_features: 'Фичи',
    nav_readme: 'README',

    structure_title: 'Минимальная структура <code>src/</code>',
    structure_out: 'Папки вывода: <code>dist/</code> (dev) и <code>public/</code> (build/preview).',

    commands_title: 'Команды',
    cmd_dev: '<code>gulp</code> — dev (dist + server + watch)',
    cmd_build: '<code>gulp build</code> — production сборка в <code>public/</code>',
    cmd_fast: '<code>gulp build:fast</code> — ускоренная production сборка (без тяжёлых оптимизаций)',
    cmd_preview: '<code>gulp preview</code> — build в <code>public/</code> и запуск сервера',
    readme_note: 'Полная документация: откройте <code>README.md</code> в корне репозитория (в IDE) или попробуйте <a href="/README.md">/README.md</a>.',

    features_title: 'Ассеты и фичи',
    features_p1:
      'Флаги фич лежат в <code>config/features.js</code>. Большинство модулей опциональны. Для некоторых действует строгая ' +
      'политика: если фича выключена, но входные файлы существуют — в dev будет предупреждение, а в build — ошибка.',

    images_title: 'Изображения',
    images_p: 'Растровые картинки и одиночные SVG:',
    sprite_title: 'SVG sprite',
    sprite_p: 'Иконки для спрайта (один SVG = одна иконка):',
    sprite_hint: 'Если спрайт не нужен — отключите в <code>config/features.js</code>.',
    static_title: 'Static',
    static_p: 'Файлы копируются как есть в корень output:',
    fonts_title: 'Шрифты',
    fonts_p: 'Опциональная директория:',

    basepath_title: '<code>basePath</code> и <code>linksMode</code>',
    basepath_p:
      'Для деплоя в подкаталог (например, <code>/my-site/</code>) настройте <code>basePath</code> и <code>linksMode</code> в ' +
      '<code>config/site.js</code> и конфиге валидаторов. Сборка содержит stage-aware валидацию ассетов/ссылок.',

    footer_p: 'Эту страницу можно удалить, когда проект будет настроен.',
    loaded_at: 'Загружено',

    nav_docs: 'Docs',
    docs_note: 'Полная документация — на странице <code>docs.html</code>.',
    shared_title: 'Shared',
    shared_p: 'Папка для общих фрагментов/partials (используется шаблонизаторами и попадает в watch):',
    shared_hint: 'Если используете чистый HTML — можно игнорировать. Для Nunjucks/EJS/Handlebars — это удобное место для includes.',

    docs_title: 'Документация',
    docs_lead: 'Эта страница — расширенная справка по сборке. Если вы начинаете новый проект, сначала откройте <a href="/">главную</a>.',
    docs_nav_quick: 'Быстрый старт',
    docs_nav_structure: 'Структура',
    docs_nav_features: 'Фичи',
    docs_nav_validation: 'Валидация',
    docs_nav_faq: 'FAQ',
    docs_quick: "\n<h2>Быстрый старт</h2>\n<ol class=\"list\">\n  <li><b>Node:</b> нужен <code>Node &gt;= 24</code>.</li>\n  <li><b>Установка:</b> <code>pnpm i</code> (или ваш менеджер пакетов).</li>\n  <li><b>Dev:</b> <code>gulp</code> — сборка в <code>dist/</code> + server + watch.</li>\n  <li><b>Prod:</b> <code>gulp build</code> — сборка в <code>public/</code>.</li>\n  <li><b>Быстро:</b> <code>gulp build:fast</code> — как <code>build</code>, но без тяжёлых оптимизаций.</li>\n  <li><b>Preview:</b> <code>gulp preview</code> — сборка в <code>public/</code> + server.</li>\n</ol>\n<p class=\"note\">В dev линтеры запускаются один раз при старте. В <code>preview</code> линт не запускается.</p>\n",
    docs_structure: "\n<h2>Структура проекта</h2>\n<p>Минимум, чтобы сборка работала “из коробки” на дефолтных настройках:</p>\n<pre><code>src/\n  pages/\n    index.html\n  styles/\n    main.scss\n  scripts/\n    main.js\n  assets/\n    favicons/\n      favicon.svg\n</code></pre>\n<p class=\"muted\">Output: <code>dist/</code> (dev) и <code>public/</code> (build/preview).</p>\n\n<h3><code>src/shared</code></h3>\n<p><code>src/shared/</code> — место для общих фрагментов (partials/includes). Папка входит в watch. Для чистого HTML можете игнорировать. Если подключаете шаблонизатор (Nunjucks/EJS/Handlebars) — используйте как директорию с include-файлами.</p>\n\n<h3>Ассеты</h3>\n<ul class=\"list\">\n  <li><code>src/assets/images/</code> — изображения (png/jpg/webp/avif и одиночные svg).</li>\n  <li><code>src/assets/icons/</code> — исходники для SVG sprite (если включено).</li>\n  <li><code>src/assets/fonts/</code> — шрифты (опционально).</li>\n</ul>\n\n<h3><code>src/static</code></h3>\n<p>Если включён модуль <b>static</b>, файлы из <code>src/static/**</code> копируются как есть в корень output.</p>\n",
    docs_features: "\n<h2>Фичи и конфиги</h2>\n<p>Все флаги лежат в <code>config/features.js</code>. Выключение модулей — нормальный сценарий.</p>\n<ul class=\"list\">\n  <li><b>favicons</b> — генерация фавиконок из <code>src/assets/favicons/favicon.svg</code>.</li>\n  <li><b>svgSprite</b> — сборка спрайта из <code>src/assets/icons/*.svg</code>.</li>\n  <li><b>static</b> — копирование <code>src/static/**</code>.</li>\n  <li><b>audio/video</b> — обработка медиа (если включено).</li>\n</ul>\n<p class=\"note\">Политика: если фича выключена, но входные файлы присутствуют — <b>dev</b> предупреждает, <b>build/preview</b> падают.</p>\n\n<h3><code>basePath</code> и <code>linksMode</code></h3>\n<p>Настройки деплоя и построения ссылок — в <code>config/site.js</code> и конфиге валидаторов. Для деплоя в подкаталог используйте <code>basePath</code>.</p>\n",
    docs_validation: "\n<h2>Качество и валидация</h2>\n<ul class=\"list\">\n  <li><b>lint</b>: запускается один раз на старте dev и на <code>build</code>. В <code>preview</code> не запускается.</li>\n  <li><b>validateStructure</b>: dev → warn, build/preview → fail.</li>\n  <li><b>validateAssets</b>: dev → warn, build/preview → fail. Режимы: <code>linksMode</code>, <code>basePath</code>.</li>\n</ul>\n<p class=\"note\">Если видите ошибку про “Missing referenced assets”, проверьте ссылки в HTML и наличие файлов в output.</p>\n",
    docs_faq: "\n<h2>FAQ</h2>\n<h3>Можно ли удалить стартовые файлы?</h3>\n<p>Да. Как только у вас есть свой <code>src/</code>, удаляйте/заменяйте starter.</p>\n\n<h3>Почему <code>seoTask</code> пишет про <code>siteUrl</code>?</h3>\n<p>Без <code>siteUrl</code> сборка не генерирует sitemap/hreflang. Это нормально для локальной разработки.</p>\n\n<h3>Нужно ли создавать все папки из структуры?</h3>\n<p>Нет. Многие директории опциональны. Если папки нет — соответствующий таск не должен падать. Обязательные пути перечислены в разделе “Структура проекта”.</p>\n",
    docs_footer: 'Вернуться на <a href="/">стартовую страницу</a>.'
  },

  en: {
    hero_title: 'Starter project skeleton',
    hero_lead: 'This page is a short reference for the expected <code>src/</code> structure. Replace it with your HTML.',
    nav_structure: 'Structure',
    nav_commands: 'Commands',
    nav_features: 'Features',
    nav_readme: 'README',

    structure_title: 'Minimal <code>src/</code> structure',
    structure_out: 'Output folders: <code>dist/</code> (dev) and <code>public/</code> (build/preview).',

    commands_title: 'Commands',
    cmd_dev: '<code>gulp</code> — dev (dist + server + watch)',
    cmd_build: '<code>gulp build</code> — production build into <code>public/</code>',
    cmd_fast: '<code>gulp build:fast</code> — faster production build (skips heavy optimizations)',
    cmd_preview: '<code>gulp preview</code> — build into <code>public/</code> and serve it',

    features_title: 'Assets & features',
    features_p1:
      'Feature flags live in <code>config/features.js</code>. Many modules are optional. Some modules are strict: ' +
      'if a feature is disabled but input files exist — dev warns, build fails.',

    images_title: 'Images',
    images_p: 'Put raster images and standalone SVGs here:',
    sprite_title: 'SVG sprite',
    sprite_p: 'Put sprite icons here (one SVG per icon):',
    sprite_hint: 'If you don\'t need a sprite, disable it in <code>config/features.js</code>.',
    static_title: 'Static',
    static_p: 'Files copied as-is to output root:',
    fonts_title: 'Fonts',
    fonts_p: 'Optional directory:',

    basepath_title: '<code>basePath</code> & <code>linksMode</code>',
    basepath_p:
      'For subdirectory hosting (e.g., <code>/my-site/</code>), configure <code>basePath</code> and <code>linksMode</code> in ' +
      '<code>config/site.js</code> and the validator config. The build includes stage-aware validation of assets/links.',

    footer_p: 'You can safely delete this starter page once your project is set up.',
    loaded_at: 'Loaded',

    nav_docs: 'Docs',
    docs_note: 'Full documentation is available on <code>docs.html</code>.',
    shared_title: 'Shared',
    shared_p: 'Folder for shared fragments/partials (watched and used by template engines):',
    shared_hint: 'If you use plain HTML you can ignore it. For Nunjucks/EJS/Handlebars it is a convenient place for includes.',

    docs_title: 'Documentation',
    docs_lead: 'This page is an extended reference. If you are starting a new project, open the <a href="/">home page</a> first.',
    docs_nav_quick: 'Quick start',
    docs_nav_structure: 'Structure',
    docs_nav_features: 'Features',
    docs_nav_validation: 'Validation',
    docs_nav_faq: 'FAQ',
    docs_quick: "\n<h2>Quick start</h2>\n<ol class=\"list\">\n  <li><b>Node:</b> requires <code>Node &gt;= 24</code>.</li>\n  <li><b>Install:</b> <code>pnpm i</code> (or your package manager).</li>\n  <li><b>Dev:</b> <code>gulp</code> — builds to <code>dist/</code> + server + watch.</li>\n  <li><b>Prod:</b> <code>gulp build</code> — builds to <code>public/</code>.</li>\n  <li><b>Fast:</b> <code>gulp build:fast</code> — like <code>build</code>, but skips heavy optimizations.</li>\n  <li><b>Preview:</b> <code>gulp preview</code> — builds to <code>public/</code> + server.</li>\n</ol>\n<p class=\"note\">In dev, linters run once at startup. In <code>preview</code> lint is skipped.</p>\n",
    docs_structure: "\n<h2>Project structure</h2>\n<p>Minimal structure to work out of the box with default settings:</p>\n<pre><code>src/\n  pages/\n    index.html\n  styles/\n    main.scss\n  scripts/\n    main.js\n  assets/\n    favicons/\n      favicon.svg\n</code></pre>\n<p class=\"muted\">Output: <code>dist/</code> (dev) and <code>public/</code> (build/preview).</p>\n\n<h3><code>src/shared</code></h3>\n<p><code>src/shared/</code> is a place for shared fragments (partials/includes). It is included in watch. For plain HTML you can ignore it. If you use a template engine (Nunjucks/EJS/Handlebars), keep include files there.</p>\n\n<h3>Assets</h3>\n<ul class=\"list\">\n  <li><code>src/assets/images/</code> — images (png/jpg/webp/avif and single svg).</li>\n  <li><code>src/assets/icons/</code> — SVG sprite sources (if enabled).</li>\n  <li><code>src/assets/fonts/</code> — fonts (optional).</li>\n</ul>\n\n<h3><code>src/static</code></h3>\n<p>If <b>static</b> feature is enabled, files from <code>src/static/**</code> are copied to the output root.</p>\n",
    docs_features: "\n<h2>Features and config</h2>\n<p>All feature flags live in <code>config/features.js</code>. Disabling modules is a normal scenario.</p>\n<ul class=\"list\">\n  <li><b>favicons</b> — generates icons from <code>src/assets/favicons/favicon.svg</code>.</li>\n  <li><b>svgSprite</b> — builds a sprite from <code>src/assets/icons/*.svg</code>.</li>\n  <li><b>static</b> — copies <code>src/static/**</code>.</li>\n  <li><b>audio/video</b> — media processing (if enabled).</li>\n</ul>\n<p class=\"note\">Policy: if a feature is disabled but input files exist — <b>dev</b> warns, <b>build/preview</b> fail.</p>\n\n<h3><code>basePath</code> and <code>linksMode</code></h3>\n<p>Deployment and link building settings are in <code>config/site.js</code> and validator config. Use <code>basePath</code> for subdirectory deployments.</p>\n",
    docs_validation: "\n<h2>Quality gates</h2>\n<ul class=\"list\">\n  <li><b>lint</b>: runs once at dev start and on <code>build</code>. Skipped on <code>preview</code>.</li>\n  <li><b>validateStructure</b>: dev → warn, build/preview → fail.</li>\n  <li><b>validateAssets</b>: dev → warn, build/preview → fail. Modes: <code>linksMode</code>, <code>basePath</code>.</li>\n</ul>\n<p class=\"note\">If you see “Missing referenced assets”, check HTML references and the output files.</p>\n",
    docs_faq: "\n<h2>FAQ</h2>\n<h3>Can I remove the starter files?</h3>\n<p>Yes. Once you have your own <code>src/</code>, delete/replace the starter.</p>\n\n<h3>Why does <code>seoTask</code> mention <code>siteUrl</code>?</h3>\n<p>Without <code>siteUrl</code> the build skips sitemap/hreflang generation. This is normal for local dev.</p>\n\n<h3>Do I need to create every folder?</h3>\n<p>No. Many directories are optional. If a folder does not exist, the related task should not crash. Required paths are listed in “Project structure”.</p>\n",
    docs_footer: 'Back to the <a href="/">starter page</a>.'
  },
};

function getLangFromQuery() {
  const url = new URL(window.location.href);
  const v = (url.searchParams.get('lang') || '').toLowerCase();
  return v === 'en' || v === 'ru' ? v : null;
}

function getInitialLang() {
  return getLangFromQuery() || localStorage.getItem(STORAGE_KEY) || 'ru';
}

function setActiveButtons(lang) {
  document.querySelectorAll('.lang__btn').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.lang === lang);
  });
}

function applyTranslations(lang) {
  const t = dict[lang] || dict.ru;

  // textContent-only
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const val = t[key];
    if (typeof val === 'string') el.textContent = val;
  });

  // innerHTML (controlled strings)
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    if (!key) return;
    const val = t[key];
    if (typeof val === 'string') el.innerHTML = val;
  });

  document.documentElement.lang = lang === 'en' ? 'en' : 'ru';
  setActiveButtons(lang);
}

function setLang(lang) {
  const normalized = lang === 'en' ? 'en' : 'ru';
  localStorage.setItem(STORAGE_KEY, normalized);
  applyTranslations(normalized);
}

document.addEventListener('click', (e) => {
  const btn = e.target instanceof HTMLElement ? e.target.closest('.lang__btn') : null;
  if (!btn) return;
  const lang = btn.getAttribute('data-lang') || 'ru';
  setLang(lang);
});

(() => {
  const lang = getInitialLang();
  applyTranslations(lang);

  // Tooltip on badge
  const badge = document.querySelector('.hero__badge');
  if (badge) {
    const now = new Date();
    const ts = now.toISOString().slice(0, 19).replace('T', ' ');
    const label = (dict[lang]?.loaded_at || dict.ru.loaded_at) + `: ${ts}`;
    badge.title = label;
  }

  console.log(`[gulp-lonrav] starter loaded (lang=${lang})`);
})();
