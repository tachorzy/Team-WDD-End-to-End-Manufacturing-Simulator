/**
 * @jest-environment jsdom
 */

import React from "react";
import { createEvent, fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Asset } from "@/app/api/_utils/types";
import AssetMarker from "../components/factorydashboard/floorplan/blueprint/marker/AssetMarker";

describe("AssetMarker Component", () => {
    const mockAsset: Asset = {
        assetId: "1",
        name: "Asset 1",
        description: "Description 1",
        imageData: "imageData.png",
        factoryId: "1",
    };

    test("should render without error", () => {
        const { getByText, getByAltText } = render(
            <AssetMarker asset={mockAsset} />,
        );

        const assetImage = getByText(`${mockAsset.name}`);
        const asssetName = getByAltText("asset marker icon");

        expect(assetImage).toBeInTheDocument();
        expect(asssetName).toBeInTheDocument();
    });

    test("should call preventDefault when dragged", () => {
        const { getByAltText } = render(<AssetMarker asset={mockAsset} />);

        const assetMarker = getByAltText("asset marker icon");
        const dragEvent = createEvent.dragStart(assetMarker);
        const prevented = jest.spyOn(dragEvent, "preventDefault");

        fireEvent(assetMarker, dragEvent);

        expect(prevented).toHaveBeenCalled();
    });

    test("should render an empty string when asset is missing", () => {
        render(<AssetMarker asset={null} />);

        const assetName = document.querySelector("p");

        expect(assetName).toHaveTextContent("");
    });
});
