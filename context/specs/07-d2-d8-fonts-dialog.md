# D2/D8 — локальні icon fonts і фотодіалог

**Публікація прямо погоджена 2026-10-27:** користувач відповів «Так» після фінального QA; дозволено commit + push 12 файлів D2.1/D8.1 у `codex/seo-1-audit` за workflow §3. Свіжий fetch HEAD/origin 0/0, Git Credential Manager — `Chekirko`. Нижчі згадки про ще потрібну згоду/відсутність commit+push — попередній стан. Результат — у git history та фінальному повідомленні; live deployment не засвідчений.

Доручення «Роби Далі — D2/D8», 2026-10-27. Старт: чистий `6b12965`, `codex/seo-1-audit`.

**D2.1 і D8.1 завершені локально.** [Звіт](../../docs/seo/audit.md#d2-d8-2026-10-27), [evidence](../../docs/seo/d2-d8-2026-10-27.json). Font-display audit PASS у всіх 3 runs; Performance 66→66, LCP 6,885→6,908 с, прискорення не доведено. Label 4,46→4,72:1; dialog на 320px 320/323→320/320. 72 icon comparisons, 15 real-photo + 3 synthetic portrait geometry checks; keyboard/shared gallery/HTTP/build/lint/TypeScript/регресії перевірені. Повні D2/D8 лишаються відкритими. Commit/push не виконані; тимчасова public fixture видалена.

Два послідовні вузькі юніти в межах workflow:

1. **D2.1:** усунути `font-display: block` трьох використовуваних Font Awesome 6 faces через локальні CSS overrides з `swap`. Зберегти оригінальні файли, glyph mappings, сімейства/ваги, ліцензії та CMS-вибір іконок. Порівняти три production Lighthouse mobile runs головної до/після, той самий Chrome/профіль/assets; перевірити font-display audit, bytes, LCP/CLS і видимі іконки. Не заявляти прискорення лише з audit PASS. Render-blocking CSS та загальні цілі D2 залишаються відкритими.
2. **D8.1:** виправити відомий контраст ministry leader label чинним темнішим token і горизонтальний overflow спільного фотодіалогу на 320px. Перевірити 320/390/1280px, landscape/portrait фото, межі/стрілки, Esc/бекдроп, Tab trap/restore; зберегти повнорозмірні URL/q=100 і відкладений preload D9. Решта D8 — окремі юніти.

Після кожного юніту — build і запис результату в progress. Фінально lint/typecheck/наявні регресії, browser QA і звіт з обмеженнями. Не змінювати CMS/schema/GROQ/env/settings/залежності/індексацію. Commit/push потребують окремої згоди за [workflow §3](../ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19).
