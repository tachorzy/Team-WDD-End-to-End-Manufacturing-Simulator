/**
 * @jest-environment jsdom
 */

import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import FactoryPageNavbar from "../components/Navbar/FactoryPageNavbar";

const props = {
    pageId: "",
    factoryId: "1",
};

describe("FactoryPageNavBar", () => {
    test("renders Navbar component with correct links and buttons", () => {
        const { getByText, getByAltText, getByTestId } = render(
            <FactoryPageNavbar {...props} />,
        );

        expect(getByText("Home")).toBeInTheDocument();
        expect(getByText("Factory Floor")).toBeInTheDocument();
        expect(getByText("Dashboard")).toBeInTheDocument();
        expect(getByText("Assets")).toBeInTheDocument();
        expect(getByText("Anomaly Detection")).toBeInTheDocument();
        expect(getByAltText("brand")).toBeInTheDocument();
        expect(getByTestId("sign-up")).toBeInTheDocument();
    });

    test("should render with a selected page", () => {
        const { getByText } = render(
            <FactoryPageNavbar {...props} pageId="Home" />,
        );
        expect(getByText("Home")).toHaveClass("text-MainBlue");
    });
});
