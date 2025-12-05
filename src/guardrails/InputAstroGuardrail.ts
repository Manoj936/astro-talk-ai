import { Agent, InputGuardrail, run } from "@openai/agents";
import { z } from "zod";

// This agent just classifies: "Is this message about astrology?"
const AstroGuardRailAgent = new Agent({
  name: "AstroGuardRail",
 instructions: `
You are a classifier.

Your task:
- Determine whether the message is related to ASTROLOGY topics.
- Astrology includes: horoscope, zodiac, planets, kundli, rashi, lagna, birth chart, moon sign, sun sign, ascendant, nakshatra, dasha, houses, grahas, compatibility, etc.
- Use GPT's world knowledge of astrology to help classify.

IMPORTANT EXCEPTION:
- If the user message is a greeting (like "hi", "hello", "hey", "good morning"), 
  classify it as { "isAstrologyRelated": true } 
  because greetings are allowed BEFORE the user asks astrology questions.
- Also if user ask about your speciality or capabilities, classify as true. 

Rules:
- Do NOT block greetings.
- If the message asks a question unrelated to astrology (coding, tech, math, cooking, health, random facts), then isAstrologyRelated = false.

Your entire output MUST be JSON:
{ "isAstrologyRelated": boolean }
`,

  outputType: z.object({
    isAstrologyRelated: z.boolean(),
  }),
});

// This is the guardrail object you attach to an agent.
export const AstroGuardrail: InputGuardrail = {
  name: "AstroGuardRail",

  // We want to block BEFORE the main model runs.
  runInParallel: false,

  execute: async ({ input, context }) => {
    const result = await run(AstroGuardRailAgent, input, { context });

    const isAstrologyRelated = result.finalOutput?.isAstrologyRelated ?? false;

    return {
      // Anything you want logged / inspected
      outputInfo: result.finalOutput,
      // If NOT astrology -> tripwire triggers -> agent is blocked
      tripwireTriggered: !isAstrologyRelated,
    };
  },
};
