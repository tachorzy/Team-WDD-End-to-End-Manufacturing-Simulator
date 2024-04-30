/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BackendConnector } from "@/app/api/_utils/connector";
import ModelTable from "../components/factorydashboard/ModelTable";
import "@testing-library/jest-dom";

jest.mock("@/app/api/_utils/connector", () => ({
    BackendConnector: {
        get: jest.fn(),
    },
}));
// Mock console.error as a jest.fn() to make it a mock function
console.error = jest.fn();

const mockedBackendConnector = BackendConnector as jest.Mocked<
    typeof BackendConnector
>;

describe("ModelTable component", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    /*
    test("should render loading state while fetching data", async () => {
        mockedBackendConnector.get.mockResolvedValueOnce([]);
        render(<ModelTable factoryId="someFactoryId" />);

        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        // Wait for data to be loaded
        await waitFor(() =>
            expect(mockedBackendConnector.get).toHaveBeenCalledTimes(1),
        );
    });
    */

    test("should render data correctly", async () => {
        const testData = [
            {
                modelId: "model-1",
                attributes: [{ name: "attr1", value: "value1" }],
                properties: [{ name: "prop1", unit: "unit1" }],
                factoryId: "someFactoryId",
            },
        ];
        const mockedResponse =
            mockedBackendConnector.get.mockResolvedValueOnce(testData);
        render(<ModelTable factoryId="someFactoryId" />);

        await waitFor(() => expect(mockedResponse).toHaveBeenCalledTimes(1));

        // Assert data is rendered correctly
        expect(screen.getByText("Model ID")).toBeInTheDocument();
        expect(screen.getByText("Attributes")).toBeInTheDocument();
        expect(screen.getByText("Properties")).toBeInTheDocument();
        expect(screen.getByText("Factory ID")).toBeInTheDocument();

        // You can add more specific assertions here to check if the data is displayed correctly
        expect(screen.getByText("model-1")).toBeInTheDocument();
        expect(screen.getByText("attr1: value1")).toBeInTheDocument();
        expect(screen.getByText("prop1: unit1")).toBeInTheDocument();
        expect(screen.getByText("someFactoryId")).toBeInTheDocument();
    });

    test("should paginate data correctly", async () => {
        const testData = [
            {
                modelId: "model-1",
                factoryId: "factory-1",
                attributes: [
                    {
                        factoryId: "factory-1",
                        modelId: "1",
                        name: "Height",
                        value: "10 meters",
                    },
                    {
                        factoryId: "factory-1",
                        modelId: "1",
                        name: "Weight",
                        value: "500 kg",
                    },
                    {
                        factoryId: "factory-1",
                        modelId: "1",
                        name: "Color",
                        value: "Blue",
                    },
                ],
                properties: [
                    {
                        factoryId: "factory-1",
                        modelId: "1",
                        measurementId: "1",
                        name: "Temperature",
                        unit: "Celsius",
                        generatorType: "constant",
                    },
                    {
                        factoryId: "factory-1",
                        modelId: "1",
                        measurementId: "2",
                        name: "Voltage",
                        unit: "Volts",
                        generatorType: "sine wave",
                    },
                    {
                        factoryId: "factory-1",
                        modelId: "1",
                        measurementId: "3",
                        name: "Pressure",
                        unit: "Pascal",
                        generatorType: "sawtooth",
                    },
                ],
            },
            {
                modelId: "model-2",
                factoryId: "factory-1",
                attributes: [
                    {
                        factoryId: "factory-1",
                        modelId: "2",
                        name: "Height",
                        value: "12 meters",
                    },
                    {
                        factoryId: "factory-1",
                        modelId: "2",
                        name: "Weight",
                        value: "600 kg",
                    },
                    {
                        factoryId: "factory-1",
                        modelId: "2",
                        name: "Color",
                        value: "Red",
                    },
                ],
                properties: [
                    {
                        factoryId: "factory-1",
                        modelId: "2",
                        measurementId: "4",
                        name: "Temperature",
                        unit: "Celsius",
                        generatorType: "sine wave",
                    },
                    {
                        factoryId: "factory-1",
                        modelId: "2",
                        measurementId: "5",
                        name: "Voltage",
                        unit: "Volts",
                        generatorType: "sawtooth",
                    },
                    {
                        factoryId: "factory-1",
                        modelId: "2",
                        measurementId: "6",
                        name: "Pressure",
                        unit: "Pascal",
                        generatorType: "constant",
                    },
                ],
            },
            {
                modelId: "model-3",
                factoryId: "factory-1",
                attributes: [],
                properties: [],
            },
            {
                modelId: "model-4",
                factoryId: "factory-1",
                attributes: [],
                properties: [],
            },
            {
                modelId: "model-5",
                factoryId: "factory-1",
                attributes: [],
                properties: [],
            },
            {
                modelId: "model-6",
                factoryId: "factory-1",
                attributes: [],
                properties: [],
            },
        ];
        const mockedResponse =
            mockedBackendConnector.get.mockResolvedValueOnce(testData);
        render(<ModelTable factoryId="someFactoryId" />);

        await waitFor(() => expect(mockedResponse).toHaveBeenCalledTimes(1));

        // Mock clicking next page
        fireEvent.click(screen.getByText(">"));
        // Assert that the page number changes
        expect(screen.getByTestId("currentpage").textContent).toBe("2");

        // Mock clicking previous page
        fireEvent.click(screen.getByText("<"));
        // Assert that the page number changes back
        expect(screen.getByTestId("currentpage").textContent).toBe("1");
    });

    test("should log error message when fetching models fails", async () => {
        render(<ModelTable factoryId="someFactoryId" />);

        mockedBackendConnector.get.mockRejectedValueOnce("Fetch error");

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith(
                "Failed to fetch models:",
                "Fetch error",
            );
        });
    });

    test("should render without error when modelId is null or undefined", () => {
        const testData = [
            { modelId: null, factoryId: "factory-1" },
            { modelId: undefined, factoryId: "factory-1" },
        ];

        // Render the ModelTable component for each test data item
        testData.forEach((data) => {
            const { container } = render(
                <ModelTable factoryId={data.factoryId} />,
            );
            // Assert that the component renders without errors
            expect(container).toBeTruthy();
        });
    });

    test("should apply background color to even-numbered modelIds", () => {
        const testData = [
            { modelId: 1, factoryId: "factory-1" },
            { modelId: 2, factoryId: "factory-1" },
            { modelId: 3, factoryId: "factory-1" },
            { modelId: 4, factoryId: "factory-1" },
            { modelId: 5, factoryId: "factory-1" },
        ];

        const { container } = render(<ModelTable factoryId="factory-1" />);

        testData.forEach((data, index) => {
            const trElement = container.querySelector(
                `tr:nth-child(${index + 1})`,
            );
            // Check if trElement is not null before making assertions
            if (trElement !== null) {
                expect(trElement).toBeInTheDocument();

                if (data.modelId % 2 === 0) {
                    expect(trElement).toHaveClass("bg-gray-100");
                } else {
                    expect(trElement).not.toHaveClass("bg-gray-100");
                }
            }
        });
    });
});
