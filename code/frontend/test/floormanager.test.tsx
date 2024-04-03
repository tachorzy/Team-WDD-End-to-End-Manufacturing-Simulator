/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import FloorManager from "../components/factorydashboard/floormanager/FloorManager";
import AddAssetForm from "../components/factorydashboard/floormanager/assetform/AddAssetForm";

describe("FloorManager ", () => {
    test("should open AddAssetForm when 'Create Asset' button is clicked", () => {
        const { getByText, getByPlaceholderText } = render(
            <FloorManager setAssetMarkers={jest.fn()}  factoryId="1" />,
        );

        const addButton = getByText("Add Asset");

        fireEvent.click(addButton);

        const nameInput = getByPlaceholderText("Name");
        const descriptionInput = getByPlaceholderText("Description");

        expect(nameInput).toBeInTheDocument();
        expect(descriptionInput).toBeInTheDocument();
    });

    jest.mock("react-dropzone", () => ({
        useDropzone: () => ({
            getRootProps: () => ({}),
            getInputProps: () => ({}),
            isDragActive: false,
            isDragAccept: false,
            isDragReject: false,
        }),
    }));

    test("should add new asset to FloorManager when AddAssetForm is filled out.", () => {
        const handleAdd = jest.fn();

        const { getByText, getByPlaceholderText } = render(
            <AddAssetForm onAdd={handleAdd} onClose={jest.fn()}  factoryId="1"/>,
        );

        const nameInput = getByPlaceholderText("Name");

        const descriptionInput = getByPlaceholderText("Description");
        const createAssetButton = getByText("Create Asset");

        fireEvent.change(nameInput, { target: { value: "New Asset" } });
        fireEvent.change(descriptionInput, {
            target: { value: "New Asset Description" },
        });

        fireEvent.click(createAssetButton);

        expect(handleAdd).toHaveBeenCalledWith({
            name: "New Asset",
            description: "New Asset Description",
            id: "",
            image: "",
        });
    });
});
