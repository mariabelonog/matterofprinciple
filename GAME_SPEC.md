# GAME_SPEC.md — Matter of Principle: Game Design Specification

> This document defines the complete game design. Do not modify app UI or implement features until this spec is approved.

---

## Concept

The player is appointed team principal of a fictional racing team in crisis. They have one season — 8 races — to stabilize the team through budget allocation, risk management, driver choice, public image decisions, and crisis events.

---

## Currency

- **Name:** Geld, abbreviated **G**
- **Starting budget:** 100M G
- **Game over condition:** Budget drops below 0 G at any point

---

## Season Structure

8 races in order:

| # | City | Crisis Race? |
|---|------|-------------|
| 1 | Paris | No |
| 2 | Strassburg | **Yes** |
| 3 | Stuttgart | No |
| 4 | Vienna | No |
| 5 | Budapest | **Yes** |
| 6 | Bucharest | No |
| 7 | Sinaia | No |
| 8 | Istanbul | **Yes** |

---

## Teams

- 10 teams total compete each race.
- The player controls **one** team.
- The other 9 teams are **CPU opponents** with fixed scores per race.

> **Design decision:** Opponent scores are predetermined constants (different per race, not adaptive). This keeps simulation simple and deterministic.

---

## Initial Setup Flow

1. Player enters their **team name**.
2. Player chooses **one driver** from three presented options.
3. Driver cost is **immediately subtracted** from the starting 100M G budget.
4. Player makes **initial investments** in car development, staff quality, and public image.

---

## Drivers

Each driver has three attributes:

| Attribute | Type | Range |
|-----------|------|-------|
| name | string | — |
| driverIndex | number | 0–10 |
| cost | number | in million G |

> **Design decision:** Three drivers are offered at game start. All three are fictional. The player picks exactly one.

---

## Core Indices

All indices are bounded between **0 and 10**.

| Index | Description | When Set |
|-------|-------------|----------|
| `carDevelopment` | Car technical level | Set via investment |
| `staffQuality` | Team operations quality | Set via investment |
| `publicImage` | Team reputation | Set via investment + events |
| `driverIndex` | Chosen driver's skill | Fixed at driver selection |
| `riskWillingness` | Aggression for this race | Chosen before each race (0–10) |

---

## Derived Indices (Calculated Each Race)

```
carPerformance = carDevelopment * 0.6 + staffQuality * 0.4

strategy = staffQuality * 0.7 + riskWillingness * 0.3

driverInput = driverIndex * 0.6 + riskWillingness * 0.4

raceScore = carPerformance * 0.6 + driverInput * 0.1 + strategy * 0.3
```

---

## Race Position

- `raceScore` is **not** the race position directly.
- Race position is determined by **ranking** the player's `raceScore` against 9 opponent scores.
- Position 1 = highest score, Position 10 = lowest score.
- Higher `raceScore` is always better.

---

## Investments

Each round, the player allocates Geld into three categories:

| Category | Formula | Index Cap |
|----------|---------|-----------|
| Car development | `carDevelopment += carInvestment / 20` | max 10 |
| Staff quality | `staffQuality += staffInvestment / 20` | max 10 |
| Public image | `publicImageInvestment / 25` (see below) | max 10 |

> **Design decision:** Returns are linear (no diminishing returns) for simplicity. Indices are hard-capped at 10.

---

## Public Image

Public image is updated each race using:

```
publicImage = publicImage + publicImageInvestment / 25 - riskWillingness * 0.05
```

- Higher `publicImage` increases sponsor contract probability.
- High `riskWillingness` slowly erodes public image.
- `publicImage` is clamped to [0, 10].

### Sponsor Contracts

```
sponsorProbability = publicImage / 10

if sponsor contract happens:
  sponsorIncome = publicImage * 3  (in million G)
else:
  sponsorIncome = 0
```

Sponsor contract is resolved via a random roll each race before the race begins.

---

## Risk

Before each race, the player selects `riskWillingness` (0–10).

Effects of higher risk:
- **Improves** `strategy` and `driverInput` (via formulas above)
- **Increases** crash probability
- **Slightly reduces** `publicImage`

---

## Crash Losses

```
crashProbability = riskWillingness / 20

if crash happens:
  losses = (lastCarInvestment + previousCarInvestment) * riskWillingness / 20
else:
  losses = 0
```

- `lastCarInvestment` = car development spending from the previous race.
- `previousCarInvestment` = car development spending from the race before that.
- For Race 1: use 0 for missing previous values.
- Losses are subtracted from budget immediately after the race.

> **Design decision:** Losses are tied to car investment history to make spending meaningful and risky simultaneously.

---

## Race Loop (Per Race)

1. Show **city-themed card/frame** for the current race location.
2. Roll **sponsor contract** — show result and income (if any).
3. If this is a **crisis race**, show the crisis event and present 3 choices. Apply chosen effect.
4. Player selects **riskWillingness** (0–10 slider or input).
5. Calculate `carPerformance`, `strategy`, `driverInput`, `raceScore`.
6. Calculate **race position** (rank vs. 9 opponent scores).
7. Roll **crash** — calculate losses.
8. Subtract losses from budget.
9. **If budget < 0 → Game Over.**
10. Player allocates **investments** for next race (car development, staff quality, public image).
11. Apply investment formulas. Update `publicImage` (including risk penalty).
12. Advance to next race.

---

## Crisis Events

Crisis races: **Strassburg**, **Budapest**, **Istanbul**.

Each crisis event presents a situation and **3 choices**. Choices affect one or more of:

- budget (direct gain or loss)
- losses (modifier to crash damage)
- publicImage
- staffQuality
- carDevelopment
- riskWillingness (for this race only)

### Example Crisis Structure (to be defined per city):

```
{
  city: "Strassburg",
  description: "A key engineer threatens to quit...",
  choices: [
    { label: "Pay retention bonus", budgetDelta: -5, staffQualityDelta: +1 },
    { label: "Promote internally",  staffQualityDelta: -0.5, publicImageDelta: +0.5 },
    { label: "Ignore the situation", staffQualityDelta: -1.5, publicImageDelta: -0.5 }
  ]
}
```

> **Design decision:** Crisis effects are applied immediately before the race calculation.

---

## End of Season

After Race 8 (Istanbul), the season ends. Final score is based on:

| Factor | Weight |
|--------|--------|
| Average race position (lower = better) | Primary |
| Remaining budget | Secondary |
| Final `publicImage` | Tertiary |

Success thresholds and exact scoring formula to be defined during implementation.

> **Design decision:** The player wins by surviving all 8 races without going bankrupt. Final ranking is a bonus metric, not a win condition.

---

## Visual Style

- **Theme:** Dark, premium motorsport dashboard.
- **Universe:** Entirely fictional — no real F1 teams, drivers, logos, or circuits.
- **City frames:** Low-key pixel-style or stylized silhouettes of each race city.
- **UI:** Dashboard-style panels; no animations required in initial version.

---

## What Is Out of Scope (v1)

- No authentication or accounts
- No database or persistence (game is stateless per session)
- No multiplayer
- No real-time elements
- No analytics or tracking
