import { getHeroAction } from "@/heroes/actions/get.hero.action";
import { describe, expect, test } from "vitest";

const BASE_URL = import.meta.env.VITE_API_URL;


describe('getHeroAction', () => {
    test('should fetch hero data and return with complete image url', async () => {

        const result = await getHeroAction('4');

        expect(result.id).toBeTruthy();
        // expect(resultado.image).toContain('http://localhost:3001/images')
        expect(result.image).toBe(`${BASE_URL}/images/${result.id}.jpeg`)

        // console.log(resultado)
    });

    test('should throw and error is hero is not found', async () => {
        const idSlug = 'batman-2';

        const result = await getHeroAction(idSlug).catch((error) => {
            expect(error).toBeDefined();
            expect(error.message).toBe('Request failed with status code 404');

        });

        expect(result).toBeUndefined();
    });


});