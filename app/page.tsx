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
import { INVESTMENT_DIVISORS } from "@/lib/simulation";
import { applyUpgrades, generateRivals, updateRivals } from "@/lib/simulationEngine";
import { RACES } from "@/lib/races";
import type { GameState, Driver, BudgetAllocation, ExtendedRaceResult } from "@/types/game";

// All screens reachable during a real playthrough
type Screen =
  | "hero"
  | "howtoplay"
  | "teamsetup"
  | "driverselection"
  | "budgetallocation"
  | "race"
  | "investment"
  | "seasonresult";

// Starting values for a fresh game session
const INITIAL_STATE: GameState = {
  teamName: "",
  budget: 100_000_000,    // 100 M Geld starting capital
  driver: null,
  carDevelopment: 0,       // indices run 0–10; start at zero, built via investment
  staffQuality: 0,
  publicImage: 0,
  riskWillingness: 5,      // mid-point default; player adjusts each race
  currentRace: 1,
  lastCarInvestment: 0,    // used by crash-loss formula: losses scale with recent car spend
  previousCarInvestment: 0,
  raceHistory: [],
  seasonSeed: 0,           // seeded PRNG; set once at team-confirm so strategies are reproducible
  carReliability: 10,      // degrades with high risk; affects crash probability
  rivals: [],
};

// Shared helper: convert a BudgetAllocation into updated index values and deduct spend.
// Used identically by pre-season allocation and between-race investment.
function applyAllInvestments(
  state: Pick<GameState, "carDevelopment" | "staffQuality" | "publicImage" | "budget">,
  alloc: BudgetAllocation
) {
  const totalInvested = alloc.carDevelopment + alloc.staffQuality + alloc.publicImage;
  return {
    carDevelopment: applyUpgrades(state.carDevelopment, alloc.carDevelopment, 0.7, INVESTMENT_DIVISORS.carDevelopment),
    staffQuality:   applyUpgrades(state.staffQuality,   alloc.staffQuality,   0.7, INVESTMENT_DIVISORS.staffQuality),
    publicImage:    applyUpgrades(state.publicImage,    alloc.publicImage,    0.7, INVESTMENT_DIVISORS.publicImage),
    budget: state.budget - totalInvested,
  };
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("hero");
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  // Holds race result between handleRaceComplete and handleRaceContinue so the
  // result screen can display it before we advance to the investment/season screen.
  const [pendingResult, setPendingResult] = useState<ExtendedRaceResult | null>(null);

  // Shallow-merge a partial update into gameState without replacing unchanged fields
  function patchState(patch: Partial<GameState>) {
    setGameState((prev) => ({ ...prev, ...patch }));
  }

  function handleTeamConfirm(name: string) {
    patchState({
      teamName: name,
      // Seed is fixed for the whole season so the same strategy always gives the same result
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

  // Pre-season one-time investment in car, staff, and public image
  function handleBudgetConfirm(alloc: BudgetAllocation) {
    patchState({
      ...applyAllInvestments(gameState, alloc),
      lastCarInvestment: alloc.carDevelopment,
      previousCarInvestment: 0,
      currentRace: 1,
    });
    setCurrentScreen("race");
  }

  // Called by RaceScreen when the simulation finishes — applies financial outcomes and stores result
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

  // Called when the player clicks "continue" after reading the race result
  function handleRaceContinue() {
    if (!pendingResult) return;
    setPendingResult(null);

    // budget was already updated inside handleRaceComplete via setGameState
    const isBankrupt = gameState.budget < 0;
    const isLastRace  = gameState.currentRace >= 8;

    if (isBankrupt || isLastRace) {
      setCurrentScreen("seasonresult");
    } else {
      setCurrentScreen("investment");
    }
  }

  // Between-race investment; also advances the race counter and evolves rival teams
  function handleInvestmentConfirm(alloc: BudgetAllocation) {
    setGameState((prev) => ({
      ...prev,
      ...applyAllInvestments(prev, alloc),
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

  // RACES is 0-indexed; currentRace is 1-indexed
  const currentRaceData = RACES[gameState.currentRace - 1] ?? RACES[0];
  // null when we're on the final race (no next city to show in the investment screen)
  const nextRaceData = RACES[gameState.currentRace] ?? null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-start relative overflow-hidden">
      {/* Scanline overlay — subtle horizontal lines for retro CRT feel */}
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

      {/* Top pixel border strip — alternating red squares via CSS gradient */}
      <div
        className="fixed top-0 left-0 w-full h-3 z-20"
        style={{
          backgroundImage: "repeating-linear-gradient(to right, #dc2626 0px, #dc2626 50%, #991b1b 50%, #991b1b 100%)",
          backgroundSize: "calc(100% / 64 * 2) 100%",
        }}
      />

      {/* Bottom pixel border strip */}
      <div
        className="fixed bottom-0 left-0 w-full h-3 z-20"
        style={{
          backgroundImage: "repeating-linear-gradient(to right, #991b1b 0px, #991b1b 50%, #dc2626 50%, #dc2626 100%)",
          backgroundSize: "calc(100% / 64 * 2) 100%",
        }}
      />

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
          // key forces RaceScreen to fully remount between races,
          // resetting sponsor roll and phase state to their initial values
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
