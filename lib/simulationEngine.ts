/**
 * simulationEngine.ts — Pure simulation functions for season computation.
 *
 * All functions are side-effect-free. Randomness is controlled via a seeded
 * PRNG so the same seed always produces the same season, enabling strategy
 * comparison across playthroughs.
 */

import type { GameState, Race } from "@/types/game";
import type { Rival } from "@/types/game";
import {
  calcCarPerformance,
  calcStrategy,
  calcDriverInput,
  calcRaceScore,
} from "@/lib/simulation";

// ─── Seeded PRNG ─────────────────────────────────────────────────────────────

/** Mulberry32 — fast seeded PRNG returning values in [0, 1) */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Prize money ─────────────────────────────────────────────────────────────

/** Prize money awarded per finishing position (in G) */
export const PRIZE_MONEY: Record<number, number> = {
  1:  50_000_000,
  2:  35_000_000,
  3:  25_000_000,
  4:  18_000_000,
  5:  13_000_000,
  6:   9_000_000,
  7:   6_000_000,
  8:   4_000_000,
  9:   2_000_000,
  10:  1_000_000,
};

// ─── Rival system ────────────────────────────────────────────────────────────

const RIVAL_TEMPLATES: Omit<Rival, "reliability">[] = [
  { id: "vortex",   teamName: "Vortex Motorsport",  basePerformance: 6.5, developmentRate: 0.15, budget: 120_000_000 },
  { id: "ironclad", teamName: "Ironclad Racing",    basePerformance: 5.2, developmentRate: 0.20, budget:  90_000_000 },
  { id: "aether",   teamName: "Aether Works",       basePerformance: 7.1, developmentRate: 0.10, budget: 150_000_000 },
  { id: "pascal",   teamName: "Équipe Pascal",      basePerformance: 4.8, developmentRate: 0.25, budget:  70_000_000 },
  { id: "zephyr",   teamName: "Zephyr Grand Prix",  basePerformance: 6.0, developmentRate: 0.12, budget: 100_000_000 },
  { id: "colossus", teamName: "Colossus Racing",    basePerformance: 5.8, developmentRate: 0.18, budget:  85_000_000 },
  { id: "nocturne", teamName: "Nocturne Speed",     basePerformance: 4.5, developmentRate: 0.30, budget:  65_000_000 },
  { id: "tempest",  teamName: "Tempest Auto",       basePerformance: 7.5, developmentRate: 0.08, budget: 200_000_000 },
  { id: "meridian", teamName: "Meridian Motors",    basePerformance: 5.5, developmentRate: 0.22, budget:  80_000_000 },
];

/** Create the 9 rival teams at season start. */
export function generateRivals(): Rival[] {
  return RIVAL_TEMPLATES.map((t) => ({ ...t, reliability: 8.5 }));
}

// ─── Race simulation ─────────────────────────────────────────────────────────

export interface RivalRaceResult {
  rivalId: string;
  teamName: string;
  score: number; // -1 means DNF
  dnf: boolean;
}

export interface SimulateRaceOutput {
  playerScore: number;
  playerDnf: boolean;
  rivalResults: RivalRaceResult[];
  position: number;
  prizeMoneyEarned: number;
  sponsorIncome: number;
  crashLosses: number;
  carPerformance: number;
  strategy: number;
  driverInput: number;
  reliabilityAfter: number;
}

/**
 * Compute sponsor result for the pre-race sponsor phase.
 * Uses a separate RNG namespace (offset +1_000_000) so it stays in sync
 * with the sponsor roll inside simulateRace.
 */
export function rollSponsorSeeded(
  seed: number,
  round: number,
  publicImage: number,
): { didFire: boolean; income: number } {
  const rng = mulberry32(seed + round * 7919 + 1_000_000);
  const didFire = rng() < publicImage / 10;
  return { didFire, income: didFire ? Math.round(publicImage * 3_000_000) : 0 };
}

/**
 * Full seeded race simulation.
 *
 * RNG call order (race namespace = seed + round * 7919):
 *   1. Player DNF check
 *   2–19. Per rival: score noise, rival DNF check (2 calls × 9 rivals)
 *   20. Crash check
 *
 * Sponsor uses its own namespace (seed + round * 7919 + 1_000_000) so
 * rollSponsorSeeded() returns the same value independently.
 */
