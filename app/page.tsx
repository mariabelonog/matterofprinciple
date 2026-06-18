"use client";

// page.tsx — корневой компонент-оркестратор игры.
// Управляет глобальным GameState, переключает экраны и связывает все фазы:
// hero → teamsetup → driverselection → budgetallocation → race (×8) → seasonresult.
// Между гонками вставляется экран investment; при банкротстве — досрочный seasonresult.

import { useState } from "react";
import HeroScreen from "@/components/screens/HeroScreen";
import HowToPlay from "@/components/screens/HowToPlay";
import TeamSetup from "@/components/screens/TeamSetup";
import DriverSelectionScreen from "@/components/screens/DriverSelectionScreen";
import BudgetAllocationScreen from "@/components/screens/BudgetAllocationScreen";
import RaceScreen from "@/components/screens/RaceScreen";
import InvestmentScreen from "@/components/screens/InvestmentScreen";
import FinalSeasonResult from "@/components/screens/FinalSeasonResult";
import { INVESTMENT_DIVISORS } from "@/lib/simulation";
import { applyUpgrades, generateRivals, updateRivals } from "@/lib/simulationEngine";
import { RACES } from "@/lib/races";
import type { GameState, Driver, BudgetAllocation, ExtendedRaceResult } from "@/types/game";

// Идентификаторы всех экранов, достижимых в реальном прохождении.
type Screen =
  | "hero"
  | "howtoplay"
  | "teamsetup"
  | "driverselection"
  | "budgetallocation"
  | "race"
  | "investment"
  | "seasonresult";

// Начальное состояние игры: нет команды, нет пилота, нулевые индексы, бюджет 100M.
// seasonSeed = 0 до старта; реальный сид устанавливается в handleTeamConfirm.
const INITIAL_STATE: GameState = {
  teamName: "",
  budget: 100_000_000,    // стартовый капитал 100M Geld
  driver: null,
  carDevelopment: 0,       // индексы в диапазоне 0–10; начинают с нуля, растут через инвестиции
  staffQuality: 0,
  publicImage: 0,
  riskWillingness: 5,      // среднее значение по умолчанию; игрок меняет перед каждой гонкой
  currentRace: 1,
  lastCarInvestment: 0,    // используется в формуле потерь от аварии: убытки = % от последних инвестиций
  previousCarInvestment: 0,
  raceHistory: [],
  seasonSeed: 0,           // сид PRNG; фиксируется раз в начале сезона для воспроизводимости
  carReliability: 10,      // деградирует при высоком риске; влияет на вероятность поломки
  rivals: [],
};

