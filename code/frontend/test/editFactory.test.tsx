/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditFactoryForm from "../components/factorydashboard/editFactory";

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () =>
            Promise.resolve({
                factoryId: "1",
                message: "",
            }),
    }),
) as jest.Mock;

const mockFactory = {
    factoryId: "1",
    name: "Factory 1",
    location: {
        latitude: 123.456,
        longitude: 456.789,
    },
    description: "",
};

const onCloseMock = jest.fn();
const props = {
    factory: mockFactory,
    onClose: onCloseMock,
    onSave: jest.fn(),
};

const factoryName = "TensorIoT Factory";
const factoryDescription = "This is a factory used by TensorIoT in Texas";

describe("Landing Page Component", () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });

    test("renders and its compontents correctly ", () => {
        const { getByText, getByAltText, getByPlaceholderText } = render(
            <EditFactoryForm {...props} />,
        );

        const header = getByText(/(Edit Factory Details)/);
        const closeIcon = getByAltText("Close icon");
        const inputName = getByPlaceholderText("Enter factory name");
        const inputDescription = getByPlaceholderText(
            "Enter factory description (optional)",
        );
        const button = getByText(/(Save Changes)/);

        expect(header).toBeInTheDocument();
        expect(closeIcon).toBeInTheDocument();
        expect(inputName).toBeInTheDocument();
        expect(inputDescription).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });

    test("is closed when close icon clicked", () => {
        const { getByAltText } = render(<EditFactoryForm {...props} />);

        const closeIcon = getByAltText("Close icon");
        fireEvent.click(closeIcon);

        expect(onCloseMock).toHaveBeenCalled();
    });

    test("factory name textbox changes on input", () => {
        const { getByPlaceholderText } = render(<EditFactoryForm {...props} />);

        const nameInput = getByPlaceholderText("Enter factory name");
        const descriptionInput = getByPlaceholderText(
            "Enter factory description (optional)",
        );

        fireEvent.change(nameInput, {
            target: {
                value: factoryName,
            },
        });

        expect(nameInput).toHaveValue(factoryName);
        expect(descriptionInput).toHaveValue("");
    });

    test("factory description textbox changes on input", () => {
        const { getByPlaceholderText } = render(<EditFactoryForm {...props} />);

        const nameInput = getByPlaceholderText("Enter factory name");
        const descriptionInput = getByPlaceholderText(
            "Enter factory description (optional)",
        );

        fireEvent.change(descriptionInput, {
            target: {
                value: factoryDescription,
            },
        });

        expect(nameInput).toHaveValue("Factory 1");
        expect(descriptionInput).toHaveValue(factoryDescription);
    });

    test("both factory name and description textboxes changes on input", () => {
        const { getByPlaceholderText } = render(<EditFactoryForm {...props} />);

        const nameInput = getByPlaceholderText("Enter factory name");
        const descriptionInput = getByPlaceholderText(
            "Enter factory description (optional)",
        );

        fireEvent.change(nameInput, {
            target: {
                value: factoryName,
            },
        });
        fireEvent.change(descriptionInput, {
            target: {
                value: factoryDescription,
            },
        });

        expect(nameInput).toHaveValue(factoryName);
        expect(descriptionInput).toHaveValue(factoryDescription);
    });

    test("displays error message on missing factory name", () => {
        const { getByText, getByPlaceholderText } = render(
            <EditFactoryForm {...props} />,
        );

        const nameInput = getByPlaceholderText("Enter factory name");
        fireEvent.change(nameInput, {
            target: {
                value: null,
            },
        });
        fireEvent.click(getByText(/(Save Changes)/));

        const noNameError = getByText("Please provide a name for the factory.");
        expect(noNameError).toBeInTheDocument();
    });

    test("displays error message on blank factory name", () => {
        const { getByPlaceholderText, getByText } = render(
            <EditFactoryForm {...props} />,
        );

        const nameInput = getByPlaceholderText("Enter factory name");
        const emptyName = "";

        fireEvent.change(nameInput, {
            target: {
                value: emptyName,
            },
        });
        fireEvent.click(getByText(/(Save Changes)/));

        const noNameError = getByText("Please provide a name for the factory.");

        expect(nameInput).toHaveValue(emptyName);
        expect(noNameError).toBeInTheDocument();
    });

    test("displays error message when factory description is too long", () => {
        const { getByPlaceholderText, getByText } = render(
            <EditFactoryForm {...props} />,
        );

        const descriptionInput = getByPlaceholderText(
            "Enter factory description (optional)",
        );
        const longDescription =
            "This description is longer than two hundred characters long, so it can not be used in the form. please try to have descriptions less than two hundred characters long, or it will not work in the form. thanks.";

        fireEvent.change(descriptionInput, {
            target: {
                value: longDescription,
            },
        });
        fireEvent.click(getByText(/(Save Changes)/));

        const descriptionTooLongError = getByText(
            "Factory description must be no more than 200 characters.",
        );

        expect(descriptionInput).toHaveValue(longDescription);
        expect(descriptionTooLongError).toBeInTheDocument();
    });

    test("successfully  edit factory", async () => {
        const onSaveMock = jest.fn();
        const onClosemockedMock = jest.fn();

        const newProps = {
            factory: mockFactory,
            onClose: onClosemockedMock,
            onSave: onSaveMock,
        };

        const { getByPlaceholderText, getByText } = render(
            <EditFactoryForm {...newProps} />,
        );

        const nameInput = getByPlaceholderText("Enter factory name");
        const descriptionInput = getByPlaceholderText(
            "Enter factory description (optional)",
        );

        fireEvent.change(nameInput, {
            target: {
                value: factoryName,
            },
        });

        fireEvent.change(descriptionInput, {
            target: {
                value: factoryDescription,
            },
        });

        fireEvent.click(getByText(/(Save Changes)/));

        await waitFor(() => {
            expect(onSaveMock).toHaveBeenCalledWith({
                factoryId: "1",
                name: "TensorIoT Factory",
                location: { latitude: 123.456, longitude: 456.789 },
                description: "This is a factory used by TensorIoT in Texas",
            });
        });
    });

    test("logs error when factory data is incomplete", async () => {
        const consoleErrorMock = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        // Simulate factory data being incomplete by not providing factoryId
        const incompleteFactoryData = {
            factoryId: "", // Incomplete data
            name: "TensorIoT Factory",
            location: { latitude: 123.456, longitude: 456.789 },
            description: "This is a factory used by TensorIoT in Texas",
        };

        const { getByText } = render(
            <EditFactoryForm
                factory={incompleteFactoryData}
                onClose={jest.fn()}
                onSave={jest.fn()}
            />,
        );

        fireEvent.click(getByText(/(Save Changes)/));

        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalledWith(
                "Failed to update factory:",
                new Error("Factory data is incomplete."),
            );
        });
    });

    test("logs error when factory data is incomplete is null", async () => {
        const consoleErrorMock = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        const incompleteFactoryData = null;

        const { getByText } = render(
            <EditFactoryForm
                factory={incompleteFactoryData}
                onClose={jest.fn()}
                onSave={jest.fn()}
            />,
        );

        fireEvent.click(getByText(/(Save Changes)/));

        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalledWith(
                "Failed to update factory:",
                new Error("Factory data is incomplete."),
            );
        });
    });
});
