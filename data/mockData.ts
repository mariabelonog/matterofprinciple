// Static mock data for Matter of Principle — all values are fictional.
// Vortex Motorsport is a fictional racing team; no real F1 entities are referenced.

export const teamStats = {
  budget: 4_200_000,         // remaining budget in fictional currency
  carPerformance: 42,        // 0–100
  driverMorale: 61,          // 0–100
  staffQuality: 55,          // 0–100
  reputation: 38,            // 0–100
  risk: 74,                  // 0–100 (higher = worse)
};

export const budgetCategories = [
  {
    id: "car_dev",
    label: "Car Development",
    allocated: 35,
    color: "#dc2626",
    description: "Wind tunnel time, CFD simulations, component fabrication.",
  },
  {
    id: "driver_contracts",
    label: "Driver Contracts",
    allocated: 25,
    color: "#f59e0b",
    description: "Primary and reserve driver retainers and bonuses.",
  },
  {
    id: "staff_engineering",
    label: "Staff & Engineering",
    allocated: 20,
    color: "#3b82f6",
    description: "Mechanics, strategists, data engineers, and pit crew.",
  },
  {
    id: "marketing_sponsors",
    label: "Marketing & Sponsors",
    allocated: 12,
    color: "#8b5cf6",
    description: "Hospitality suites, livery deals, and media commitments.",
  },
  {
    id: "crisis_reserve",
    label: "Crisis Reserve",
    allocated: 8,
    color: "#22c55e",
    description: "Emergency fund for unexpected setbacks mid-season.",
  },
];

export const crisisEvent = {
  title: "KEY ENGINEER POACHED",
  description:
    "Vortex Motorsport's lead aerodynamicist, Dr. Rael Vance, has accepted a lucrative offer from a rival outfit. The rest of the aero department is rattled. You have 48 hours to decide how to respond before the story breaks in the press.",
  choices: [
    {
      id: "match_offer",
      label: "Match the Offer",
      description: "Renegotiate Vance's contract at 40% above current rate to keep him in-house.",
      consequence: "−$800k budget · +12 Staff Quality · −5 Risk",
    },
    {
      id: "promote_internal",
      label: "Promote from Within",
      description: "Elevate junior aerodynamicist Sable Drex to lead role immediately.",
      consequence: "+10 Driver Morale · −8 Car Performance (short term) · +4 Risk",
    },
    {
      id: "ride_it_out",
      label: "Let Him Go & Restructure",
      description: "Accept the departure, redistribute responsibilities, and cut costs elsewhere.",
      consequence: "−15 Reputation · −6 Staff Quality · +$200k budget",
    },
  ],
};

export const seasonResult = {
  outcome: "survived" as "survived" | "bankrupt" | "acquired",
  summary:
    "Against all odds, Vortex Motorsport crossed the finish line. The season was turbulent — two driver controversies, a mid-year sponsor pullout, and a gearbox scandal — but disciplined budget management and a bold mid-season car upgrade kept the team alive. You've earned a second chance.",
  stats: {
    racesCompleted: 8,
    points: 47,
    budgetRemaining: 1_150_000,
    moraleFinal: 68,
  },
};

export const mockRaceCalendar = [
  { round: 1, name: "Grand Prix of Solara", location: "Solara City", status: "completed" as const },
  { round: 2, name: "Ironveil Classic", location: "Ironveil", status: "completed" as const },
  { round: 3, name: "Duskport Sprint", location: "Duskport", status: "completed" as const },
  { round: 4, name: "Verano Enduro", location: "Verano", status: "completed" as const },
  { round: 5, name: "Nordpass Challenge", location: "Nordpass", status: "next" as const },
  { round: 6, name: "Copper Canyon Race", location: "Copper Canyon", status: "upcoming" as const },
  { round: 7, name: "Halcyon 400", location: "Halcyon", status: "upcoming" as const },
  { round: 8, name: "Terminus Grand Prix", location: "Terminus", status: "upcoming" as const },
];
