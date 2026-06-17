# UI Context

## Theme

Light theme. Clean, modern church website aesthetic. White/light gray backgrounds with green accent colors. Frosted-glass effects on hero sections. Professional but warm and inviting feel.

## Colors

All components must use CSS custom property tokens from `globals.css` — no hardcoded hex values.

| Role              | CSS Variable         | Value     |
| ----------------- | -------------------- | --------- |
| Primary           | `--color-primary`    | `#4cbd89` |
| Gradient start    | `--gradient-start`   | `#97c74e` |
| Gradient end      | `--gradient-end`     | `#2ab9a5` |
| Page background   | white                | `#ffffff` |
| Surface / section | `--color-gray-100`   | `#f7f8f9` |
| Border            | `--border-color`     | `rgba(0,0,0,0.1)` |
| Text primary      | `--color-gray-800`   | `#343a40` |
| Text body         | `--color-gray-600`   | `#6b7177` (AA ≥4.5:1 on white) |
| Text muted        | `--color-gray-500`   | `#6f757a` (AA ≥4.5:1 on white) |
| Success           | `--color-success`    | `#28a745` |
| Danger            | `--color-danger`     | `#dc3545` |
| Warning           | `--color-warning`    | `#ffc107` |

### Brand Gradient

```css
background: linear-gradient(150deg, var(--gradient-end) 0%, var(--gradient-start) 50%, var(--gradient-end) 100%);
background-size: 260% 100%;
```

Use `.bg-grad` utility class for decorative backgrounds (bright gradient `--gradient-start/end`).

**Buttons use a separate darker gradient** (`--gradient-btn-start: #4e7d2a` → `--gradient-btn-end: #1c7e70`) so white button text passes WCAG AA contrast (`.btn-grad`, `.btn-outline-grad` hover). Do not put white text on the bright decorative gradient — it fails AA.

## Accessibility (WCAG 2.2 AA)

- Global `:focus-visible` outline (2px `--color-primary`, 2px offset) is defined in `globals.css` base layer — never re-add `outline:none`/`ring-0` without a visible replacement.
- `prefers-reduced-motion: reduce` damps animations/transitions globally.
- Skip-link (`Перейти до вмісту`) targets `<main id="main-content">` in `app/(front)/layout.tsx`.
- Header nav: active item gets `aria-current="page"` (via `usePathname()`); the "Про нас" dropdown is a keyboard-operable disclosure (`aria-haspopup`/`aria-expanded`, opens on click+hover, closes on Escape/blur); mobile toggle has `aria-expanded`. Decorative `<i class="fa…">` icons are `aria-hidden="true"`.
- Section heroes (`PageHero` + news/events detail) render the background via `next/image` (`fill priority`), not CSS `background-image`.

## Typography

| Role        | Font              | Variable         |
| ----------- | ----------------- | ---------------- |
| Headings    | Poppins           | `--font-heading` |
| Body text   | Roboto            | `--font-base`    |
| Accent/Alt  | Playfair Display  | `--font-alt`     |

- Headings: Poppins, weight 500, line-height 1.2
- Body: Roboto, 14px (0.875rem), line-height 1.6
- Pre-titles: Playfair Display, italic, `text-2xl`

## Border Radius

| Context           | Token          | Value  |
| ----------------- | -------------- | ------ |
| Default           | `--radius`     | `3px`  |
| Small             | `--radius-sm`  | `2px`  |
| Medium            | `--radius-md`  | `3px`  |
| Large             | `--radius-lg`  | `4px`  |
| Cards / hero      | `rounded-2xl`  | `1rem` |
| Buttons (round)   | `rounded-full` | `50%`  |

## Component Patterns

### Buttons
- Primary: `.btn .btn-grad` (gradient animated on hover)
- Outline: `.btn .btn-outline-grad` (gradient border, white fill → gradient on hover)
- CTA: `.btn .btn-white` / `.btn .btn-outline-white` on dark backgrounds
- Link: `.btn-link` (underline animation on hover)

### Section Title Pattern
```html
<div class="title text-center">
  <span class="pre-title">Pre-title text</span>
  <h2>Main Title</h2>
  <p>Description paragraph</p>
</div>
```

### Frosted Glass Hero (PageHero component)
Used on: History, Ministry Detail pages
```
- Background image with `bg-black/55` overlay
- Centered card with `backdrop-filter: blur(16px)`
- Gradient background: `rgba(151,199,78,0.15)` → `rgba(42,185,165,0.15)`
- White border: `rgba(255,255,255,0.22)`
- Box shadow: `0 4px 24px rgba(0,0,0,0.3)`
```

## Layout Patterns

- **Container**: `.container-larexa` — responsive max-width container (up to 1200px)
- **Sections**: `py-12 md:py-16` default section padding (set in base styles)
- **Grid**: Flexbox-based with `-mx-4` / `px-4` columns pattern
- **Sidebar layout**: `w-full md:w-1/4` sidebar + `w-full md:w-3/4` main content
- **Cards**: `shadow-card` / `shadow-hover` with `transition-all duration-300`

## Icons

Inline SVGs where needed. **Font Awesome is self-hosted** via the `@fortawesome/fontawesome-free` npm package (CSS imported once in `app/layout.tsx`, pinned to 6.x) — no external cdnjs request. Use the same `fas`/`far`/`fab` class names; mark decorative icons `aria-hidden="true"`.
