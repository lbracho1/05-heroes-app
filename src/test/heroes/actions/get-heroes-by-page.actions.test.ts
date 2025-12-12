import { describe, expect, test } from "vitest";
import AxiosMockAdapter from 'axios-mock-adapter';
import { beforeEach } from "vitest";

import { getHeroesByPageAction } from "@/heroes/actions/get-heroes-by-page.actions";
import { heroApi } from "@/heroes/api/hero.api";

const BASE_URL = import.meta.env.VITE_API_URL;

describe('getHeroesByPageAction', () => {

    const heroesApiMock = new AxiosMockAdapter(heroApi);

    beforeEach(() => {
        heroesApiMock.reset();
        heroesApiMock.resetHistory();
    });

    test('should return default heroes', async () => {
        heroesApiMock.onGet('/').reply(200, {
            total: 10,
            pages: 2,
            heroes: [
                {
                    image: '1.jpeg'
                },
                {
                    image: '2.jpeg'
                }
            ]
        });

        const response = await getHeroesByPageAction(1);

        expect(response).toStrictEqual({
            total: 10,
            pages: 2,
            heroes: [
                { image: `${BASE_URL}/images/1.jpeg` },
                { image: `${BASE_URL}/images/2.jpeg` }
            ]
        });

    });

    test('should return the correct heroes when page is not a number', async () => {
        const responseObject = {
            total: 10,
            pages: 1,
            heroes: []
        };

        heroesApiMock.onGet('/').reply(200, responseObject);

        await getHeroesByPageAction('abc' as unknown as number)

        const params = heroesApiMock.history.get[0].params;
        expect(params).toStrictEqual({ limit: 6, offset: 0, category: 'all' });
    });

    test('should return the correct heroes when page is string number', async () => {
        const responseObject = {
            total: 10,
            pages: 1,
            heroes: []
        };

        heroesApiMock.onGet('/').reply(200, responseObject);

        await getHeroesByPageAction('5' as unknown as number)

        const params = heroesApiMock.history.get[0].params;
        expect(params).toStrictEqual({ limit: 6, offset: 24, category: 'all' });
    });

    test('should call the api with correct params', async () => {
        const responseObject = {
            total: 10,
            pages: 1,
            heroes: []
        };

        heroesApiMock.onGet('/').reply(200, responseObject);

        await getHeroesByPageAction(2, 10, 'heroes');

        const params = heroesApiMock.history.get[0].params;
        expect(params).toStrictEqual({ limit: 10, offset: 10, category: 'heroes' })
    });

});