export function simulateRace(
  state: GameState,
  race: Race,
  effectiveRisk: number,
  driverBoost: number,
  crashLossMultiplier: number,
  driverWeight: number,
): SimulateRaceOutput {
  if (!state.driver) throw new Error("No driver selected");

  const rng = mulberry32(state.seasonSeed + race.round * 7919);

  // Player performance components
  const carPerformance = calcCarPerformance(state.carDevelopment, state.staffQuality);
  const strategy = calcStrategy(state.staffQuality, effectiveRisk);
  const driverInput = calcDriverInput(
    Math.min(10, state.driver.driverIndex + driverBoost),
    effectiveRisk,
  );
  const playerScore = calcRaceScore(carPerformance, driverInput, strategy, driverWeight);

  // DNF probability: risk amplifies unreliable cars
  const dnfProb = ((10 - state.carReliability) / 20) * (effectiveRisk / 10);
  const playerDnf = rng() < dnfProb; // call #1

  // Reliability degrades each race from mechanical stress
  const reliabilityAfter = Math.max(0, state.carReliability - (0.15 + effectiveRisk * 0.04));

  // Rival scores with seeded noise
  const rivalResults: RivalRaceResult[] = state.rivals.map((rival) => {
    const developmentGain = rival.developmentRate * (race.round - 1);
    const noise = (rng() - 0.5) * 1.5; // calls #2, 4, 6… (odd)
    const score = Math.max(0, rival.basePerformance + developmentGain + noise);
    const rivalDnf = rng() < (10 - rival.reliability) / 25; // calls #3, 5, 7… (even)
    return {
      rivalId: rival.id,
      teamName: rival.teamName,
      score: rivalDnf ? -1 : score,
      dnf: rivalDnf,
    };
  });

  // Position (DNF player scores -1, always at the back)
  const effectiveScore = playerDnf ? -1 : playerScore;
  const position = Math.min(10, rivalResults.filter((r) => r.score > effectiveScore).length + 1);
  const prizeMoneyEarned = PRIZE_MONEY[position] ?? 1_000_000;

  // Sponsor (own namespace)
  const { income: sponsorIncome } = rollSponsorSeeded(state.seasonSeed, race.round, state.publicImage);

  // Crash: skipped on DNF (car already retired)
  const crashDidHappen = !playerDnf && rng() < effectiveRisk / 20; // call #20
  const crashLosses = crashDidHappen
    ? Math.round(
        (state.lastCarInvestment + state.previousCarInvestment) *
          (effectiveRisk / 20) *
          crashLossMultiplier,
      )
    : 0;

  return {
    playerScore,
    playerDnf,
    rivalResults,
    position,
    prizeMoneyEarned,
    sponsorIncome,
    crashLosses,
    carPerformance,
    strategy,
    driverInput,
    reliabilityAfter,
  };
}

// ─── Between-race updates ─────────────────────────────────────────────────────

/**
 * Advance rival state after a race.
 * Each rival spends 10% of their remaining budget on development and
 * their reliability degrades slightly from race stress.
 */
export function updateRivals(rivals: Rival[]): Rival[] {
  return rivals.map((rival) => {
    const spend = rival.budget * 0.1;
    return {
      ...rival,
      budget: rival.budget - spend,
      reliability: Math.max(5, rival.reliability - 0.1),
    };
  });
}

// ─── Upgrade formula ─────────────────────────────────────────────────────────

/**
 * Diminishing returns upgrade formula.
 * gain = (budgetSpent / divisor) ^ alpha
 *
 * At alpha=0.7:
 *   10M G → +1.00 pts  (same as linear)
 *   20M G → +1.62 pts  (linear would be +2.00)
 *   40M G → +2.64 pts  (linear would be +4.00)
 *
 * Encourages spreading budget rather than dumping everything in one category.
 */
export function applyUpgrades(
  current: number,
  budgetSpent: number,
  alpha = 0.7,
  divisor = 10_000_000,
): number {
  if (budgetSpent <= 0) return current;
  return Math.min(10, current + Math.pow(budgetSpent / divisor, alpha));
}

// ─── Financial update ────────────────────────────────────────────────────────

/**
 * Apply all income and losses for one race.
 * Centralises the budget arithmetic so the call site is one line.
 */
export function updateFinances(
  budget: number,
  prizeMoneyEarned: number,
  sponsorIncome: number,
  crashLosses: number,
): number {
  return budget + prizeMoneyEarned + sponsorIncome - crashLosses;
}
