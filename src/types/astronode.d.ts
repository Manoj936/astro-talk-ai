declare module "astronode" {
  export class SweDate {
    constructor(year: number, month: number, day: number, hour: number);
  }

  export interface HouseData {
    cusp: number;
    sign: string;
  }

  export interface PlanetData {
    name: string;
    longitude: number;
    latitude: number;
    speed: number;
    sign: string;
    nakshatra?: string;
    retrograde?: boolean;
  }

  export interface ChartResult {
    ascendant: {
      longitude: number;
      sign: string;
    };
    planets: PlanetData[];
    houses: HouseData[];
  }

  export class SweChart {
    constructor(options: {
      date: SweDate;
      latitude: number;
      longitude: number;
      ayanamsha?: string;
      houseSystem?: string;
    });
    calculate(): Promise<ChartResult>;
  }
}
