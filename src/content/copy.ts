// Verbatim from phase0-content.md — Sections 1, 4, 5, 6, 8, 9.

export const onboarding = {
  screenIntro: "Set this up your way. This is yours.",
  welcomeMessage:
    "This isn't about winning more. It's about getting better at the part nobody sees — how you think, how you bounce back, how you show up. Do that, and the rest follows.",
  feelingWordExamples: ["calm", "sharp", "fearless", "locked-in", "loose"],
};

export const standardJournal = {
  questions: [
    "One thing you did well today — effort, attitude, or a skill?",
    "What was hard, and how did you handle it?",
    "One thing you'll try next time?",
  ],
  helperText: "A sentence each is plenty. This isn't homework.",
  completionMessage: "Logged. That's the work most people skip.",
};

export const postLoss = {
  breathingIntro: "Box breathing. In for 4. Hold for 4. Out for 4. Hold for 4. Four rounds.",
  breathingOnScreen: "You don't have to feel good yet. Just breathe.",
  questions: [
    "What are you feeling right now? (one word is fine)",
    "Was there a moment you're proud of, even in this loss?",
    "One thing — just one — you'd do differently?",
  ],
  completionMessage: "That took more than winning does. Nice.",
};

export const mistakeOfWeek = {
  prompt: "What's a mistake you made this week — game, practice, anywhere — and what did it teach you?",
  completionMessage: "You just turned a mistake into a lesson. That's the whole game.",
};

export const breathingExercises = {
  sixtySecondReset: {
    title: "60-Second Reset",
    steps: [
      "In through your nose, 4 seconds.",
      "Hold, 4 seconds.",
      "Out through your mouth, 4 seconds.",
      "Hold, 4 seconds.",
    ],
    footer: "Four rounds, then go.",
  },
  readyBreath: {
    title: "Ready Breath",
    steps: ["Three slow breaths. On each one out, drop your shoulders. That's it. You're ready."],
  },
};

export const milestoneMessages: Record<3 | 7 | 21, string> = {
  3: "You've started something. Keep it rolling.",
  7: "A full week of showing up. This is what consistency looks like.",
  21: "Three weeks. This isn't a phase anymore — it's a habit.",
};
