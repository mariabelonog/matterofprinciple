"use client";

import { useState } from "react";
import HeroScreen from "@/components/screens/HeroScreen";
import HowToPlay from "@/components/screens/HowToPlay";
import Dashboard from "@/components/screens/Dashboard";
import CrisisCard from "@/components/screens/CrisisCard";
import SeasonResult from "@/components/screens/SeasonResult";
import { seasonResult } from "@/data/mockData";

type Screen = "hero" | "howtoplay" | "dashboard" | "crisis" | "result";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("hero");

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
            onStart={() => setCurrentScreen("dashboard")}
            onHowToPlay={() => setCurrentScreen("howtoplay")}
          />
        )}

        {currentScreen === "howtoplay" && (
          <HowToPlay onBack={() => setCurrentScreen("hero")} />
        )}

        {currentScreen === "dashboard" && (
          <Dashboard
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
