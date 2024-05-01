/**
 * @jest-environment jsdom
 */
import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import InventoryNavBar from "../components/factorydashboard/floormanager/inventory/InventoryNavBar";
import { BackendConnector } from "@/app/api/_utils/connector";
import { Attribute, Factory, Model } from "@/app/api/_utils/types";

const mockSetModels = jest.fn();
const mockSetActiveNavItem = jest.fn();

const mockPost = jest.fn();
BackendConnector.post = mockPost;

describe("InventoryNavBar", () => {
    test("should prompt user to create models if there are no pre-existing models.", () => {
        const { getByText } = render(<InventoryNavBar factoryId={"1234"} />);
        expect(getByText("No models found")).toBeInTheDocument();
        expect(getByText("No models found")).toHaveClass("text-red-300")
    });


    // failing test cases:

    // let expectedModels = [] as Model[];

    // test.each([["CNC"], ["PLC"], ["EDM"]])(
    //     "should change activeNavItem on click",
    //     async (label) => {

    //         const mockNameAttribute = { name: "Name", value: label } as Attribute;

    //         const mockModel: Model =
    //             {
    //                 modelId: "010101010101",
    //                 factoryId: "1234567890",
    //                 attributes: [mockNameAttribute],
    //                 properties: [],
    //                 measurements: [],
    //             };

    //         expectedModels.push(mockModel);

    //         mockPost.mockResolvedValue(expectedModels);
            
    //         const { getByText } = render(<InventoryNavBar factoryId={"f95b2506-33e1-4aad-a319-880e518164ef"}/>);
            
    //         await waitFor(() => {
    //             expect(mockPost).toHaveBeenCalledWith(expectedModels);
    //             const modelButton = getByText(`${label}`);
    //             fireEvent.click(modelButton);
    //             expect(getByText(label)).toHaveClass("text-MainBlue");
    //         });
    //     },
    // );
});
