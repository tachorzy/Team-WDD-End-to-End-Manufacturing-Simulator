/**
 * @jest-environment jsdom
 */
import React from "react";
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import InventoryNavBar from "../components/factorydashboard/floormanager/InventoryNavBar";

describe("InventoryNavBar", () => {
    test("should render without error", () => {
        const { getByText } = render(<InventoryNavBar />);

        expect(getByText("CNC Models")).toBeInTheDocument();
        expect(getByText("Stamping Models")).toBeInTheDocument();
        expect(getByText("EDM Models")).toBeInTheDocument();
    });

    test.each([["CNC Models"], ["Stamping Models"], ["EDM Models"]])(
        "should change activeNavItem on click",
        (label) => {
            const { getByText } = render(<InventoryNavBar />);

            fireEvent.click(getByText(label));

            expect(getByText(label)).toHaveClass("text-MainBlue");
        },
    );
});
