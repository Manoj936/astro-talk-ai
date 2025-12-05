import { outputAstroGuardrailTemplate } from "@/promptTemplates/outputAstroGuardrailTemplate";
import { Agent, OutputGuardrail, run } from "@openai/agents";
import { z } from "zod";

// LLM classifier for the agent's output
const AstroOutputGuardrailAgent = new Agent({
  name: "AstroOutputGuardrail",
  instructions: outputAstroGuardrailTemplate,

  outputType: z.object({
    notAllowed: z.boolean(),
  }),
});

export const AstroOutputGuardrail: OutputGuardrail = {
  name:  "AstroOutputGuardrail",
  async execute({ agentOutput, context }) {
    const result = await run(AstroOutputGuardrailAgent, agentOutput , {
      context,
    });
   const notAllowed = result.finalOutput?.notAllowed ?? true;

    return {
      outputInfo: result.finalOutput,
      tripwireTriggered: notAllowed,
    };
  },
};


