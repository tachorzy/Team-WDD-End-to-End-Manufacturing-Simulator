/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render } from "@testing-library/react";
import { Asset } from "@/app/types/types";
import AssetItem from "../components/factorydashboard/floormanager/AssetItem";
// code\frontend\components\factorydashboard\floormanager\AssetItem.tsx
describe("AssetItem", () => {
    test("should render correctly with valid asset", () => {
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

        const { getByText, getByAltText } = render(
            <AssetItem
                asset={assets[0]}
                setSelectedAsset={jest.fn()}
                selectedAsset={null}
            />,
        );

        expect(
            getByAltText(`${assets[0].name} Asset Image`),
        ).toBeInTheDocument();
    });

    test("should render placeholder asset image when no image is provided", () => {
        const assets: Asset[] = [
            {
                id: "1",
                name: "Asset 1",
                description: "Description 1",
                image: "",
            },
        ];

        const { getByAltText } = render(
            <AssetItem
                asset={assets[0]}
                setSelectedAsset={jest.fn()}
                selectedAsset={null}
            />,
        );

        const assetImage = getByAltText(
            `${assets[0].name} Asset Image`,
        ) as HTMLImageElement;
        expect(assetImage.src).toBe(
            "http://localhost/icons/floorplan/placeholder-asset.svg",
        );
        expect(assetImage).toBeInTheDocument();
    });
});
