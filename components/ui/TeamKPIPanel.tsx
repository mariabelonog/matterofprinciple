"use client";

// TeamKPIPanel — панель финансовых KPI команды, раскрывается по клику.
// Вычисляет показатели через calcTeamKPIs и отображает их секциями:
// прибыльность, трек-перформанс, риски и эффективность капитала.

import { useState } from "react";
import type { ExtendedRaceResult, Driver } from "@/types/game";
import { calcTeamKPIs } from "@/lib/teamKPIs";

// Пропсы панели KPI команды.
interface Props {
  raceHistory: ExtendedRaceResult[]; // история гонок для расчёта всех показателей
  currentBudget: number;             // текущий бюджет для расчёта ROI и runway
  driver: Driver | null;             // выбранный пилот (null = ещё не выбран)
}

// ─── Tooltip (explanation) ────────────────────────────────────────────────────

const EXPLANATIONS: Record<string, string> = {
  roi:
    "Return on Investment — how much your starting 100M G has grown or shrunk. " +
    "Positive = you've made money vs your starting capital. Negative = you're burning through it. " +
    "Formula: (current budget − 100M) / 100M × 100%.",
  netPL:
    "Net Profit & Loss — the raw difference between your current budget and the 100M G you started with. " +
    "Positive means the team is worth more than it cost to assemble.",
  revenuePerRace:
    "Average gross income per race (prize money + sponsor income, before crash losses). " +
    "Useful for projecting how much capital you'll have for the rest of the season.",
  crashLossRate:
    "Crash losses as a percentage of gross revenue. " +
    "High values (>20%) mean crashes are significantly eating into race income — consider reducing risk.",
  prizeEfficiency:
    "Your actual prize earnings vs the theoretical maximum if you finished P1 every race (P1 = 50M G). " +
    "100% = perfect season. A useful measure of raw on-track performance.",
  sponsorHitRate:
    "Percentage of races where the sponsor contract activated. " +
    "Driven by Public Image — higher image = higher probability (publicImage / 10). " +
    "Low rate signals underinvestment in public image.",
  crashRate:
    "Percentage of races that ended in a crash. " +
    "Crashes destroy a fraction of your recent car investment. " +
    "Driven by risk setting — formula: effectiveRisk / 20.",
  dnfRate:
    "Percentage of races where the car retired (Did Not Finish). " +
    "DNFs score position −1 (last place) and earn minimum prize money. " +
    "Caused by low reliability combined with high risk.",
  avgPosition:
    "Average finishing position across completed races. " +
    "Lower is better. Below 5.0 is solid; above 7.0 signals the car needs more investment.",
  positionTrend:
    "Whether your average finishing position is improving or declining compared to the first half of your season. " +
    "'Improving' means smaller position numbers in recent races.",
  driverCostPaybackRaces:
    "How many races of average revenue are needed to cover what you paid for your driver. " +
    "Nando (15M) pays back in ~1 race. Vax (70M) needs 3–5 races. " +
    "The lower this is, the better your driver cost efficiency.",
  runsOutInRaces:
    "Estimated races until bankruptcy at current average burn rate vs revenue. " +
    "Shown only when the team is net-burning capital. A warning — not a guarantee.",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

// KPIRow — строка одного показателя с раскрывающимся пояснением из EXPLANATIONS.
function KPIRow({
  label,
  value,
  id,
  sub,
  valueColor,
}: {
  label: string;      // название метрики
  value: string;      // форматированное значение (строка, уже с единицами)
  id: string;         // ключ в EXPLANATIONS для текста подсказки
  sub?: string;       // дополнительная подпись под названием (опционально)
  valueColor?: string; // цвет значения; по умолчанию белый
}) {
  const [open, setOpen] = useState(false); // раскрыто ли пояснение

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-3 py-2 cursor-pointer text-left group"
        style={{ borderBottom: "1px solid #1a1a1a" }}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-gray-400 text-[12px] font-mono uppercase tracking-widest group-hover:text-gray-300 transition-colors">
            {label}
          </span>
          {sub && <span className="text-gray-600 text-[11px] font-mono">{sub}</span>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="text-[14px] font-mono font-bold"
            style={{ color: valueColor ?? "#ffffff" }}
          >
            {value}
          </span>
          <span className="text-gray-600 text-[10px]">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && EXPLANATIONS[id] && (
        <div className="px-2 py-3" style={{ backgroundColor: "#0d0d0d", borderBottom: "1px solid #1a1a1a" }}>
          <p className="text-gray-400 text-[12px] font-mono leading-relaxed">
            {EXPLANATIONS[id]}
          </p>
        </div>
      )}
    </div>
  );
}

