/**
 * @jest-environment jsdom
 */

/*
    TODO: 
            - Properly mock process.env.NEXT_PUBLIC_AWS_ENDPOINT within each function's test
            - Include errors in testing to make sure they fail properly
*/

import "@testing-library/jest-dom";
import { Factory } from "@/app/types/types";
import { requestOptions, getFactory, createFactory, getAllFactories, updateFactory } from "../app/api/factories/factoryAPI";
import { waitFor } from "@testing-library/react";

global.fetch = jest.fn();

const consoleErrorMock = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

describe("Factory API", () => {
    beforeEach(() => {    
        (global.fetch as jest.Mock).mockClear();
    });

    const mockFactories: Factory[] = [
        {
            factoryId: "1",
            name: "Factory 1",
            location: {
                latitude: 100.001,
                longitude: 200.002,
            },
            description: "This is factory 1",
        },
        {
            factoryId: "2",
            name: "Factory 2",
            location: {
                latitude: 300.003,
                longitude: 400.004,
            },
            description: "This is factory 2",
        },
        {
            factoryId: "3",
            name: "Factory 3",
            location: {
                latitude: 500.005,
                longitude: 600.006,
            },
            description: "This is factory 3",
        },
        {
            factoryId: "2",
            name: "Factory 2",
            location: {
                latitude: 700.007,
                longitude: 800.008,
            },
            description: "This is factory 5",
        },
    ];

    test("should fetch and return one factory using getFactory", async () => {
        const mockResponse = mockFactories[0];

        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => mockResponse,
            }),
        );

        const result = await getFactory("1");

        expect(global.fetch).toHaveBeenCalledWith(
            "undefined/factories?id=1", 
            requestOptions
        );
        expect(result).toEqual(mockResponse);
    });

    test("should throw and log an error on getFactory", async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                statusText: "404",
            }),
        );

        expect(async () => {
            await getFactory("1");
        }).rejects.toThrow("Failed to fetch factory with ID 1");

        await waitFor(() =>{
            expect(consoleErrorMock).toHaveBeenCalledWith(
                "Failed to fetch factory with ID 1:", 
                new Error("Failed to fetch factory with ID 1: 404"),
            );
        });
    });

    test("should create and return a new factor using createFactory", async () => {
        const mockResponse = mockFactories[0];

        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => mockResponse,
            }),
        );

        const result = await createFactory(mockFactories[0]);

        expect(global.fetch).toHaveBeenCalledWith(
            "undefined/factories",
            {
                "body": JSON.stringify(mockFactories[0]),
                "headers": {
                    "Content-Type": "application/json",
                },
                "method": "POST",
            }
        );
        expect(result).toEqual(mockResponse);
    });

    test("should throw and log an error on createFactory", async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                statusText: "404",
            }),
        );

        expect(async () => {
            await createFactory(mockFactories[0]);
        }).rejects.toThrow("Failed to add new factory");

        await waitFor(() =>{
            expect(consoleErrorMock).toHaveBeenCalledWith(
                "Failed to add new factory:", 
                new Error("Failed to add new factory: 404"),
            );
        });
    });

    test("should fetch and return two factories using getAllFactories", async () => {
        const mockResponse = [mockFactories[0], mockFactories[1]];

        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => mockResponse,
            }),
        );

        const result = await getAllFactories();

        expect(global.fetch).toHaveBeenCalledWith(
            "undefined/factories", 
            requestOptions
        );
        expect(result).toHaveLength(2);
        expect(result).toEqual(mockResponse);
    });

    test("should fetch and return three factories using getAllFactories", async () => {
        const mockResponse = [mockFactories[0], mockFactories[1], mockFactories[2]];

        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => mockResponse,
            }),
        );

        const result = await getAllFactories();

        expect(global.fetch).toHaveBeenCalledWith(
            "undefined/factories", 
            requestOptions
        );
        expect(result).toHaveLength(3);
        expect(result).toEqual(mockResponse);
    });

    test("should fetch and return four factories using getAllFactories", async () => {
        const mockResponse = mockFactories;

        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => mockResponse,
            }),
        );

        const result = await getAllFactories();

        expect(global.fetch).toHaveBeenCalledWith(
            "undefined/factories", 
            requestOptions
        );
        expect(result).toHaveLength(4);
        expect(result).toEqual(mockResponse);
    });

    test("should throw and log an error on getAllFactories", async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                statusText: "404",
            }),
        );

        expect(async () => {
            await getAllFactories();
        }).rejects.toThrow("Failed to fetch all factories.");

        await waitFor(() =>{
            expect(consoleErrorMock).toHaveBeenCalledWith(
                "Failed to fetch all factories: ", 
                new Error("Failed to fetch all factories: 404"),
            );
        });
    });

    test("should update a factory using updateFactory", async () => {
        const updatedFactory: Factory = {
            ...mockFactories[0],
            name: "Updated Factory",
        };
        const mockResponse = updatedFactory;

        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => mockResponse,
            }),
        );

        const result = await updateFactory(updatedFactory);

        expect(global.fetch).toHaveBeenCalledWith(
            "undefined/factories",
            {
                "body": JSON.stringify(updatedFactory),
                "headers": {
                    "Content-Type": "application/json",
                },
                "method": "PUT",
            }
        );
        expect(result).toEqual(mockResponse);
    });

    test("should throw and log an error on updateFactory", async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                statusText: "404",
            }),
        );

        expect(async () => {
            await updateFactory(mockFactories[0]);
        }).rejects.toThrow("Failed to update factory.");

        await waitFor(() =>{
            expect(consoleErrorMock).toHaveBeenCalledWith(
                "Failed to update factory: ", 
                new Error("Failed to update factory: 404"),
            );
        });
    });
});
