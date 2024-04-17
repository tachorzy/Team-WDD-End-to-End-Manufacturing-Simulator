/**
 * @jest-environment jsdom
 */

import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "../components/Navbar/Navbar";

describe("Navbar Component", () => {
    test("renders Navbar component with correct links and buttons", () => {
        const { getByText, getByAltText } = render(<Navbar pageId="" />);

        expect(getByText("Home")).toBeInTheDocument();
        expect(getByText("Gateways")).toBeInTheDocument();
        expect(getByText("Assets")).toBeInTheDocument();
        expect(getByText("Login")).toBeInTheDocument();
        expect(getByText("Sign Up")).toBeInTheDocument();
        expect(getByAltText("brand")).toBeInTheDocument();
    });

    test("should render with a selected page", () => {
        const { getByText } = render(<Navbar pageId="Home" />);
        expect(getByText("Home")).toHaveClass("text-MainBlue");
    });
});
