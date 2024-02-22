/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "../components/dashboard/Dashboard";

test("renders Dashboard component with correct values", () => {
    const { container } = render(<Dashboard />);

    // Check if the component renders
    expect(container).toBeInTheDocument();

    // Check if each tile is rendered with the correct label and value
    const tileData = [
        { label: "Sites", value: 10 },
        { label: "Gateways", value: 5 },
        { label: "Assets", value: 100 },
    ];

    tileData.forEach((tile) => {
        const tileElement = screen.getByText(new RegExp(tile.label, "i"));
        expect(tileElement).toBeInTheDocument();

        const valueElement = screen.getByText(tile.value.toString());
        expect(valueElement).toBeInTheDocument();
    });
});
