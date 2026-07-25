// Verbatim from phase0-content.md, Section 3.
export interface ProcessGoalGroup {
  label: string;
  goals: string[];
}

export const processGoalRule =
  "A process goal is 100% in your control. Not \"score 2 goals\" — that depends on other people. \"Do my full warm-up\" — that's all you.";

export const processGoalLibrary: ProcessGoalGroup[] = [
  {
    label: "Confidence / fear of mistakes",
    goals: [
      "Reset within 5 seconds after every mistake — one breath, next play",
      "Try the hard thing at least once, even if it might not work",
      "Talk to myself the way I'd talk to a teammate who messed up",
    ],
  },
  {
    label: "Handling losses / frustration",
    goals: [
      "Give full effort on the final play, win or lose, close or blowout",
      "Keep my body language steady after a bad moment (no slumping, no throwing things)",
      "Find one thing to say to a teammate to lift them up",
    ],
  },
  {
    label: "Motivation / effort consistency",
    goals: [
      "Do my complete warm-up routine, no skipping steps",
      "Ask my coach one question about what to work on",
      "Show up 10 minutes early and get my head right before we start",
      "Full effort on the last rep of every drill",
    ],
  },
];
