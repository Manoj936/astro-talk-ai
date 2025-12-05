// reception.ts
import { Agent } from "@openai/agents";
import { RECOMMENDED_PROMPT_PREFIX } from "@openai/agents-core/extensions";

import { AstroGuardrail } from "@/guardrails/InputAstroGuardrail";
import { AstroOutputGuardrail } from "@/guardrails/OutputAstroGuardrail";

import { PrimaryAstrologerAgent } from "./AstroAgent";
import { receptionTemplate } from "@/promptTemplates/receptionTemplate";

export const receptionAgent = new Agent({
  name: "AstroReception",
  instructions: `
${RECOMMENDED_PROMPT_PREFIX}
${receptionTemplate}
`,

  handoffs: [PrimaryAstrologerAgent],
  outputType: "text",
  inputGuardrails: [AstroGuardrail],
  outputGuardrails: [AstroOutputGuardrail],
});
