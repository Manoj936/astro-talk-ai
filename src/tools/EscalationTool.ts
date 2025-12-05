import { tool } from "@openai/agents";
import { z } from "zod";

// Escalate to expert tool is used when the user's question is too complex for general astrology advice.

export const EscalateToExpertTool = tool({
  name: "EscalateToExpert",
  description: "Escalate to expert with structured birth data.",
  parameters: z.object({
    date: z.string(),
    timeStart: z.string(),
    timeEnd: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    place: z.string()
  }),
  execute: async (args) => {
  return {
      handoff: "AstroMaster",
      payload:args
    };
  }
});