/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AssetInventory from "../components/factorydashboard/floormanager/AssetInventory";

describe("AssetInventory", () => {
    test("should Asset Inventory heading", () => {
        const assets = [
            {
                id: "1",
                name: "Asset 1",
                description: "Description 1",
                image: "image1.jpg",
                factoryId:"1"
            },
            {
                id: "2",
                name: "Asset 2",
                description: "Description 2",
                image: "image2.jpg",
                factoryId:"2"
            },
        ];

        const { getByText } = render(<AssetInventory assets={assets} />);
        const headingElement = getByText("Asset Inventory");

        expect(headingElement).toBeInTheDocument();
    });

    test("should render list of assets", () => {
        const assets = [
            {
                id: "1",
                name: "Asset 1",
                description: "Description 1",
                image: "image1.jpg",
                factoryId:"1"
            },
            {
                id: "2",
                name: "Asset 2",
                description: "Description 2",
                image: "image2.jpg",
                factoryId:"1"
            },
        ];

        const { getByText } = render(<AssetInventory assets={assets} />);

        assets.forEach((asset) => {
            const assetNameElement = getByText(
                (content, node) => node!.textContent === `Name: ${asset.name}`,
            );
            const assetDescriptionElement = getByText(
                (content, node) =>
                    node!.textContent === `Description: ${asset.description}`,
            );

            expect(assetNameElement).toBeInTheDocument();
            expect(assetDescriptionElement).toBeInTheDocument();
        });
    });

    test("should render No assets available when assets array is empty", () => {
        const { getByText } = render(<AssetInventory assets={[]} />);
        const noAssetsMessage = getByText("No assets available");

        expect(noAssetsMessage).toBeInTheDocument();
    });
});
