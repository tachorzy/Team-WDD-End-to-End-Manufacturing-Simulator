/**
 * @jest-environment jsdom
 */
import React from "react";
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddAsset from "../components/factorydashboard/floormanager/AddAsset";

const onAddMock = jest.fn();

describe("AddAsset", () => {
    test("should render without error", () => {
        const { getByPlaceholderText, getByText } = render(
            <AddAsset onAdd={onAddMock} />,
        );

        expect(getByPlaceholderText("Asset ID")).toBeInTheDocument();
        expect(getByPlaceholderText("Asset ID")).toHaveValue("");
        expect(getByPlaceholderText("Name")).toBeInTheDocument();
        expect(getByPlaceholderText("Name")).toHaveValue("");
        expect(getByPlaceholderText("Description")).toBeInTheDocument();
        expect(getByPlaceholderText("Description")).toHaveValue("");
        expect(getByPlaceholderText("Image URL")).toBeInTheDocument();
        expect(getByPlaceholderText("Image URL")).toHaveValue("");
        expect(getByText("Add Asset")).toBeInTheDocument();
    });

    test.each([
        ["Asset ID", "1"],
        ["Name", "Asset 1"],
        ["Description", "Asset 1 Description"],
        ["Image URL", "https://www.example.com/image1.png"],
    ])("input fields should change on input with %s", (label, input) => {
        const { getByPlaceholderText } = render(<AddAsset onAdd={onAddMock} />);

        const textBox = getByPlaceholderText(label);

        fireEvent.change(textBox, { target: { value: input } });

        expect(textBox).toHaveValue(input);
    });

    test("should call onAdd when Add Asset is clicked", () => {
        const { getByPlaceholderText, getByText } = render(
            <AddAsset onAdd={onAddMock} />,
        );

        const newAsset = {
            id: "1",
            name: "Asset 1",
            description: "Asset 1 Description",
            image: "https://www.example.com/image1.png",
        };

        fireEvent.change(getByPlaceholderText("Asset ID"), {
            target: { value: newAsset.id },
        });
        fireEvent.change(getByPlaceholderText("Name"), {
            target: { value: newAsset.name },
        });
        fireEvent.change(getByPlaceholderText("Description"), {
            target: { value: newAsset.description },
        });
        fireEvent.change(getByPlaceholderText("Image URL"), {
            target: { value: newAsset.image },
        });

        fireEvent.click(getByText("Add Asset"));

        expect(onAddMock).toHaveBeenCalledWith(
            expect.objectContaining(newAsset),
        );
        expect(getByPlaceholderText("Asset ID")).toHaveValue("");
        expect(getByPlaceholderText("Name")).toHaveValue("");
        expect(getByPlaceholderText("Description")).toHaveValue("");
        expect(getByPlaceholderText("Image URL")).toHaveValue("");
    });
});
