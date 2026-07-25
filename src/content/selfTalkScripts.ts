import type { SelfTalkScript, TriggerTag } from "../types";

// Verbatim from phase0-content.md, Section 7.
export const selfTalkScripts: SelfTalkScript[] = [
  { id: "st-1", trigger: "after_mistake", text: "I miss, I adjust, I go again." },
  { id: "st-2", trigger: "after_mistake", text: "That's one play. It's already behind me. Next." },
  { id: "st-3", trigger: "nerves", text: "I've done this before. My legs know what to do — let them." },
  { id: "st-4", trigger: "nerves", text: "Nervous means ready. Let's use it." },
  { id: "st-5", trigger: "frustration", text: "One bad play doesn't erase a good athlete. Next play." },
  { id: "st-6", trigger: "frustration", text: "I can be mad and still do my job. Both at once." },
  { id: "st-7", trigger: "low_confidence", text: "Good is still in there. Today I just find one rep of it." },
  { id: "st-8", trigger: "low_confidence", text: "I don't have to be perfect. I have to be present." },
];

export const triggerLabels: Record<TriggerTag, string> = {
  after_mistake: "After a mistake",
  nerves: "Nerves",
  frustration: "Frustration",
  low_confidence: "Low confidence",
};
