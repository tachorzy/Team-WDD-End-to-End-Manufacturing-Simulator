/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import * as assetAPI from "@/app/api/assets/assetAPI";
import FloorManager from "../components/factorydashboard/floormanager/FloorManager";
import AddAssetForm from "../components/factorydashboard/floormanager/assetform/AddAssetForm";

jest.mock("@/app/api/assets/assetAPI", () => ({
    getAssetsForFactory: jest.fn(),
    createAsset: jest.fn(),
}));

describe("FloorManager", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (assetAPI.getAssetsForFactory as jest.Mock).mockResolvedValue([
            {
                assetId: "mockAssetId1",
                name: "Mock Asset 1",
                description: "Mock Description 1",
                imageData: "mockImage1.jpg",
                factoryId: "1",
            },
        ]);

        // in the backend i accidentally put "floorplanId when its supposed to be assetId in the message, my bad chile
        (assetAPI.createAsset as jest.Mock).mockImplementation((asset) =>
            Promise.resolve({
                assetId: "mockGeneratedAssetId",
                message:
                    "floorplanId mockGeneratedAssetId created successfully",
            }),
        );
    });

    test("should open AddAssetForm when 'Create Asset' button is clicked", async () => {
        const { getByText, findByPlaceholderText } = render(
            <FloorManager setAssetMarkers={jest.fn()} factoryId="1" />,
        );

        const addButton = getByText("Add Asset");
        fireEvent.click(addButton);

        const nameInput = await findByPlaceholderText("Name");
        const descriptionInput = await findByPlaceholderText("Description");

        expect(nameInput).toBeInTheDocument();
        expect(descriptionInput).toBeInTheDocument();
    });

    jest.mock("react-dropzone", () => ({
        useDropzone: () => ({
            getRootProps: jest.fn(),
            getInputProps: jest.fn(),
            isDragActive: false,
            isDragAccept: false,
            isDragReject: false,
        }),
    }));

    test("should add new asset to FloorManager when AddAssetForm is filled out and submitted", async () => {
        const handleAdd = jest.fn();

        const { getByText, getByPlaceholderText } = render(
            <AddAssetForm
                onAdd={handleAdd}
                onClose={jest.fn()}
                factoryId="1"
            />,
        );

        const nameInput = getByPlaceholderText("Name");
        const descriptionInput = getByPlaceholderText("Description");
        const createAssetButton = getByText("Create Asset");

        fireEvent.change(nameInput, { target: { value: "New Asset" } });
        fireEvent.change(descriptionInput, {
            target: { value: "New Asset Description" },
        });

        fireEvent.click(createAssetButton);

        await waitFor(() => {
            expect(assetAPI.createAsset).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "New Asset",
                    description: "New Asset Description",
                    factoryId: "1",
                }),
            );
        });
    });
});
