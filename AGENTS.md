# Application Building Context

Read context files lazily to save tokens. If a new chat starts or you receive a new task:
1. PROACTIVELY read ONLY `context/progress-tracker.md` to understand the current phase and next steps.
2. Read the other files (`architecture.md`, `ui-context.md`, `code-standards.md`, `project-overview.md`) ONLY IF your task specifically touches those domains (e.g., UI changes, new database schemas, etc.).

## Rules

- **CRITICAL (Lazy Skill Loading)**: Before implementing any task, check the **Skill Registry** table below. If your task matches a trigger domain, you MUST read the corresponding `SKILL.md` file to load the skill's workflow, standards, and decision framework. Read `references/` files from the same directory ONLY when you need deep implementation patterns (e.g., JSON-LD templates, WCAG criteria details, profiling recipes). Never load all skills at once — load only what the current task requires.
- **CRITICAL (Six-File Context System)**: You MUST automatically adhere to the Six-File Context model. At the end of EVERY completed task, you MUST autonomously update `context/progress-tracker.md` with the new state. If your implementation alters any architecture or UI conventions, update the corresponding context file(s) before concluding your turn.
- Always use `defineQuery()` from `next-sanity` for GROQ queries.
- **CRITICAL (Package Manager)**: This is a `pnpm` workspace. NEVER use `npm` or `yarn`. Always use `pnpm install`, `pnpm run dev`, `pnpm run build`, etc.
- **CRITICAL (Terminal Hangs)**: On Windows (Antigravity 2.0), wrap long-running terminal commands in `cmd /c` (e.g. `cmd /c "pnpm run build"`) to prevent the agent from hanging on "Running...".
- Always run `pnpm run build` before considering any unit complete.
- Never use PowerShell pipes for files containing Cyrillic text.
- **CRITICAL (Weak References)**: При створенні або модифікації будь-якої Sanity-схеми, що містить `type: 'reference'` — ЗАВЖДИ додавай `weak: true`. Фронтенд-компонент, що рендерить referenced-дані, ОБОВ'ЯЗКОВО повинен мати null-guard (`{data.ref && ...}`). Див. `context/code-standards.md` → Sanity References.
- For skill rationale and full analysis, see `skills_analysis_for_newlife2.md` (read only if needed for background context).

## Skill Registry

Load the actual skill files **on-demand** based on what your task involves. Paths are relative to the project root.

### Quality & Standards (P0–P1)

| Domain | When to Load | SKILL.md (read first) | References (read on-demand) |
|--------|-------------|----------------------|----------------------------|
| **SEO / Schema Markup** | Adding JSON-LD, new page type, structured data, rich snippets | `./.agents/skills/schema-markup/SKILL.md` | `implementation-patterns.md` — JSON-LD templates; `schema-types-guide.md` — per-type field reference |
| **SEO Audit** | Meta tags, H1-H6 review, page ranking, sitemap, content SEO | `./.agents/skills/seo-audit/SKILL.md` | `seo-audit-reference.md` — full audit framework; `cwv-thresholds.md`; `eeat-framework.md` |
| **Accessibility (a11y)** | New UI component, form, interactive element, contrast, keyboard nav | `./.agents/skills/a11y-audit/skills/a11y-audit/SKILL.md` | `framework-a11y-patterns.md` — React/Next.js fix patterns; `wcag-quick-ref.md` — WCAG 2.2 criteria; `aria-patterns.md`; `color-contrast-guide.md` |
| **Performance** | Lighthouse score, bundle size, load time, image optimization, lazy-loading | `./.agents/skills/performance-profiler/SKILL.md` | `profiling-recipes.md` — Node.js/bundle/DB recipes |

### Engineering & Code Quality

