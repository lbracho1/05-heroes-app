import { getSummaryAction } from "@/heroes/actions/get-summary.action";
import { describe, expect, test } from "vitest";


describe('getSummaryAction', () => {

    test('should fetch summary and return complete information', async () => {

        const summary = await getSummaryAction();

        expect(summary).toStrictEqual({
            totalHeroes: expect.any(Number),
            strongestHero: expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
                slug: expect.any(String),
                alias: expect.any(String),
                powers: expect.any(Array),
                description: expect.any(String),
                strength: expect.any(Number),
                intelligence: expect.any(Number),
                speed: expect.any(Number),
                durability: expect.any(Number),
                team: expect.any(String),
                image: expect.any(String),
                firstAppearance: expect.any(String),
                status: expect.any(String),
                category: expect.any(String),
                universe: expect.any(String),
            }),
            smartestHero: expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
                slug: expect.any(String),
                alias: expect.any(String),
                powers: expect.any(Array),
                description: expect.any(String),
                strength: expect.any(Number),
                intelligence: expect.any(Number),
                speed: expect.any(Number),
                durability: expect.any(Number),
                team: expect.any(String),
                image: expect.any(String),
                firstAppearance: expect.any(String),
                status: expect.any(String),
                category: expect.any(String),
                universe: expect.any(String),
            }),
            heroCount: expect.any(Number),
            villainCount: expect.any(Number),
        });
    });
});