/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, waitFor } from "@testing-library/react";
import { Asset } from "@/app/api/_utils/types";
import AssetInventory from "../components/factorydashboard/floormanager/inventory/AssetInventory";
import InventoryNavBar from "../components/factorydashboard/floormanager/inventory/InventoryNavBar";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("AssetInventory", () => {
    beforeEach(() => {
        global.URL.createObjectURL = jest.fn();
        // const mockImageData = new Blob([""], { type: "image/jpeg" });
        const mockBase64Data = "data:image/jpeg;base64,";
        fetchMock.mockResponseOnce(() => Promise.resolve(mockBase64Data));
    });
    
    test("should have asset inventory navbar", () => {
        const { getByText } = render(<InventoryNavBar />);
        const cncHeader = getByText("CNC Models");
        const stampingHeader = getByText("Stamping Models");
        const edmHeader = getByText("EDM Models");

        expect(cncHeader).toBeInTheDocument();
        expect(stampingHeader).toBeInTheDocument();
        expect(edmHeader).toBeInTheDocument();
    });

    test("should render list of assets", async () => {
        const mockAssets: Asset[] = [
            {
                assetId: "1",
                name: "Asset 1",
                description: "Description 1",
                imageData: "image1.jpg",
                factoryId: "1",
            },
            {
                assetId: "2",
                name: "Asset 2",
                description: "Description 2",
                imageData: "image2.jpg",
                factoryId: "1",
            },
        ];

        const { findByAltText } = render(
            <AssetInventory
                assets={mockAssets}
                setSelectedAsset={jest.fn()}
                selectedAsset={null}
            />,
        );

        mockAssets.forEach(async (asset) => {
            const image = await findByAltText(`${asset.name} Asset Image`);
            expect(image).toBeInTheDocument();
        });
    });

    test("should render No assets available when assets array is empty", () => {
        const assets: Asset[] = [];

        const { getByText } = render(
            <AssetInventory
                assets={assets}
                setSelectedAsset={jest.fn()}
                selectedAsset={null}
            />,
        );
        const noAssetsMessage = getByText("No assets found.");

        expect(noAssetsMessage).toBeInTheDocument();
    });
});
