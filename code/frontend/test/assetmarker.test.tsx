/**
 * @jest-environment jsdom
 */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Asset } from "@/app/api/_utils/types";
import AssetMarker from "../components/factorydashboard/floorplan/blueprint/AssetMarker";

describe("AssetMarker Component", () => {
    test("should have a label with the name of the asset", () => {
        const mockAsset: Asset = {
            assetId: "1",
            name: "Asset 1",
            description: "Description 1",
            image: "/image1.jpg",
            factoryId: "1",
        };

        render(<AssetMarker asset={mockAsset} />);

        const label = screen.getByText(`${mockAsset.name}`);

        expect(label).toHaveClass(
            "shadow-md text-xs group-hover:visible invisible text-center self-center bg-opacity-[40%] px-1 py-0.5 font-medium rounded-sm bg-gray-800 my-1",
        );
    });

    test("should render the correct marker image", () => {
        const mockAsset: Asset = {
            assetId: "1",
            name: "Asset 1",
            description: "Description 1",
            image: "/image1.jpg",
            factoryId: "1",
        };

        const { getByAltText } = render(<AssetMarker asset={mockAsset} />);

        const markerImage = getByAltText(
            "asset marker icon",
        ) as HTMLImageElement;
        expect(markerImage.src).toContain("/icons/floorplan/asset-marker.svg");
    });

    test("should be draggable", () => {
        const mockAsset: Asset = {
            assetId: "1",
            name: "Asset 1",
            description: "Description 1",
            image: "/image1.jpg",
            factoryId: "1",
        };

        const { getByText } = render(<AssetMarker asset={mockAsset} />);

        const assetMarker = getByText(`${mockAsset.name}`);

        fireEvent.mouseDown(assetMarker);
        fireEvent.mouseMove(assetMarker, { clientX: 100, clientY: 100 });
        fireEvent.mouseUp(assetMarker);
    });
});
