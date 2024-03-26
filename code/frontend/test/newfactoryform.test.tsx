/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import NewFactoryForm from "../components/home/NewFactoryForm";

describe ("New Factory Form", () => {
    const props = {
        latitude: 123.456,
        longitude: 567.89,
        setQueryMade: jest.fn(),
        onFactorySubmit: jest.fn(),
    };
    
    const factoryName = "TensorIoT Factory";
    const factoryDescription = "This is a factory used by TensorIoT in Texas";

    beforeEach(() => {
        global.fetch = jest.fn(() => 
            Promise.resolve({ 
                ok: true, 
                json: () => Promise.resolve(
                    {
                        factoryId: "1",
                        message: ""
                    }
                )
            })
        ) as jest.Mock;
      });

    afterEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });

    test("renders without crashing", () => {
        render(<NewFactoryForm {...props}/>)
    })

    test("renders and its compontents correctly", () => {
        const { getByText, getByAltText, getAllByAltText, getByPlaceholderText } = render(<NewFactoryForm {...props} />);

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
        expect(factoryInput).toHaveValue("");
        expect(descriptionInput).toBeInTheDocument();
        expect(descriptionInput).toHaveValue("");
        expect(button).toBeInTheDocument();
        expect(logo).toBeInTheDocument();
    });

    test("form is closed on click", () => {
        const { getByText, getByAltText, getAllByAltText, getByPlaceholderText } = render(<NewFactoryForm {...props} />);

        const header = getByText(/(Provide your factory details)/);
        const closeIcon = getByAltText("close icon");
        const factoryImages = getAllByAltText("maginify glass");
        const factoryInput = getByPlaceholderText("Enter factory name");
        const descriptionInput = getByPlaceholderText("Enter factory description (optional)");
        const button = getByText(/Create/);
        const logo = getByAltText("tensor branding");

        fireEvent.click(closeIcon);

        expect(header).not.toBeInTheDocument();
        expect(closeIcon).not.toBeInTheDocument();
        expect(factoryImages[0]).not.toBeInTheDocument();
        expect(factoryImages[1]).not.toBeInTheDocument();
        expect(factoryInput).not.toBeInTheDocument();
        expect(descriptionInput).not.toBeInTheDocument();
        expect(button).not.toBeInTheDocument();
        expect(logo).not.toBeInTheDocument();
    });

    test("succesffuly creates a new factory", () => {
        const setQueryMadeMock = jest.fn();
        const onFactorySubmitMock = jest.fn();

        onFactorySubmitMock.mockReturnValueOnce({
            factoryId: "1",
            name: factoryName,
            description: factoryDescription,
            location: { 
                latitdue: 123.456, 
                longitude: 567.89 },
        });
        setQueryMadeMock.mockReturnValueOnce(true);

        const newprops = {
            latitude: 123.456,
            longitude: 567.89,
            setQueryMade: setQueryMadeMock,
            onFactorySubmit: setQueryMadeMock,
        }

        const {  getByPlaceholderText, getByText } = render(<NewFactoryForm {...newprops} />);

        const factoryInput = getByPlaceholderText("Enter factory name");
        const descriptionInput = getByPlaceholderText("Enter factory description (optional)");
        const button = getByText(/Create/);
        
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

        expect(global.fetch).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalledWith(
            "undefined/factories", 
            {
                "body": '{"name":"TensorIoT Factory","location":{"latitude":123.456,"longitude":567.89},"description":"This is a factory used by TensorIoT in Texas"}', 
                "headers": 
                {
                    "Content-Type": "application/json"
                }, 
                "method": "POST"
            }
        );
    });
    
    test("factory name textbox changes on input", () => {
        const { getByPlaceholderText } = render(<NewFactoryForm {...props} />);

        const nameInput = getByPlaceholderText("Enter factory name");
        const descriptionInput = getByPlaceholderText("Enter factory description (optional)");

        fireEvent.change(nameInput, {
            target: {
                value: factoryName
            }
        });

        expect(nameInput).toHaveValue(factoryName);
        expect(descriptionInput).toHaveValue(""); 
    });

    test("factory description textbox changes on input", () => {
        const { getByPlaceholderText } = render( <NewFactoryForm {...props} />);

        const nameInput = getByPlaceholderText("Enter factory name");
        const descriptionInput = getByPlaceholderText("Enter factory description (optional)");

        fireEvent.change(descriptionInput, {
            target: {
                value: factoryDescription
            }
        });

        expect(nameInput).toHaveValue("");
        expect(descriptionInput).toHaveValue(factoryDescription); 
    });
    
    test("both factory name and description textboxes changes on input", () => {
        const { getByPlaceholderText } = render(<NewFactoryForm {...props} />);

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
        const { getByPlaceholderText, getByText } = render( <NewFactoryForm {...props} /> );

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
        const { getByPlaceholderText, getByText } = render(<NewFactoryForm {...props} />);

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

    test("logs fetch error in console", async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() => 
            Promise.resolve({
                ok: false,
                statusText: "404",
            }
        ));        
        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { getByText, getByPlaceholderText } = render(<NewFactoryForm {...props} />);

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

        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalled();
            expect(consoleErrorMock).toHaveBeenCalledWith("Failed to create factory:", new Error("Failed to create factory: 404"))
        });
    });
});
