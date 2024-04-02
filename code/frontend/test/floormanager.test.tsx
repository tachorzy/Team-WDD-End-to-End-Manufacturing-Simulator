/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import FloorManager from "../components/factorydashboard/floormanager/FloorManager";

describe("FloorManager ", () => {
    test("should open AddAssetForm when 'Create Asset' button is clicked", () => {
        const { getByText, getByPlaceholderText } = render(<FloorManager />);
        const addButton = getByText("Add Asset");

        fireEvent.click(addButton);

        const nameInput = getByPlaceholderText("Name");
        const descriptionInput = getByPlaceholderText("Description");

        expect(nameInput).toBeInTheDocument();
        expect(descriptionInput).toBeInTheDocument();
    });

    test("should add new asset when 'Add Asset' button is clicked in AddAssetForm", () => {
        const { getByText, getByPlaceholderText, queryByText } = render(
            <FloorManager />,
        );
        const addButton = getByText("Add Asset");
        fireEvent.click(addButton);

        const nameInput = getByPlaceholderText("Name");
        const descriptionInput = getByPlaceholderText("Description");
        const createAssetButton = getByText("Create Asset");

        fireEvent.change(nameInput, { target: { value: "New Asset" } });
        fireEvent.change(descriptionInput, {
            target: { value: "New Asset Description" },
        });

        fireEvent.click(createAssetButton);

        // After creating, it should hide the AddAssetForm
        expect(queryByText("Name: New Asset")).toBeInTheDocument();
        expect(
            queryByText("Description: New Asset Description"),
        ).toBeInTheDocument();
    });
});
