/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignUpForm from "@/components/Navbar/SignUpForm";

describe("Navbar Component", () => {
    test("renders SignUpForm component with correct inputs and buttons", () => {
        render(<SignUpForm />);

        const emailInput = screen.getByPlaceholderText(/Email/i);
        expect(emailInput).toBeInTheDocument();

        const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
        expect(passwordInputs.length).toBe(2);

        const passwordInstruction = screen.getByText(
            /Password must be longer than 10 characters and contain a special character./i,
        );
        expect(passwordInstruction).toBeInTheDocument();

        const buttonElement = screen.getByText(/Sign Up/i);
        expect(buttonElement).toBeInTheDocument();
    });
});
