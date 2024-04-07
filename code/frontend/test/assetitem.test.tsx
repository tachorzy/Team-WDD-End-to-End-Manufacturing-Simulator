/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render } from "@testing-library/react";
import fetchMock from 'jest-fetch-mock';
import { Asset } from "@/app/api/_utils/types";
import AssetItem from "../components/factorydashboard/floormanager/AssetItem";

describe("AssetItem", () => {
    beforeEach(() => {
        const mockImageData = new Blob([''], { type: 'image/jpeg' });
        const mockBase64Data = 'data:image/jpeg;base64,';
        fetchMock.mockResponseOnce(() => Promise.resolve(mockBase64Data));
    });

    test("should render correctly with valid asset", () => {
        const asset: Asset = {
            assetId: "1",
            name: "Asset 1",
            description: "Description",
            imageData: "https://wcs.smartdraw.com/floor-plan/img/facility-planning-example.png?bn=15100111927", // for some reason it doesnt pass in github when we use image/test.jpg so a temp solution is using a real image url
            factoryId: "1",
        };

        const { getByAltText } = render(
            <AssetItem
                asset={asset}
                setSelectedAsset={jest.fn()}
                selectedAsset={null}
            />,
        );

        expect(getByAltText(`${asset.name} Asset Image`)).toBeInTheDocument();
    });

    test("should render placeholder asset image when no image is provided", () => {
        const asset: Asset = {
            assetId: "1",
            name: "Asset 1",
            description: "Description 1",
            imageData: "",
            factoryId: "1",
        };

        const { getByAltText } = render(
            <AssetItem
                asset={asset}
                setSelectedAsset={jest.fn()}
                selectedAsset={null}
            />,
        );

        const assetImage = getByAltText(
            `${asset.name} Asset Image`,
        ) as HTMLImageElement;
        expect(assetImage.src).toContain("placeholder-asset.svg");
        expect(assetImage).toBeInTheDocument();
    });
});
