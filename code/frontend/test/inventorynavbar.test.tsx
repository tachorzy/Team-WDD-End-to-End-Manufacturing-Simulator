import React from "react";
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BackendConnector } from "@/app/api/_utils/connector";
import { Attribute, Model } from "@/app/api/_utils/types";
import { act } from "react-dom/test-utils";
import InventoryNavBar from "../components/factorydashboard/floormanager/inventory/InventoryNavBar";

jest.mock("@/app/api/_utils/connector", () => ({
    BackendConnector: {
        get: jest.fn(),
    },
}));

describe("InventoryNavBar", () => {
    let errorLog: typeof console.error;

    beforeAll(() => {
        errorLog = console.error; // Save the original error function
        console.error = (message?: string) => {
            // Replace it with a custom function
            if (message !== "No models returned from backend") {
                errorLog(message);
            }
        };
    });

    afterAll(() => {
        console.error = errorLog; // After all tests, restore the original function
    });
    test("should prompt user to create models if there are no pre-existing models.", () => {
        render(
            <InventoryNavBar
                factoryId="1234"
                activeNavItem=""
                setActiveNavItem={jest.fn()}
            />,
        );
        expect(screen.getByText("No models found")).toBeInTheDocument();
        expect(screen.getByText("No models found")).toHaveClass("text-red-300");
    });

    const mockSetActiveNavItem = jest.fn();
    const mockNameAttribute = {
        name: "Name",
        value: "",
    } as Attribute;
    const mockModel: Model = {
        modelId: "010101010101",
        factoryId: "1234567890",
        attributes: [mockNameAttribute],
        properties: [],
        measurements: [],
    };

    test.each([["CNC"], ["PLC"], ["EDM"]])(
        "should change activeNavItem on click",
        async (label) => {
            // Create a new model for each label
            const mockModelWithLabel: Model = {
                ...mockModel,
                attributes: [{ ...mockNameAttribute, value: label }],
            };

            // Mock the BackendConnector.get function to return the model with the label
            (BackendConnector.get as jest.Mock).mockResolvedValue([
                mockModelWithLabel,
            ]);

            act(() => {
                render(
                    <InventoryNavBar
                        factoryId="f95b2506-33e1-4aad-a319-880e518164ef"
                        activeNavItem=""
                        setActiveNavItem={mockSetActiveNavItem}
                    />,
                );
            });

            // Wait for the models to be fetched and the buttons to be rendered
            await waitFor(() => screen.getByText(label));

            // Simulate click on the element representing the model type
            fireEvent.click(screen.getByText(label));

            // Wait for the component to update

            await waitFor(() => {
                expect(mockSetActiveNavItem).toHaveBeenCalledWith(
                    mockModelWithLabel.modelId,
                );
            });
        },
    );
});
