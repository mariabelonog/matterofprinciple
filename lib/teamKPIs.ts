// teamKPIs.ts — Функция расчёта финансовых и спортивных KPI команды.
// Используется в TeamKPIPanel на экране инвестиций между гонками.

import type { ExtendedRaceResult, Driver } from "@/types/game";
import { PRIZE_MONEY } from "@/lib/simulationEngine";

// Совокупность ключевых показателей эффективности команды за прошедшую часть сезона.
export interface TeamKPIs {
  // --- Прибыльность ---
  roi: number;                    // ROI в % относительно стартового капитала 100M G
  netPL: number;                  // чистая прибыль/убыток: текущий бюджет минус 100M G
  revenuePerRace: number;         // средний доход за гонку (призовые + спонсор)
  crashLossRate: number;          // потери от аварий в % от валового дохода

  // --- Разбивка выручки ---
  totalPrize: number;             // суммарные призовые за все гонки
  totalSponsor: number;           // суммарный спонсорский доход
  totalCrash: number;             // суммарные потери от аварий
  grossRevenue: number;           // валовый доход (призовые + спонсор, без учёта аварий)

  // --- Спортивные показатели ---
  avgPosition: number;            // средняя финишная позиция (меньше = лучше)
  positionTrend: "improving" | "declining" | "stable" | "insufficient_data"; // тенденция улучшения/ухудшения
  sponsorHitRate: number;         // % гонок, в которых сработал спонсорский контракт
  crashRate: number;              // % гонок с аварией
  dnfRate: number;                // % гонок с DNF (сходом автомобиля)

  // --- Эффективность ---
  prizeEfficiency: number;        // реальные призовые / максимально возможные (P1 каждую гонку)
  driverCostPaybackRaces: number; // сколько гонок среднего дохода нужно для окупаемости пилота

  // --- Финансовый запас ---
  racesCompleted: number;         // количество завершённых гонок
  avgBurnPerRace: number;         // средний расход капитала за гонку (инвестиции + потери)
  runsOutInRaces: number | null;  // через сколько гонок закончатся деньги; null = команда в плюсе
}

const STARTING_BUDGET = 100_000_000; // начальный бюджет игрока в G — база для расчёта ROI
const TOTAL_RACES = 8;               // длина сезона; используется для расчёта оставшихся гонок

// Вычисляет все KPI команды на основе истории гонок и текущего бюджета.
export function calcTeamKPIs(
  raceHistory: ExtendedRaceResult[],
  currentBudget: number,
  driver: Driver | null,
): TeamKPIs {
  const n = raceHistory.length; // количество завершённых гонок (0 если сезон только начался)

  // Суммируем все финансовые данные за прошедшие гонки
  const totalPrize   = raceHistory.reduce((s, r) => s + r.prizeMoneyEarned, 0);
  const totalSponsor = raceHistory.reduce((s, r) => s + r.sponsorIncome, 0);
  const totalCrash   = raceHistory.reduce((s, r) => s + r.crashLosses, 0);
  const grossRevenue = totalPrize + totalSponsor; // доход до вычета потерь от аварий
  const netRevenue   = grossRevenue - totalCrash; // чистый доход с гонок

  // ROI: current budget vs 100M starting capital
  const netPL = currentBudget - STARTING_BUDGET;
  const roi   = (netPL / STARTING_BUDGET) * 100;

  const revenuePerRace = n > 0 ? grossRevenue / n : 0;
  const crashLossRate  = grossRevenue > 0 ? (totalCrash / grossRevenue) * 100 : 0;

  // Position metrics
  const avgPosition = n > 0
    ? raceHistory.reduce((s, r) => s + r.position, 0) / n
    : 0;

  // Тренд: сравниваем среднюю позицию в первой и второй половине гонок (нужно минимум 4)
  let positionTrend: TeamKPIs["positionTrend"] = "insufficient_data";
  if (n >= 4) {
    const firstHalf = raceHistory.slice(0, Math.floor(n / 2));
    const lastHalf  = raceHistory.slice(Math.floor(n / 2));
    const avgFirst  = firstHalf.reduce((s, r) => s + r.position, 0) / firstHalf.length;
    const avgLast   = lastHalf.reduce((s, r)  => s + r.position, 0) / lastHalf.length;
    // delta > 0 означает, что позиция в числах стала меньше (лучше), т.е. команда улучшается
    const delta = avgFirst - avgLast;
    // пороговое значение 0.5 фильтрует незначительные колебания
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

  // Эффективность призовых: реально заработано vs максимум при победе в каждой гонке
  const maxPrizePerRace = PRIZE_MONEY[1]; // 50M G — призовые за P1 (максимум)
  const maxPrize = maxPrizePerRace * n;   // теоретический максимум за n гонок
  const prizeEfficiency = maxPrize > 0 ? (totalPrize / maxPrize) * 100 : 0;

  // Driver cost payback (in races at current revenue rate)
  const driverCostPaybackRaces = driver && revenuePerRace > 0
    ? driver.cost / revenuePerRace
    : 0;

  // Финансовый запас: через сколько гонок закончатся деньги при текущем темпе расходов
  // Расход капитала = (стартовый - текущий + чистый доход) / число гонок
  const totalCapitalConsumed = STARTING_BUDGET - currentBudget + netRevenue;
  const avgBurnPerRace = n > 0 ? totalCapitalConsumed / n : 0;
  const racesRemaining = TOTAL_RACES - n; // сколько гонок осталось до конца сезона
  let runsOutInRaces: number | null = null;
  if (avgBurnPerRace > revenuePerRace && racesRemaining > 0) {
    // Чистый расход за гонку (расходы превышают доходы — команда "сжигает" капитал)
    const netBurnPerRace = avgBurnPerRace - revenuePerRace;
    runsOutInRaces = netBurnPerRace > 0
      ? Math.floor(currentBudget / netBurnPerRace) // делим бюджет на чистый расход
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
