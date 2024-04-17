import React from "react";
import { Context } from "@/components/models/createmodelform/CreateModelForm";
import AttributesForm, { AttributesFormContext }from "@/components/models/createmodelform/attributedefinition/AttributesForm";
import { Attribute } from "@/app/api/_utils/types";
import { act, fireEvent, render, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";

const mockSetAttributes = jest.fn();
const mockSetProperties = jest.fn();
const mockNextPage = jest.fn();

describe("AttributesForm", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders correctly", () => {
        const mockContextValue: AttributesFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            attributes: [],
            setAttributes: mockSetAttributes,
            properties: [],
            setProperties: mockSetProperties,
            nextPage: mockNextPage,
        };

        const {getByTestId} =render(
            
        <Context.Provider value={mockContextValue}>
            <AttributesForm />
        </Context.Provider>
        );

        expect(getByTestId("name-field")).toBeInTheDocument();
        expect(getByTestId("attribute-input")).toBeInTheDocument();
        expect(getByTestId("add-attribute")).toBeInTheDocument();
    });

    test("should add attributes to the list of attributes", async () => {
        const mockContextValue: AttributesFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            attributes: [],
            setAttributes: mockSetAttributes,
            properties: [],
            setProperties: mockSetProperties,
            nextPage: mockNextPage,
        };

        const expectedAttributes: Attribute[] = [
            { 
                factoryId: "987654321",
                modelId: "123456",
                name: "name",
                value: "GOAT 2000"
            },
            { 
                factoryId: "987654321",
                modelId: "123456",
                name: "Serial number",
                value: "SN-0987654321"
            }
        ];
        
        const { getByPlaceholderText, getByText } = render(
            <Context.Provider value={mockContextValue}>
                <AttributesForm />
            </Context.Provider>
        );

        const nameField = getByPlaceholderText("Enter a model name");
        fireEvent.change(nameField, { target: { value: "GOAT 2000" } });

        await waitFor(() => {
            expect(mockSetAttributes).toHaveBeenCalledWith([expectedAttributes[0]]);
            mockContextValue.attributes.push(expectedAttributes[0]); // simulate the change in the context
        });

        const attributeNameInput = getByPlaceholderText("e.g. Serial number");
        fireEvent.change(attributeNameInput, { target: { value: "Serial number" } });

        const attributeValueInput = getByPlaceholderText("e.g. SN-1234567890");
        fireEvent.change(attributeValueInput, { target: { value: "SN-0987654321" } });

        await waitFor(() => {
            expect(mockSetAttributes).toHaveBeenLastCalledWith(expectedAttributes);
            mockContextValue.attributes.push(expectedAttributes[1]); // simulate the change in the context
        });

        const submit = getByText(/Next/);
        fireEvent.click(submit);

        await waitFor(() => {
            expect(mockNextPage).toHaveBeenCalled();
        });
    });

    test("should display an error message if model name is empty", async () => {
        const mockContextValue: AttributesFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            attributes: [],
            setAttributes: mockSetAttributes,
            properties: [],
            setProperties: mockSetProperties,
            nextPage: mockNextPage,
        };

        const { getByText } = render(
            <Context.Provider value={mockContextValue}>
                <AttributesForm />
            </Context.Provider>
        );

        const submit = getByText(/Next/);
        fireEvent.click(submit);

        expect(getByText("Model name is required.")).toBeInTheDocument(); 
    });

    test("should not continue to the next page if the form is not complete", () => {
        const mockContextValue: AttributesFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            attributes: [],
            setAttributes: mockSetAttributes,
            properties: [],
            setProperties: mockSetProperties,
            nextPage: mockNextPage,
        };

        const { getByText } = render(
            <Context.Provider value={mockContextValue}>
                <AttributesForm />
            </Context.Provider>
        );

        const submit = getByText(/Next/);
        fireEvent.click(submit);

        expect(mockNextPage).not.toHaveBeenCalled();
    });

    test("should add a new attribute input field when the 'Add Attribute' button is clicked", () => {
        const mockContextValue: AttributesFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            attributes: [],
            setAttributes: mockSetAttributes,
            properties: [],
            setProperties: mockSetProperties,
            nextPage: mockNextPage,
        };

        const { getByText } = render(
            <Context.Provider value={mockContextValue}>
                <AttributesForm />
            </Context.Provider>
        );

        const addAttributeButton = getByText("Add Attribute");
        fireEvent.click(addAttributeButton);

        expect(getByText("Attribute 2")).toBeInTheDocument();
    });

    test("should clear timeout in 'NameField", () => {
        const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
        const setTimeoutSpy = jest.spyOn(window, 'setTimeout');

        const mockDebounceTimeout = { current: null as NodeJS.Timeout | null };
        React.useRef = jest.fn(() => mockDebounceTimeout);

        setTimeoutSpy.mockImplementation(() => 123 as unknown as NodeJS.Timeout);

        const mockContextValue: AttributesFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            attributes: [],
            setAttributes: mockSetAttributes,
            properties: [],
            setProperties: mockSetProperties,
            nextPage: mockNextPage,
        };

        const { getByPlaceholderText } = render(
            <Context.Provider value={mockContextValue}>
                <AttributesForm />
            </Context.Provider>
        );

        mockDebounceTimeout.current = setTimeout(() => {}, 1000);

        const nameField = getByPlaceholderText("Enter a model name");
        fireEvent.change(nameField, { target: { value: "GOAT 2000" } });

        expect(clearTimeoutSpy).toHaveBeenCalledWith(mockDebounceTimeout.current);
    });

    test("should clear timeout in 'AttributeInputColumn", () => {
        const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
        const setTimeoutSpy = jest.spyOn(window, 'setTimeout');

        const mockDebounceTimeout = { current: null as NodeJS.Timeout | null };
        React.useRef = jest.fn(() => mockDebounceTimeout);

        setTimeoutSpy.mockImplementation(() => 123 as unknown as NodeJS.Timeout);

        const mockContextValue: AttributesFormContext = {
            factoryId: "987654321",
            modelId: "123456",
            attributes: [],
            setAttributes: mockSetAttributes,
            properties: [],
            setProperties: mockSetProperties,
            nextPage: mockNextPage,
        };

        const { getByPlaceholderText } = render(
            <Context.Provider value={mockContextValue}>
                <AttributesForm />
            </Context.Provider>
        );

        mockDebounceTimeout.current = setTimeout(() => {}, 1000);

        const attributeNameInput = getByPlaceholderText("e.g. Serial number");
        fireEvent.change(attributeNameInput, { target: { value: "Serial number" } });

        const attributeValueInput = getByPlaceholderText("e.g. SN-1234567890");
        fireEvent.change(attributeValueInput, { target: { value: "SN-0987654321" } });

        expect(clearTimeoutSpy).toHaveBeenCalledWith(mockDebounceTimeout.current);
    });
});
