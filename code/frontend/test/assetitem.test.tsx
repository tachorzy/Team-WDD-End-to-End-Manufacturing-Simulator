/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render } from "@testing-library/react";
import { Asset } from "@/app/types/types";
import AssetItem from "../components/factorydashboard/floormanager/AssetItem";

describe("AssetItem", () => {
    test("should render correctly with valid asset", () => {
        const asset: Asset = {
            assetId: "1",
            name: "Asset 1",
            description: "Description",
            image: "test.jpg",
            factoryId: "1",
        };

        const { getByAltText } = render(
            <AssetItem
                asset={asset}
                setSelectedAsset={jest.fn()}
                selectedAsset={null}
            />,
        );

        expect(
            getByAltText(`${asset.name} Asset Image`), 
        ).toBeInTheDocument();
    });

    test("should render placeholder asset image when no image is provided", () => {
        const asset: Asset = {
            assetId: "1",
            name: "Asset 1",
            description: "Description 1",
            image: "",
            factoryId: "1",
        };

        const { getByAltText } = render(
            <AssetItem
                asset={asset} 
                setSelectedAsset={jest.fn()}
                selectedAsset={null}
            />,
        );

        const assetImage = getByAltText(`${asset.name} Asset Image`) as HTMLImageElement;
        expect(assetImage.src).toContain("placeholder-asset.svg");
        expect(assetImage).toBeInTheDocument();
    });
});