| Domain | When to Load | SKILL.md (read first) | References (read on-demand) |
|--------|-------------|----------------------|----------------------------|
| **Frontend (React/Next.js)** | Any new page/route, new component with client-side state or animations, `next/dynamic` usage, RSC↔client boundary decisions, Tailwind layout issues | `./.agents/skills/senior-frontend/SKILL.md` | `frontend_best_practices.md`; `nextjs_optimization_guide.md`; `react_patterns.md` |
| **Fullstack Architecture** | New Sanity schema type, adding API routes, major data flow changes, adding a new integration | `./.agents/skills/senior-fullstack/SKILL.md` | `architecture_patterns.md`; `development_workflows.md`; `tech_stack_guide.md` |
| **Clean Coding (Karpathy)** | Any change touching 3+ files, refactoring existing code, code review request, extracting shared logic | `./.agents/skills/karpathy-coder/skills/karpathy-coder/SKILL.md` | `karpathy-principles.md`; `anti-patterns.md`; `enforcement-patterns.md` |
| **Security** | Contact form changes, `.env` / token modifications, any user input handling, adding external scripts/embeds | `./.agents/skills/security-guidance/skills/security-guidance/SKILL.md` | `pretooluse_hook_canon.md` — 12 anti-pattern detectors |
| **Chaos Engineering** | Testing system limits, error boundaries, failure modes, checking system stability | `./.agents/skills/chaos-engineering/SKILL.md` | _(standalone, no references)_ |

### Architecture & Process

| Domain | When to Load | SKILL.md (read first) | References (read on-demand) |
|--------|-------------|----------------------|----------------------------|
| **Design Interview (grill-me)** | User asks to plan/scope a feature, requirements have multiple valid approaches, user uses `/grill-me` command | `./.agents/skills/grill-me/skills/grill-me/SKILL.md` | `forcing_question_patterns.md`; `when_to_stop_grilling.md` |
| **Docs-Anchored Review** | Updating `context/*.md` files, verifying implementation plan against existing architecture decisions | `./.agents/skills/grill-with-docs/skills/grill-with-docs/SKILL.md` | `adr_practice.md`; `context_md_as_artifact.md`; `ubiquitous_language.md` |
| **Session Handoff** | User says «завершуємо», long session ending, preparing context for next session | `./.agents/skills/handoff/skills/handoff/SKILL.md` | `handoff_structure.md`; `next_session_skill_matching.md`; `deduplication_discipline.md` |
| **Code Tour** | User asks «поясни код», «як це працює», onboarding a new contributor | `./.agents/skills/code-tour/skills/code-tour/SKILL.md` | _(standalone, no references)_ |
| **Codebase Onboarding** | User asks to generate project docs, README update, preparing project for handoff to another developer | `./.agents/skills/codebase-onboarding/SKILL.md` | `onboarding-template.md`; `output-format-templates.md` |
| **AutoResearch Agent** | Deep analysis of a problem, finding architectural patterns before coding begins | `./.agents/skills/autoresearch-agent/skills/autoresearch-agent/SKILL.md` | _(standalone, no references)_ |

### DevOps & Content

| Domain | When to Load | SKILL.md (read first) | References (read on-demand) |
|--------|-------------|----------------------|----------------------------|
| **CI/CD Pipelines** | GitHub Actions, Vercel deploy config, prebuild optimization | `./.agents/skills/ci-cd-pipeline-builder/SKILL.md` | `github-actions-templates.md`; `deployment-gates.md` |
| **Env & Secrets** | .env management, secret leak detection, rotation, Sanity token safety | `./.agents/skills/env-secrets-manager/SKILL.md` | `secret-patterns.md`; `validation-detection-rotation.md` |
| **Landing Pages** | Event pages, campaign pages, special occasion landing pages | `./.agents/skills/landing-page-generator/SKILL.md` | `conversion-patterns.md`; `copy-frameworks.md`; `seo-checklist.md` |
| **Content Creator** | Writing structured content, news generation, announcements, generating copy for Sanity | `./.agents/skills/content-creator/SKILL.md` | _(standalone, no references)_ |

### Skill Loading Protocol

1. **Identify domain**: Determine which skill domains your current task touches (can be multiple).
2. **Read SKILL.md**: Load only the relevant `SKILL.md` file(s) (~5-12 KB each) to get the workflow, decision framework, and standards.
3. **Read references on-demand**: During implementation, if you need specific templates, patterns, or criteria — read the corresponding file from `references/` in the same skill directory.
4. **Run scripts when applicable**: Skills may include Python scripts (stdlib-only) in `scripts/` for automated auditing. Run them when performing an audit task.
5. **Apply proactive triggers**: Each SKILL.md defines proactive triggers (situations where the skill should auto-activate). Be aware of these even when the user hasn't explicitly asked.

## Feature Specs

When building a new feature, check `context/specs/` for a spec file. If one exists, implement exactly what the spec describes — no more, no less.

