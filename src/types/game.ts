export interface Driver {
  id: string;
  name: string;
  driverIndex: number; // 0–10
  cost: number;        // in G (Geld)
  description: string;
  riskProfile: string;
}

export interface GameState {
  teamName: string;
  budget: number;          // in G
  driver: Driver | null;
  carDevelopment: number;  // 0–10
  staffQuality: number;    // 0–10
  publicImage: number;     // 0–10
  riskWillingness: number; // 0–10
  currentRace: number;     // 1–8
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
