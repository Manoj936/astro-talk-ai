// reception.ts
import { Agent } from "@openai/agents";
import { z } from "zod";
import { RECOMMENDED_PROMPT_PREFIX } from "@openai/agents-core/extensions";
import { PrimaryAstrologerAgent } from "./Primary";

import { AstroGuardrail } from "@/guardrails/InputAstroGuardrail";
import { AstroOutputGuardrail } from "@/guardrails/OutputAstroGuardrail";

export const receptionAgent = new Agent({
  name: "AstroReception",
  instructions: `
${RECOMMENDED_PROMPT_PREFIX}

Your job:
- Understand the user's astrology request and greet them
- IF customer ask about general astrology Forward It to AstroGuide (primary) ->PrimaryAstrologerAgent

Routing logic:
- General Greeting → AstroReception
- General astrological-style interpretation → PrimaryAstrologerAgent
`,

handoffs: [PrimaryAstrologerAgent],
  outputType: "text",
  inputGuardrails :[AstroGuardrail],
  outputGuardrails :[AstroOutputGuardrail],
});
