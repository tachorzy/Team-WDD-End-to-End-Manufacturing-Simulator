/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import {NextServerConnector, BackendConnector, GetConfig, PostConfig, PutConfig} from "@/app/api/_utils/connector";

global.fetch = jest.fn();

jest.mock("@/app/api/_utils/constants", () => ({
    ...jest.requireActual("@/app/api/_utils/constants"),
    BASE_BACKEND_API_URL: "http://mock-api-url",
}));

describe("Connector", () => {
    describe("Instance creation", () => {
        test("should set baseURL to an empty string", () => {
            // Mock the constants to be an empty string
            jest.doMock("@/app/api/_utils/constants", () => ({
                BASE_BACKEND_API_URL: undefined,
                BASE_NEXT_API_URL: undefined,
            }));

            // Reload the module to apply the mock
            jest.resetModules();
            const { BackendConnector, NextServerConnector } = require("@/app/api/_utils/connector");

            expect(BackendConnector.baseURL).toBe("");
            expect(NextServerConnector.baseURL).toBe("");
        });
    });

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
                "Content-Type": "application/json"
            }
        };

        test("should successfully get a resouce", async () => {
            const mockResponse = { data: "mockData" };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => mockResponse,
            });

            const config: GetConfig = { 
                resource: "mockResource" 
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
                params: { key: "value" } 
            };
            const result = await NextServerConnector.get(config);

            expect(result).toEqual(mockResponse);
            expect(global.fetch).toHaveBeenCalledWith(url + "?key=value", fetchOptions);
        }); 

        test("should throw an error if the get response is not ok", async () => {
            const config: GetConfig = { 
                resource: "mockResource" 
            };
            
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                statusText: `${config.resource} Not Found`,
            });

            await expect(NextServerConnector.get(config)).rejects.toThrow(new Error(`Fetch error: ${config.resource} Not Found`));
        });

        test("should successfully post it's playload", async () => {
            interface mockType {
                mockData: string;
            }
            
            const config: PostConfig<mockType> = { 
                resource: "mockResource", 
                payload: {mockData: "Post this data"}
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => config.payload,
            });

            const result = await NextServerConnector.post<mockType>(config);

            const postOptions = {
                ...fetchOptions,
                method: "POST",
                body: JSON.stringify(config.payload)
            }

            expect(result).toEqual(config.payload);
            expect(global.fetch).toHaveBeenCalledWith(url, postOptions);
        });

        test("should throw an error if the post response is not ok", async () => {
            interface mockType {
                mockData: string;
            }
            
            const config: PostConfig<mockType> = { 
                resource: "mockResource", 
                payload: {mockData: "Post this data"}
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                statusText: `${config.resource} Not Found`,
            });

            await expect(NextServerConnector.post<mockType>(config)).rejects.toThrow(new Error(`Fetch error: ${config.resource} Not Found`));
        });

        test("should successfully put it's payload", async () => {
            interface mockType {
                mockData: string;
            }
            
            const config: PutConfig<mockType> = { 
                resource: "mockResource", 
                payload: {mockData: "Put this data"}
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => config.payload,
            });

            await NextServerConnector.put<mockType>(config);

            const putOptions = {
                ...fetchOptions,
                method: "PUT",
                body: JSON.stringify(config.payload)
            }

            expect(global.fetch).toHaveBeenCalledWith(url, putOptions);
        });

        test("should throw an error if the put response is not ok", async () => {
            interface mockType {
                mockData: string;
            }
            
            const config: PostConfig<mockType> = { 
                resource: "mockResource", 
                payload: {mockData: "Put this data"}
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                statusText: `${config.resource} Not Found`,
            });

            await expect(NextServerConnector.put<mockType>(config)).rejects.toThrow(new Error(`Fetch error: ${config.resource} Not Found`));
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
                "Content-Type": "application/json"
            }
        };

        test("should successfully get a resouce", async () => { 
            const mockResponse = { data: "mockData" };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => mockResponse,
            });

            const config: GetConfig = { 
                resource: "mockResource" 
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
                params: { key: "value" } 
            };
            const result = await BackendConnector.get(config);

            expect(result).toEqual(mockResponse);
            expect(global.fetch).toHaveBeenCalledWith(url + "?key=value", fetchOptions);
        }); 

        test("should throw an error if the get response is not ok", async () => {
            const config: GetConfig = { 
                resource: "mockResource" 
            };
            
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                statusText: `${config.resource} Not Found`,
            });

            await expect(BackendConnector.get(config)).rejects.toThrow(new Error(`Fetch error: ${config.resource} Not Found`));
        });

        test("should successfully post it's playload", async () => {
            interface mockType {
                mockData: string;
            }
            
            const config: PostConfig<mockType> = { 
                resource: "mockResource", 
                payload: {mockData: "Post this data"}
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => config.payload,
            });

            const result = await BackendConnector.post<mockType>(config);

            const postOptions = {
                ...fetchOptions,
                method: "POST",
                body: JSON.stringify(config.payload)
            }

            expect(result).toEqual(config.payload);
            expect(global.fetch).toHaveBeenCalledWith(url, postOptions);
        });

        test("should throw an error if the post response is not ok", async () => {
            interface mockType {
                mockData: string;
            }
            
            const config: PostConfig<mockType> = { 
                resource: "mockResource", 
                payload: {mockData: "Post this data"}
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                statusText: `${config.resource} Not Found`,
            });

            await expect(BackendConnector.post<mockType>(config)).rejects.toThrow(new Error(`Fetch error: ${config.resource} Not Found`));
        });

        test("should successfully put it's payload", async () => {
            interface mockType {
                mockData: string;
            }
            
            const config: PutConfig<mockType> = { 
                resource: "mockResource", 
                payload: {mockData: "Put this data"}
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => config.payload,
            });

            await BackendConnector.put<mockType>(config);

            const putOptions = {
                ...fetchOptions,
                method: "PUT",
                body: JSON.stringify(config.payload)
            }

            expect(global.fetch).toHaveBeenCalledWith(url, putOptions);
        });

        test("should throw an error if the put response is not ok", async () => {
            interface mockType {
                mockData: string;
            }
            
            const config: PostConfig<mockType> = { 
                resource: "mockResource", 
                payload: {mockData: "Put this data"}
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                statusText: `${config.resource} Not Found`,
            });

            await expect(BackendConnector.put<mockType>(config)).rejects.toThrow(new Error(`Fetch error: ${config.resource} Not Found`));
        });
    });
});
