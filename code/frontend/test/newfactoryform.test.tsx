/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import NewFactoryForm from "../components/home/NewFactoryForm";

global.fetch = jest.fn(() => 
    Promise.resolve({ 
        ok: true, json: () => Promise.resolve({
            factoryId: "1",
            message: ""
        })}
)) as jest.Mock;

const latitude = 40.7128;
const longitude = -74.0060;
const setQueryMadeMock = jest.fn();
const onFactorySubmitMock = jest.fn();
const factoryName = "TensorIoT Factory";
const factoryDescription = "This is a factory used by TensorIoT in Texas";

describe ("New Factory Form", () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
      });

    test("renders and its compontents correctly ", () => {
        const { getByText, getByAltText, getAllByAltText, getByPlaceholderText } = render(
            <NewFactoryForm
                latitude={latitude}
                longitude={longitude} 
                setQueryMade={setQueryMadeMock}
                onFactorySubmit={onFactorySubmitMock}
            />
        );

        const header = getByText(/(Provide your factory details)/);
        const closeIcon = getByAltText("close icon");
        const factoryImages = getAllByAltText("maginify glass");
        const factoryInput = getByPlaceholderText("Enter factory name");
        const descriptionInput = getByPlaceholderText("Enter factory description (optional)");
        const button = getByText(/Create/);
        const logo = getByAltText("tensor branding");
    
        expect(header).toBeInTheDocument();
        expect(closeIcon).toBeInTheDocument();
        expect(factoryImages).toHaveLength(2);
        expect(factoryImages[0]).toBeInTheDocument();
        expect(factoryImages[1]).toBeInTheDocument();
        expect(factoryInput).toBeInTheDocument();
        expect(descriptionInput).toBeInTheDocument();
        expect(button).toBeInTheDocument();
        expect(logo).toBeInTheDocument();
    });

    test("is invisble when close icon is clicked", () => {
        const { getByAltText } = render(
            <NewFactoryForm
                latitude={latitude}
                longitude={longitude} 
                setQueryMade={setQueryMadeMock}
                onFactorySubmit={onFactorySubmitMock}
            />
        );
        
        const closeIcon = getByAltText("close icon");

        expect(closeIcon).toBeInTheDocument();

        fireEvent.click(closeIcon);

        expect(closeIcon).not.toBeInTheDocument();
    });

    test("factory name and description textboxes changes on input", () => {
        const { getByPlaceholderText } = render(
            <NewFactoryForm
                latitude={latitude}
                longitude={longitude} 
                setQueryMade={setQueryMadeMock}
                onFactorySubmit={onFactorySubmitMock}
            />
        );

        const nameInput = getByPlaceholderText("Enter factory name");
        const descriptionInput = getByPlaceholderText("Enter factory description (optional)");

        fireEvent.change(nameInput, {
            target: {
                value: factoryName
            }
        });
        fireEvent.change(descriptionInput, {
            target: {
                value: factoryDescription
            }
        });

        expect(nameInput).toHaveValue(factoryName);
        expect(descriptionInput).toHaveValue(factoryDescription); 
    });

    test("displays error message on blank factory name", () => {
        const { getByPlaceholderText, getByText } = render(
            <NewFactoryForm
                latitude={latitude}
                longitude={longitude} 
                setQueryMade={setQueryMadeMock}
                onFactorySubmit={onFactorySubmitMock}
            />
        );

        const nameInput = getByPlaceholderText("Enter factory name");
        const emptyName = "";

        fireEvent.change(nameInput, {
            target: {
                value: emptyName
            }
        });
        fireEvent.click(getByText(/(Create)/));

        const noNameError = getByText("Please provide a name for your new facility.");

        expect(nameInput).toHaveValue(emptyName);
        expect(noNameError).toBeInTheDocument();
    });

    test("displays error message when factory description is too long", () => {
        const { getByPlaceholderText, getByText } = render(
            <NewFactoryForm
                latitude={latitude}
                longitude={longitude} 
                setQueryMade={setQueryMadeMock}
                onFactorySubmit={onFactorySubmitMock}
            />
        );

        const descriptionInput = getByPlaceholderText("Enter factory description (optional)");
        const longDescription = "This description is longer than two hundred characters long, so it can not be used in the form. please try to have descriptions less than two hundred characters long, or it will not work in the form. thanks.";

        fireEvent.change(descriptionInput, {
            target: {
                value: longDescription
            }
        });
        fireEvent.click(getByText(/(Create)/));

        const descriptionTooLongError = getByText("Facility description must be no more than 200 characters.");

        expect(descriptionInput).toHaveValue(longDescription);
        expect(descriptionTooLongError).toBeInTheDocument();
    });

    test("logs error fetch error in console", () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() => 
            Promise.resolve({
                ok: false,
                statusText: "404",
            }
        ));

        const { getByText, getByPlaceholderText } = render(
            <NewFactoryForm
                latitude={latitude}
                longitude={longitude} 
                setQueryMade={setQueryMadeMock}
                onFactorySubmit={onFactorySubmitMock}
            />
        );

        const nameInput = getByPlaceholderText("Enter factory name");
        const descriptionInput = getByPlaceholderText("Enter factory description (optional)");

        fireEvent.change(nameInput, {
            target: {
                value: factoryName
            }
        });
        fireEvent.change(descriptionInput, {
            target: {
                value: factoryDescription
            }
        });
        fireEvent.click(getByText(/(Create)/))

        expect(global.fetch).toHaveBeenCalled();
    });

    test("is invisble after completing form", async () => {
        onFactorySubmitMock.mockReturnValueOnce({
            factoryId: "1",
            name: factoryName,
            description: factoryDescription,
            location: { latitude, longitude },
        });
        setQueryMadeMock.mockReturnValueOnce(true);
        const { getByText, getByAltText, getAllByAltText, getByPlaceholderText } = render(
            <NewFactoryForm
                latitude={latitude}
                longitude={longitude} 
                setQueryMade={setQueryMadeMock}
                onFactorySubmit={onFactorySubmitMock}
            />
        );

        const header = getByText(/(Provide your factory details)/);
        const closeIcon = getByAltText("close icon");
        const factoryImages = getAllByAltText("maginify glass");
        const factoryInput = getByPlaceholderText("Enter factory name");
        const descriptionInput = getByPlaceholderText("Enter factory description (optional)");
        const button = getByText(/Create/);
        const logo = getByAltText("tensor branding");

        expect(header).toBeInTheDocument();
        expect(closeIcon).toBeInTheDocument();
        expect(factoryImages).toHaveLength(2);
        expect(factoryImages[0]).toBeInTheDocument();
        expect(factoryImages[1]).toBeInTheDocument();
        expect(factoryInput).toBeInTheDocument();
        expect(descriptionInput).toBeInTheDocument();
        expect(button).toBeInTheDocument();
        expect(logo).toBeInTheDocument();
        
        fireEvent.change(factoryInput, {
            target: {
                value: factoryName
            }
        });
        fireEvent.change(descriptionInput, {
            target: {
                value: factoryDescription
            }
        });
        fireEvent.click(button);

        await waitFor(() => {
            expect(header).not.toBeInTheDocument();
            expect(closeIcon).not.toBeInTheDocument();
            expect(factoryImages[0]).not.toBeInTheDocument();
            expect(factoryImages[1]).not.toBeInTheDocument();
            expect(factoryInput).not.toBeInTheDocument();
            expect(descriptionInput).not.toBeInTheDocument();
            expect(button).not.toBeInTheDocument();
            expect(logo).not.toBeInTheDocument();
        });
    });

});
