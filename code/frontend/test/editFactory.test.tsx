/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditFactoryForm from "../components/factorydashboard/editFactory";


global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () =>
            Promise.resolve({
                factoryId: "1",
                message: "",
            }),
    }),
) as jest.Mock;

const onSaveMock = jest.fn();
const onCloseMock = jest.fn();
const mockFactory = {
    factoryId: "1",
    name: "Factory 1",
    location: {
        latitude: 123.456,
        longitude: 456.789,
    },
    description: "none",
};

describe("Landing Page Component", () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });
    
    test("renders and its compontents correctly ", () => {
        const {
            getByText,
            getByAltText,
            getByPlaceholderText,
           
        } = render(
            <EditFactoryForm
                factory={mockFactory}
                onClose={onCloseMock}
                onSave={onSaveMock}
            />
        );

        const header = getByText(/(Edit Factory Details)/);
        const closeIcon = getByAltText("Close icon");
        const factoryName = getByPlaceholderText("Enter factory name");
        const factoryDescription = getByPlaceholderText("Enter factory description (optional)");
        const button = getByText(/(Save Changes)/);

        expect(header).toBeInTheDocument();
        expect(closeIcon).toBeInTheDocument();
        expect(factoryName).toBeInTheDocument();
        expect(factoryDescription).toBeInTheDocument();
        expect(button).toBeInTheDocument();

    });


    test("is closed when close icon clicked", () => {
       

        const {
            getByAltText,
        } = render(
            <EditFactoryForm
                factory={mockFactory}
                onClose={onCloseMock}
                onSave={onSaveMock}
            />
        );
      
        const closeIcon = getByAltText("Close icon");
        fireEvent.click(closeIcon);

        expect(onCloseMock).toHaveBeenCalled();
    });
});
