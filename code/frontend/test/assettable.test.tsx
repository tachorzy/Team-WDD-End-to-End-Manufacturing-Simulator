import React from "react";
import "@testing-library/jest-dom";
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { BackendConnector } from "@/app/api/_utils/connector";
import AssetTable from "@/components/factorydashboard/floormanager/AssetTable";

jest.mock("@/app/api/_utils/connector", () => ({
    BackendConnector: {
        get: jest.fn(),
    },
    GetConfig: {}, // Mock GetConfig if needed
}));
// Mock console.error as a jest.fn() to make it a mock function
console.error = jest.fn();

const mockedBackendConnector = BackendConnector as jest.Mocked<
    typeof BackendConnector
>;

describe("AssetTable component", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should render data correctly", async () => {
        const testData = [
            {
                assetId: 1,
                name: "Asset 1",
                description: "Description of Asset 1",
                factoryId: "Factory 1",
            },
            // Add similar data for remaining assets
        ];
        const mockeResponse =
            mockedBackendConnector.get.mockResolvedValueOnce(testData);
        render(<AssetTable factoryId="Factory 1" />);

        await waitFor(() => expect(mockeResponse).toHaveBeenCalledTimes(1));

        // Assert data is rendered correctly
        expect(screen.getByText("Image")).toBeInTheDocument();
        expect(screen.getByText("Description")).toBeInTheDocument();
        expect(screen.getByText("Factory ID")).toBeInTheDocument();

        // You can add more specific assertions here to check if the data is displayed correctly
        expect(screen.getByText("Asset 1")).toBeInTheDocument();
        expect(
            screen.getByText("Description: Description of Asset 1"),
        ).toBeInTheDocument();
        expect(screen.getByText("Factory 1")).toBeInTheDocument();
    });

    test("should paginate data correctly", async () => {
        const testData = [
            {
                assetId: 1,
                name: "Asset 1",
                description: "Description of Asset 1",
                factoryId: "Factory 1",
                // Add other necessary properties for testing
            },
            {
                assetId: 2,
                name: "Asset 2",
                description: "Description of Asset 2",
                factoryId: "Factory 1",
                // Add other necessary properties for testing
            },
            {
                assetId: 3,
                name: "Asset 3",
                description: "Description of Asset 3",
                factoryId: "Factory 1",
                // Add other necessary properties for testing
            },
            {
                assetId: 4,
                name: "Asset 4",
                description: "Description of Asset 4",
                factoryId: "Factory 1",
                // Add other necessary properties for testing
            },
            {
                assetId: 5,
                name: "Asset 5",
                description: "Description of Asset 5",
                factoryId: "Factory 1",
                // Add other necessary properties for testing
            },
            {
                assetId: 6,
                name: "Asset 6",
                description: "Description of Asset 6",
                factoryId: "Factory 1",
                // Add other necessary properties for testing
            },
        ];
        const mockedResponse =
            mockedBackendConnector.get.mockResolvedValueOnce(testData);
        render(<AssetTable factoryId="Factory 1" />);

        await waitFor(() => expect(mockedResponse).toHaveBeenCalledTimes(1));

        // Mock clicking next page
        fireEvent.click(screen.getByText(">"));
        // Assert that the page number changes
        expect(screen.getByTestId("currentpage").textContent).toBe("2");

        // Mock clicking previous page
        fireEvent.click(screen.getByText("<"));
        // Assert that the page number changes back
        expect(screen.getByTestId("currentpage").textContent).toBe("1");
    });

    test("should log error message when fetching assets fails", async () => {
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation();

        // Mock BackendConnector.get to throw an error
        (BackendConnector.get as jest.Mock).mockRejectedValueOnce(
            "Fetch error",
        );

        render(<AssetTable factoryId="Factory 1" />);

        // Wait for the error message to be logged
        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Failed to fetch assets:",
                "Fetch error",
            );
        });

        consoleErrorSpy.mockRestore();
    });
});
