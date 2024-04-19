/**
 * @jest-environment jsdom
 */

import React from "react";
import {
    createEvent,
    fireEvent,
    render,
    waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { Asset } from "@/app/api/_utils/types";
import AssetMarker from "../components/factorydashboard/floorplan/blueprint/marker/AssetMarker";

const mockAsset: Asset = {
    assetId: "1",
    name: "Asset 1",
    description: "Description 1",
    imageData: "https//www.example.com/image.png",
    factoryId: "1",
    modelId: "1",
    modelUrl: "https//www.example.com/model.glb",
    floorplanCords: { x: 0, y: 0 },
};

describe("AssetMarker Component", () => {
    test("should have a label with the name of the asset", () => {
        const { getByText } = render(<AssetMarker asset={mockAsset} />);

        const label = getByText(`${mockAsset.name}`);

        expect(label).toHaveClass(
            "shadow-md text-xs group-hover:visible invisible text-center self-center bg-opacity-[40%] px-1 py-0.5 font-medium rounded-sm bg-gray-800 my-1",
        );
    });

    test("should render the correct marker image", () => {
        const { getByAltText } = render(<AssetMarker asset={mockAsset} />);

        const markerImage = getByAltText(
            "asset marker icon",
        ) as HTMLImageElement;

        expect(markerImage.src).toContain("/icons/floorplan/asset-marker.svg");
    });

    test("should be draggable", () => {
        const { getByAltText } = render(<AssetMarker asset={mockAsset} />);

        const assetMarker = getByAltText("asset marker icon");
        const dragEvent = createEvent.dragStart(assetMarker);
        const prevented = jest.spyOn(dragEvent, "preventDefault");

        fireEvent(assetMarker, dragEvent);

        expect(prevented).toHaveBeenCalled();

        prevented.mockRestore();
    });

    test("should show Asset Info, name, and description when marker image is clicked", () => {
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