// RevenueBar — горизонтальный стек-бар распределения доходов:
// зелёный — призовые, коричневый — спонсор, красный — потери от аварий.
function RevenueBar({
  prize,
  sponsor,
  crash,
}: {
  prize: number;   // суммарные призовые за все гонки
  sponsor: number; // суммарный спонсорский доход
  crash: number;   // суммарные потери от аварий
}) {
  const total = prize + sponsor; // база для нормализации ширины сегментов
  if (total === 0) return null;
  const prizePct   = (prize / total) * 100;           // % ширины зелёного сегмента
  const sponsorPct = (sponsor / total) * 100;         // % ширины коричневого сегмента
  const lossPct    = Math.min(100, (crash / total) * 100); // % потерь от дохода, максимум 100

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-gray-600 text-[11px] font-mono uppercase tracking-widest">Revenue breakdown</span>
      <div className="w-full h-4 flex overflow-hidden" style={{ border: "1px solid #222" }}>
        <div style={{ width: `${prizePct}%`, backgroundColor: "#15803d" }} title="Prize money" />
        <div style={{ width: `${sponsorPct}%`, backgroundColor: "#92400e" }} title="Sponsor" />
      </div>
      {crash > 0 && (
        <div className="w-full h-2 bg-[#111] overflow-hidden" style={{ border: "1px solid #1a1a1a" }}>
          <div style={{ width: `${lossPct}%`, backgroundColor: "#7f1d1d" }} title="Crash losses" />
        </div>
      )}
      <div className="flex gap-4 flex-wrap">
        <span className="text-[11px] font-mono" style={{ color: "#22c55e" }}>
          ■ Prize {(prize / 1_000_000).toFixed(0)}M
        </span>
        <span className="text-[11px] font-mono" style={{ color: "#f59e0b" }}>
          ■ Sponsor {(sponsor / 1_000_000).toFixed(0)}M
        </span>
        {crash > 0 && (
          <span className="text-[11px] font-mono" style={{ color: "#dc2626" }}>
            ■ Crash −{(crash / 1_000_000).toFixed(0)}M
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function TeamKPIPanel({ raceHistory, currentBudget, driver }: Props) {
  const [expanded, setExpanded] = useState(false); // развёрнута ли панель с деталями

  // Не рендерим панель пока не завершена хотя бы одна гонка
  if (raceHistory.length === 0) return null;

  const kpi = calcTeamKPIs(raceHistory, currentBudget, driver); // рассчитываем все KPI

  // Цвет ROI: зелёный >10%, жёлтый >0%, красный — убыток
  const roiColor =
    kpi.roi > 10 ? "#22c55e" : kpi.roi > 0 ? "#f59e0b" : "#dc2626";

  // Метки и цвета для тренда позиций
  const trendLabel = {
    improving:        "↑ IMPROVING",
    declining:        "↓ DECLINING",
    stable:           "→ STABLE",
    insufficient_data: "—",
  }[kpi.positionTrend];

  const trendColor = {
    improving:        "#22c55e",
    declining:        "#dc2626",
    stable:           "#f59e0b",
    insufficient_data: "#6b7280",
  }[kpi.positionTrend];

  return (
    <div
      className="w-full flex flex-col"
      style={{ border: "3px solid #1f2937", boxShadow: "4px 4px 0px #0f1720", backgroundColor: "#0d0d0d" }}
    >
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#111] transition-colors"
      >
        <span
          className="text-gray-400 text-[12px] tracking-widest uppercase"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          ■ TEAM FINANCIALS & KPIs
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[13px] font-bold" style={{ color: roiColor }}>
            ROI {kpi.roi >= 0 ? "+" : ""}{kpi.roi.toFixed(1)}%
          </span>
          <span className="text-gray-600 text-[11px]">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 flex flex-col gap-5" style={{ borderTop: "1px solid #1f2937" }}>

          {/* Revenue bar */}
          <div className="pt-4">
            <RevenueBar
              prize={kpi.totalPrize}
              sponsor={kpi.totalSponsor}
              crash={kpi.totalCrash}
            />
          </div>

          {/* P&L section */}
          <div className="flex flex-col">
            <span
              className="text-gray-600 text-[10px] tracking-widest uppercase mb-2 mt-1"
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              PROFITABILITY
            </span>
            <KPIRow
              id="roi"
              label="ROI on starting capital"
              value={`${kpi.roi >= 0 ? "+" : ""}${kpi.roi.toFixed(1)}%`}
              valueColor={roiColor}
            />
            <KPIRow
              id="netPL"
              label="Net P&L"
              value={`${kpi.netPL >= 0 ? "+" : ""}${(kpi.netPL / 1_000_000).toFixed(1)}M G`}
              valueColor={kpi.netPL >= 0 ? "#22c55e" : "#dc2626"}
            />
            <KPIRow
              id="revenuePerRace"
              label="Revenue per race"
              sub="prize + sponsor avg"
              value={`${(kpi.revenuePerRace / 1_000_000).toFixed(1)}M G`}
            />
            <KPIRow
              id="crashLossRate"
              label="Crash loss rate"
              sub="losses / gross revenue"
              value={`${kpi.crashLossRate.toFixed(1)}%`}
              valueColor={kpi.crashLossRate > 20 ? "#dc2626" : kpi.crashLossRate > 10 ? "#f59e0b" : "#22c55e"}
            />
          </div>

          {/* Performance section */}
          <div className="flex flex-col">
            <span
              className="text-gray-600 text-[10px] tracking-widest uppercase mb-2"
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              ON-TRACK PERFORMANCE
            </span>
            <KPIRow
              id="avgPosition"
              label="Average finishing position"
              value={`P${kpi.avgPosition.toFixed(1)}`}
              valueColor={kpi.avgPosition <= 3 ? "#22c55e" : kpi.avgPosition <= 6 ? "#f59e0b" : "#dc2626"}
            />
            <KPIRow
              id="positionTrend"
              label="Performance trend"
              sub={kpi.racesCompleted < 4 ? "available after race 4" : undefined}
              value={trendLabel}
              valueColor={trendColor}
            />
            <KPIRow
              id="prizeEfficiency"
              label="Prize money efficiency"
              sub="vs theoretical P1 every race"
              value={`${kpi.prizeEfficiency.toFixed(0)}%`}
              valueColor={kpi.prizeEfficiency >= 50 ? "#22c55e" : kpi.prizeEfficiency >= 25 ? "#f59e0b" : "#dc2626"}
            />
          </div>

          {/* Risk & reliability section */}
          <div className="flex flex-col">
            <span
              className="text-gray-600 text-[10px] tracking-widest uppercase mb-2"
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              RISK PROFILE
            </span>
            <KPIRow
              id="sponsorHitRate"
              label="Sponsor activation rate"
              value={`${kpi.sponsorHitRate.toFixed(0)}%`}
              valueColor={kpi.sponsorHitRate >= 60 ? "#22c55e" : kpi.sponsorHitRate >= 30 ? "#f59e0b" : "#dc2626"}
            />
            <KPIRow
              id="crashRate"
              label="Crash rate"
              value={`${kpi.crashRate.toFixed(0)}%`}
              valueColor={kpi.crashRate > 30 ? "#dc2626" : kpi.crashRate > 15 ? "#f59e0b" : "#22c55e"}
            />
            <KPIRow
              id="dnfRate"
              label="DNF rate"
              value={`${kpi.dnfRate.toFixed(0)}%`}
              valueColor={kpi.dnfRate > 20 ? "#dc2626" : kpi.dnfRate > 0 ? "#f59e0b" : "#22c55e"}
            />
          </div>

          {/* Capital efficiency */}
          <div className="flex flex-col">
            <span
              className="text-gray-600 text-[10px] tracking-widest uppercase mb-2"
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              CAPITAL EFFICIENCY
            </span>
            {driver && (
              <KPIRow
                id="driverCostPaybackRaces"
                label="Driver cost payback"
                sub={`${driver.name} cost ${(driver.cost / 1_000_000).toFixed(0)}M G`}
                value={`${kpi.driverCostPaybackRaces.toFixed(1)} races`}
                valueColor={kpi.driverCostPaybackRaces <= 2 ? "#22c55e" : kpi.driverCostPaybackRaces <= 4 ? "#f59e0b" : "#dc2626"}
              />
            )}
            {kpi.runsOutInRaces !== null && (
              <KPIRow
                id="runsOutInRaces"
                label="Runway at current burn rate"
                value={`~${kpi.runsOutInRaces} races`}
                valueColor="#dc2626"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
