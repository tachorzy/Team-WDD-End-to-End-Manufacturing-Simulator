/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render } from "@testing-library/react";
import AssetItem from "../components/factorydashboard/floormanager/AssetItem";
import { Asset } from "@/app/types/types";
// code\frontend\components\factorydashboard\floormanager\AssetItem.tsx
describe("AssetItem", () => {
    test("should render correctly with valid asset", () => {
        const assets: Asset[] = [
            {
                id: "1",
                name: "Asset 1",
                description: "Description 1",
                image: "image1.jpg",
            },
            {
                id: "2",
                name: "Asset 2",
                description: "Description 2",
                image: "image2.jpg",
            },
        ];

        const { getByText, getByAltText } = render(<AssetItem asset={assets[0]} setSelectedAsset={jest.fn()} selectedAsset={null}/>);

        expect(getByText("Name: Asset 1")).toBeInTheDocument();
        expect(getByText("Description: Description")).toBeInTheDocument();
    });

    test("should render asset name when asset is undefined", () => {
        const assets: Asset[] = [
            {
                id: "1",
                name: "Asset 1",
                description: "Description 1",
                image: "image1.jpg",
            },
            {
                id: "2",
                name: "Asset 2",
                description: "Description 2",
                image: "image2.jpg",
            },
        ];

        const { getByText } = render(<AssetItem asset={assets[0]} setSelectedAsset={jest.fn()} selectedAsset={null}/>);

        expect(getByText("No asset data available")).toBeInTheDocument();
    });
});
