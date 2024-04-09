import CreateModelForm from "@/components/models/createmodelform/CreateModelForm";
import AttributeInputColumn from "@/components/models/createmodelform/AttributeInputColumn";
import PropertyInputColumn from "@/components/models/createmodelform/PropertyInputColumn";
import { render } from "@testing-library/react";
import '@testing-library/jest-dom';

describe("CreateModelForm", () => {
    test("should render CreateModelForm component with model ID field", () => {
        const { getByText, getByPlaceholderText, getByDisplayValue } = render(<CreateModelForm />);

        const formTitle = getByText("Create Your Asset Model");
        const modelIDHeader = getByText("Model ID");
        const modelIDPrompt = getByText("Define ID prefix");
        const modelIDInput = getByPlaceholderText("e.g. CNC");

        expect(formTitle).toBeInTheDocument();
        expect(modelIDHeader).toBeInTheDocument();
        expect(modelIDPrompt).toBeInTheDocument();
        expect(modelIDInput).toBeInTheDocument();
    });

    test("should render attribute and property columns", () => {
        const { getByText } = render(<CreateModelForm />);
        const attributeColumn = getByText("Attributes");
        const propertyColumn = getByText("Properties");

        expect(attributeColumn).toBeInTheDocument();
        expect(propertyColumn).toBeInTheDocument();
    });

    test("should render AttributeInputColumn input fields", () => {
        const { getByText, getByPlaceholderText } = render(<AttributeInputColumn attributes={[{ attribute: "", value: "" }]} />);
        const attributeHeader = getByText("Attribute 1");
        const attributeInput = getByPlaceholderText("e.g. Model Name");
        const valueInput = getByPlaceholderText("e.g. CNC 1");

        expect(attributeHeader).toBeInTheDocument();
        expect(attributeInput).toBeInTheDocument();
        expect(valueInput).toBeInTheDocument();
    });

    test("should render PropertyInputColumn input fields", () => {
        const { getByText, getByPlaceholderText } = render(<PropertyInputColumn properties={[{ property: "", unit: "" }]} />);
        const propertyHeader = getByText("Property 1");
        const propertyInput = getByPlaceholderText("e.g. Temperature");
        const unitsInput = getByPlaceholderText("e.g. °C");

        expect(propertyHeader).toBeInTheDocument();
        expect(propertyInput).toBeInTheDocument();
        expect(unitsInput).toBeInTheDocument();
    });

    test("should add new attribute input field when Add Attribute button is clicked", () => {
        const { getByText } = render(<AttributeInputColumn attributes={[{ attribute: "", value: "" }]} />);
        const addAttributeButton = getByText("Add Attribute");

        addAttributeButton.click();

        const attributeHeader = getByText("Attribute 2");
        const valueInput = getByText("Value");

        expect(attributeHeader).toBeInTheDocument();
        expect(valueInput).toBeInTheDocument();
    });

    test("should add new property input field when Add Property button is clicked", () => {
        const { getByText } = render(<PropertyInputColumn properties={[{ property: "", unit: "" }]} />);
        const addPropertyButton = getByText("Add Property");

        addPropertyButton.click();

        const propertyHeader = getByText("Property 2");
        const unitsInput = getByText("Units");

        expect(propertyHeader).toBeInTheDocument();
        expect(unitsInput).toBeInTheDocument();
    });
    
});
