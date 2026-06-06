import type { Race } from "@/types/game";

export const RACES: Race[] = [
  {
    round: 1,
    city: "Paris",
    isCrisis: false,
    opponentScores: [1.5, 2.0, 2.2, 2.5, 2.8, 3.0, 3.3, 3.6, 4.0],
    atmosphereText: "Night street circuit. Rainy asphalt reflects the city lights. The paddock is tense.",
  },
  {
    round: 2,
    city: "Strassburg",
    isCrisis: true,
    opponentScores: [1.7, 2.2, 2.5, 2.8, 3.1, 3.4, 3.7, 4.0, 4.5],
    atmosphereText: "Old city, cathedral silhouette. Political pressure arrives before the lights go out.",
  },
  {
    round: 3,
    city: "Stuttgart",
    isCrisis: false,
    opponentScores: [1.9, 2.4, 2.7, 3.0, 3.3, 3.6, 4.0, 4.4, 4.8],
    atmosphereText: "Industrial circuit. Factory towers line the horizon. Engineering defines everything here.",
  },
  {
    round: 4,
    city: "Vienna",
    isCrisis: false,
    opponentScores: [2.0, 2.5, 2.9, 3.2, 3.5, 3.9, 4.2, 4.6, 5.0],
    atmosphereText: "Classical boulevards. Opera-house silhouette at dawn. Strategic calm before the pressure builds.",
  },
  {
    round: 5,
    city: "Budapest",
    isCrisis: true,
    opponentScores: [2.2, 2.7, 3.1, 3.5, 3.8, 4.2, 4.6, 5.0, 5.5],
    atmosphereText: "River bridge silhouette. A rushed decision could save or sink the season.",
  },
  {
    round: 6,
    city: "Bucharest",
    isCrisis: false,
    opponentScores: [2.3, 2.8, 3.2, 3.6, 4.0, 4.4, 4.8, 5.2, 5.7],
    atmosphereText: "Wide boulevards, unstable finances. This race is a chance to recover — or slip further.",
  },
  {
    round: 7,
    city: "Sinaia",
    isCrisis: false,
    opponentScores: [2.5, 3.0, 3.4, 3.8, 4.2, 4.6, 5.0, 5.5, 6.0],
    atmosphereText: "Mountain circuit. Castle silhouette above the fog. Final preparation before Istanbul.",
  },
  {
    round: 8,
    city: "Istanbul",
    isCrisis: true,
    opponentScores: [2.7, 3.2, 3.7, 4.1, 4.5, 5.0, 5.5, 6.0, 6.5],
    atmosphereText: "Bridge silhouette, domes on the horizon. The final race. Every principle is tested.",
  },
];
