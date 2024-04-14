/**
 * @jest-environment jsdom
 */

import fetchMock from "jest-fetch-mock";
import { BackendConnector } from "@/app/api/_utils/connector";
import { Asset } from "@/app/api/_utils/types";

fetchMock.enableMocks();

beforeEach(() => {
    fetchMock.resetMocks();
    process.env.NEXT_PUBLIC_AWS_ENDPOINT = "https://aws.com/api";
});

describe("BackendConnector", () => {
    const BASE_URL = process.env.NEXT_PUBLIC_AWS_ENDPOINT;

    describe("post (createAsset)", () => {
        it("should successfully create an asset", async () => {
            const mockAsset: Asset = {
                assetId: "",
                name: "Test Asset",
                description: "Test Description",
                factoryId: "factory123",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockAsset));

            const result = await BackendConnector.post<Asset>({
                resource: "assets",
                payload: mockAsset,
            });

            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/assets`, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify(mockAsset),
            });
            expect(result).toEqual(mockAsset);
        });
    });

    describe("get (getAssetsForFactory)", () => {
        it("should fetch assets for a given factory ID", async () => {
            const factoryId = "factory123";
            const mockAssets: Asset[] = [
                { assetId: "1", name: "Asset 1", factoryId, description: "" },
                { assetId: "2", name: "Asset 2", factoryId, description: "" },
            ];

            fetchMock.mockResponseOnce(JSON.stringify(mockAssets));

            const result = await BackendConnector.get<Asset[]>({
                resource: "assets",
                params: { factoryId },
            });

            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock).toHaveBeenCalledWith(
                `${BASE_URL}/assets?factoryId=${factoryId}`,
                {
                    headers: { "Content-Type": "application/json" },
                },
            );
            expect(result).toEqual(mockAssets);
        });
    });
});
