# Церква «Нове Життя» — Борислав

Україномовний сайт на Next.js 16 (App Router), React 19, Sanity 4 і Tailwind v4. Новини, події, служіння, команда й медіа редагуються у вбудованому Studio: `/studio`. Проєкт до запуску; індексація закрита.

Потрібні Node.js 24 і **pnpm** версії з `package.json#packageManager`. Єдиний lockfile — `pnpm-lock.yaml`.

```sh
pnpm install --frozen-lockfile
```

Скопіюйте [`.env.example`](.env.example) у `.env.local`. Публічні Sanity project/dataset уже наведено; secrets потрібні лише для відповідних інтеграцій. Не додавайте реальні ключі в Git. `NEXT_PUBLIC_SITE_URL` задавайте повним origin тільки за потреби; порожню активну змінну не додавайте.

```sh
pnpm run dev
```

Сайт: [localhost:3000](http://localhost:3000), Studio: [localhost:3000/studio](http://localhost:3000/studio). Studio вимагає Sanity login. Build читає публічний CMS dataset, тому потребує доступу до Sanity; write token для нього не потрібен.

```sh
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run build
```

На Windows довгі команди запускайте через `cmd /c`, наприклад `cmd /c "pnpm run build"`. Typecheck/build генерують ігноровані schema/TypeScript файли. Після зміни схем або GROQ — `pnpm run typegen`; generated файли вручну не редагуються. `seed:*` — допоміжні скрипти до запуску, не частина звичайного старту; запис у CMS потребує окремого доручення.

Робочий контекст: [AGENTS.md](AGENTS.md), [поточний стан](context/progress-tracker.md), [master-plan](context/master-plan.md), [Larexa spec](context/specs/08-larexa-redesign.md). Практичні інструкції: [CI і перевірки](docs/ci.md), [контактна форма та env](docs/contact-form.md), [Sanity webhook і кеш](docs/sanity-revalidation.md). Застосунок — `app/(front)/`, спільні компоненти — `components/`, CMS — `sanity/`, фолбеки/утиліти — `lib/`.
