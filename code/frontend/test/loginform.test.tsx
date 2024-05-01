/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginForm from "@/components/Navbar/LoginForm";

describe("Navbar Component", () => {
    test("renders LoginForm component with correct inputs and buttons", () => {
        render(<LoginForm />);

        const emailInput = screen.getByPlaceholderText(/Email/i);
        expect(emailInput).toBeInTheDocument();

        const passwordInput = screen.getByPlaceholderText(/Password/i);
        expect(passwordInput).toBeInTheDocument();

        const buttonElement = screen.getByText(/Log In/i);
        expect(buttonElement).toBeInTheDocument();
    });
});
