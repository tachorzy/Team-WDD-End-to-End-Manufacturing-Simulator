/**
 * @jest-environment jsdom
 */

/*
    TODO: 
            - Properly mock process.env.NEXT_PUBLIC_AWS_ENDPOINT within each function's test
            - Include errors in testing to make sure they fail properly
*/

import "@testing-library/jest-dom";
import { Factory } from "@/app/api/_utils/types";
import * as api from "../app/api/factories/factoryAPI";

// Mocks
const mockFetch = jest.fn();
const originalEnv = process.env;

beforeEach(() => {
    jest.resetModules();

    process.env = { ...originalEnv };
});

afterEach(() => {
    process.env = originalEnv;
});

beforeEach(() => {
    global.fetch = mockFetch;
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("Factory API", () => {
    const mockFactory = {
        factoryId: "1",
        name: "Factory 1",
        location: {
            latitude: 123.456,
            longitude: 456.789,
        },
        description: "none",
    };

    test("updateFactory function", async () => {
        process.env.NEXT_PUBLIC_AWS_ENDPOINT = "https://example.com/api";

        const updatedFactory = {
            ...mockFactory,
            name: "Updated Factory",
        };
        const mockResponse = updatedFactory;

        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => mockResponse,
        } as unknown as Response);

        const result = await api.updateFactory(updatedFactory as Factory); // Using 'as Factory' to suppress TypeScript error

        expect(result).toEqual(mockResponse);
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });
});
