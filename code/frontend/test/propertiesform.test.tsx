import React from "react";
import { Context } from "@/components/models/createmodelform/CreateModelForm";
import PropertiesForm, {
    PropertiesFormContext,
} from "@/components/models/createmodelform/propertiesdefinition/PropertiesForm";
import { BackendConnector, PostConfig } from "@/app/api/_utils/connector";
import { Property, Asset } from "@/app/api/_utils/types";
import { fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockPost = jest.fn();
BackendConnector.post = mockPost;

const mockSetProperties = jest.fn();
const mockNextPage = jest.fn();

const mockAsset: Asset = {
    assetId: "",
    name: "",
    description: "",
    imageData: "",
    factoryId: "",
    modelId: "",
    modelUrl: "",
    floorplanCords: {
        x: 0,
        y: 0,
    },
};

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
            asset: mockAsset,
            setAsset: jest.fn(),
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
        const expectedProperties: Property[] = [
            {
                propertyId: "",
                assetId: "",
                factoryId: "",
                modelId: "",
                measurementId: "",
                name: "Pressure",
                unit: "Pa",
                generatorType: "Random",
            },
        ];
        mockPost.mockResolvedValue(expectedProperties);

        const mockExpectedConfig: PostConfig<Property> = {
            resource: "properties",
            payload: {
                ...expectedProperties[0],
            }
        };

        const mockContextValue: PropertiesFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            attributes: [],
            setAttributes: jest.fn(),
            properties: [],
            asset: mockAsset,
            setAsset: jest.fn(),
            setProperties: mockSetProperties,
            nextPage: mockNextPage,
        };

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
            expect(mockSetProperties).toHaveBeenLastCalledWith(expectedProperties);
            mockContextValue.properties.push(expectedProperties[0]); // simulate the change in the context
        });

        const submitButton = getByText(/Next/);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith(mockExpectedConfig);
            expect(mockSetProperties).toHaveBeenLastCalledWith(expectedProperties);
            expect(mockNextPage).toHaveBeenCalled();
        });
    });

    test("should add properties with a duplicate property name to the list of properties", async () => {
        const expectedProperties: Property[] = [
            {
                propertyId: "",
                assetId: "",
                factoryId: "",
                modelId: "",
                measurementId: "",
                name: "Pressure",
                unit: "Pa",
                generatorType: "Random",
            },
        ];
        mockPost.mockResolvedValue(expectedProperties[0]);

        const mockExpectedConfig: PostConfig<Property> = {
            resource: "properties",
            payload: {
                ...expectedProperties[0],
            }
        };

        const mockContextValue: PropertiesFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            attributes: [],
            setAttributes: jest.fn(),
            properties: [
                ...expectedProperties,
                {
                    propertyId: "",
                    assetId: "",
                    factoryId: "",
                    modelId: "",
                    measurementId: "",
                    name: "Pressure",
                    unit: "psi",
                    generatorType: "Sawtooth",
                },
            ],
            asset: mockAsset,
            setAsset: jest.fn(),
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

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith(mockExpectedConfig);
            expect(mockSetProperties).toHaveBeenCalledWith(expectedProperties);
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
            asset: mockAsset,
            setAsset: jest.fn(),
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

    test("should not continue to the next page if the form is not complete", async () => {
        const mockContextValue: PropertiesFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            attributes: [],
            setAttributes: jest.fn(),
            properties: [
                {
                    propertyId: "",
                    assetId: "",
                    factoryId: "",
                    modelId: "",
                    measurementId: "",
                    name: "",
                    unit: "",
                    generatorType: "",
                },
            ],
            asset: mockAsset,
            setAsset: jest.fn(),
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

        await waitFor(() => {
            expect(
                getByText("Please fill out all provided input fields."),
            ).toBeInTheDocument();
            expect(mockNextPage).not.toHaveBeenCalled();
        });
    });

    test("should log error if the API call fails", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        const error = new Error("Failed to add property");
        mockPost.mockRejectedValue(error);

        const expectedProperties: Property[] = [
            {
                propertyId: "",
                assetId: "",
                factoryId: "",
                modelId: "",
                measurementId: "",
                name: "Pressure",
                unit: "Pa",
                generatorType: "Random",
            },
        ];

        const mockContextValue: PropertiesFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            attributes: [],
            setAttributes: jest.fn(),
            properties: [
                ...expectedProperties,
            ],
            asset: mockAsset,
            setAsset: jest.fn(),
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

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(error);
            expect(mockSetProperties).toHaveBeenLastCalledWith(expectedProperties);
        });

        consoleErrorSpy.mockRestore();
    });

    test("should update properties if response is empty", async () => {
        mockPost.mockResolvedValue(null);

        const expectedProperties: Property[] = [
            {
                propertyId: "",
                assetId: "",
                factoryId: "",
                modelId: "",
                measurementId: "",
                name: "Pressure",
                unit: "Pa",
                generatorType: "Random",
            },
        ];

        const mockContextValue: PropertiesFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            attributes: [],
            setAttributes: jest.fn(),
            properties: expectedProperties,
            asset: mockAsset,
            setAsset: jest.fn(),
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

        await waitFor(() => {
            expect(mockSetProperties).toHaveBeenLastCalledWith(expectedProperties);
        });
    });
});
