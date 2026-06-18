"use client";

import { useState } from "react";
import type { BudgetAllocation, ExtendedRaceResult, Driver } from "@/types/game";
import { applyInvestment, INVESTMENT_DIVISORS } from "@/lib/simulation";
import TeamKPIPanel from "@/components/ui/TeamKPIPanel";

interface Props {
  raceNumber: number;
  nextCity: string;
  budget: number;
  currentCarDev: number;
  currentStaff: number;
  currentImage: number;
  raceHistory: ExtendedRaceResult[];
  driver: Driver | null;
  onConfirm: (alloc: BudgetAllocation) => void;
}

function parseM(s: string): number {
  const n = parseInt(s.replace(/\D/g, ""), 10);
  return isNaN(n) ? 0 : n;
}

interface AllocInputProps {
  label: string;
  description: string;
  raw: string;
  onRawChange: (v: string) => void;
  currentIndex: number;
  newIndex: number;
  maxM: number;
}

function AllocInput({ label, description, raw, onRawChange, currentIndex, newIndex, maxM }: AllocInputProps) {
  const indexColor = newIndex >= 7 ? "#22c55e" : newIndex >= 4 ? "#f59e0b" : "#dc2626";
  const pct = (newIndex / 10) * 100;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    const clean = digits === "" ? "" : String(parseInt(digits, 10));
    onRawChange(clean);
  }

  return (
    <div
      className="w-full p-5 flex flex-col gap-3"
      style={{ border: "3px solid #374151", boxShadow: "4px 4px 0px #111827", backgroundColor: "#111111" }}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-amber-400 text-[14px] tracking-widest uppercase" style={{ fontFamily: "var(--font-pixel), monospace" }}>
          ■ {label}
        </span>
      </div>
      <p className="text-gray-500 text-[13px] font-mono">{description}</p>

      <div className="flex items-center gap-3">
        <input
          type="text"
          inputMode="numeric"
          value={raw}
          placeholder="0"
          onChange={handleChange}
          className="w-28 bg-[#0a0a0a] text-white text-[15px] font-mono px-3 py-2 outline-none"
          style={{ border: "3px solid #4b5563", boxShadow: "inset 2px 2px 0px #000" }}
        />
        <span className="text-gray-400 text-[13px] font-mono">M G</span>
        <span className="text-gray-600 text-[13px] font-mono">(max {maxM.toFixed(0)}M G)</span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-mono text-gray-600">INDEX</span>
          <span className="text-[13px] font-mono" style={{ color: indexColor }}>
            {currentIndex.toFixed(1)} → {newIndex.toFixed(2)}
          </span>
        </div>
        <div className="w-full h-2 bg-[#1a1a1a]" style={{ border: "1px solid #333" }}>
          <div style={{ width: `${pct}%`, backgroundColor: indexColor, height: "100%", transition: "width 0.2s" }} />
        </div>
      </div>
    </div>
  );
}

