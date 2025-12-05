import { inputAstroGuardRailTemplate } from "@/promptTemplates/inputAstroGuardrailTemplate";
import { Agent, InputGuardrail, run } from "@openai/agents";
import { z } from "zod";

// This agent just classifies: "Is this message about astrology?"
const AstroGuardRailAgent = new Agent({
  name: "AstroGuardRail",
  instructions: inputAstroGuardRailTemplate,
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
