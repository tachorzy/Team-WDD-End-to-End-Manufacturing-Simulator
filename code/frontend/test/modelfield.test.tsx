import React from "react";
import { render, act, screen } from "@testing-library/react";
import { BackendConnector } from "@/app/api/_utils/connector";
import ModelField from "../components/factorydashboard/floormanager/assetform/ModelField";
import "@testing-library/jest-dom";

jest.mock("@/app/api/_utils/connector", () => ({
    BackendConnector: {
        get: jest.fn(),
    },
    GetConfig: {}, // Mock GetConfig if needed
}));

const mockedBackendConnector = BackendConnector as jest.Mocked<
    typeof BackendConnector
>;

describe("ModelField", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("fetches models when factoryId changes", () => {
        const factoryId = "someFactoryId";
        const setModelId = jest.fn();
        const setFormData = jest.fn();
        const mockModels = [
            {
                modelId: "model-1",
                attributes: [{ name: "attr1", value: "value1" }],
                properties: [{ name: "prop1", unit: "unit1" }],
                factoryId: "someFactoryId",
            },
        ];
        mockedBackendConnector.get.mockResolvedValueOnce(mockModels);

        act(() => {
            render(
                <ModelField
                    factoryId={factoryId}
                    setModelId={setModelId}
                    setFormData={setFormData}
                />,
            );
        });

        // Ensure the select element is present
        const selectElement = screen.getByTestId("model-select");
        expect(selectElement).toBeInTheDocument();

        // Ensure the option with value 'model-1' is present
        const optionElement = screen.getByTestId("model-option-model-1");
        expect(optionElement).toBeInTheDocument();
    });

    test("logs error message when fetching models fails", () => {
        const factoryId = "someFactoryId";
        const setModelId = jest.fn();
        const setFormData = jest.fn();
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation();

        // Mock BackendConnector.get to return a rejected promise
        mockedBackendConnector.get.mockRejectedValueOnce(
            new Error("Failed to fetch models"),
        );

        act(() => {
            render(
                <ModelField
                    factoryId={factoryId}
                    setModelId={setModelId}
                    setFormData={setFormData}
                />,
            );
        });

        // Ensure that console.error was called with the expected message
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Failed to fetch models:",
            expect.any(Error),
        );

        // Clean up
        consoleErrorSpy.mockRestore();
    });
});