export default function InvestmentScreen({
  raceNumber,
  nextCity,
  budget,
  currentCarDev,
  currentStaff,
  currentImage,
  raceHistory,
  driver,
  onConfirm,
}: Props) {
  const [carDevRaw, setCarDevRaw] = useState("");
  const [staffRaw, setStaffRaw] = useState("");
  const [imageRaw, setImageRaw] = useState("");

  const carDevM = parseM(carDevRaw);
  const staffM = parseM(staffRaw);
  const imageM = parseM(imageRaw);

  const totalAllocatedM = carDevM + staffM + imageM;
  const budgetM = budget / 1_000_000;
  const remainingM = budgetM - totalAllocatedM;
  const isOverspending = totalAllocatedM > budgetM;

  const newCarDev = applyInvestment(currentCarDev, carDevM * 1_000_000, INVESTMENT_DIVISORS.carDevelopment);
  const newStaff  = applyInvestment(currentStaff,  staffM  * 1_000_000, INVESTMENT_DIVISORS.staffQuality);
  const newImage  = applyInvestment(currentImage,  imageM  * 1_000_000, INVESTMENT_DIVISORS.publicImage);

  function handleConfirm() {
    if (isOverspending) return;
    onConfirm({
      carDevelopment: carDevM * 1_000_000,
      staffQuality:   staffM  * 1_000_000,
      publicImage:    imageM  * 1_000_000,
    });
  }

  return (
    <div className="relative z-20 px-6 max-w-2xl mx-auto flex flex-col items-center gap-8 py-16 w-full">
      {/* Header */}
      <div
        className="px-4 py-2 text-red-400 text-[17px] tracking-widest uppercase text-center"
        style={{ fontFamily: "var(--font-pixel), monospace", border: "3px solid #dc2626", boxShadow: "4px 4px 0px #7f1d1d", backgroundColor: "#1c0a0a" }}
      >
        ▶ RACE {raceNumber} COMPLETE — INVEST BEFORE {nextCity.toUpperCase()}
      </div>

      {/* Available budget */}
      <div
        className="w-full p-4 flex items-center justify-between gap-4 flex-wrap"
        style={{ border: "3px solid #374151", boxShadow: "4px 4px 0px #111827", backgroundColor: "#111111" }}
      >
        <span className="text-gray-400 text-[13px] font-mono tracking-widest uppercase">AVAILABLE</span>
        <div className="flex items-center gap-6">
          <span className="text-white text-[15px] font-mono">{budgetM.toFixed(1)}M G</span>
          <span className="text-gray-600 font-mono">→</span>
          <span className="text-[15px] font-mono font-bold" style={{ color: isOverspending ? "#dc2626" : "#22c55e" }}>
            {remainingM.toFixed(1)}M G reserve
          </span>
        </div>
      </div>

      {isOverspending && (
        <div className="w-full p-3 text-center" style={{ border: "3px solid #dc2626", backgroundColor: "#1c0a0a" }}>
          <span className="text-red-400 text-[13px] tracking-widest" style={{ fontFamily: "var(--font-pixel), monospace" }}>
            OVERSPENDING BY {(totalAllocatedM - budgetM).toFixed(1)}M G
          </span>
        </div>
      )}

      <AllocInput
        label="CAR DEVELOPMENT"
        description="Remember that the result depends mostly on a car. Build a rocketship."
        raw={carDevRaw}
        onRawChange={setCarDevRaw}
        currentIndex={currentCarDev}
        newIndex={newCarDev}
        maxM={budgetM}
      />

      <AllocInput
        label="STAFF QUALITY"
        description="Staff quality is how you build a car and how you strategize during a race. Never neglect!"
        raw={staffRaw}
        onRawChange={setStaffRaw}
        currentIndex={currentStaff}
        newIndex={newStaff}
        maxM={budgetM}
      />

      <AllocInput
        label="PUBLIC IMAGE"
        description="You are broke and need money. So invest in some tiktok challenges for sponsors to like you."
        raw={imageRaw}
        onRawChange={setImageRaw}
        currentIndex={currentImage}
        newIndex={newImage}
        maxM={budgetM}
      />

      {/* Team KPI panel — collapsible, available after first race */}
      <TeamKPIPanel
        raceHistory={raceHistory}
        currentBudget={budget}
        driver={driver}
      />

      <p className="text-gray-600 text-[13px] font-mono text-center">
        Unspent budget remains as financial reserve.
      </p>

      <button
        onClick={handleConfirm}
        disabled={isOverspending}
        className="w-full py-4 text-white text-[14px] tracking-widest uppercase transition-colors duration-100 cursor-pointer active:translate-y-[2px] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          fontFamily: "var(--font-pixel), monospace",
          backgroundColor: isOverspending ? "#333" : "#dc2626",
          border: `3px solid ${isOverspending ? "#555" : "#f87171"}`,
          boxShadow: isOverspending ? "4px 4px 0px #222" : "4px 4px 0px #7f1d1d",
        }}
        type="button"
      >
        ▶ CONTINUE TO {nextCity.toUpperCase()} →
      </button>
    </div>
  );
}
