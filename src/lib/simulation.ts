import type { Driver, GameState, RaceResult } from "@/src/types/game";

export const DRIVERS: Driver[] = [
  {
    id: "lorris",
    name: "Nando Lorris",
    driverIndex: 5.8,
    cost: 15_000_000,
    description: "You'll probably regret your decision.",
    riskProfile: "Unpredictable. Cheap. Occasionally inspired.",
  },
  {
    id: "eclair",
    name: "Snarles Eclair",
    driverIndex: 7.2,
    cost: 35_000_000,
    description: "Semi-okay driver. No heroics but not problems either.",
    riskProfile: "Consistent mid-tier. Reliable points scorer.",
  },
  {
    id: "mestappen",
    name: "Vax Mestappen",
    driverIndex: 9.9,
    cost: 70_000_000,
    description: "High risk high reward.",
    riskProfile: "Elite ceiling. Leaves almost nothing for the car.",
  },
];

// 9 predetermined CPU opponent scores (deterministic, per spec)
const PARIS_OPPONENT_SCORES = [1.5, 2.0, 2.2, 2.5, 2.8, 3.0, 3.3, 3.6, 4.0];

export function calcCarPerformance(carDevelopment: number, staffQuality: number): number {
  return carDevelopment * 0.6 + staffQuality * 0.4;
}

export function calcStrategy(staffQuality: number, riskWillingness: number): number {
  return staffQuality * 0.7 + riskWillingness * 0.3;
}

export function calcDriverInput(driverIndex: number, riskWillingness: number): number {
  return driverIndex * 0.6 + riskWillingness * 0.4;
}

export function calcRaceScore(carPerformance: number, driverInput: number, strategy: number): number {
  // raceScore = carPerformance × 0.6 + driverInput × 0.1 + strategy × 0.3
  return carPerformance * 0.6 + driverInput * 0.1 + strategy * 0.3;
}

export function calcPosition(playerScore: number, opponentScores: number[]): number {
  // Count opponents with a higher score; add 1 for 1-based position
  return opponentScores.filter((s) => s > playerScore).length + 1;
}

// Divisors (in G) for each investment category.
// 10M G = 1 index point for car/staff; 12M G = 1 index point for public image.
// These are intentionally generous so the index bars show visible movement
// within a realistic pre-season budget.
export const INVESTMENT_DIVISORS = {
  carDevelopment: 10_000_000,
  staffQuality:   10_000_000,
  publicImage:    12_000_000,
} as const;

// Investment formula: index += investment / divisor, capped at 10
export function applyInvestment(current: number, investmentG: number, divisor: number): number {
  return Math.min(10, current + investmentG / divisor);
}

export function runParisRace(state: GameState): RaceResult {
  if (!state.driver) throw new Error("No driver selected");
  const { carDevelopment, staffQuality, riskWillingness } = state;
  const { driverIndex } = state.driver;

  const carPerformance = calcCarPerformance(carDevelopment, staffQuality);
  const strategy = calcStrategy(staffQuality, riskWillingness);
  const driverInput = calcDriverInput(driverIndex, riskWillingness);
  const raceScore = calcRaceScore(carPerformance, driverInput, strategy);
  const position = calcPosition(raceScore, PARIS_OPPONENT_SCORES);
  const narrative = buildNarrative(position);

  return { carPerformance, strategy, driverInput, raceScore, position, narrative };
}

function buildNarrative(position: number): string {
  if (position === 1)
    return "P1 in Paris. An extraordinary debut. The paddock is talking. The board is delighted. Now keep it up.";
  if (position <= 3)
    return `P${position} in Paris. A strong result. The team showed real pace this weekend. Strassburg will test you further.`;
  if (position <= 5)
    return `P${position} in Paris. A solid points finish. The team shows signs of life, but the board still expects stronger development before Strassburg.`;
  if (position <= 7)
    return `P${position} in Paris. A midfield result. Not embarrassing, but the board expected more. Invest wisely before Strassburg.`;
  if (position <= 9)
    return `P${position} in Paris. A difficult race. The car struggled all weekend. Significant investment is needed before Strassburg.`;
  return "P10 in Paris. Last place. The board is alarmed. A complete rethink is required before Strassburg.";
}
