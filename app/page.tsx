"use client";

import { useState } from "react";
import HeroScreen from "@/components/screens/HeroScreen";
import HowToPlay from "@/components/screens/HowToPlay";
import TeamSetup from "@/components/screens/TeamSetup";
import DriverSelectionScreen from "@/components/screens/DriverSelectionScreen";
import BudgetAllocationScreen from "@/components/screens/BudgetAllocationScreen";
import ParisRaceScreen from "@/components/screens/ParisRaceScreen";
import Dashboard from "@/components/screens/Dashboard";
import CrisisCard from "@/components/screens/CrisisCard";
import SeasonResult from "@/components/screens/SeasonResult";
import { seasonResult } from "@/data/mockData";
import { applyInvestment, INVESTMENT_DIVISORS } from "@/src/lib/simulation";
import type { GameState, Driver, BudgetAllocation } from "@/src/types/game";

type Screen =
  | "hero"
  | "howtoplay"
  | "teamsetup"
  | "driverselection"
  | "budgetallocation"
  | "parisrace"
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
};

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("hero");
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  function patchState(patch: Partial<GameState>) {
    setGameState((prev) => ({ ...prev, ...patch }));
  }

  function handleTeamConfirm(name: string) {
    patchState({ teamName: name });
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
      carDevelopment: applyInvestment(gameState.carDevelopment, alloc.carDevelopment, INVESTMENT_DIVISORS.carDevelopment),
      staffQuality: applyInvestment(gameState.staffQuality, alloc.staffQuality, INVESTMENT_DIVISORS.staffQuality),
      publicImage: applyInvestment(gameState.publicImage, alloc.publicImage, INVESTMENT_DIVISORS.publicImage),
      budget: gameState.budget - totalInvested,
    });
    setCurrentScreen("parisrace");
  }

  return (
    <main
      className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-start relative overflow-hidden"
    >
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)",
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
          <div
            key={i}
            className="flex-1 h-3"
            style={{ backgroundColor: i % 2 === 0 ? "#dc2626" : "#991b1b" }}
          />
        ))}
      </div>

      {/* Bottom pixel border strip */}
      <div className="fixed bottom-0 left-0 w-full flex z-20">
        {Array.from({ length: 64 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-3"
            style={{ backgroundColor: i % 2 === 0 ? "#991b1b" : "#dc2626" }}
          />
        ))}
      </div>

      {/* Screen content — padded clear of top/bottom strips */}
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

        {currentScreen === "parisrace" && (
          <ParisRaceScreen
            state={gameState}
            onStateChange={patchState}
            onContinue={() => setCurrentScreen("hero")}
          />
        )}

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
