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

// Mulberry32 — быстрый ГПСЧ с фиксированным зерном, возвращает числа в диапазоне [0, 1).
// Алгоритм использует побитовые операции и целочисленное умножение для высокого качества случайности.
// 0x6d2b79f5 — константа смешивания (mixing constant), характерная для этого алгоритма.
// >>> 0 приводит число к беззнаковому 32-битному целому, гарантируя корректность операций.
// 4294967296 = 2^32 — делитель для нормализации результата в [0, 1).
function mulberry32(seed: number): () => number {
  let s = seed >>> 0; // инициализируем состояние как беззнаковое 32-битное число
  return () => {
    s += 0x6d2b79f5;                              // шаг инкремента состояния
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);         // первое перемешивание битов
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);    // второе перемешивание битов
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296; // финальная нормализация в [0, 1)
  };
}

// ─── Prize money ─────────────────────────────────────────────────────────────

// Таблица призовых выплат в G по финишным позициям (1 = победа).
// P1 приносит 50M G, P10 — 1M G; всегда выплачивается хотя бы минимум.
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

// Шаблоны 9 соперников — вымышленные команды с именами из греческой мифологии.
// reliability не включена в шаблон и добавляется единым значением в generateRivals().
const RIVAL_TEMPLATES: Omit<Rival, "reliability">[] = [
  { id: "achilles",   teamName: "Achilles Racing",       basePerformance: 4.1, developmentRate: 0.08, budget: 200_000_000 },
  { id: "hector",     teamName: "Hector Motorsport",     basePerformance: 3.6, developmentRate: 0.15, budget: 120_000_000 },
  { id: "odysseus",   teamName: "Odysseus Grand Prix",   basePerformance: 3.3, developmentRate: 0.18, budget: 100_000_000 },
  { id: "ajax",       teamName: "Ajax Speed Works",      basePerformance: 3.9, developmentRate: 0.10, budget: 150_000_000 },
  { id: "diomedes",   teamName: "Diomedes Auto",         basePerformance: 3.2, developmentRate: 0.20, budget:  85_000_000 },
  { id: "patroclus",  teamName: "Patroclus Racing",      basePerformance: 2.9, developmentRate: 0.22, budget:  80_000_000 },
  { id: "menelaus",   teamName: "Menelaus Motorsport",   basePerformance: 3.0, developmentRate: 0.12, budget:  90_000_000 },
  { id: "agamemnon",  teamName: "Agamemnon Works",       basePerformance: 2.6, developmentRate: 0.25, budget:  70_000_000 },
  { id: "paris",      teamName: "Paris Écurie",          basePerformance: 2.5, developmentRate: 0.30, budget:  65_000_000 },
];

// Создаёт 9 команд-соперников в начале сезона с единой начальной надёжностью 8.5.
export function generateRivals(): Rival[] {
  return RIVAL_TEMPLATES.map((t) => ({ ...t, reliability: 8.5 })); // 8.5 — высокая надёжность в начале сезона
}

// ─── Race simulation ─────────────────────────────────────────────────────────

// Результат одного соперника в гонке.
export interface RivalRaceResult {
  rivalId: string;   // уникальный id для связи с объектом Rival
  teamName: string;  // отображаемое название команды
  score: number;     // числовой счёт; -1 означает DNF (сход с гонки)
  dnf: boolean;      // true если соперник сошёл с трассы
}

// Полный вывод функции simulateRace — все данные для обновления состояния игры.
export interface SimulateRaceOutput {
  playerScore: number;           // итоговый счёт игрока
  playerDnf: boolean;            // сошёл ли игрок с гонки
  rivalResults: RivalRaceResult[]; // результаты всех 9 соперников
  position: number;              // финишная позиция игрока: 1–10
  prizeMoneyEarned: number;      // призовые деньги по позиции
  sponsorIncome: number;         // доход от спонсора (0 если не сработал)
  crashLosses: number;           // потери от аварии в G
  carPerformance: number;        // компонент производительности автомобиля
  strategy: number;              // компонент стратегии
  driverInput: number;           // компонент вклада пилота
  reliabilityAfter: number;      // надёжность автомобиля после гонки
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

  // Пространство имён ГПСЧ для этой гонки: seed + round * 7919 (простое число для распределения)
  const rng = mulberry32(state.seasonSeed + race.round * 7919);

  // Вычисляем компоненты производительности игрока
  const carPerformance = calcCarPerformance(state.carDevelopment, state.staffQuality);
  const strategy = calcStrategy(state.staffQuality, effectiveRisk);
  const driverInput = calcDriverInput(
    Math.min(10, state.driver.driverIndex + driverBoost), // кризисный буст не превышает максимум 10
    effectiveRisk,
  );
  const playerScore = calcRaceScore(carPerformance, driverInput, strategy, driverWeight);

  // Вероятность DNF: низкая надёжность + высокий риск = больше шансов сойти
  // Формула: ((10 - reliability) / 20) * (risk / 10)
  const dnfProb = ((10 - state.carReliability) / 20) * (effectiveRisk / 10);
  const playerDnf = rng() < dnfProb; // вызов ГПСЧ #1

  // Надёжность снижается от механического стресса: базово 0.15 + 0.04 за единицу риска
  const reliabilityAfter = Math.max(0, state.carReliability - (0.15 + effectiveRisk * 0.04));

  // Результаты соперников с зашумлёнными баллами (детерминированы ГПСЧ)
  const rivalResults: RivalRaceResult[] = state.rivals.map((rival) => {
    const developmentGain = rival.developmentRate * (race.round - 1); // накопленный прогресс за сезон
    const noise = (rng() - 0.5) * 0.8; // шум ±0.4; вызовы #2, 4, 6… (нечётные)
    const score = Math.max(0, rival.basePerformance + developmentGain + noise); // не ниже нуля
    const rivalDnf = rng() < (10 - rival.reliability) / 25; // вызовы #3, 5, 7… (чётные)
    return {
      rivalId: rival.id,
      teamName: rival.teamName,
      score: rivalDnf ? -1 : score, // -1 означает DNF в таблице результатов
      dnf: rivalDnf,
    };
  });

  // Позиция: DNF-игрок получает -1, что всегда хуже любого соперника
  const effectiveScore = playerDnf ? -1 : playerScore;
  // Math.min(10, ...) ограничивает позицию максимумом 10 участников
  const position = Math.min(10, rivalResults.filter((r) => r.score > effectiveScore).length + 1);
  const prizeMoneyEarned = PRIZE_MONEY[position] ?? 1_000_000; // fallback на минимум при неизвестной позиции

  // Спонсор рассчитывается в своём пространстве имён (+1_000_000), не смешиваясь с гонкой
  const { income: sponsorIncome } = rollSponsorSeeded(state.seasonSeed, race.round, state.publicImage);

  // Авария пропускается если игрок уже сошёл — машина и так уничтожена
  const crashDidHappen = !playerDnf && rng() < effectiveRisk / 20; // вызов ГПСЧ #20
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
    const spend = rival.budget * 0.1; // соперник тратит 10% бюджета на развитие после каждой гонки
    return {
      ...rival,
      budget: rival.budget - spend,
      reliability: Math.max(5, rival.reliability - 0.1), // надёжность не опускается ниже 5
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
