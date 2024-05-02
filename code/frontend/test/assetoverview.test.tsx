/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Model, Asset } from "@/app/types/types";
import AssetOverview from "@/components/assetdashboard/AssetOverview";
import { BackendConnector } from "@/app/api/_utils/connector";

const mockGet = jest.fn();
BackendConnector.get = mockGet;

const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

const mockModel: Model[] = [
    {
        modelId: "1",
        factoryId: "1",
        attributes: [
            {
                attributeId: "1",
                factoryId: "1",
                modelId: "1",
                name: "Model Name",
                value: "Model 1",
            },
            {
                attributeId: "2",
                factoryId: "1",
                modelId: "1",
                name: "Serial Number",
                value: "SN-1243-541",
            }
        ],
        properties: [
            {
                propertyId: "1",
                factoryId: "1",
                modelId: "1",
                measurementId: "1",
                name: "Property 1",
                unit: "Unit 1",
                generatorType: "Generator 1",
            },
        ],
        measurements: [
            {
                measurementId: "1",
                modelId: "1",
                factoryId: "1",
                lowerBound: 1,
                upperBound: 10,
                generatorFunction: "Generator 1",
                frequency: 1,
                precision: 1,
            },
        ],
    },
];

describe("AssetOverview", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should render model information", async () => {
        mockGet.mockResolvedValueOnce(mockModel);

        const asset: Asset = {
            factoryId: "1",
            modelId: "1",
            name: "Asset 1",
            description: "Asset 1 description",
            imageData: "https://www.example.com/image.jpg",
        };

        const { getByText } = render(<AssetOverview asset={asset} />);

        await waitFor(() => {
            expect(getByText(`${asset.name}`)).toBeInTheDocument();
            expect(getByText("Asset Model:")).toBeInTheDocument();
            expect(getByText("Asset Properties:")).toBeInTheDocument();
        });
    });

    test("should log error when there are not models", async () => {
        mockGet.mockResolvedValueOnce([]);

        const asset: Asset = {
            factoryId: "1",
            modelId: "1",
            name: "Asset 1",
            description: "Asset 1 description",
            imageData: "https://www.example.com/image.jpg",
        };

        const consoleError = jest.spyOn(console, "error");
        consoleError.mockImplementation(() => {});

        render(<AssetOverview asset={asset} />);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith("No models returned from backend");
        });
    });

    test("should log error on failure of fetching models", async () => {
        mockGet.mockRejectedValueOnce(new Error("Could not find models"));

        const asset: Asset = {
            factoryId: "1",
            modelId: "1",
            name: "Asset 1",
            description: "Asset 1 description",
            imageData: "https://www.example.com/image.jpg",
        };

        const consoleError = jest.spyOn(console, "error");
        consoleError.mockImplementation(() => {});

        render(<AssetOverview asset={asset} />);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to fetch models:", new Error("Could not find models"));
        });
    });
});
