/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditAssetForm from "@/components/factorydashboard/floormanager/EditAssetForm";

const closeEditFormMock = jest.fn();
const props = {
    closeEditForm: closeEditFormMock,
};

const assetName = "CNC Machine";
const assetDescription = "This is a cnc machine";

describe("Edit factory form ", () => {
    test("should render and its compontents correctly ", () => {
        const { getByText, getByAltText, getByPlaceholderText } = render(
            <EditAssetForm {...props} />,
        );

        const header = getByText(/(Edit Asset Details)/);
        const closeIcon = getByAltText("Close icon");
        const inputName = getByPlaceholderText("Enter asset name");
        const inputDescription = getByPlaceholderText(
            "Enter asset description",
        );
        const button = getByText(/(Save Changes)/);

        expect(header).toBeInTheDocument();
        expect(closeIcon).toBeInTheDocument();
        expect(inputName).toBeInTheDocument();
        expect(inputDescription).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });

    test("should be closed when close icon clicked", () => {
        const { getByAltText } = render(<EditAssetForm {...props} />);

        const closeIcon = getByAltText("Close icon");
        fireEvent.click(closeIcon);

        expect(closeEditFormMock).toHaveBeenCalled();
    });

    test("should change asset name textbox on input", () => {
        const { getByPlaceholderText } = render(<EditAssetForm {...props} />);

        const nameInput = getByPlaceholderText("Enter asset name");
        const descriptionInput = getByPlaceholderText(
            "Enter asset description",
        );

        fireEvent.change(nameInput, {
            target: {
                value: assetName,
            },
        });

        expect(nameInput).toHaveValue(assetName);
        expect(descriptionInput).toHaveValue("");
    });

    test("should change factory description textbox on input", () => {
        const { getByPlaceholderText } = render(<EditAssetForm {...props} />);

        const nameInput = getByPlaceholderText("Enter asset name");
        const descriptionInput = getByPlaceholderText(
            "Enter asset description",
        );

        fireEvent.change(descriptionInput, {
            target: {
                value: assetDescription,
            },
        });

        expect(nameInput).toHaveValue("");
        expect(descriptionInput).toHaveValue(assetDescription);
    });

    test("both factory name and description textboxes changes on input", () => {
        const { getByPlaceholderText } = render(<EditAssetForm {...props} />);

        const nameInput = getByPlaceholderText("Enter asset name");
        const descriptionInput = getByPlaceholderText(
            "Enter asset description",
        );

        fireEvent.change(nameInput, {
            target: {
                value: assetName,
            },
        });
        fireEvent.change(descriptionInput, {
            target: {
                value: assetDescription,
            },
        });

        expect(nameInput).toHaveValue(assetName);
        expect(descriptionInput).toHaveValue(assetDescription);
    });
});
