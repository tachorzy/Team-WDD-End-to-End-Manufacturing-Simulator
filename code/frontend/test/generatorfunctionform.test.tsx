import React from "react";
import { Context } from "@/components/models/createmodelform/CreateModelForm";
import GeneratorFunctionForm, {
    GeneratorFunctionFormContext,
} from "@/components/models/createmodelform/generatordefinition/GeneratorFunctionForm";
import { Measurement, Model } from "@/app/api/_utils/types";
import { BackendConnector } from "@/app/api/_utils/connector";
import { fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockSetModels = jest.fn();
const mockSetMeasurements = jest.fn();

const mockPost = jest.fn();
BackendConnector.post = mockPost;

jest.spyOn(global.console, "log").mockImplementation(() => {});

describe("Generator Function Form", () => {
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
                measurementId: "test test test test",
                modelId: "test test test test",
                factoryId: "test test",
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
            },
        ];

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

        mockPost.mockResolvedValue(expectedModel);

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
                measurementId: "test test test test",
                modelId: "test test test test",
                factoryId: "test test test test",
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
            },
        ];

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

        mockPost.mockResolvedValue(expectedModel);

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
                measurementId: "test test test test",
                modelId: "test test test test",
                factoryId: "test test test test",
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
            },
        ];

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

        mockPost.mockResolvedValue(expectedModel);

    });

    test("should handle no unique properties", () => {
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

        const { getByText } = render(
            <Context.Provider value={mockContextValue}>
                <GeneratorFunctionForm />
            </Context.Provider>,
        );

        expect(getByText("Property 1 - Pressure")).toBeInTheDocument();
    });
});
