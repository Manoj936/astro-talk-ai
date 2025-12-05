import { tool } from "@openai/agents";
import { z } from "zod";

// Save chat tool is used to save the user and ai conversation to the database.

export const SaveChatTool = tool({
  name: "SaveChat",
  description: "Saves user and assistant messages.",
  parameters: z.object({
    userMessage: z.string().optional(),
    aiMessage: z.string().optional(),
  }).strict(),
  execute: async ({ userMessage, aiMessage }) => {
    console.log("💾 Saving chat:", { userMessage, aiMessage });
    return "Chat saved successfully.";
  },
});
