/**
 * @jest-environment jsdom
 */

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Asset } from "@/app/api/_utils/types";
import AssetMarker from "../components/factorydashboard/floorplan/blueprint/marker/AssetMarker";

describe("AssetMarker Component", () => {
    test("should have a label with the name of the asset", () => {
        const mockAsset: Asset = {
            assetId: "1",
            name: "Asset 1",
            description: "Description 1",
            imageData:
                "ttps://wcs.smartdraw.com/floor-plan/img/facility-planning-example.png?bn=15100111927",
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
            imageData:
                "ttps://wcs.smartdraw.com/floor-plan/img/facility-planning-example.png?bn=15100111927",
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
            imageData:
                "ttps://wcs.smartdraw.com/floor-plan/img/facility-planning-example.png?bn=15100111927",
            factoryId: "1",
        };

        const { getByText } = render(<AssetMarker asset={mockAsset} />);

        const assetMarker = getByText(`${mockAsset.name}`);

        fireEvent.mouseDown(assetMarker);
        fireEvent.mouseMove(assetMarker, { clientX: 100, clientY: 100 });
        fireEvent.mouseUp(assetMarker);
    });

    test("should show Asset Info, name, and description when marker image is clicked", () => {
        const mockAsset: Asset = {
            assetId: "1",
            name: "Asset 1",
            description: "Description 1",
            imageData:
                "ttps://wcs.smartdraw.com/floor-plan/img/facility-planning-example.png?bn=15100111927",
            factoryId: "1",
        };

        const { getByAltText, getByText, getByTestId } = render(
            <AssetMarker asset={mockAsset} />,
        );

        const markerImage = getByAltText("asset marker icon");
        fireEvent.click(markerImage);

        const assetInfoHeading = getByText("Asset Info");
        const assetName = getByTestId("name");
        const assetDescription = getByText("Description 1");

        expect(assetInfoHeading).toBeInTheDocument();
        expect(assetName).toBeInTheDocument();
        expect(assetDescription).toBeInTheDocument();
    });

    test("should show delete confirmation dialog when delete button is clicked", async () => {
        const mockAsset: Asset = {
            assetId: "1",
            name: "Asset 1",
            description: "Description 1",
            imageData:
                "ttps://wcs.smartdraw.com/floor-plan/img/facility-planning-example.png?bn=15100111927",
            factoryId: "1",
        };

        const { getByTestId, getByAltText } = render(
            <AssetMarker asset={mockAsset} />,
        );

        const markerImage = getByAltText("asset marker icon");
        fireEvent.click(markerImage);

        const deleteButton = getByTestId("delete-button");
        fireEvent.click(deleteButton);

        await waitFor(() => {
            const confirmDialog = getByTestId("confirm-dialog");
            expect(confirmDialog).toBeInTheDocument();
        });
    });

    test("should show edit form dialog when edit button is clicked", async () => {
        const mockAsset: Asset = {
            assetId: "1",
            name: "Asset 1",
            description: "Description 1",
            imageData:
                "ttps://wcs.smartdraw.com/floor-plan/img/facility-planning-example.png?bn=15100111927",
            factoryId: "1",
        };

        const { getByTestId, getByAltText } = render(
            <AssetMarker asset={mockAsset} />,
        );

        const markerImage = getByAltText("asset marker icon");
        fireEvent.click(markerImage);

        const deleteButton = getByTestId("edit-button");
        fireEvent.click(deleteButton);

        await waitFor(() => {
            const editForm = getByTestId("edit-form");
            expect(editForm).toBeInTheDocument();
        });
    });

    test("marker should be deleted when confirmation dialog is confirmed", async () => {
        const mockAsset: Asset = {
            assetId: "1",
            name: "Asset 1",
            description: "Description 1",
            imageData:
                "ttps://wcs.smartdraw.com/floor-plan/img/facility-planning-example.png?bn=15100111927",
            factoryId: "1",
        };

        const { getByTestId, getByAltText } = render(
            <AssetMarker asset={mockAsset} />,
        );

        const markerImage = getByAltText("asset marker icon");
        fireEvent.click(markerImage);

        const deleteButton = getByTestId("delete-button");
        fireEvent.click(deleteButton);

        await waitFor(() => {
            const confirmDialog = getByTestId("confirm-dialog");
            expect(confirmDialog).toBeInTheDocument();

            const confirmButton = getByTestId("yes-button");
            fireEvent.click(confirmButton);

            expect(markerImage).not.toBeInTheDocument();
        });
    });

    test("marker should be remain when confirmation dialog is denied", async () => {
        const mockAsset: Asset = {
            assetId: "1",
            name: "Asset 1",
            description: "Description 1",
            imageData:
                "ttps://wcs.smartdraw.com/floor-plan/img/facility-planning-example.png?bn=15100111927",
            factoryId: "1",
        };

        const { getByTestId, getByAltText } = render(
            <AssetMarker asset={mockAsset} />,
        );

        const markerImage = getByAltText("asset marker icon");
        fireEvent.click(markerImage);

        const deleteButton = getByTestId("delete-button");
        fireEvent.click(deleteButton);

        await waitFor(() => {
            const confirmDialog = getByTestId("confirm-dialog");
            expect(confirmDialog).toBeInTheDocument();

            const denyButton = getByTestId("no-button");
            fireEvent.click(denyButton);

            expect(markerImage).toBeInTheDocument();
        });
    });

    test("should show edit form dialog when edit button is clicked", async () => {
        const mockAsset: Asset = {
            assetId: "1",
            name: "Asset 1",
            description: "Description 1",
            imageData:
                "ttps://wcs.smartdraw.com/floor-plan/img/facility-planning-example.png?bn=15100111927",
            factoryId: "1",
        };

        const { getByTestId, getByAltText } = render(
            <AssetMarker asset={mockAsset} />,
        );

        const markerImage = getByAltText("asset marker icon");
        fireEvent.click(markerImage);

        const deleteButton = getByTestId("edit-button");
        fireEvent.click(deleteButton);

        await waitFor(() => {
            const editForm = getByTestId("edit-form");
            expect(editForm).toBeInTheDocument();

            const closeButton = getByAltText("Close icon");
            fireEvent.click(closeButton);

            expect(editForm).not.toBeInTheDocument();
        });
    });
});
