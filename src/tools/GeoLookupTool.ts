import { tool } from "@openai/agents";
import { z } from "zod";

export const GeoLookupTool = tool({
  name: "GeoLookup",
  description: "Convert city/place to latitude and longitude.",
  parameters: z.object({
    place: z.string(),
  }),
  execute: async ({ place }) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!json[0]) throw new Error("Location not found");

    return {
      latitude: Number(json[0].lat),
      longitude: Number(json[0].lon)
    };
  }
});
