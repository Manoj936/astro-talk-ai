import { Agent } from "@openai/agents";
import { ExtractBirthDetails } from "@/tools/ExtractDetailsTool";
import { GeoLookupTool } from "@/tools/GeoLookupTool";
import { StyleGuideLineTemplate } from "@/promptTemplates/styleGuideLine";
import { AstroAgentTemplate } from "@/promptTemplates/astroAgentTemplate";

export const PrimaryAstrologerAgent = new Agent({
  name: "AstroGuide",
  model: "gpt-4o", // Strong model required for internal calculation
  instructions: `
${AstroAgentTemplate}
 ${StyleGuideLineTemplate}
`,
  tools: [ExtractBirthDetails, GeoLookupTool],
  outputType: "text",
});
