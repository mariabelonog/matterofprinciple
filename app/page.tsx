"use client";

import { useState } from "react";
import HeroScreen from "@/components/screens/HeroScreen";
import HowToPlay from "@/components/screens/HowToPlay";
import TeamSetup from "@/components/screens/TeamSetup";
import DriverSelectionScreen from "@/components/screens/DriverSelectionScreen";
import BudgetAllocationScreen from "@/components/screens/BudgetAllocationScreen";
import RaceScreen from "@/components/screens/RaceScreen";
import InvestmentScreen from "@/components/screens/InvestmentScreen";
import FinalSeasonResult from "@/components/screens/FinalSeasonResult";
import Dashboard from "@/components/screens/Dashboard";
import CrisisCard from "@/components/screens/CrisisCard";
import SeasonResult from "@/components/screens/SeasonResult";
import { seasonResult } from "@/data/mockData";
import { INVESTMENT_DIVISORS } from "@/lib/simulation";
import { applyUpgrades, generateRivals, updateRivals } from "@/lib/simulationEngine";
import { RACES } from "@/lib/races";
import type { GameState, Driver, BudgetAllocation, ExtendedRaceResult } from "@/types/game";

type Screen =
  | "hero"
  | "howtoplay"
  | "teamsetup"
  | "driverselection"
  | "budgetallocation"
  | "race"
  | "investment"
  | "seasonresult"
  | "dashboard"
  | "crisis"
  | "result";

