# Olympics — The Cycle

IOC simulation. Pick host cities, simulate Summer Olympics day by day across 15 days, track medals and records across cycles.

## Stack

- Vite + React 18 + TypeScript
- Zustand for game state (with `persist` middleware → LocalStorage)
- CSS Modules per screen
- Deployed to GitHub Pages on push to `main`

## Architecture

```
src/
├── data/        — typed constants (countries, sports, cities, legends)
├── engine/      — pure functions (ratings, qualifying, scheduling, simulation, history, lookup)
├── store/       — Zustand store with persistence
├── screens/     — React UI, one folder per screen with its own CSS module
├── components/  — shared UI bits (Flame mark)
└── styles/      — design tokens + global resets
```

## Develop

```bash
npm install
npm run dev
```

Local server runs at http://localhost:5173/olympics/

## Deploy

`git push origin main` → GitHub Action builds and publishes to
https://fortisross14-pixel.github.io/olympics/

One-time GitHub setup: **Settings → Pages → Source = GitHub Actions**

## Roadmap

- [x] **Iteration 1** — Scaffold (Vite, TS, tab shell, GH Pages workflow)
- [x] **Iteration 2** — Data + types (countries, sports, cities, all domain types)
- [x] **Iteration 3** — Engine: ratings & qualifying + functional Host & Qualifiers screens
- [x] **Iteration 4** — Engine: scheduling & simulation + GamesDay screen
- [x] **Iteration 5** — MedalTable screen
- [x] **Iteration 6** — Database expansion (20 sports, 106 events, 20 countries, 38 legends)
- [x] **Iteration 7** — 15-day calendar, day slicer, host themes, Paris-style visual pivot, persistence, multi-cycle history
- [x] **Iteration 8a** — Balancing: budget-based ratings, hard-coded specialties, host bonus +0.7, variance tuned for ~60% favorite-win, demonstration sports (host-exclusive, separate medal table)
- [x] **Iteration 8b** — Sport icons (hand-drawn pictograms) + country flags (Unicode emoji)
- [ ] Iteration 9 — Wire legends into simulation engine
- [ ] Iteration 10 — Polish: cinematic reveals, sound

## What works right now (after iteration 8b)

1. **Start** — three states: first cycle / mid-cycle / between cycles. Archive completed Games and start next (year +4).
2. **Host City** — 3 random candidates from 17-city pool. Each card shows the city's flag, 2-color theme, and demonstration sports they'll bring. Selecting one applies its colors across the UI.
3. **Qualifiers** — all events for the cycle with sport pictogram icons, flags on qualified nations. Demo sports tagged "DEMO".
4. **The Games** — 15-day calendar slicer. Sport icons in preview lists and event card headers. Flags on podium country names.
5. **Medal Table** — flags throughout, separate "Demo G" column for demonstration medals.
6. **History** — All-Time Medals, Records, Past Cycles — all with country flags.

## Balancing model (iter 8a)

**Budget-based ratings.** Each country has a point budget randomized within their tier each cycle:
- Tier 1 (3 countries): 90-100 points
- Tier 2 (6 countries): 55-70 points
- Tier 3 (7 countries): 35-50 points
- Tier 4 (4 countries): 22-32 points

**Specialties.** Each country has 0-3 hard-coded specialty sports (real-world strengths). Each specialty is fixed at rating 5 and costs 5 points from the budget. Remaining budget distributes across non-specialty sports as integers 1-5.

**Host bonus.** Host country gets +0.7 added to every sport rating that cycle.

**Demonstration sports.** Each host city brings 0-3 demo sports unique to its cycle. Host country gets rating 3, every other country gets rating 1. Demo medals are tracked separately and don't count toward totals.

**Variance.** Per-finalist score = `rating × 20 + (random - 0.5) × 40`. With 8 finalists, a clear favorite wins ~65% of the time. With closer ratings, more upsets.

## Data overview

- **20 countries** across 4 tiers, with real-world specialties (USA → athletics/swimming/basketball; Kenya → athletics; etc.)
- **20 core sports**, **106 core events** — athletics and swimming dominate as in real Olympics
- **17 host cities** with 2-color themes + 0-3 demo sports each (Tokyo brings Karate + Sumo, Mumbai brings Cricket + Kabaddi, etc.)
- **38 fictional legends** in `data/legends.ts` (engine wiring is iter 9)

## Persistence

State persists to `localStorage` under key `the-cycle:v2`. Both the current cycle and full history are saved. Reset Current Cycle preserves history. Wipe All Data clears everything.

**Note**: Iter 8a bumped the storage version from v1 → v2 (Cycle shape changed). If you were running iter 7 locally, your old save under `the-cycle:v1` will be ignored.
