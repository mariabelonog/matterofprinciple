import type { Driver, GameState, RaceResult } from "@/types/game";

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

// Divisors (in G) for each investment category.
// 10M G = 1 index point for car/staff; 12M G = 1 index point for public image.
export const INVESTMENT_DIVISORS = {
  carDevelopment: 10_000_000,
  staffQuality:   10_000_000,
  publicImage:    12_000_000,
} as const;

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
  return carPerformance * 0.6 + driverInput * 0.1 + strategy * 0.3;
}

export function calcPosition(playerScore: number, opponentScores: number[]): number {
  return opponentScores.filter((s) => s > playerScore).length + 1;
}

// Investment formula: index += investment / divisor, capped at 10
export function applyInvestment(current: number, investmentG: number, divisor: number): number {
  return Math.min(10, current + investmentG / divisor);
}

// Sponsor contract: random roll based on publicImage
// sponsorProbability = publicImage / 10
export function rollSponsor(publicImage: number): { didFire: boolean; income: number } {
  const probability = publicImage / 10;
  const didFire = Math.random() < probability;
  return { didFire, income: didFire ? Math.round(publicImage * 3_000_000) : 0 };
}

// Crash: random roll based on effectiveRisk
// crashProbability = effectiveRisk / 20
// losses = (lastCarInvestment + previousCarInvestment) * effectiveRisk / 20 * multiplier
export function rollCrash(
  effectiveRisk: number,
  lastCarInvestment: number,
  previousCarInvestment: number,
  multiplier = 1,
): { didCrash: boolean; losses: number } {
  const probability = effectiveRisk / 20;
  const didCrash = Math.random() < probability;
  const losses = didCrash
    ? Math.round((lastCarInvestment + previousCarInvestment) * (effectiveRisk / 20) * multiplier)
    : 0;
  return { didCrash, losses };
}

// Generic race runner — usable for all 8 races
export function runRace(
  state: GameState,
  opponentScores: number[],
  effectiveRisk: number,  // riskWillingness + crisisRiskModifier, clamped 0–10
  driverBoost = 0,
): Omit<RaceResult, "narrative"> & { carPerformance: number; strategy: number; driverInput: number } {
  if (!state.driver) throw new Error("No driver selected");
  const { carDevelopment, staffQuality } = state;
  const driverIndex = Math.min(10, state.driver.driverIndex + driverBoost);

  const carPerformance = calcCarPerformance(carDevelopment, staffQuality);
  const strategy = calcStrategy(staffQuality, effectiveRisk);
  const driverInput = calcDriverInput(driverIndex, effectiveRisk);
  const raceScore = calcRaceScore(carPerformance, driverInput, strategy);
  const position = calcPosition(raceScore, opponentScores);

  return { carPerformance, strategy, driverInput, raceScore, position };
}

// Position narrative — generic version
export function buildRaceNarrative(city: string, position: number): string {
  if (position === 1)
    return `P1 in ${city}. An extraordinary result. The paddock takes notice. Keep it up.`;
  if (position <= 3)
    return `P${position} in ${city}. A strong performance. The team is building momentum.`;
  if (position <= 5)
    return `P${position} in ${city}. Solid points finish. The work is paying off slowly.`;
  if (position <= 7)
    return `P${position} in ${city}. Midfield result. Not enough to silence the critics, but the team survives another week.`;
  if (position <= 9)
    return `P${position} in ${city}. Difficult race. The board is watching the numbers carefully.`;
  return `P10 in ${city}. Last place. A complete rethink may be required.`;
}

// Keep runParisRace for backward compat with any existing references
const PARIS_OPPONENT_SCORES = [1.5, 2.0, 2.2, 2.5, 2.8, 3.0, 3.3, 3.6, 4.0];

export function runParisRace(state: GameState): RaceResult {
  if (!state.driver) throw new Error("No driver selected");
  const { carDevelopment, staffQuality, riskWillingness } = state;
  const { driverIndex } = state.driver;

  const carPerformance = calcCarPerformance(carDevelopment, staffQuality);
  const strategy = calcStrategy(staffQuality, riskWillingness);
  const driverInput = calcDriverInput(driverIndex, riskWillingness);
  const raceScore = calcRaceScore(carPerformance, driverInput, strategy);
  const position = calcPosition(raceScore, PARIS_OPPONENT_SCORES);
  const narrative = buildRaceNarrative("Paris", position);

  return { carPerformance, strategy, driverInput, raceScore, position, narrative };
}