const INITIAL_STATE: GameState = {
  teamName: "",
  budget: 100_000_000,
  driver: null,
  carDevelopment: 0,
  staffQuality: 0,
  publicImage: 0,
  riskWillingness: 5,
  currentRace: 1,
  lastCarInvestment: 0,
  previousCarInvestment: 0,
  raceHistory: [],
  seasonSeed: 0,
  carReliability: 10,
  rivals: [],
};

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("hero");
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  // Pending result — stored until user clicks continue, then we navigate
  const [pendingResult, setPendingResult] = useState<ExtendedRaceResult | null>(null);

  function patchState(patch: Partial<GameState>) {
    setGameState((prev) => ({ ...prev, ...patch }));
  }

  function handleTeamConfirm(name: string) {
    patchState({
      teamName: name,
      // Fresh seed each new game; fixed for the whole season so strategies are comparable
      seasonSeed: Date.now() & 0xffffffff,
      rivals: generateRivals(),
    });
    setCurrentScreen("driverselection");
  }

  function handleDriverSelect(driver: Driver) {
    patchState({
      driver,
      budget: gameState.budget - driver.cost,
    });
    setCurrentScreen("budgetallocation");
  }

  function handleBudgetConfirm(alloc: BudgetAllocation) {
    const totalInvested = alloc.carDevelopment + alloc.staffQuality + alloc.publicImage;
    patchState({
      carDevelopment: applyUpgrades(gameState.carDevelopment, alloc.carDevelopment, 0.7, INVESTMENT_DIVISORS.carDevelopment),
      staffQuality:   applyUpgrades(gameState.staffQuality, alloc.staffQuality, 0.7, INVESTMENT_DIVISORS.staffQuality),
      publicImage:    applyUpgrades(gameState.publicImage, alloc.publicImage, 0.7, INVESTMENT_DIVISORS.publicImage),
      budget: gameState.budget - totalInvested,
      lastCarInvestment: alloc.carDevelopment,
      previousCarInvestment: 0,
      currentRace: 1,
    });
    setCurrentScreen("race");
  }

  // Called by RaceScreen when race finishes — applies budget changes, stores result
  function handleRaceComplete(result: ExtendedRaceResult) {
    setGameState((prev) => {
      const newBudget =
        prev.budget + result.prizeMoneyEarned + result.sponsorIncome - result.crashLosses;
      return {
        ...prev,
        budget: newBudget,
        carReliability: result.reliabilityAfter,
        raceHistory: [...prev.raceHistory, { ...result, budgetAfter: newBudget }],
      };
    });
    setPendingResult(result);
  }

  // Called when user clicks "continue" button after reading race result
  function handleRaceContinue() {
    if (!pendingResult) return;

    const newBudget = gameState.budget; // already updated in handleRaceComplete
    const isLastRace = gameState.currentRace >= 8;
    const isBankrupt = newBudget < 0;

    setPendingResult(null);

    if (isBankrupt || isLastRace) {
      setCurrentScreen("seasonresult");
    } else {
      setCurrentScreen("investment");
    }
  }

  function handleInvestmentConfirm(alloc: BudgetAllocation) {
    const totalInvested = alloc.carDevelopment + alloc.staffQuality + alloc.publicImage;
    setGameState((prev) => ({
      ...prev,
      carDevelopment: applyUpgrades(prev.carDevelopment, alloc.carDevelopment, 0.7, INVESTMENT_DIVISORS.carDevelopment),
      staffQuality:   applyUpgrades(prev.staffQuality, alloc.staffQuality, 0.7, INVESTMENT_DIVISORS.staffQuality),
      publicImage:    applyUpgrades(prev.publicImage, alloc.publicImage, 0.7, INVESTMENT_DIVISORS.publicImage),
      budget: prev.budget - totalInvested,
      previousCarInvestment: prev.lastCarInvestment,
      lastCarInvestment: alloc.carDevelopment,
      currentRace: prev.currentRace + 1,
      rivals: updateRivals(prev.rivals),
    }));
    setCurrentScreen("race");
  }

  function handlePlayAgain() {
    setGameState(INITIAL_STATE);
    setPendingResult(null);
    setCurrentScreen("hero");
  }

  // Current race data
  const currentRaceData = RACES[gameState.currentRace - 1] ?? RACES[0];
  // Next city for investment screen
  const nextRaceData = RACES[gameState.currentRace] ?? null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-start relative overflow-hidden">
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-[0.04]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* Pixel grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #dc2626 1px, transparent 1px), linear-gradient(to bottom, #dc2626 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top pixel border strip */}
      <div className="fixed top-0 left-0 w-full flex z-20">
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} className="flex-1 h-3" style={{ backgroundColor: i % 2 === 0 ? "#dc2626" : "#991b1b" }} />
        ))}
      </div>

      {/* Bottom pixel border strip */}
      <div className="fixed bottom-0 left-0 w-full flex z-20">
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} className="flex-1 h-3" style={{ backgroundColor: i % 2 === 0 ? "#991b1b" : "#dc2626" }} />
        ))}
      </div>

      {/* Screen content */}
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
          // key prop forces remount between races so sponsor roll and phase reset
          <div key={`race-${gameState.currentRace}`}>
            <RaceScreen
              race={currentRaceData}
              state={gameState}
              onStateChange={patchState}
              onRaceComplete={handleRaceComplete}
              onContinue={handleRaceContinue}
            />
          </div>
        )}

        {currentScreen === "investment" && nextRaceData && (
          <InvestmentScreen
            raceNumber={gameState.currentRace}
            nextCity={nextRaceData.city}
            budget={gameState.budget}
            currentCarDev={gameState.carDevelopment}
            currentStaff={gameState.staffQuality}
            currentImage={gameState.publicImage}
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

        {/* Legacy screens kept for compat */}
        {currentScreen === "dashboard" && (
          <Dashboard
            teamName={gameState.teamName}
            onCrisisEvent={() => setCurrentScreen("crisis")}
            onEndSeason={() => setCurrentScreen("result")}
          />
        )}

        {currentScreen === "crisis" && (
          <CrisisCard onChoice={() => setCurrentScreen("dashboard")} />
        )}

        {currentScreen === "result" && (
          <SeasonResult
            result={seasonResult}
            onRestart={() => setCurrentScreen("hero")}
            onNextSeason={() => setCurrentScreen("hero")}
          />
        )}
      </div>
    </main>
  );
}
