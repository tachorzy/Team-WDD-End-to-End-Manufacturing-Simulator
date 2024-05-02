import React from "react";
import { Context } from "@/components/models/createmodelform/CreateModelForm";
import GeneratorFunctionForm, {
    GeneratorFunctionFormContext,
} from "@/components/models/createmodelform/generatordefinition/GeneratorFunctionForm";
import { Measurement, Model } from "@/app/api/_utils/types";
import { BackendConnector, PostConfig } from "@/app/api/_utils/connector";
import { fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockSetModels = jest.fn();
const mockSetMeasurements = jest.fn();

const mockPost = jest.fn();
BackendConnector.post = mockPost;

const mockReaderResult = jest.spyOn(
    global.FileReader.prototype,
    "result",
    "get",
);

const mockConfig: PostConfig<Model> = {
    resource: "models",
    payload: {
        modelId: "",
        factoryId: "",
        attributes: [],
        properties: [],
        measurements: [],
    },
};

describe("Generator Function Form", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should add measurments for the Replay Generator", async () => {
        mockReaderResult.mockImplementationOnce(() => "1,2,3\n4,5,6\n7,8,9");

        const mockContextValue: GeneratorFunctionFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            models: [],
            setModels: mockSetModels,
            attributes: [],
            setAttributes: jest.fn(),
            properties: [
                {
                    factoryId: "",
                    modelId: "",
                    measurementId: "",
                    name: "Pressure",
                    unit: "Pa",
                    generatorType: "Replay",
                },
            ],
            setProperties: jest.fn(),
            measurements: [],
            setMeasurements: mockSetMeasurements,
            nextPage: jest.fn(),
        };

        const expectedMeasurement: Measurement[] = [
            {
                measurementId: "",
                modelId: "",
                factoryId: "",
                lowerBound: 0.0,
                upperBound: 100,
                frequency: 10000,
                precision: 0.0,
                generatorFunction: "replay",
                replaySequence: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            },
        ];

        const expectedModel: Model[] = [
            {
                factoryId: mockContextValue.factoryId,
                modelId: mockContextValue.modelId,
                attributes: mockContextValue.attributes,
                properties: mockContextValue.properties,
                measurements: [],
            },
        ];

        mockPost.mockResolvedValue(expectedModel);
        const expectedConfig = {
            ...mockConfig,
            payload: expectedModel[0],
        };

        const { getByPlaceholderText, getByText, getByTestId } = render(
            <Context.Provider value={mockContextValue}>
                <GeneratorFunctionForm />
            </Context.Provider>,
        );

        const frequencyInput = getByPlaceholderText("e.g. 60000");
        fireEvent.change(frequencyInput, { target: { value: "10000" } });

        const minValueInput = getByPlaceholderText("e.g. 0");
        fireEvent.change(minValueInput, { target: { value: "0" } });

        const maxValueInput = getByPlaceholderText("e.g. 100");
        fireEvent.change(maxValueInput, { target: { value: "100" } });

        const csvFile = new File(["blob"], "replay.csv", { type: "text/csv" });

        const dropInput = getByTestId("drop-input");
        Object.defineProperty(dropInput, "files", {
            value: [csvFile],
        });
        fireEvent.drop(dropInput);

        await waitFor(() => {
            expect(mockSetMeasurements).toHaveBeenCalledWith(
                expectedMeasurement,
            );
            mockContextValue.measurements.push(expectedMeasurement[0]);
        });

        const submitButton = getByText(/Submit/);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith(expectedConfig);
        });
    });

    test("should add measurments for the Random Generator", async () => {
        const mockContextValue: GeneratorFunctionFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            models: [],
            setModels: mockSetModels,
            attributes: [],
            setAttributes: jest.fn(),
            properties: [
                {
                    factoryId: "",
                    modelId: "",
                    measurementId: "",
                    name: "Pressure",
                    unit: "Pa",
                    generatorType: "Random",
                },
            ],
            setProperties: jest.fn(),
            measurements: [],
            setMeasurements: mockSetMeasurements,
            nextPage: jest.fn(),
        };

        const expectedMeasurement: Measurement[] = [
            {
                measurementId: "",
                modelId: "",
                factoryId: "",
                lowerBound: 0,
                upperBound: 100,
                frequency: 10000,
                precision: 0.0,
                generatorFunction: "random",
            },
        ];

        const expectedModel: Model[] = [
            {
                factoryId: mockContextValue.factoryId,
                modelId: mockContextValue.modelId,
                attributes: mockContextValue.attributes,
                properties: mockContextValue.properties,
                measurements: [],
            },
        ];

        mockPost.mockResolvedValue(expectedModel);
        const expectedConfig = {
            ...mockConfig,
            payload: expectedModel[0],
        };

        const { getByPlaceholderText, getByText } = render(
            <Context.Provider value={mockContextValue}>
                <GeneratorFunctionForm />
            </Context.Provider>,
        );

        const frequencyInput = getByPlaceholderText("e.g. 60000");
        fireEvent.change(frequencyInput, { target: { value: "10000" } });

        const minValueInput = getByPlaceholderText("e.g. 0");
        fireEvent.change(minValueInput, { target: { value: "0" } });

        const maxValueInput = getByPlaceholderText("e.g. 100");
        fireEvent.change(maxValueInput, { target: { value: "100" } });

        await waitFor(() => {
            expect(mockSetMeasurements).toHaveBeenCalledWith(
                expectedMeasurement,
            );
            mockContextValue.measurements.push(expectedMeasurement[0]);
        });

        const submitButton = getByText(/Submit/);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith(expectedConfig);
        });
    });

    test("should add measurments for the Sine Wave Generator", async () => {
        const mockContextValue: GeneratorFunctionFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            models: [],
            setModels: mockSetModels,
            attributes: [],
            setAttributes: jest.fn(),
            properties: [
                {
                    factoryId: "",
                    modelId: "",
                    measurementId: "",
                    name: "Pressure",
                    unit: "Pa",
                    generatorType: "Sine wave",
                },
            ],
            setProperties: jest.fn(),
            measurements: [],
            setMeasurements: mockSetMeasurements,
            nextPage: jest.fn(),
        };

        const expectedMeasurement: Measurement[] = [
            {
                measurementId: "",
                modelId: "",
                factoryId: "",
                lowerBound: 0.0,
                upperBound: 100,
                frequency: 10000,
                angularFrequency: 500,
                amplitude: 1,
                phase: 0.3,
                precision: 0.0,
                generatorFunction: "sinewave",
            },
        ];

        const expectedModel: Model[] = [
            {
                factoryId: mockContextValue.factoryId,
                modelId: mockContextValue.modelId,
                attributes: mockContextValue.attributes,
                properties: mockContextValue.properties,
                measurements: [],
            },
        ];

        mockPost.mockResolvedValue(expectedModel);
        const expectedConfig = {
            ...mockConfig,
            payload: expectedModel[0],
        };

        const { getByPlaceholderText, getByText } = render(
            <Context.Provider value={mockContextValue}>
                <GeneratorFunctionForm />
            </Context.Provider>,
        );

        const frequencyInput = getByPlaceholderText("e.g. 60000");
        fireEvent.change(frequencyInput, { target: { value: "10000" } });

        const angularFrequencyInput = getByPlaceholderText("e.g. 1000");
        fireEvent.change(angularFrequencyInput, { target: { value: "500" } });

        const amplitudeInput = getByPlaceholderText("e.g. 2");
        fireEvent.change(amplitudeInput, { target: { value: "1" } });

        const phaseInput = getByPlaceholderText("e.g. 0.5");
        fireEvent.change(phaseInput, { target: { value: "0.3" } });

        const maxValueInput = getByPlaceholderText("e.g. 100");
        fireEvent.change(maxValueInput, { target: { value: "100" } });

        await waitFor(() => {
            expect(mockSetMeasurements).toHaveBeenCalledWith(
                expectedMeasurement,
            );
            mockContextValue.measurements.push(expectedMeasurement[0]);
        });

        const submitButton = getByText(/Submit/);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith(expectedConfig);
        });
    });

    test("should add measurments for the Sawtooth Generator", async () => {
        const mockContextValue: GeneratorFunctionFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            models: [],
            setModels: mockSetModels,
            attributes: [],
            setAttributes: jest.fn(),
            properties: [
                {
                    factoryId: "",
                    modelId: "",
                    measurementId: "",
                    name: "Pressure",
                    unit: "Pa",
                    generatorType: "Sawtooth",
                },
            ],
            setProperties: jest.fn(),
            measurements: [],
            setMeasurements: mockSetMeasurements,
            nextPage: jest.fn(),
        };

        const expectedMeasurement: Measurement[] = [
            {
                measurementId: "",
                modelId: "",
                factoryId: "",
                lowerBound: 0.0,
                upperBound: 100,
                frequency: 10000,
                angularFrequency: 500,
                amplitude: 1,
                phase: 0.3,
                precision: 0.0,
                generatorFunction: "sawtooth",
            },
        ];

        const expectedModel: Model[] = [
            {
                factoryId: mockContextValue.factoryId,
                modelId: mockContextValue.modelId,
                attributes: mockContextValue.attributes,
                properties: mockContextValue.properties,
                measurements: [],
            },
        ];

        mockPost.mockResolvedValue(expectedModel);
        const expectedConfig = {
            ...mockConfig,
            payload: expectedModel[0],
        };

        const { getByPlaceholderText, getByText } = render(
            <Context.Provider value={mockContextValue}>
                <GeneratorFunctionForm />
            </Context.Provider>,
        );

        const frequencyInput = getByPlaceholderText("e.g. 60000");
        fireEvent.change(frequencyInput, { target: { value: "10000" } });

        const angularFrequencyInput = getByPlaceholderText("e.g. 1000");
        fireEvent.change(angularFrequencyInput, { target: { value: "500" } });

        const amplitudeInput = getByPlaceholderText("e.g. 2");
        fireEvent.change(amplitudeInput, { target: { value: "1" } });

        const phaseInput = getByPlaceholderText("e.g. 0.5");
        fireEvent.change(phaseInput, { target: { value: "0.3" } });

        const maxValueInput = getByPlaceholderText("e.g. 100");
        fireEvent.change(maxValueInput, { target: { value: "100" } });

        await waitFor(() => {
            expect(mockSetMeasurements).toHaveBeenCalledWith(
                expectedMeasurement,
            );
            mockContextValue.measurements.push(expectedMeasurement[0]);
        });

        const submitButton = getByText(/Submit/);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith(expectedConfig);
        });
    });

    test("should handle duplicate attributes, properties, and measurements", () => {
        const mockContextValue: GeneratorFunctionFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            models: [],
            setModels: mockSetModels,
            attributes: [
                {
                    attributeId: "",
                    factoryId: "",
                    modelId: "",
                    name: "Model Name",
                    value: "Model Value",
                },
                {
                    attributeId: "",
                    factoryId: "",
                    modelId: "",
                    name: "Model Name",
                    value: "Different Model Value",
                },
            ],
            setAttributes: jest.fn(),
            properties: [
                {
                    factoryId: "",
                    modelId: "",
                    measurementId: "",
                    name: "Pressure",
                    unit: "Pa",
                    generatorType: "Sawtooth",
                },
                {
                    factoryId: "",
                    modelId: "",
                    measurementId: "",
                    name: "Pressure",
                    unit: "Pa",
                    generatorType: "Sine wave",
                },
            ],
            setProperties: jest.fn(),
            measurements: [
                {
                    measurementId: "",
                    modelId: "",
                    factoryId: "",
                    lowerBound: 0.0,
                    upperBound: 100,
                    frequency: 10000,
                    angularFrequency: 500,
                    amplitude: 1,
                    phase: 0.3,
                    precision: 0.0,
                    generatorFunction: "sawtooth",
                },
                {
                    measurementId: "",
                    modelId: "",
                    factoryId: "",
                    lowerBound: 0.0,
                    upperBound: 100,
                    frequency: 10000,
                    angularFrequency: 500,
                    amplitude: 1,
                    phase: 0.3,
                    precision: 0.0,
                    generatorFunction: "replay",
                },
            ],
            setMeasurements: mockSetMeasurements,
            nextPage: jest.fn(),
        };

        const { getByText } = render(
            <Context.Provider value={mockContextValue}>
                <GeneratorFunctionForm />
            </Context.Provider>,
        );

        expect(getByText("Property 1 - Pressure")).toBeInTheDocument();
    });

    test("should handle error when adding model", async () => {
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});
        mockPost.mockRejectedValueOnce(new Error("404"));

        const mockContextValue: GeneratorFunctionFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            models: [],
            setModels: mockSetModels,
            attributes: [],
            setAttributes: jest.fn(),
            properties: [],
            setProperties: jest.fn(),
            measurements: [],
            setMeasurements: mockSetMeasurements,
            nextPage: jest.fn(),
        };

        const { getByText } = render(
            <Context.Provider value={mockContextValue}>
                <GeneratorFunctionForm />
            </Context.Provider>,
        );

        const submitButton = getByText(/Submit/);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Failed to add model",
                new Error("404"),
            );
        });

        consoleErrorSpy.mockRestore();
    });
});
