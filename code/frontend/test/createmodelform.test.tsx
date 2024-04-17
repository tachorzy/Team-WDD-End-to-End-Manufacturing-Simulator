import CreateModelForm from "@/components/models/createmodelform/CreateModelForm";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockFactoryId = "123456789";

// suppresses console.log
jest.spyOn(global.console, "log").mockImplementation(() => {});

describe("CreateModelForm", () => {
    test("should render without errors", () => {
        const { getByText, getByTestId } = render(
            <CreateModelForm factoryId={mockFactoryId} />,
        );

        const formTitle = getByText("Create Asset Model");
        const progressTracker = getByTestId("progress-tracker");
        expect(formTitle).toBeInTheDocument();
        expect(progressTracker).toBeInTheDocument();
    });

    test("should render 'AttributesForm'", () => {
        const { getByTestId } = render(
            <CreateModelForm factoryId={mockFactoryId} />,
        );

        const attributesForm = getByTestId("attributes-form");
        expect(attributesForm).toBeInTheDocument();
    });
});