import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import FactoryBio from "../components/factorydashboard/FactoryBio";

describe("Factorybio Component", () => { 
    test("should render the Factorybio component", () => {
        const { getByText } = render(
            <FactoryBio />,
        );

        expect(getByText("Factory Bio")).toBeInTheDocument();
    });
});