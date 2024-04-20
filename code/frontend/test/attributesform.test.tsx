import React from "react";
import { Context } from "@/components/models/createmodelform/CreateModelForm";
import AttributesForm, {
    AttributesFormContext,
} from "@/components/models/createmodelform/attributedefinition/AttributesForm";
import { BackendConnector, GetConfig, PostConfig } from "@/app/api/_utils/connector";
import { Attribute, Asset } from "@/app/api/_utils/types";
import { act, fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockGet = jest.fn();
BackendConnector.get = mockGet;

const mockPost = jest.fn();
BackendConnector.post = mockPost;

const mockSetAttributes = jest.fn();
const mockNextPage = jest.fn();
const mockSetAsset = jest.fn();

const mockAsset: Asset = {
    assetId: "1",
    factoryId: "987654321",
    modelId: "123456",
    name: "cairo",
    description: "funniest CS major",
    imageData: "selfie.jpg",
    modelUrl: "instagram.com/cairoach",
    floorplanCords: {
        x:0,
        y:0
    },
};

describe("AttributesForm", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should add attributes to the list of attributes", async () => {
        mockGet.mockResolvedValueOnce([mockAsset]);

        const mockGetConfig: GetConfig = {
            resource: "assets",
            params: { factoryId: "987654321" },
        };

        const expectedAttributes: Attribute[] = [
            {   
                factoryId: "987654321",
                modelId: "123456",
                name: "name",
                value: "GOAT 2000",
                assetId: "1",
            },
            {
                factoryId: "987654321",
                modelId: "123456",
                name: "Serial number",
                value: "SN-0987654321",
                assetId: "1",
            },
        ];
        mockPost.mockResolvedValueOnce(expectedAttributes);

        const mockPostConfig1: PostConfig<Attribute> = {
            resource: "attributes",
            payload: expectedAttributes[0],
        };

        const mockPostConfig2: PostConfig<Attribute> = {
            resource: "attributes",
            payload: expectedAttributes[1],
        };

        const mockContextValue: AttributesFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            attributes: [],
            setAttributes: mockSetAttributes,
            asset: mockAsset,
            setAsset: mockSetAsset,
            properties: [],
            setProperties: jest.fn(),
            nextPage: mockNextPage,
        };

        const { getByPlaceholderText, getByRole, getByText } = render(
            <Context.Provider value={mockContextValue}>
                <AttributesForm />
            </Context.Provider>,
        );

        await waitFor(() => {
            expect(mockGet).toHaveBeenCalledWith(mockGetConfig) ;
            expect(getByText("cairo")).toBeInTheDocument();
        });

        act(() => {
            const assetSelect = getByRole("combobox",);
            fireEvent.change(assetSelect, { target: { value: "1" } });
        });
           
        await waitFor(() => {
            expect(mockSetAsset).toHaveBeenCalledWith(mockAsset);
            mockContextValue.asset = mockAsset; // simulate the change in the context
        });

        const nameField = getByPlaceholderText("Enter a model name");
        fireEvent.change(nameField, { target: { value: "GOAT 2000" } });

        await waitFor(() => {
            expect(mockSetAttributes).toHaveBeenCalledWith([
                expectedAttributes[0],
            ]);
            mockContextValue.attributes.push(expectedAttributes[0]); // simulate the change in the context
        });

        const propertyNameInput = getByPlaceholderText("e.g. Serial number");
        fireEvent.change(propertyNameInput, {
            target: { value: "Serial number" },
        });

        const propertyUnitInput = getByPlaceholderText("e.g. SN-1234567890");
        fireEvent.change(propertyUnitInput, {
            target: { value: "SN-0987654321" },
        });

        await waitFor(() => {
            expect(mockSetAttributes).toHaveBeenLastCalledWith(
                expectedAttributes,
            );
            mockContextValue.attributes.push(expectedAttributes[1]); // simulate the change in the context
        });

        const submitButton = getByText(/Next/);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockPost).toHaveBeenNthCalledWith(1, mockPostConfig1);
            expect(mockPost).toHaveBeenNthCalledWith(2, mockPostConfig2);
            expect(mockNextPage).toHaveBeenCalled();
        });
    });

    test("should add attributes to the list of attributes with duplicate attribute names", async () => {
        const expectedAttributes: Attribute[] = [
            {   
                factoryId: "",
                modelId: "123456",
                name: "name",
                value: "GOAT 2000",
                assetId: "1",
            },
            {
                factoryId: "",
                modelId: "123456",
                name: "Serial number",
                value: "SN-0987654321",
                assetId: "1",
            },
        ];
        mockPost.mockResolvedValueOnce(expectedAttributes);

        const mockPostConfig1: PostConfig<Attribute> = {
            resource: "attributes",
            payload: expectedAttributes[0],
        };

        const mockPostConfig2: PostConfig<Attribute> = {
            resource: "attributes",
            payload: expectedAttributes[1],
        };

        const mockContextValue: AttributesFormContext = {
            factoryId: "",
            modelId: "123456",
            attributes: [
                ...expectedAttributes,
                {
                    factoryId: "",
                    modelId: "123456",
                    name: "Serial number",
                    value: "SN-0987654321",
                    assetId: "1",
                },
            ],
            setAttributes: mockSetAttributes,
            asset: mockAsset,
            setAsset: mockSetAsset,
            properties: [],
            setProperties: jest.fn(),
            nextPage: mockNextPage,
        };

        const { getByText } = render(
            <Context.Provider value={mockContextValue}>
                <AttributesForm />
            </Context.Provider>,
        );

        const submitButton = getByText(/Next/);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockPost).toHaveBeenNthCalledWith(1, mockPostConfig1);
            expect(mockPost).toHaveBeenNthCalledWith(2, mockPostConfig2);
            expect(mockNextPage).toHaveBeenCalled();
        });
    });

    test("should not continue to the next page if the form is not complete", () => {
        const mockContextValue: AttributesFormContext = {
            factoryId: "",
            modelId: "123456",
            attributes: [],
            setAttributes: mockSetAttributes,
            asset:mockAsset,
            setAsset: mockSetAsset,
            properties: [],
            setProperties: jest.fn(),
            nextPage: mockNextPage,
        };

        const { getByText } = render(
            <Context.Provider value={mockContextValue}>
                <AttributesForm />
            </Context.Provider>,
        );

        const submitButton = getByText(/Next/);
        fireEvent.click(submitButton);

        expect(getByText("Model name is required.")).toBeInTheDocument();
        expect(mockNextPage).not.toHaveBeenCalled();
    });

    test("should add a new attribute input fields when the 'Add Attribute' button is clicked", () => {
        const mockContextValue: AttributesFormContext = {
            factoryId: "",
            modelId: "123456",
            attributes: [],
            setAttributes: mockSetAttributes,
            asset:mockAsset,
            setAsset:mockSetAsset,
            properties: [],
            setProperties: jest.fn(),
            nextPage: mockNextPage,
        };

        const { getByText } = render(
            <Context.Provider value={mockContextValue}>
                <AttributesForm />
            </Context.Provider>,
        );

        const addAttributeButton = getByText("Add Attribute");
        fireEvent.click(addAttributeButton);

        expect(getByText("Attribute 2")).toBeInTheDocument();
    });

    test("should clear timeout in 'NameField", () => {
        const clearTimeoutSpy = jest.spyOn(window, "clearTimeout");
        const setTimeoutSpy = jest.spyOn(window, "setTimeout");

        const mockDebounceTimeout = { current: null as NodeJS.Timeout | null };
        React.useRef = jest.fn(() => mockDebounceTimeout);

        setTimeoutSpy.mockImplementation(
            () => 123 as unknown as NodeJS.Timeout,
        );

        const mockContextValue: AttributesFormContext = {
            factoryId: "",
            modelId: "123456",
            attributes: [],
            asset:mockAsset,
            setAsset:mockSetAsset,
            setAttributes: mockSetAttributes,
            properties: [],
            setProperties: jest.fn(),
            nextPage: mockNextPage,
        };

        const { getByPlaceholderText } = render(
            <Context.Provider value={mockContextValue}>
                <AttributesForm />
            </Context.Provider>,
        );

        mockDebounceTimeout.current = setTimeout(() => {}, 1000);

        const nameField = getByPlaceholderText("Enter a model name");
        fireEvent.change(nameField, { target: { value: "GOAT 2000" } });

        expect(clearTimeoutSpy).toHaveBeenCalledWith(
            mockDebounceTimeout.current,
        );
    });

    test("should clear timeout in 'AttributeInputColumn", () => {
        const clearTimeoutSpy = jest.spyOn(window, "clearTimeout");
        const setTimeoutSpy = jest.spyOn(window, "setTimeout");

        const mockDebounceTimeout = { current: null as NodeJS.Timeout | null };
        React.useRef = jest.fn(() => mockDebounceTimeout);

        setTimeoutSpy.mockImplementation(
            () => 123 as unknown as NodeJS.Timeout,
        );

        const mockContextValue: AttributesFormContext = {
            factoryId: "",
            modelId: "123456",
            asset:mockAsset,
            setAsset:mockSetAsset,
            attributes: [],
            setAttributes: mockSetAttributes,
            properties: [],
            setProperties: jest.fn(),
            nextPage: mockNextPage,
        };

        const { getByPlaceholderText } = render(
            <Context.Provider value={mockContextValue}>
                <AttributesForm />
            </Context.Provider>,
        );

        mockDebounceTimeout.current = setTimeout(() => {}, 1000);

        const attributeNameInput = getByPlaceholderText("e.g. Serial number");
        fireEvent.change(attributeNameInput, {
            target: { value: "Serial number" },
        });

        const attributeValueInput = getByPlaceholderText("e.g. SN-1234567890");
        fireEvent.change(attributeValueInput, {
            target: { value: "SN-0987654321" },
        });

        expect(clearTimeoutSpy).toHaveBeenCalledWith(
            mockDebounceTimeout.current,
        );
    });

    test("should log error if failed to fetch assets", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        const error = new Error("Failed to fetch assets");
        mockGet.mockRejectedValueOnce(error);

        const mockContextValue: AttributesFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            attributes: [],
            setAttributes: mockSetAttributes,
            asset: mockAsset,
            setAsset: mockSetAsset,
            properties: [],
            setProperties: jest.fn(),
            nextPage: mockNextPage,
        };

        render(
            <Context.Provider value={mockContextValue}>
                <AttributesForm />
            </Context.Provider>,
        );

        await act(async () => {
            // Wait for useEffect to complete
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to fetch assets:", error);

        consoleErrorSpy.mockRestore();
    });

    test("should log error if failed to post attribute", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        const error = new Error("Failed to fetch assets");
        mockPost.mockRejectedValueOnce(error);

        const mockContextValue: AttributesFormContext = {
            factoryId: "",
            modelId: "123456",
            attributes: [
                {   
                    factoryId: "987654321",
                    modelId: "123456",
                    name: "name",
                    value: "GOAT 2000",
                    assetId: "1",
                },
                {
                    factoryId: "987654321",
                    modelId: "123456",
                    name: "Serial number",
                    value: "SN-0987654321",
                    assetId: "1",
                },
            ],
            setAttributes: mockSetAttributes,
            asset: mockAsset,
            setAsset: mockSetAsset,
            properties: [],
            setProperties: jest.fn(),
            nextPage: mockNextPage,
        };

        const { getByText } = render(
            <Context.Provider value={mockContextValue}>
                <AttributesForm />
            </Context.Provider>,
        );

        const submitButton = getByText(/Next/);
        fireEvent.click(submitButton);

        await act(async () => {
            // Wait for useEffect to complete
        });
        
        expect(consoleErrorSpy).toHaveBeenCalledWith(error);

        consoleErrorSpy.mockRestore();
    });
});
