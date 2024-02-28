/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LandingPageTitle from "../components/home/LandingPageTitle";

describe("Landing Page Component", () => {
    test("renders Landing Page Title corretly and it's components ", () => {
        render(<LandingPageTitle />);
        const header1 = screen.getByText("Bringing innovation to life.");
        const title = screen.getByText(/^(End-to-End)(Manufacturing Simulator)$/)
        const header2 = screen.getByText("We connect your devices to make them smarter.")

        expect(header1).toBeInTheDocument();
        expect(header1).toHaveClass("font-medium text-MainBlue text-lg py-2");
        expect(title).toBeInTheDocument();
        expect(title).toHaveClass("font-semibold bg-gradient-to-br from-DarkGray via-[#555F68] to-DarkGray bg-clip-text text-transparent text-3xl text-center md:text-4xl lg:text-5xl xl:text-6xl pb-4");
        expect(header2).toBeInTheDocument();
        expect(header2).toHaveClass("font-regular text-[#797979] text-xl py-2");
    });
});