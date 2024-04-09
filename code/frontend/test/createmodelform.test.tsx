import CreateModelForm from "@/components/models/createmodelform/CreateModelForm";
import { render } from "@testing-library/react";
import '@testing-library/jest-dom';

describe("CreateModelForm", () => {
    test("renders CreateModelForm component with model ID field", () => {
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
});
