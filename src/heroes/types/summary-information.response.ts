export interface SummaryInformationResponse {
    totalHeroes: number;
    strongestHero: EstHero;
    smartestHero: EstHero;
    heroCount: number;
    villainCount: number;
};

export interface EstHero {
    id: string;
    name: string;
    slug: string;
    alias: string;
    powers: string[];
    description: string;
    strength: number;
    intelligence: number;
    speed: number;
    durability: number;
    team: string;
    image: string;
    firstAppearance: string;
    status: string;
    category: string;
    universe: string;
};
