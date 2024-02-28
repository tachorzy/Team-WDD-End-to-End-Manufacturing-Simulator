/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "../components/Navbar/Navbar";

describe("Navbar Component", () => {
  test("renders Navbar component with correct links and buttons", () => {
    // Mock the useRouter hook from Next.js
    jest.mock("next/router", () => ({
      useRouter: () => ({
        pathname: "/",
      }),
    }));

    // Render the Navbar component
    render(<Navbar pageId="/" />);

    // Check if the logo is rendered
    const logo = screen.getByAltText("brand");
    expect(logo).toBeInTheDocument();

    // Check if the navigation links are rendered
    const homeLink = screen.getByText("Home");
    const gatewaysLink = screen.getByText("Gateways");
    const assetsLink = screen.getByText("Assets");

    expect(homeLink).toBeInTheDocument();
    expect(gatewaysLink).toBeInTheDocument();
    expect(assetsLink).toBeInTheDocument();

    // Check if the login link and SignUpButton are rendered
    const loginLink = screen.getByText("Login");
    const signUpButton = screen.getByText("Sign Up");

    expect(loginLink).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();

    // Check the initial text color for Home link
    expect(homeLink).toHaveClass("text-[#494949]");

    // Check the styling of the link based on the pageId prop
    expect(homeLink).toHaveClass("group text-lg font-medium");
    expect(gatewaysLink).toHaveClass("group text-lg font-medium");
    expect(assetsLink).toHaveClass("group text-lg font-medium");
    expect(loginLink).toHaveClass("group text-lg font-medium");
    expect(signUpButton).toHaveClass("text-lg font-medium text-[#494949] py-1.5 px-2");
  });
});
