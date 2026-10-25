# Контактна форма /contact

Форма надсилає звернення через серверний Action → Resend HTTP API. Одержувач визначається на сервері: `CONTACT_TO_EMAIL`, якщо задано, інакше актуальний `siteSettings.email` через `getSiteSettings()`. Користувач не задає одержувача/відправника. Його email — лише `reply_to`; лист містить звичайний текст.

## Налаштування

У Vercel → Project → Settings → Environment Variables додайте значення для потрібного середовища. Для локальної розробки — у gitignored `.env.local`; приклад без секретів — `.env.example`.

| Змінна | Призначення |
| --- | --- |
| `RESEND_API_KEY` | Окремий sending API key для цього проєкту; потрібен лише серверу під час надсилання. |
| `CONTACT_FROM_EMAIL` | Адреса без display name, наприклад `forms@example.org`, на домені, підтвердженому в Resend. |
| `CONTACT_TO_EMAIL` | Необов’язкова фіксована адреса одержувача. Порожня → email із налаштувань сайту в Studio. |
| `UPSTASH_REDIS_REST_URL` | HTTPS REST URL бази Upstash Redis для спільних лічильників спаму. |
| `UPSTASH_REDIS_REST_TOKEN` | REST token тієї самої бази з дозволом на EVAL/GET/INCR/EXPIRE; не read-only token. |

Не додавайте префікс `NEXT_PUBLIC_` до цих змінних. Не копіюйте секрети в Git, документацію, screenshots або повідомлення чату. Після зміни env потрібен redeploy. Build/CI проходять без цих ключів; надсилання до їх налаштування повертає помилку й зберігає введений текст.

Можна використати наявний Resend-акаунт. Створіть окремий API key для цього сайту та виберіть підтверджений домен відправника. Публічна Gmail-адреса церкви може бути одержувачем; її не слід використовувати як From замість адреси підтвердженого домену. Див. [Resend: домени](https://resend.com/docs/dashboard/domains/introduction), [Send Email API](https://resend.com/docs/api-reference/emails/send-email).

## Захист і межі

- Zod перевіряє дані на сервері: ім’я ≤100, email ≤254, тема ≤160, повідомлення ≤5000 символів; всі поля обов’язкові. Файли, повторні поля, некоректна адреса, керівні символи й багаторядкові поштові заголовки відхиляються. Багаторядковий текст повідомлення дозволений.
- Прихований honeypot `website` має бути рівно один і порожній. Next.js Server Actions виконують перевірку Origin/Host; не розширювати `allowedOrigins` без потреби.
- Upstash виконує один атомарний Lua EVAL: до 5 спроб/IP і 3/email за 15 хвилин, до 30 спроб на годину для середовища. Лічильники інкрементуються лише якщо всі ліміти дозволяють; помилки Resend теж витрачають спробу. Вікно починається з першої спроби, TTL не подовжується.
- IP із `x-vercel-forwarded-for` довіряємо лише на Vercel (`VERCEL=1`). Поза Vercel всі звернення мають спільний IP bucket `local`; для іншого хостингу потрібно явно визначити довірений proxy. [Vercel request headers](https://vercel.com/docs/headers/request-headers).
- Namespace `newlife2:contact:<VERCEL_ENV або local>` розділяє production/preview/local; Redis keys містять HMAC-SHA256 від IP/email, ключ HMAC — серверний Redis token. IP/email buckets живуть 15 хв, загальний — 1 годину. Імена й тексти звернень у Redis не зберігаються. Ротація token змінить IP/email bucket hashes.
- Немає in-memory fallback: недоступна/неналаштована Redis блокує відправлення. Honeypot/ліміти зменшують спам, але не замінюють повний bot-management. За потреби обмеження трафіку можна додати у Vercel Firewall окремо.
- Redis timeout 5с, Resend timeout 10с; обидва fetch — `no-store`. Успіх лише після HTTP success та `id` Resend, що означає прийняття до відправлення; inbox-доставку перевіряють окремо. Якщо відповідь загубилась після прийняття провайдером, повторна спроба може дублювати лист.
- Application не записує звернення у Sanity, localStorage чи logs. Resend та поштова скринька обробляють/зберігають листи за своїми налаштуваннями. Фінальна політика `/privacy` лишається окремим завданням.

Протокол лічильників: [Upstash REST API](https://upstash.com/docs/redis/features/restapi), [атомарний EVAL через HTTP](https://upstash.com/blog/lua-scripting-on-upstash-redis-atomic-operations-over-http).

## Перевірка

`pnpm test` включає `tsx --conditions=react-server scripts/check-contact-form.ts`: input validation, honeypot, довжини, повтори/файли, header injection; HTTP contract Redis, відхилення ліміту/невалідних відповідей, збої Resend, безпечний plain-text payload. HTTP повністю підмінено: листи не надсилаються, реальна Redis/Lua не виконується. У CI mail/Redis keys не потрібні.

Після налаштування env потрібне окреме погоджене тестове звернення через Preview: перевірити лист у скриньці, Reply-To й статус у Resend. Це ще не виконано в локальній перевірці без credentials. Візуальні/інтерактивні результати — у `context/progress-tracker.md`.
