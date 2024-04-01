/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FactoryPageNavbar from "../components/Navbar/FactoryPageNavbar";

describe("FactoryPageNavBar", () => {
    test("renders Navbar component with correct links and buttons", () => {
        jest.mock("next/router", () => ({
            useRouter: () => ({
                pathname: "/",
            }),
        }));

        render(<FactoryPageNavbar pageId="/" factoryId="123456789" />);

        const logo = screen.getByAltText("brand");
        expect(logo).toBeInTheDocument();

        const homeLink = screen.getByText("Home");
        const dashboardLink = screen.getByText("Dashboard");
        const assetsLink = screen.getByText("Assets");
        const anomalyDetectionLink = screen.getByText("Anomaly Detection");

        expect(homeLink).toBeInTheDocument();
        expect(dashboardLink).toBeInTheDocument();
        expect(assetsLink).toBeInTheDocument();
        expect(anomalyDetectionLink).toBeInTheDocument();

        const loginLink = screen.getByText("Login");
        const signUpButton = screen.getByText("Sign Up");

        expect(loginLink).toBeInTheDocument();
        expect(signUpButton).toBeInTheDocument();

        expect(homeLink).toHaveClass("text-[#494949]");

        expect(homeLink).toHaveClass("text-[#494949] group text-base font-medium -mt-4");
        expect(dashboardLink).toHaveClass("text-[#494949] group text-base font-medium -mt-4");
        expect(assetsLink).toHaveClass("text-[#494949] group text-base font-medium -mt-4");
        expect(anomalyDetectionLink).toHaveClass("text-[#494949] group text-base font-medium -mt-4");

        expect(loginLink).toHaveClass("group text-base font-medium text-[#494949]");
        expect(signUpButton).toHaveClass(
            "text-sm font-medium text-[#494949] py-0.5 px-2",
        );
    });
});
