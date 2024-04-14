import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditAssetForm from "@/components/factorydashboard/floormanager/EditAssetForm";

const closeEditFormMock = jest.fn();
const mockAsset = {
    name: "Test Asset",
    description: "Test Description",
    factoryId: "factory123",
};

const props = {
    asset: mockAsset,
    closeEditForm: closeEditFormMock,
};

const assetName = "CNC Machine";
const assetDescription = "This is a CNC machine";

describe("Edit factory form ", () => {
    test("should change asset name textbox on input", () => {
        const { getByPlaceholderText } = render(<EditAssetForm {...props} />);

        const nameInput = getByPlaceholderText("Enter asset name") as HTMLInputElement;
        const descriptionInput = getByPlaceholderText("Enter asset description") as HTMLInputElement;

       
        fireEvent.change(nameInput, { target: { value: assetName } });

        
        expect(nameInput.value).toBe(assetName);
        expect(descriptionInput.value).toBe(mockAsset.description);
    });

    test("should change factory description textbox on input", () => {
        const { getByPlaceholderText } = render(<EditAssetForm {...props} />);

        const nameInput = getByPlaceholderText("Enter asset name") as HTMLInputElement;
        const descriptionInput = getByPlaceholderText("Enter asset description") as HTMLInputElement;

      
        fireEvent.change(descriptionInput, { target: { value: assetDescription } });

        expect(nameInput.value).toBe(mockAsset.name);
        expect(descriptionInput.value).toBe(assetDescription);
    });

    test("both factory name and description textboxes changes on input", () => {
        const { getByPlaceholderText } = render(<EditAssetForm {...props} />);

        const nameInput = getByPlaceholderText("Enter asset name") as HTMLInputElement;
        const descriptionInput = getByPlaceholderText("Enter asset description") as HTMLInputElement;

       
        fireEvent.change(nameInput, { target: { value: assetName } });
        fireEvent.change(descriptionInput, { target: { value: assetDescription } });

        
        expect(nameInput.value).toBe(assetName);
        expect(descriptionInput.value).toBe(assetDescription);
    });
});
