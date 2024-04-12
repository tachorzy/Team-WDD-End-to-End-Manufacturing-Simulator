import CreateModelForm from "@/components/models/createmodelform/CreateModelForm";
import AttributeInputColumn from "@/components/models/createmodelform/attributedefinition/AttributeInputColumn";
import PropertyInputColumn from "@/components/models/createmodelform/propertiesdefinition/PropertyInputColumn";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("CreateModelForm", () => {
    test("should render CreateModelForm component with model ID field", () => {
        const mockFactoryId = "12345678";
        const { getByText, getByPlaceholderText } = render(
            <CreateModelForm factoryId={mockFactoryId} />,
        );

        const formTitle = getByText("Create Your Asset Model");
        const modelIDHeader = getByText("Model ID");
        const modelIDPrompt = getByText("Define ID Prefix");
        const modelIDInput = getByPlaceholderText("e.g. CNC");

        expect(formTitle).toBeInTheDocument();
        expect(modelIDHeader).toBeInTheDocument();
        expect(modelIDPrompt).toBeInTheDocument();
        expect(modelIDInput).toBeInTheDocument();
    });

    test("should render attribute and property columns", () => {
        const mockFactoryId = "12345678";
        const { getByText } = render(
            <CreateModelForm factoryId={mockFactoryId} />,
        );
        const attributeColumn = getByText("Attributes");
        const propertyColumn = getByText("Properties");

        expect(attributeColumn).toBeInTheDocument();
        expect(propertyColumn).toBeInTheDocument();
    });

    test("should render AttributeInputColumn input fields", () => {
        const { getByText, getByPlaceholderText } = render(
            <AttributeInputColumn
                attributes={[{ attribute: "", value: "" }]}
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
            <PropertyInputColumn properties={[{ property: "", unit: "" }]} />,
        );
        const propertyHeader = getByText("Property 1");
        const propertyInput = getByPlaceholderText("e.g. Temperature");
        const unitsInput = getByPlaceholderText("e.g. °C");

        expect(propertyHeader).toBeInTheDocument();
        expect(propertyInput).toBeInTheDocument();
        expect(unitsInput).toBeInTheDocument();
    });

    test("should add new attribute input field when Add Attribute button is clicked", async () => {
        const mockFactoryId = "12345678";
        const { getByText } = render(
            <CreateModelForm factoryId={mockFactoryId} />,
        );
        const addAttributeButton = getByText("Add Attribute");

        addAttributeButton.click();
        const attributeHeader = getByText("Attribute 1");

        await waitFor(() => {
            const attributeHeader2 = getByText("Attribute 2");

            expect(attributeHeader).toBeInTheDocument();
            expect(attributeHeader2).toBeInTheDocument();
        });
    });

    test("should add new property input field when Add Property button is clicked", async () => {
        const mockFactoryId = "12345678";
        const { getByText } = render(
            <CreateModelForm factoryId={mockFactoryId} />,
        );
        const addPropertyButton = getByText("Add Property");
        addPropertyButton.click();

        const propertyHeader = getByText("Property 1");

        await waitFor(() => {
            const propertyHeader2 = getByText("Property 2");

            expect(propertyHeader).toBeInTheDocument();
            expect(propertyHeader2).toBeInTheDocument();
        });
    });
});
