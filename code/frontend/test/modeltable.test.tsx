import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModelTable from "../components/factorydashboard/ModelTable";

describe("ModelTable component", () => {
    test("renders models based on factoryId prop", () => {
        // Mock factoryId prop
        const factoryId = "factory-1";

        // Render the component with mock factoryId prop
        render(<ModelTable factoryId={factoryId} />);

        // Check if the models are rendered based on the factoryId prop
        const modelIds = screen.getAllByText(/model-/i);
        expect(modelIds.length).toBe(5); // Assuming there are 2 models for factory-1
    });

    test("pagination controls work correctly", async () => {

        const factoryId = "factory-1";

        render(<ModelTable factoryId={factoryId} />);

        const initialPageNumber = screen.getByTestId("currentpage");
        expect(initialPageNumber.textContent).toContain("1");

        
        const nextPageButton = screen.getByText(">");
        fireEvent.click(nextPageButton);

       
        await waitFor(() => {
            const nextPageNumber = screen.getByTestId("currentpage");
            expect(nextPageNumber.textContent).toContain("2");
        });
        
        const prevPageButton = screen.getByText("<");
        fireEvent.click(prevPageButton);
        
        await waitFor(() => {
            const newPageNumber = screen.getByTestId("currentpage");
            expect(newPageNumber.textContent).toContain("1");
        });
    });
});
