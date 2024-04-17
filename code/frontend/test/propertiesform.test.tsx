import React from "react";
import { Context } from "@/components/models/createmodelform/CreateModelForm";
import PropertiesForm, {
    PropertiesFormContext,
} from "@/components/models/createmodelform/propertiesdefinition/PropertiesForm";
import { Property } from "@/app/api/_utils/types";
import { fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockSetProperties = jest.fn();
const mockNextPage = jest.fn();

describe("Properties Form", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders correctly", () => {
        const mockContextValue: PropertiesFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            attributes: [],
            setAttributes: jest.fn(),
            properties: [],
            setProperties: mockSetProperties,
            nextPage: mockNextPage,
        };

        const { getByTestId } = render(
            <Context.Provider value={mockContextValue}>
                <PropertiesForm />
            </Context.Provider>,
        );

        expect(getByTestId("property-input")).toBeInTheDocument();
        expect(getByTestId("add-property")).toBeInTheDocument();
        expect(getByTestId("combobox-gen-functions")).toBeInTheDocument();
    });

    test("should add properties to the list of properties", async () => {
        const mockContextValue: PropertiesFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            attributes: [],
            setAttributes: jest.fn(),
            properties: [],
            setProperties: mockSetProperties,
            nextPage: mockNextPage,
        };

        const expectedProperties: Property[] = [
            {
                factoryId: "",
                modelId: "",
                measurementId: "",
                name: "Pressure",
                unit: "Pa",
                generatorType: "Random",
            },
        ];

        const { getByPlaceholderText, getByRole, getByText } = render(
            <Context.Provider value={mockContextValue}>
                <PropertiesForm />
            </Context.Provider>,
        );

        const comboBoxInput = getByPlaceholderText("Select generator function");
        fireEvent.change(comboBoxInput, { target: { value: "Random" } });

        expect(getByText("Random")).toBeInTheDocument();

        const option = getByRole("option", { name: "Random" });
        fireEvent.click(option);

        const generaforFuncationInput = getByPlaceholderText(
            "Select generator function",
        );
        fireEvent.change(generaforFuncationInput, {
            target: { value: "Random" },
        });

        const attributeNameInput = getByPlaceholderText("e.g. Temperature");
        fireEvent.change(attributeNameInput, {
            target: { value: "Pressure" },
        });

        const attributeValueInput = getByPlaceholderText("e.g. °C");
        fireEvent.change(attributeValueInput, {
            target: { value: "Pa" },
        });

        await waitFor(() => {
            expect(mockSetProperties).toHaveBeenCalledWith(expectedProperties);
        });

        const submitButton = getByText(/Next/);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockNextPage).toHaveBeenCalled();
        });
    });

    test("should add a new property input fields when the 'Add Property' button is clicked", () => {
        const mockContextValue: PropertiesFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            attributes: [],
            setAttributes: jest.fn(),
            properties: [],
            setProperties: mockSetProperties,
            nextPage: mockNextPage,
        };

        const { getByText } = render(
            <Context.Provider value={mockContextValue}>
                <PropertiesForm />
            </Context.Provider>,
        );

        const addPropertyeButton = getByText("Add Property");
        fireEvent.click(addPropertyeButton);

        expect(getByText("Property 2")).toBeInTheDocument();
    });

    test("should not continue to the next page if the form is not complete", () => {
        const mockContextValue: PropertiesFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            attributes: [],
            setAttributes: jest.fn(),
            properties: [
                {
                    factoryId: "",
                    modelId: "",
                    measurementId: "",
                    name: "Pressure",
                    unit: "Pa",
                    generatorType: "",
                },
            ],
            setProperties: mockSetProperties,
            nextPage: mockNextPage,
        };

        const { getByText } = render(
            <Context.Provider value={mockContextValue}>
                <PropertiesForm />
            </Context.Provider>,
        );

        const submitButton = getByText(/Next/);
        fireEvent.click(submitButton);

        expect(
            getByText("Please fill out all provided input fields."),
        ).toBeInTheDocument();
        expect(mockNextPage).not.toHaveBeenCalled();
    });
});
