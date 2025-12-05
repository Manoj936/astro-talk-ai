import { tool } from "@openai/agents";
import { z } from "zod";

export const ExtractBirthDetails = tool({
  name: "ExtractBirthDetails",
  description: "Store extracted birth details structured by the agent.",
  parameters: z.object({
    date: z.string().describe("DOB in YYYY-MM-DD format"),
    timeStart: z.string().describe("Start of birth time window HH:mm"),
    timeEnd: z.string().describe("End of birth time window HH:mm"),
    place: z.string().describe("Birthplace text"),
  }),
  execute: async ({ date, timeStart, timeEnd, place }) => {
    // The agent gives these values; tool does NOT generate anything.
    return {
      date,
      timeStart,
      timeEnd,
      place
    };
  }
});
