/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, fireEvent, getAllByAltText } from "@testing-library/react";
import "@testing-library/jest-dom";
import AssetInventory from "../components/factorydashboard/floormanager/AssetInventory";
import InventoryNavBar from "../components/factorydashboard/floormanager/InventoryNavBar";
import { Asset } from "@/app/types/types";

describe("AssetInventory", () => { 
    test("should have asset inventory navbar", () => {

        const { getByText } = render(<InventoryNavBar/>);
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
                id: "1",
                name: "Asset 1",
                description: "Description 1",
                image: "/image1.jpg",
            },
            {
                id: "2",
                name: "Asset 2",
                description: "Description 2",
                image: "/image2.jpg",
            },
        ];

        const { getAllByAltText } = render(<AssetInventory assets={assets} setSelectedAsset={jest.fn()} selectedAsset={null}/>);

        assets.forEach((asset) => {
            const assetImage = getAllByAltText(`${asset.name} Asset mage`);
        );

            expect(assetImage).toBeInTheDocument();
        });
    });

    test("should render No assets available when assets array is empty", () => {
        const assets: Asset[] = [];
        
        const { getByText } = render(<AssetInventory assets={assets} setSelectedAsset={jest.fn()} selectedAsset={null}/>);
        const noAssetsMessage = getByText("No assets found.");

        expect(noAssetsMessage).toBeInTheDocument();
    });
});
