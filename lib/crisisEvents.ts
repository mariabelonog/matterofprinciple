import type { CrisisEvent } from "@/types/game";

export const CRISIS_EVENTS: Record<string, CrisisEvent> = {
  Strassburg: {
    city: "Strassburg",
    title: "SPONSOR PRESSURE",
    description:
      "A major sponsor offers emergency funding, but demands influence over the team's public messaging and driver priorities. The paddock is watching how you respond.",
    choices: [
      {
        id: "accept",
        label: "Accept the conditions",
        description: "Take the money. Let the sponsor shape part of the team's public image.",
        budgetDelta: 30_000_000,
        publicImageDelta: -1,
        staffQualityDelta: -0.5,
        riskModifier: 1,
        narrative:
          "The team survives financially, but the paddock questions whether you still control the project.",
      },
      {
        id: "refuse",
        label: "Refuse — protect independence",
        description: "Send the sponsor away. Take the financial hit.",
        budgetDelta: -10_000_000,
        publicImageDelta: 2,
        staffQualityDelta: 0.5,
        narrative: "The board is nervous, but the team respects your principles.",
      },
      {
        id: "negotiate",
        label: "Negotiate a compromise",
        description: "Accept partial terms — some money, limited influence.",
        budgetDelta: 15_000_000,
        publicImageDelta: 0.5,
        narrative: "You buy time without fully surrendering control.",
      },
    ],
  },
  Budapest: {
    city: "Budapest",
    title: "UNSAFE UPGRADE",
    description:
      "Engineers propose a rushed upgrade before Budapest. It could save the season — but it may be unstable under race conditions.",
    choices: [
      {
        id: "approve",
        label: "Approve the risky upgrade",
        description: "Run it. The car gets faster, but reliability is unknown.",
        carDevelopmentDelta: 1.5,
        budgetDelta: -15_000_000,
        riskModifier: 2,
        crashLossMultiplier: 1.5,
        narrative: "The car is faster, but every lap feels like a gamble.",
      },
      {
        id: "delay",
        label: "Delay — partial upgrade only",
        description: "Take the safe version. Less pace, more reliability.",
        carDevelopmentDelta: 0.5,
        budgetDelta: -5_000_000,
        riskModifier: -1,
        narrative: "The team loses some pace, but avoids unnecessary panic.",
      },
      {
        id: "cancel",
        label: "Cancel the upgrade",
        description: "Scrap it entirely. Preserve budget and stability.",
        publicImageDelta: 1,
        staffQualityDelta: -0.5,
        riskModifier: -1,
        narrative:
          "The decision looks responsible from the outside, but frustrates the technical department.",
      },
    ],
  },
  Istanbul: {
    city: "Istanbul",
    title: "MATTER OF PRINCIPLE",
    description:
      "Before the final race, the board offers a controversial deal: guaranteed funding for the team's future in exchange for compromising the team's independence and public values. This is the decision the whole season has been building toward.",
    choices: [
      {
        id: "take_deal",
        label: "Take the deal",
        description: "Accept the funding. The team survives, but at a cost.",
        budgetDelta: 40_000_000,
        publicImageDelta: -3,
        carDevelopmentDelta: 1,
        narrative:
          "The team is saved on paper, but the name Matter of Principle starts to sound ironic.",
      },
      {
        id: "refuse_public",
        label: "Refuse publicly",
        description: "Reject the deal in front of the press. Rally the garage.",
        budgetDelta: -15_000_000,
        publicImageDelta: 3,
        driverBoost: 1,
        riskModifier: 1,
        narrative:
          "The garage rallies behind you. It is risky, but the team finally believes in itself.",
      },
      {
        id: "stay_silent",
        label: "Stay silent — focus on racing",
        description: "Avoid the politics. Put everything into the final race.",
        staffQualityDelta: 0.5,
        narrative: "You avoid scandal and put all attention on the final race.",
      },
    ],
  },
};
