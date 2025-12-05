import { tool } from "@openai/agents";
import { z } from "zod";

export const ChartCalculatorTool = tool({
  name: "calculate_planetary_positions",
  description: "Calculates exact zodiac signs for Sun, Moon, and Ascendant given a date, time, and location.",
  // CHANGE THIS: Use 'args', not 'parameters'
  args: {
    date: z.string().describe("ISO date string (YYYY-MM-DD)"),
    time: z.string().describe("24hr format time (HH:MM)"),
    lat: z.number().describe("Latitude of the birth place"),
    lon: z.number().describe("Longitude of the birth place"),
  },
  execute: async ({ date, time, lat, lon }) => {
    console.log(`[ChartTool] Calculating for ${date} ${time} at ${lat}, ${lon}`);

    // --- MOCK LOGIC ---
    const signs = [
      "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
      "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ];
    
    const getRandom = () => signs[Math.floor(Math.random() * signs.length)];

    const mockChart = {
      sun_sign: getRandom(),
      moon_sign: getRandom(),
      ascendant: getRandom(),
      mercury: getRandom(),
      venus: getRandom(),
      mars: getRandom(),
      note: "Calculated using High-Precision Ephemeris (Mock)"
    };

    return JSON.stringify(mockChart);
  },
});