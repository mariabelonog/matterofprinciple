# CLAUDE.md — Development Rules for Matter of Principle

This file defines conventions and rules for AI-assisted development on this project.
Update this file whenever new rules or conventions are established.

---

## General Principles

- **Keep changes small and focused.** One concern per commit. Avoid bundling unrelated changes.
- **Do not add unnecessary dependencies.** Prefer native browser APIs and what Next.js/React already provide. Every new package must have a clear justification.
- **Do not add authentication or a database unless explicitly requested.** The game is intentionally stateless and runs in the browser. Do not introduce Prisma, Supabase, NextAuth, or similar without a direct instruction.

---

## Content & IP Rules

- **Do not use real Formula 1 logos, team names, driver names, or any copyrighted assets.** This includes but is not limited to: Ferrari, Mercedes, Red Bull Racing, McLaren, etc.
- **Use fictional racing teams only.** Invent plausible-but-clearly-fictional names (e.g., "Vortex Motorsport", "Ironclad Racing").
- **Do not reference real race circuits by name** if it could create legal ambiguity. Use fictional or generic names.

---

## Code Style

- **Keep code clean and commented where non-obvious.** Comments should explain *why*, not *what*.
- **Prefer server components** (default in App Router) unless the component requires client-side interactivity (event handlers, state, effects). Add `"use client"` only when needed.
- **Use Tailwind utility classes.** Avoid writing custom CSS unless Tailwind genuinely cannot achieve the result.
- **No inline styles** except for values that must be dynamic and cannot be expressed with Tailwind (e.g., programmatic widths for progress bars).

---

## Project Structure

- **All game data must live in `/lib` or `/data` directories**, not hardcoded inside components.
  - `/data` — static JSON-like data: event tables, team configs, decision trees, budget constants.
  - `/lib` — TypeScript functions and helpers: game logic, simulation engine, formatters.
- **Components** (`/app` or a future `/components` directory) should only receive data as props and render it — no business logic inside JSX files.

---

## What NOT to Do (without explicit instruction)

- Do not scaffold a `/api` route unless the feature genuinely requires server-side processing.
- Do not add `localStorage` persistence without being asked.
- Do not add analytics, tracking, or third-party scripts.
- Do not modify `next.config.ts` or `tsconfig.json` without a clear reason.
- Do not rename or restructure the `/app` directory layout without discussion.
