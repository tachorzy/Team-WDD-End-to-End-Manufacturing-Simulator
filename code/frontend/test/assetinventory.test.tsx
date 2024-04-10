/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import { Asset } from "@/app/api/_utils/types";
import AssetInventory from "../components/factorydashboard/floormanager/AssetInventory";
import InventoryNavBar from "../components/factorydashboard/floormanager/InventoryNavBar";

fetchMock.enableMocks();

beforeEach(() => {
    global.URL.createObjectURL = jest.fn();
    fetchMock.resetMocks();
    const mockBase64Image = `data:image/jpeg;base64,${btoa("fake-image-data")}`;
    fetchMock.mockResponseOnce(JSON.stringify({ src: mockBase64Image }));
});

describe("AssetInventory", () => {
    test("should have asset inventory navbar", () => {
        const { getByText } = render(<InventoryNavBar />);
        const cncHeader = getByText("CNC Models");
        const stampingHeader = getByText("Stamping Models");
        const edmHeader = getByText("EDM Models");

        expect(cncHeader).toBeInTheDocument();
        expect(stampingHeader).toBeInTheDocument();
        expect(edmHeader).toBeInTheDocument();
    });

    test("should render list of assets", () => {
        const assets: Asset[] = [
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

        const { getAllByAltText } = render(
            <AssetInventory
                assets={assets}
                setSelectedAsset={jest.fn()}
                selectedAsset={null}
            />,
        );

        assets.forEach((asset) => {
            const assetImages = getAllByAltText(`${asset.name} Asset Image`);
            assetImages.forEach((image) => {
                expect(image).toBeInTheDocument();
            });
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
