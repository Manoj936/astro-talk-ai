import { Agent, OutputGuardrail, run } from "@openai/agents";
import { z } from "zod";

// LLM classifier for the agent's output
const AstroOutputGuardrailAgent = new Agent({
  name: "AstroOutputGuardrail",
  instructions: `
You are an output safety classifier.

Evaluate the AGENT'S RESPONSE (not the user message).

Rules:
- If the response mentions death, disease, illness, tragedy, accidents → notAllowed = true.
- If response predicts guaranteed future events (e.g., "you WILL marry X", "you WILL get job") → notAllowed = true.
- If response talks about non-astrology topics (tech, coding, politics, medicine) → notAllowed = true.
- If response contains black magic, curses, negative spiritual claims → notAllowed = true.

Allowed:
- General astrology interpretations
- Personality tendencies
- Planet positions
- House meanings
- Non-deterministic guidance (e.g., "potential", "tendency")

Return ONLY JSON:
{ "notAllowed": boolean }
`,

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


