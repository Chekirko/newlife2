# Автоматичні перевірки (C4)

Workflow: `.github/workflows/ci.yml`, job **Quality checks**.

- Запускається для pull request у `master`, push у `master` та вручну.
- Робота йде в окремих `codex/*` гілках; після завершення завдання — commit і push. Для CI перед злиттям потрібен PR у `master`.
- Один Ubuntu job на Node.js 24, pnpm із `package.json#packageManager`. Кешується pnpm store; інсталяція — `--frozen-lockfile`. Застарілий запуск того самого PR скасовується, ліміт — 15 хвилин.
- Послідовність: install → lint → Sanity/Next typegen + TypeScript → наявні регресії → production build. Якщо ранній крок падає, збірка не витрачає час.
- У CI після генерації типів виконується `pnpm exec next build`, щоб не повторювати Sanity `prebuild`. Звичайна локальна й Vercel-команда лишається `pnpm run build` із `prebuild`.

## Локально

```sh
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run build
```

На Windows довгі команди запускати через `cmd /c`, наприклад `cmd /c "pnpm run build"`.

`typecheck` створює ігноровані Git файли `schema.json`, `sanity/lib/sanity.types.ts`, `next-env.d.ts` і Next route types; працює також після чистого checkout. ESLint перевіряє код застосунку, Studio та скриптів; generated output і приклади агентських skills виключено. Помилки й warnings блокують lint.

## Дані й доступи

CI використовує лише публічні `NEXT_PUBLIC_SANITY_PROJECT_ID=n4j5141g` та `NEXT_PUBLIC_SANITY_DATASET=production`. Build читає публічний контент Sanity; це також перевірка інтеграції, тому недоступність CMS може зупинити збірку. Секрети Sanity/Vercel, CMS write token і YouTube API key для CI не потрібні. Без YouTube key live-перевірка використовує наявний fallback без витрат квоти.

Шрифти зберігаються локально в `public/fonts/`, із CSS у `app/fonts.css`, ліцензіями й hashes джерел. Build не звертається до Google Fonts: Next 16.1.6 може падати на extensionless URL із query parameters (див. [upstream issue](https://github.com/vercel/next.js/issues/99114)). Шрифти та build command не потребують нового пакета або зміни bundler.

Локальний gallery test підхоплює `.env.local`, якщо файл існує; у CI використовує workflow env. Три регресії працюють без записів у CMS, мережевих upload або реального надсилання листів:

- `check-gallery-input.tsx` — реальний Sanity callback `onSelectFile`, multiple picker, Select зі Studio, readOnly, ліміт 10 і вимкнені uploads.
- `check-studio-reconnect.mjs` — patched browser dependency, віртуальний 45-секундний heartbeat, warning/error, reconnect і cleanup без очікування реальних 45 секунд.
- `check-contact-form.ts` — серверна валідація/honeypot, HTTP contract лімітів, відмови Resend та plain-text payload. Окремий процес `tsx --conditions=react-server` для server-only модулів; mock HTTP, без mail/Redis credentials або live Redis/Lua. Конфігурація робочої форми — `docs/contact-form.md`.

Новий тестовий фреймворк, Lighthouse CI, браузерна матриця й додаткові deploy jobs не додані. Наступні тести варто вводити для конкретної регресії або нової критичної логіки.

## Злиття й Vercel

2026-10-25 за явним погодженням користувача ввімкнено й повторно перевірено захист `master`: потрібен PR, успішний **Quality checks** саме від GitHub Actions і актуальність гілки відносно master. Правила застосовуються також до адміністратора. Прямий push, force push і видалення master заблоковані.

Обов'язкових рецензентів — **0**: окремий review через **Approve** не потрібен. Після перегляду Preview й успішного CI користувач може перевести draft PR у ready та натиснути **Merge**. Автоматичного злиття не налаштовано; агент виконує merge лише за окремим запитом користувача. Сам YAML не керує branch protection — ці налаштування зберігаються в GitHub.

Vercel Git integration самостійно створює Preview після push гілки. CI не викликає Vercel API та не додає deploy. Preview може будуватися паралельно з GitHub CI; CI перевіряє готовність до злиття.

Офіційні джерела: [setup-node і pnpm cache](https://github.com/actions/setup-node), [pnpm/action-setup](https://github.com/pnpm/action-setup), [Next typegen](https://nextjs.org/docs/app/api-reference/cli/next).
