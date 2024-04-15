/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import {
    NextServerConnector,
    BackendConnector,
    GetConfig,
    PostConfig,
    PutConfig,
} from "@/app/api/_utils/connector";

global.fetch = jest.fn();

interface ConstantsType {
    BASE_BACKEND_API_URL: string;
}

jest.mock("@/app/api/_utils/constants", () => ({
    ...(jest.requireActual(
        "@/app/api/_utils/constants",
    ) as unknown as ConstantsType),
    BASE_BACKEND_API_URL: "http://mock-api-url",
}));

describe("Connector", () => {
    describe("As Next Server Connector", () => {
        beforeEach(() => {
            (global.fetch as jest.Mock).mockClear();
        });

        afterAll(() => {
            (global.fetch as jest.Mock).mockRestore();
        });

        const url = "http://localhost/api/mockResource";
        const fetchOptions = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        test("should successfully get a resouce", async () => {
            const mockResponse = { data: "mockData" };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => mockResponse,
            });

            const config: GetConfig = {
                resource: "mockResource",
            };
            const result = await NextServerConnector.get(config);

            expect(result).toEqual(mockResponse);
            expect(global.fetch).toHaveBeenCalledWith(url, fetchOptions);
        });

        test("should successfully get a resouce with search parameters ", async () => {
            const mockResponse = { data: "mockData" };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => mockResponse,
            });

            const config: GetConfig = {
                resource: "mockResource",
                params: { key: "value" },
            };
            const result = await NextServerConnector.get(config);

            expect(result).toEqual(mockResponse);
            expect(global.fetch).toHaveBeenCalledWith(
                `${url}?key=value`,
                fetchOptions,
            );
        });

        test("should throw an error if the get response is not ok", async () => {
            const config: GetConfig = {
                resource: "mockResource",
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                statusText: `${config.resource} Not Found`,
            });

            await expect(NextServerConnector.get(config)).rejects.toThrow(
                new Error(`Fetch error: ${config.resource} Not Found`),
            );
        });

        test("should successfully post it's playload", async () => {
            interface MockType {
                mockData: string;
            }

            const config: PostConfig<MockType> = {
                resource: "mockResource",
                payload: { mockData: "Post this data" },
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => config.payload,
            });

            const result = await NextServerConnector.post<MockType>(config);

            const postOptions = {
                ...fetchOptions,
                method: "POST",
                body: JSON.stringify(config.payload),
            };

            expect(result).toEqual(config.payload);
            expect(global.fetch).toHaveBeenCalledWith(url, postOptions);
        });

        test("should throw an error if the post response is not ok", async () => {
            interface MockType {
                mockData: string;
            }

            const config: PostConfig<MockType> = {
                resource: "mockResource",
                payload: { mockData: "Post this data" },
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                statusText: `${config.resource} Not Found`,
            });

            await expect(
                NextServerConnector.post<MockType>(config),
            ).rejects.toThrow(
                new Error(`Fetch error: ${config.resource} Not Found`),
            );
        });

        test("should successfully put it's payload", async () => {
            interface MockType {
                mockData: string;
            }

            const config: PutConfig<MockType> = {
                resource: "mockResource",
                payload: { mockData: "Put this data" },
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => config.payload,
            });

            await NextServerConnector.put<MockType>(config);

            const putOptions = {
                ...fetchOptions,
                method: "PUT",
                body: JSON.stringify(config.payload),
            };

            expect(global.fetch).toHaveBeenCalledWith(url, putOptions);
        });

        test("should throw an error if the put response is not ok", async () => {
            interface MockType {
                mockData: string;
            }

            const config: PostConfig<MockType> = {
                resource: "mockResource",
                payload: { mockData: "Put this data" },
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                statusText: `${config.resource} Not Found`,
            });

            await expect(
                NextServerConnector.put<MockType>(config),
            ).rejects.toThrow(
                new Error(`Fetch error: ${config.resource} Not Found`),
            );
        });

        test("each method should throw TypeError when url is empty", async () => {
            jest.doMock("@/app/api/_utils/constants", () => ({
                BASE_NEXT_API_URL: undefined,
            }));
            jest.resetModules();

            interface ConnectorType {
                NextServerConnector: typeof NextServerConnector;
            }

            const { NextServerConnector: ActualNextServerConnector } =
                jest.requireActual(
                    "@/app/api/_utils/connector",
                ) as unknown as ConnectorType;

            interface MockType {
                mockData: string;
            }

            await expect(
                ActualNextServerConnector.get({ resource: "mockResource" }),
            ).rejects.toThrow(new TypeError("Invalid URL: /mockResource"));
            await expect(
                ActualNextServerConnector.post<MockType>({
                    resource: "mockResource",
                    payload: { mockData: "Post this data" },
                }),
            ).rejects.toThrow(new TypeError("Invalid URL: /mockResource"));
            await expect(
                ActualNextServerConnector.put<MockType>({
                    resource: "mockResource",
                    payload: { mockData: "Put this data" },
                }),
            ).rejects.toThrow(new TypeError("Invalid URL: /mockResource"));
        });
    });

    describe("As Backend Connector", () => {
        beforeEach(() => {
            (global.fetch as jest.Mock).mockClear();
        });

        afterAll(() => {
            (global.fetch as jest.Mock).mockRestore();
        });

        const url = "http://mock-api-url/mockResource";
        const fetchOptions = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        test("should successfully get a resouce", async () => {
            const mockResponse = { data: "mockData" };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => mockResponse,
            });

            const config: GetConfig = {
                resource: "mockResource",
            };
            const result = await BackendConnector.get(config);

            expect(result).toEqual(mockResponse);
            expect(global.fetch).toHaveBeenCalledWith(url, fetchOptions);
        });

        test("should successfully get a resouce with search parameters ", async () => {
            const mockResponse = { data: "mockData" };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => mockResponse,
            });

            const config: GetConfig = {
                resource: "mockResource",
                params: { key: "value" },
            };
            const result = await BackendConnector.get(config);

            expect(result).toEqual(mockResponse);
            expect(global.fetch).toHaveBeenCalledWith(
                `${url}?key=value`,
                fetchOptions,
            );
        });

        test("should throw an error if the get response is not ok", async () => {
            const config: GetConfig = {
                resource: "mockResource",
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                statusText: `${config.resource} Not Found`,
            });

            await expect(BackendConnector.get(config)).rejects.toThrow(
                new Error(`Fetch error: ${config.resource} Not Found`),
            );
        });

        test("should successfully post it's playload", async () => {
            interface MockType {
                mockData: string;
            }

            const config: PostConfig<MockType> = {
                resource: "mockResource",
                payload: { mockData: "Post this data" },
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => config.payload,
            });

            const result = await BackendConnector.post<MockType>(config);

            const postOptions = {
                ...fetchOptions,
                method: "POST",
                body: JSON.stringify(config.payload),
            };

            expect(result).toEqual(config.payload);
            expect(global.fetch).toHaveBeenCalledWith(url, postOptions);
        });

        test("should throw an error if the post response is not ok", async () => {
            interface MockType {
                mockData: string;
            }

            const config: PostConfig<MockType> = {
                resource: "mockResource",
                payload: { mockData: "Post this data" },
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                statusText: `${config.resource} Not Found`,
            });

            await expect(
                BackendConnector.post<MockType>(config),
            ).rejects.toThrow(
                new Error(`Fetch error: ${config.resource} Not Found`),
            );
        });

        test("should successfully put it's payload", async () => {
            interface MockType {
                mockData: string;
            }

            const config: PutConfig<MockType> = {
                resource: "mockResource",
                payload: { mockData: "Put this data" },
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => config.payload,
            });

            await BackendConnector.put<MockType>(config);

            const putOptions = {
                ...fetchOptions,
                method: "PUT",
                body: JSON.stringify(config.payload),
            };

            expect(global.fetch).toHaveBeenCalledWith(url, putOptions);
        });

        test("should throw an error if the put response is not ok", async () => {
            interface MockType {
                mockData: string;
            }

            const config: PostConfig<MockType> = {
                resource: "mockResource",
                payload: { mockData: "Put this data" },
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                statusText: `${config.resource} Not Found`,
            });

            await expect(
                BackendConnector.put<MockType>(config),
            ).rejects.toThrow(
                new Error(`Fetch error: ${config.resource} Not Found`),
            );
        });

        test("each method should throw TypeError when url is empty", async () => {
            jest.doMock("@/app/api/_utils/constants", () => ({
                BASE_BACKEND_API_URL: undefined,
            }));
            jest.resetModules();

            interface ConnectorType {
                BackendConnector: typeof BackendConnector;
            }

            const { BackendConnector: ActualBackendConnector } =
                jest.requireActual(
                    "@/app/api/_utils/connector",
                ) as unknown as ConnectorType;

            interface MockType {
                mockData: string;
            }

            await expect(
                ActualBackendConnector.get({ resource: "mockResource" }),
            ).rejects.toThrow(new TypeError("Invalid URL: /mockResource"));
            await expect(
                ActualBackendConnector.post<MockType>({
                    resource: "mockResource",
                    payload: { mockData: "Post this data" },
                }),
            ).rejects.toThrow(new TypeError("Invalid URL: /mockResource"));
            await expect(
                ActualBackendConnector.put<MockType>({
                    resource: "mockResource",
                    payload: { mockData: "Put this data" },
                }),
            ).rejects.toThrow(new TypeError("Invalid URL: /mockResource"));
        });
    });
});
