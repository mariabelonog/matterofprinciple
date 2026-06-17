export interface Rival {
  id: string;
  teamName: string;
  basePerformance: number;   // 0–10
  developmentRate: number;   // performance gained per race round
  budget: number;            // in G
  reliability: number;       // 0–10
}

export interface Driver {
  id: string;
  name: string;
  driverIndex: number; // 0–10
  cost: number;        // in G (Geld)
  description: string;
}

export interface GameState {
  teamName: string;
  budget: number;               // in G
  driver: Driver | null;
  carDevelopment: number;       // 0–10
  staffQuality: number;         // 0–10
  publicImage: number;          // 0–10
  riskWillingness: number;      // 0–10
  currentRace: number;          // 1–8
  lastCarInvestment: number;    // in G, default 0
  previousCarInvestment: number; // in G, default 0
  raceHistory: ExtendedRaceResult[];
  seasonSeed: number;           // PRNG seed, fixed for the whole season
  carReliability: number;       // 0–10, degrades with risk and age
  rivals: Rival[];              // 9 autonomous rival teams
}

export interface RaceResult {
  carPerformance: number;
  strategy: number;
  driverInput: number;
  raceScore: number;
  position: number; // 1–10
  narrative: string;
}

export interface BudgetAllocation {
  carDevelopment: number; // in G
  staffQuality: number;   // in G
  publicImage: number;    // in G
}

export interface Race {
  round: number;           // 1–8
  city: string;
  isCrisis: boolean;
  opponentScores: number[]; // 9 fixed CPU scores for this race
  atmosphereText: string;   // short flavour text shown on race card
}

export interface CrisisChoice {
  id: string;
  label: string;
  description: string;
  narrative: string;        // shown after selecting
  budgetDelta?: number;     // in G
  carDevelopmentDelta?: number;
  staffQualityDelta?: number;
  publicImageDelta?: number;
  riskModifier?: number;       // added to riskWillingness for this race only
  crashLossMultiplier?: number; // multiplies crash losses this race (default 1)
  driverBoost?: number;        // temporary driverIndex boost this race only
}

export interface CrisisEvent {
  city: string;
  title: string;
  description: string;
  choices: CrisisChoice[];
}

export interface ExtendedRaceResult extends RaceResult {
  raceNumber: number;
  city: string;
  sponsorIncome: number;   // 0 if no contract
  crashLosses: number;     // 0 if no crash
  budgetAfter: number;
  crisisChoiceId?: string; // which crisis choice was made
  crisisNarrative?: string;
  prizeMoneyEarned: number;    // position-based prize from simulationEngine
  dnf: boolean;                // true if car retired before finish
  reliabilityAfter: number;    // carReliability value after this race
}
