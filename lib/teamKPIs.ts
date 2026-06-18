import type { ExtendedRaceResult, Driver } from "@/types/game";
import { PRIZE_MONEY } from "@/lib/simulationEngine";

export interface TeamKPIs {
  // Profitability
  roi: number;                   // % return on 100M starting capital
  netPL: number;                 // current_budget - 100M (in G)
  revenuePerRace: number;        // avg (prize + sponsor) per race
  crashLossRate: number;         // crash losses / gross revenue %

  // Revenue breakdown
  totalPrize: number;
  totalSponsor: number;
  totalCrash: number;
  grossRevenue: number;

  // Performance
  avgPosition: number;
  positionTrend: "improving" | "declining" | "stable" | "insufficient_data";
  sponsorHitRate: number;        // % races with sponsor income
  crashRate: number;             // % races with crash
  dnfRate: number;               // % races with DNF

  // Efficiency
  prizeEfficiency: number;       // actual prize / maximum possible (P1 every race) %
  driverCostPaybackRaces: number; // how many races of current avg revenue to cover driver cost

  // Runway
  racesCompleted: number;
  avgBurnPerRace: number;        // capital consumed per race (investments + losses)
  runsOutInRaces: number | null; // null = solvent for remaining season
}

const STARTING_BUDGET = 100_000_000;
const TOTAL_RACES = 8;

export function calcTeamKPIs(
  raceHistory: ExtendedRaceResult[],
  currentBudget: number,
  driver: Driver | null,
): TeamKPIs {
  const n = raceHistory.length;

  const totalPrize   = raceHistory.reduce((s, r) => s + r.prizeMoneyEarned, 0);
  const totalSponsor = raceHistory.reduce((s, r) => s + r.sponsorIncome, 0);
  const totalCrash   = raceHistory.reduce((s, r) => s + r.crashLosses, 0);
  const grossRevenue = totalPrize + totalSponsor;
  const netRevenue   = grossRevenue - totalCrash;

  // ROI: current budget vs 100M starting capital
  const netPL = currentBudget - STARTING_BUDGET;
  const roi   = (netPL / STARTING_BUDGET) * 100;

  const revenuePerRace = n > 0 ? grossRevenue / n : 0;
  const crashLossRate  = grossRevenue > 0 ? (totalCrash / grossRevenue) * 100 : 0;

  // Position metrics
  const avgPosition = n > 0
    ? raceHistory.reduce((s, r) => s + r.position, 0) / n
    : 0;

  // Trend: compare last 3 races vs first 3 races (need ≥4 races)
  let positionTrend: TeamKPIs["positionTrend"] = "insufficient_data";
  if (n >= 4) {
    const firstHalf = raceHistory.slice(0, Math.floor(n / 2));
    const lastHalf  = raceHistory.slice(Math.floor(n / 2));
    const avgFirst  = firstHalf.reduce((s, r) => s + r.position, 0) / firstHalf.length;
    const avgLast   = lastHalf.reduce((s, r)  => s + r.position, 0) / lastHalf.length;
    const delta = avgFirst - avgLast; // positive = position number got smaller = improving
    positionTrend = delta > 0.5 ? "improving" : delta < -0.5 ? "declining" : "stable";
  }

  // Rate metrics
  const sponsorHitRate = n > 0
    ? (raceHistory.filter((r) => r.sponsorIncome > 0).length / n) * 100
    : 0;
  const crashRate = n > 0
    ? (raceHistory.filter((r) => r.crashLosses > 0).length / n) * 100
    : 0;
  const dnfRate = n > 0
    ? (raceHistory.filter((r) => r.dnf).length / n) * 100
    : 0;

  // Prize efficiency: actual vs if P1 every race
  const maxPrizePerRace = PRIZE_MONEY[1]; // 50M
  const maxPrize = maxPrizePerRace * n;
  const prizeEfficiency = maxPrize > 0 ? (totalPrize / maxPrize) * 100 : 0;

  // Driver cost payback (in races at current revenue rate)
  const driverCostPaybackRaces = driver && revenuePerRace > 0
    ? driver.cost / revenuePerRace
    : 0;

  // Runway: how many races until bankruptcy at current burn rate
  // burn = capital consumed per race = (starting - current + net_revenue) / n
  const totalCapitalConsumed = STARTING_BUDGET - currentBudget + netRevenue;
  const avgBurnPerRace = n > 0 ? totalCapitalConsumed / n : 0;
  const racesRemaining = TOTAL_RACES - n;
  let runsOutInRaces: number | null = null;
  if (avgBurnPerRace > revenuePerRace && racesRemaining > 0) {
    // Net burn rate per race (consuming more than earning)
    const netBurnPerRace = avgBurnPerRace - revenuePerRace;
    runsOutInRaces = netBurnPerRace > 0
      ? Math.floor(currentBudget / netBurnPerRace)
      : null;
  }

  return {
    roi,
    netPL,
    revenuePerRace,
    crashLossRate,
    totalPrize,
    totalSponsor,
    totalCrash,
    grossRevenue,
    avgPosition,
    positionTrend,
    sponsorHitRate,
    crashRate,
    dnfRate,
    prizeEfficiency,
    driverCostPaybackRaces,
    racesCompleted: n,
    avgBurnPerRace,
    runsOutInRaces,
  };
}
