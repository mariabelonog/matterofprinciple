# Matter of Principle

## Game Overview

**Matter of Principle** is a browser-based economic simulation game where you step into the role of a team principal for a struggling fictional racing team. With your organization on the brink of financial collapse, you have exactly one season to turn things around.

Each race weekend presents you with decisions: how to allocate your limited budget, which upgrades to prioritize, how to manage staff morale, and when to take calculated risks. Every choice has consequences that ripple through the season — a matter of principle isn't just a phrase, it's the core mechanic.

The game is designed to be played in a single browser session, with no accounts or persistent data required.

---

## For Developers

### Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with the App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Linting:** ESLint with Next.js config
- **Deployment:** Vercel (recommended)

### Architecture

```
/app            — Next.js App Router pages and layouts
/app/page.tsx   — Landing page (home)
/public         — Static assets (images, icons)
/lib            — Shared utilities and game logic helpers
/data           — Static game data: events, teams, decisions, balance tables
```

Game state is managed client-side (React state / context). No backend, no database — the simulation runs entirely in the browser.

Server components are used for static/layout content. Client components (`"use client"`) are used only where interactivity is required.

All game data (events, team stats, decision trees) lives in `/lib` or `/data`, never hardcoded inside components.

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app hot-reloads on file changes.

---

## Deploying to Vercel

The easiest way to deploy is via the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub.
2. Import the repository on vercel.com.
3. Vercel auto-detects Next.js — click **Deploy**.

No environment variables are required for the base game (no external APIs or databases).

For CLI deployment:

```bash
npm i -g vercel
vercel
```

---

## Project Goals & Assessment Criteria

This project is developed as part of a second-year university course on web development.

### Goals

- Demonstrate proficiency with a modern React/Next.js stack
- Implement non-trivial client-side game logic (budget simulation, event branching)
- Produce a polished, deployable web application
- Practice clean code organization and component architecture

### Assessment Criteria (expected)

| Criterion | Description |
|---|---|
| Functionality | Core game loop works end-to-end for at least one full season |
| Code quality | Clean, readable TypeScript; components are small and focused |
| UI/UX | Visually coherent, responsive, accessible |
| Architecture | Proper separation of concerns; game data not hardcoded in UI |
| Deployment | Live, publicly accessible Vercel URL |
| Documentation | README and inline comments where non-obvious |
