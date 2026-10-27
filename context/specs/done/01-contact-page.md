# Unit 01: Contact Page

## Goal

Create a contact page (`/contact`) with church address, service schedule, contact information, embedded Google Map, and an optional contact form. The page should match the visual language of existing pages (PageHero, frosted-glass pattern).

## Design

- PageHero at top with breadcrumb: Home → Контакти
- Background image: church exterior or relevant photo
- Three-column info grid: Address, Phone/Email, Service Schedule
- Each card uses `shadow-card` with gradient accent border
- Embedded Google Map (full-width, 400px height)
- Optional: Simple contact form (name, email, message, submit button)
- Use `.btn-grad` for submit button
- Responsive: stack cards on mobile, side-by-side on desktop

### Color tokens
- Cards: white background, `--color-gray-100` subtle borders
- Icons: `.icon-grad` (gradient fill)
- Text: `--color-gray-800` for titles, `--color-gray-600` for body

## Implementation

### Page File
- `app/(front)/contact/page.tsx` — Server Component
- Uses `PageHero` from `@/components`
- Static content (no Sanity data needed for v1)
- `generateMetadata()` for SEO

### Components (page-local)
- `app/(front)/contact/components/ContactInfoCard.tsx` — Reusable info card (icon, title, content)
- `app/(front)/contact/components/ContactForm.tsx` — Client component (`'use client'`) with form state
- `app/(front)/contact/components/MapEmbed.tsx` — Google Maps iframe wrapper

### Navigation
- Add "Контакти" link to `ChurchHeader.tsx` navigation

## Dependencies

- None (Google Maps embed uses iframe, no API key needed for basic embed)

## Verify when done

- [ ] `/contact` page renders without errors
- [ ] PageHero displays correctly with breadcrumb
- [ ] Contact info cards show address, phone, schedule
- [ ] Google Map embed loads and is interactive
- [ ] Page is responsive (mobile, tablet, desktop)
- [ ] Navigation link works from header
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] `npm run build` passes
