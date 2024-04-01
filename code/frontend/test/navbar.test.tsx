/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "../components/Navbar/Navbar";

describe("Navbar Component", () => {
    test("renders Navbar component with correct links and buttons", () => {
        jest.mock("next/router", () => ({
            useRouter: () => ({
                pathname: "/",
            }),
        }));

        render(<Navbar pageId="/" />);

        const logo = screen.getByAltText("brand");
        expect(logo).toBeInTheDocument();

        const homeLink = screen.getByText("Home");
        const gatewaysLink = screen.getByText("Gateways");
        const assetsLink = screen.getByText("Assets");

        expect(homeLink).toBeInTheDocument();
        expect(gatewaysLink).toBeInTheDocument();
        expect(assetsLink).toBeInTheDocument();

        const loginLink = screen.getByText("Login");
        const signUpButton = screen.getByText("Sign Up");

        expect(loginLink).toBeInTheDocument();
        expect(signUpButton).toBeInTheDocument();

        expect(homeLink).toHaveClass("text-[#494949]");

        expect(homeLink).toHaveClass("group text-lg font-medium");
        expect(gatewaysLink).toHaveClass("group text-lg font-medium");
        expect(assetsLink).toHaveClass("group text-lg font-medium");
        expect(loginLink).toHaveClass("group text-lg font-medium");
        expect(signUpButton).toHaveClass(
            "text-sm font-medium text-[#494949] py-0.5 px-2",
        );
    });
});