// Общий помощник: применяет BudgetAllocation к трём индексам с убывающей отдачей (alpha=0.7).
// Используется одинаково как при предсезонном распределении, так и между гонками.
function applyAllInvestments(
  state: Pick<GameState, "carDevelopment" | "staffQuality" | "publicImage" | "budget">,
  alloc: BudgetAllocation
) {
  const totalInvested = alloc.carDevelopment + alloc.staffQuality + alloc.publicImage;
  return {
    carDevelopment: applyUpgrades(state.carDevelopment, alloc.carDevelopment, 0.7, INVESTMENT_DIVISORS.carDevelopment),
    staffQuality:   applyUpgrades(state.staffQuality,   alloc.staffQuality,   0.7, INVESTMENT_DIVISORS.staffQuality),
    publicImage:    applyUpgrades(state.publicImage,    alloc.publicImage,    0.7, INVESTMENT_DIVISORS.publicImage),
    budget: state.budget - totalInvested, // списываем суммарные инвестиции с бюджета
  };
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("hero"); // текущий активный экран
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE); // полное состояние игры
  // Результат гонки хранится здесь между handleRaceComplete и handleRaceContinue,
  // чтобы экран результата мог отобразить его до перехода к следующему экрану.
  const [pendingResult, setPendingResult] = useState<ExtendedRaceResult | null>(null);

  // Shallow-merge: обновляет произвольный набор полей GameState без замены остальных.
  function patchState(patch: Partial<GameState>) {
    setGameState((prev) => ({ ...prev, ...patch }));
  }

  function handleTeamConfirm(name: string) {
    patchState({
      teamName: name,
      // Сид фиксируется на весь сезон: одна и та же стратегия всегда даёт одинаковый результат
      seasonSeed: Date.now() & 0xffffffff, // 32-битный timestamp как сид PRNG
      rivals: generateRivals(),
    });
    setCurrentScreen("driverselection");
  }

  // Списывает стоимость пилота с бюджета и переходит к распределению бюджета.
  function handleDriverSelect(driver: Driver) {
    patchState({
      driver,
      budget: gameState.budget - driver.cost, // стоимость пилота вычитается немедленно
    });
    setCurrentScreen("budgetallocation");
  }

  // Применяет предсезонные инвестиции с формулой убывающей отдачи (alpha=0.7).
  function handleBudgetConfirm(alloc: BudgetAllocation) {
    patchState({
      ...applyAllInvestments(gameState, alloc),
      lastCarInvestment: alloc.carDevelopment,
      previousCarInvestment: 0, // предыдущих инвестиций нет до первой гонки
      currentRace: 1,
    });
    setCurrentScreen("race");
  }

  // Вызывается RaceScreen когда симуляция завершена — применяет финансовые итоги и сохраняет результат.
  function handleRaceComplete(result: ExtendedRaceResult) {
    setGameState((prev) => {
      const newBudget = prev.budget + result.prizeMoneyEarned + result.sponsorIncome - result.crashLosses;
      return {
        ...prev,
        budget: newBudget,
        carReliability: result.reliabilityAfter,
        raceHistory: [...prev.raceHistory, { ...result, budgetAfter: newBudget }],
      };
    });
    setPendingResult(result);
  }

  // Вызывается по кнопке "continue" на экране результата гонки.
  // Определяет следующий экран: банкротство/финальная гонка → seasonresult, иначе → investment.
  function handleRaceContinue() {
    if (!pendingResult) return;
    setPendingResult(null);

    // Бюджет уже обновлён внутри handleRaceComplete через setGameState
    const isBankrupt = gameState.budget < 0;  // отрицательный бюджет = банкротство
    const isLastRace  = gameState.currentRace >= 8; // 8-я гонка — последняя в сезоне

    if (isBankrupt || isLastRace) {
      setCurrentScreen("seasonresult");
    } else {
      setCurrentScreen("investment");
    }
  }

  // Применяет межгоночные инвестиции, продвигает счётчик гонок и обновляет соперников.
  function handleInvestmentConfirm(alloc: BudgetAllocation) {
    setGameState((prev) => ({
      ...prev,
      ...applyAllInvestments(prev, alloc),
      previousCarInvestment: prev.lastCarInvestment, // сдвигаем историю инвестиций
      lastCarInvestment: alloc.carDevelopment,
      currentRace: prev.currentRace + 1, // переход к следующей гонке
      rivals: updateRivals(prev.rivals),  // соперники тоже развиваются между гонками
    }));
    setCurrentScreen("race");
  }

  // Сбрасывает всё состояние до начального и возвращает на стартовый экран.
  function handlePlayAgain() {
    setGameState(INITIAL_STATE);
    setPendingResult(null);
    setCurrentScreen("hero");
  }

  // RACES индексируется с 0; currentRace начинается с 1
  const currentRaceData = RACES[gameState.currentRace - 1] ?? RACES[0];
  // null на последней гонке (нет следующего города для InvestmentScreen)
  const nextRaceData = RACES[gameState.currentRace] ?? null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-start relative overflow-hidden">
      {/* Scanline overlay — горизонтальные полосы для CRT-эффекта */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-[0.04]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* Pixel grid background — пиксельная сетка фона */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #dc2626 1px, transparent 1px), linear-gradient(to bottom, #dc2626 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Верхняя пиксельная полоса — чередующиеся красные квадраты через CSS-градиент */}
      <div
        className="fixed top-0 left-0 w-full h-3 z-20"
        style={{
          backgroundImage: "repeating-linear-gradient(to right, #dc2626 0px, #dc2626 50%, #991b1b 50%, #991b1b 100%)",
          backgroundSize: "calc(100% / 64 * 2) 100%",
        }}
      />

      {/* Нижняя пиксельная полоса — инвертированные цвета относительно верхней */}
      <div
        className="fixed bottom-0 left-0 w-full h-3 z-20"
        style={{
          backgroundImage: "repeating-linear-gradient(to right, #991b1b 0px, #991b1b 50%, #dc2626 50%, #dc2626 100%)",
          backgroundSize: "calc(100% / 64 * 2) 100%",
        }}
      />

      {/* Screen content — контент текущего экрана */}
      <div className="w-full pt-4 pb-6 flex flex-col items-center">
        {currentScreen === "hero" && (
          <HeroScreen
            onStart={() => setCurrentScreen("teamsetup")}
            onHowToPlay={() => setCurrentScreen("howtoplay")}
          />
        )}

        {currentScreen === "howtoplay" && (
          <HowToPlay onBack={() => setCurrentScreen("hero")} />
        )}

        {currentScreen === "teamsetup" && (
          <TeamSetup onConfirm={handleTeamConfirm} />
        )}

        {currentScreen === "driverselection" && (
          <DriverSelectionScreen
            budget={gameState.budget}
            onSelect={handleDriverSelect}
          />
        )}

        {currentScreen === "budgetallocation" && (
          <BudgetAllocationScreen
            budget={gameState.budget}
            onConfirm={handleBudgetConfirm}
          />
        )}

        {currentScreen === "race" && (
          // key принудительно ремаунтирует RaceScreen между гонками,
          // сбрасывая бросок спонсора и фазу к начальным значениям
          <RaceScreen
            key={`race-${gameState.currentRace}`}
            race={currentRaceData}
            state={gameState}
            onStateChange={patchState}
            onRaceComplete={handleRaceComplete}
            onContinue={handleRaceContinue}
          />
        )}

        {currentScreen === "investment" && nextRaceData && (
          <InvestmentScreen
            raceNumber={gameState.currentRace}
            nextCity={nextRaceData.city}
            budget={gameState.budget}
            currentCarDev={gameState.carDevelopment}
            currentStaff={gameState.staffQuality}
            currentImage={gameState.publicImage}
            raceHistory={gameState.raceHistory}
            driver={gameState.driver}
            onConfirm={handleInvestmentConfirm}
          />
        )}

        {currentScreen === "seasonresult" && (
          <FinalSeasonResult
            state={gameState}
            raceHistory={gameState.raceHistory}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>
    </main>
  );
}
