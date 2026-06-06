"use client";

import { useState } from "react";
import type { BudgetAllocation } from "@/src/types/game";
import { applyInvestment } from "@/src/lib/simulation";

interface Props {
  budget: number;
  onConfirm: (alloc: BudgetAllocation) => void;
}

function formatG(n: number): string {
  return (n / 1_000_000).toFixed(1) + "M G";
}

interface AllocInputProps {
  label: string;
  description: string;
  formula: string;
  valueM: number;
  onChange: (v: number) => void;
  currentIndex: number;
  newIndex: number;
  maxM: number;
}

function AllocInput({ label, description, formula, valueM, onChange, currentIndex, newIndex, maxM }: AllocInputProps) {
  const indexColor = newIndex >= 7 ? "#22c55e" : newIndex >= 4 ? "#f59e0b" : "#dc2626";
  const pct = (newIndex / 10) * 100;

  return (
    <div
      className="w-full p-5 flex flex-col gap-3"
      style={{
        border: "3px solid #374151",
        boxShadow: "4px 4px 0px #111827",
        backgroundColor: "#111111",
      }}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span
          className="text-amber-400 text-[14px] tracking-widest uppercase"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          ■ {label}
        </span>
        <span className="text-[13px] font-mono text-gray-500">{formula}</span>
      </div>

      <p className="text-gray-500 text-[13px] font-mono">{description}</p>

      <div className="flex items-center gap-3">
        <input
          type="number"
          min={0}
          max={maxM}
          step={1}
          value={valueM}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          className="w-28 bg-[#0a0a0a] text-white text-[15px] font-mono px-3 py-2 outline-none"
          style={{
            border: "3px solid #4b5563",
            boxShadow: "inset 2px 2px 0px #000",
          }}
        />
        <span className="text-gray-400 text-[13px] font-mono">M G</span>
      </div>

      {/* Index bar showing result */}
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

export default function BudgetAllocationScreen({ budget, onConfirm }: Props) {
  const [carDevM, setCarDevM] = useState(0);
  const [staffM, setStaffM] = useState(0);
  const [imageM, setImageM] = useState(0);

  const totalAllocatedM = carDevM + staffM + imageM;
  const budgetM = budget / 1_000_000;
  const remainingM = budgetM - totalAllocatedM;
  const isOverspending = totalAllocatedM > budgetM;

  // Preview projected indices (starting from 0 since investments happen after driver selection)
  const newCarDev = applyInvestment(0, carDevM * 1_000_000, 20_000_000);
  const newStaff = applyInvestment(0, staffM * 1_000_000, 20_000_000);
  const newImage = applyInvestment(0, imageM * 1_000_000, 25_000_000);

  function handleConfirm() {
    if (isOverspending) return;
    onConfirm({
      carDevelopment: carDevM * 1_000_000,
      staffQuality: staffM * 1_000_000,
      publicImage: imageM * 1_000_000,
    });
  }

  return (
    <div className="relative z-20 px-6 max-w-2xl mx-auto flex flex-col items-center gap-8 py-16 w-full">

      {/* Header */}
      <div
        className="px-4 py-2 text-red-400 text-[17px] tracking-widest uppercase"
        style={{
          fontFamily: "var(--font-pixel), monospace",
          border: "3px solid #dc2626",
          boxShadow: "4px 4px 0px #7f1d1d",
          backgroundColor: "#1c0a0a",
        }}
      >
        ▶ PRE-SEASON BUDGET
      </div>

      {/* Available budget */}
      <div
        className="w-full p-4 flex items-center justify-between gap-4 flex-wrap"
        style={{
          border: "3px solid #374151",
          boxShadow: "4px 4px 0px #111827",
          backgroundColor: "#111111",
        }}
      >
        <span className="text-gray-400 text-[13px] font-mono tracking-widest uppercase">AVAILABLE</span>
        <div className="flex items-center gap-6">
          <span className="text-white text-[15px] font-mono">{formatG(budget)}</span>
          <span className="text-gray-600 font-mono">→</span>
          <span
            className="text-[15px] font-mono font-bold"
            style={{ color: isOverspending ? "#dc2626" : "#22c55e" }}
          >
            {remainingM.toFixed(1)}M G reserve
          </span>
        </div>
      </div>

      {isOverspending && (
        <div
          className="w-full p-3 text-center"
          style={{ border: "3px solid #dc2626", backgroundColor: "#1c0a0a" }}
        >
          <span
            className="text-red-400 text-[13px] tracking-widest"
            style={{ fontFamily: "var(--font-pixel), monospace" }}
          >
            ⚠ OVERSPENDING BY {(totalAllocatedM - budgetM).toFixed(1)}M G
          </span>
        </div>
      )}

      {/* Allocation inputs */}
      <AllocInput
        label="CAR DEVELOPMENT"
        description="Improves car performance on track. Boosts carPerformance score directly."
        formula="index += investment ÷ 20M"
        valueM={carDevM}
        onChange={setCarDevM}
        currentIndex={0}
        newIndex={newCarDev}
        maxM={budgetM}
      />

      <AllocInput
        label="STAFF QUALITY"
        description="Better engineers and strategists improve both car performance and race strategy."
        formula="index += investment ÷ 20M"
        valueM={staffM}
        onChange={setStaffM}
        currentIndex={0}
        newIndex={newStaff}
        maxM={budgetM}
      />

      <AllocInput
        label="PUBLIC IMAGE"
        description="Increases chance of sponsor contracts and board confidence."
        formula="index += investment ÷ 25M"
        valueM={imageM}
        onChange={setImageM}
        currentIndex={0}
        newIndex={newImage}
        maxM={budgetM}
      />

      {/* Leftover note */}
      <p className="text-gray-600 text-[13px] font-mono text-center">
        Unspent budget becomes financial reserve — you do not have to spend everything.
      </p>

      {/* Confirm button */}
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
        ▶ CONTINUE TO PARIS →
      </button>
    </div>
  );
}
