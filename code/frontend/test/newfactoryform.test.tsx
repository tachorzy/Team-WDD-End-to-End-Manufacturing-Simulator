/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NewFactoryForm from "../components/home/NewFactoryForm";

describe ("New Factory Form", () => {
    test("renders form and its compontents correctly ", () => {
        const latitude = 40.7128;
        const longitude = -74.0060;
        const setQueryMadeMock = jest.fn();
        const onFactorySubmitMock = jest.fn();

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
        const latitude = 40.7128;
        const longitude = -74.0060;
        const setQueryMadeMock = jest.fn();
        const onFactorySubmitMock = jest.fn();

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

    test("Factory Name Changes Input", () => {
        const latitude = 40.7128;
        const longitude = -74.0060;
        const setQueryMadeMock = jest.fn();
        const onFactorySubmitMock = jest.fn();

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

});
