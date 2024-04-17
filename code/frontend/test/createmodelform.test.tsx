import CreateModelForm, {
    Context,
} from "@/components/models/createmodelform/CreateModelForm";
import AttributeInputColumn from "@/components/models/createmodelform/attributedefinition/AttributeInputColumn";
import PropertyInputColumn from "@/components/models/createmodelform/propertiesdefinition/PropertyInputColumn";
import AddAttributeForm from "@/components/models/createmodelform/attributedefinition/AttributesForm";
import AddPropertyForm from "@/components/models/createmodelform/propertiesdefinition/PropertiesForm";
import { Attribute, Property } from "@/app/api/_utils/types";

import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

const initialAttribute: Attribute = {
    factoryId: "",
    modelId: "",
    name: "",
    value: "",
};

const initialProperty: Property = {
    factoryId: "",
    modelId: "",
    measurementId: "",
    name: "",
    unit: "",
    generatorType: "",
};

describe("CreateModelForm", () => {
    test("should render CreateModelForm", () => {
        const mockFactoryId = "12345678";
        const { getByText } = render(
            <CreateModelForm factoryId={mockFactoryId} />,
        );
        const formTitle = getByText("Create Asset Model");
        expect(formTitle).toBeInTheDocument();
    });

    test("should render AttributeInputColumn input fields", () => {
        const { getByText, getByPlaceholderText } = render(
            <AttributeInputColumn
                inputFields={[initialAttribute]}
                attributes={[initialAttribute]}
                setAttributes={jest.fn()}
                factoryId="123456789"
            />,
        );
        const attributeHeader = getByText("Attribute 1");
        const attributeInput = getByPlaceholderText("e.g. Model Name");
        const valueInput = getByPlaceholderText("e.g. CNC 1");

        expect(attributeHeader).toBeInTheDocument();
        expect(attributeInput).toBeInTheDocument();
        expect(valueInput).toBeInTheDocument();
    });

    test("should render PropertyInputColumn input fields", () => {
        const { getByText, getByPlaceholderText } = render(
            <PropertyInputColumn
                inputFields={[initialProperty]}
                properties={[initialProperty]}
                setProperties={jest.fn()}
                invalidProperty={false}
                setInvalidProperty={jest.fn()}
            />,
        );
        const propertyHeader = getByText("Property 1");
        const propertyInput = getByPlaceholderText("e.g. Temperature");
        const unitsInput = getByPlaceholderText("e.g. °C");

        expect(propertyHeader).toBeInTheDocument();
        expect(propertyInput).toBeInTheDocument();
        expect(unitsInput).toBeInTheDocument();
    });

    test("should add new attribute input field when Add Attribute button is clicked", async () => {
        const mockContextValue = {
            factoryId: "12345678",
            modelId: "12345678",
            attributes: [{ attribute: "name", value: "CNC 1" }],
            setAttributes: jest.fn(),
            properties: [{ property: "", unit: "" }],
            setProperties: jest.fn(),
        };

        const { getByText } = render(
            <Context.Provider value={mockContextValue}>
                <AddAttributeForm />
            </Context.Provider>,
        );
        const addAttributeButton = getByText("Add Attribute");

        addAttributeButton.click();

        await waitFor(() => {
            expect(getByText("Attribute 2")).toBeInTheDocument();
        });
    });

    test("should add new property input field when Add Property button is clicked", async () => {
        const mockContextValue = {
            factoryId: "12345678",
            modelId: "12345678",
            attributes: [{ attribute: "name", value: "CNC 1" }],
            setAttributes: jest.fn(),
            properties: [{ property: "Temperature", unit: "°C" }],
            setProperties: jest.fn(),
        };

        const { getByText } = render(
            <Context.Provider value={mockContextValue}>
                <AddPropertyForm />
            </Context.Provider>,
        );
        const addPropertyButton = getByText("Add Property");
        addPropertyButton.click();

        await waitFor(() => {
            expect(getByText("Property 2")).toBeInTheDocument();
        });
    });
});
