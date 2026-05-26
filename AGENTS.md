# Application Building Context

Read context files lazily to save tokens. If a new chat starts or you receive a new task:
1. PROACTIVELY read ONLY `context/progress-tracker.md` to understand the current phase and next steps.
2. Read the other files (`architecture.md`, `ui-context.md`, `code-standards.md`, `project-overview.md`) ONLY IF your task specifically touches those domains (e.g., UI changes, new database schemas, etc.).

## Rules

- **CRITICAL (Agent Skills)**: At the start of any new session or feature, PROACTIVELY read `skills_analysis_for_newlife2.md` to align on active engineering skills (`schema-markup` for SEO, `a11y-audit` for accessibility, `performance-profiler` for page speed). Always ensure implemented code meets the standards of these skills.
- **CRITICAL (Six-File Context System)**: You MUST automatically adhere to the Six-File Context model. At the end of EVERY completed task, you MUST autonomously update `context/progress-tracker.md` with the new state. If your implementation alters any architecture or UI conventions, update the corresponding context file(s) before concluding your turn.
- Always use `defineQuery()` from `next-sanity` for GROQ queries.
- Always run `npm run build` before considering any unit complete.
- Never use PowerShell pipes for files containing Cyrillic text.

## Feature Specs

When building a new feature, check `context/specs/` for a spec file. If one exists, implement exactly what the spec describes — no more, no less.
