/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NewFactoryForm from "../components/home/NewFactoryForm";

global.fetch = jest.fn(() => Promise.resolve({ ok: true})) as jest.Mock;

const latitude = 40.7128;
const longitude = -74.0060;
const setQueryMadeMock = jest.fn();
const onFactorySubmitMock = jest.fn();

describe ("New Factory Form", () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
      });

    test("renders form and its compontents correctly ", () => {
        render(
            <NewFactoryForm
                latitude={latitude}
                longitude={longitude} 
                setQueryMade={setQueryMadeMock}
                onFactorySubmit={onFactorySubmitMock}
            />
        );

        const header = screen.getByText(/(Provide your factory details)/);
        const closeIcon = screen.getByAltText("close icon");
        const factoryImages = screen.getAllByAltText("maginify glass");
        const factoryInput = screen.getByPlaceholderText("Enter factory name");
        const descriptionInput = screen.getByPlaceholderText("Enter factory description (optional)");
        const button = screen.getByText(/Create/);
        const logo = screen.getByAltText("tensor branding");
    
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

    test("Clicking close icon makes form invisible", () =>{
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

    test("Factory Name Changes On Input", () => {
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
        const factoryName = "TensorIoT Factory";
        const factoryDescription = "This is a factory used by TensorIoT in Texas";

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

    test("Factory Name Is Blank", () => {
        const { getByPlaceholderText, getByText } = render(
            <NewFactoryForm
                latitude={latitude}
                longitude={longitude} 
                setQueryMade={setQueryMadeMock}
                onFactorySubmit={onFactorySubmitMock}
            />
        );

        const nameInput = getByPlaceholderText("Enter factory name");
        const factoryName = "";

        fireEvent.change(nameInput, {
            target: {
                value: factoryName
            }
        });
        fireEvent.click(getByText(/(Create)/));

        const noNameError = getByText("Please provide a name for your new facility.");

        expect(nameInput).toHaveValue(factoryName);
        expect(noNameError).toBeInTheDocument();
    });

    test("Factory description is too long", () => {
        const { getByPlaceholderText, getByText } = render(
            <NewFactoryForm
                latitude={latitude}
                longitude={longitude} 
                setQueryMade={setQueryMadeMock}
                onFactorySubmit={onFactorySubmitMock}
            />
        );

        const descriptionInput = getByPlaceholderText("Enter factory description (optional)");
        const factoryDescription = "This description is longer than two hundred characters long, so it can not be used in the form. please try to have descriptions less than two hundred characters long, or it will not work in the form. thanks.";

        fireEvent.change(descriptionInput, {
            target: {
                value: factoryDescription
            }
        });
        fireEvent.click(getByText(/(Create)/));

        const descriptionTooLongError = getByText("Facility description must be no more than 200 characters.");

        expect(descriptionInput).toHaveValue(factoryDescription);
        expect(descriptionTooLongError).toBeInTheDocument();
    });

    test("Console logs an error on fetching data", () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve({
            ok: false,
            statusText: "404",
        }))
        const logSpy = jest.spyOn(global.console, "log");

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
        const factoryName = "TensorIoT Factory";
        const factoryDescription = "This is a factory used by TensorIoT in Texas";

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
    })
});
