/**
 * @jest-environment jsdom
 */

import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Asset } from "@/app/api/_utils/types";
import Blueprint from "../components/factorydashboard/floorplan/blueprint/Blueprint";
import AssetMarker from "../components/factorydashboard/floorplan/blueprint/marker/AssetMarker";

global.URL.createObjectURL = jest
    .fn()
    .mockReturnValue("http://test.com/test.png");

describe("Blueprint Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should render an image as a floorplan", () => {
        const mockAsset: Asset = {
            assetId: "1",
            name: "Asset 1",
            description: "Description 1",
            imageData: "assets/images/floorplan.jpg",
            factoryId: "1",
            modelId: "1",
            modelUrl: "assets/models/model.glb",
            floorplanCords: { x: 0, y: 0 },
        };

        const mockFile = new File(["(⌐□_□)"], "floorplan.jpg", {
            type: "image/jpg",
        });

        const mockAssetMarkers: JSX.Element[] = [
            <AssetMarker asset={mockAsset} />,
        ];

        const { getByAltText } = render(
            <Blueprint imageFile={mockFile} assetMarkers={mockAssetMarkers} />,
        );

        const floorplan = getByAltText("floorplan") as HTMLImageElement;
        expect(floorplan).toBeInTheDocument();
        expect(floorplan.src).toBeDefined();
    });

    test("should render with the correct CSS classes", () => {
        const mockAsset: Asset = {
            assetId: "1",
            name: "Asset 1",
            description: "Description 1",
            imageData: "assets/images/floorplan.jpg",
            factoryId: "1",
            modelId: "1",
            modelUrl: "assets/models/model.glb",
            floorplanCords: { x: 0, y: 0 },
        };

        const mockFile = new File(["(⌐□_□)"], "floorplan.jpg", {
            type: "image/jpg",
        });

        const mockAssetMarkers: JSX.Element[] = [
            <AssetMarker asset={mockAsset} />,
        ];

        const { container } = render(
            <Blueprint imageFile={mockFile} assetMarkers={mockAssetMarkers} />,
        );
        expect(container.firstChild).toHaveClass(
            "sticky overflow-hidden h-min w-[55%]",
        );
    });
});
