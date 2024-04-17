import CreateModelForm from "@/components/models/createmodelform/CreateModelForm";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockFactoryId = "12345678";

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

    // test("should render 'PropertiesForm'", () => {
    //     const { getByText, getByTestId } = render(
    //         <CreateModelForm factoryId={mockFactoryId} />,
    //     );

    //     const nextButton = getByText(/Next/);
    //     fireEvent.click(nextButton);

    //     const propertiesForm = getByTestId("properties-form");
    //     expect(propertiesForm).toBeInTheDocument();
    // });

    // test("should go back to 'AttributesForm' when 'Back' button is clicked from 'PropertiesForm'", () => {
    //     const { getByText, getByTestId } = render(
    //         <CreateModelForm factoryId={mockFactoryId} />,
    //     );

    //     const nextButton = getByText(/Next/);
    //     fireEvent.click(nextButton);

    //     const propertiesForm = getByTestId("properties-form");
    //     expect(propertiesForm).toBeInTheDocument();

    //     const backButton = getByText(/Back/);
    //     fireEvent.click(backButton);

    //     const attributesForm = getByTestId("attributes-form");
    //     expect(attributesForm).toBeInTheDocument();
    // });

    // test("should render 'GeneratorFunctionForm' with 'Back' button", () => {
    //     const { getByText, getByTestId } = render(
    //         <CreateModelForm factoryId={mockFactoryId} />,
    //     );

    //     const nextButtonAttributesForm = getByText(/Next/);
    //     fireEvent.click(nextButtonAttributesForm);
    //     const nextButtonPropertiesForm = getByText(/Next/);
    //     fireEvent.click(nextButtonPropertiesForm);

    //     const generatorFunctionForm = getByTestId("generator-function-form");
    //     expect(generatorFunctionForm).toBeInTheDocument();
    // });

    // test("should go back to 'PropertiesForm' when 'Back' button is clicked from 'GeneratorFunctionForm'", () => {
    //     const { getByText, getByTestId } = render(
    //         <CreateModelForm factoryId={mockFactoryId} />,
    //     );

    //     const nextButtonAttributesForm = getByText(/Next/);
    //     fireEvent.click(nextButtonAttributesForm);
    //     const nextButtonPropertiesForm = getByText(/Next/);
    //     fireEvent.click(nextButtonPropertiesForm);

    //     const generatorFunctionForm = getByTestId("generator-function-form");
    //     expect(generatorFunctionForm).toBeInTheDocument();

    //     const backButton = getByText(/Back/);
    //     fireEvent.click(backButton);

    //     const propertiesForm = getByTestId("properties-form");
    //     expect(propertiesForm).toBeInTheDocument();
    // });
});