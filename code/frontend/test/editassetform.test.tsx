import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditAssetForm from "@/components/factorydashboard/floormanager/EditAssetForm";
import { BackendConnector } from "@/app/api/_utils/connector";

const mockPut = jest.fn();
BackendConnector.put = mockPut;

const closeEditFormMock = jest.fn();
const mockAsset = {
    name: "Test Asset",
    description: "Test Description",
    factoryId: "factory123",
    modelId: "XXXXXXXXXX",
    modelUrl: "XXXXXXXXXX",
    assetId: "XXXXXXXXXX",
    floorplanCords:{x:0,y:0},
    imageData:" uma is my queen"
            
};

const props = {
    asset: mockAsset,
    closeEditForm: closeEditFormMock,
};

describe("Edit factory form ", () => {
    test("should render without error", () => {
        const { getByAltText, getByText, getByPlaceholderText } = render(
            <EditAssetForm {...props} />,
        );

        expect(getByAltText("Close icon")).toBeInTheDocument();
        expect(getByText("Edit Asset Details")).toBeInTheDocument();
        expect(getByPlaceholderText("Enter asset name")).toBeInTheDocument();
        expect(getByPlaceholderText("Enter asset name")).toHaveValue(
            "Test Asset",
        );
        expect(
            getByPlaceholderText("Enter asset description"),
        ).toBeInTheDocument();
        expect(getByPlaceholderText("Enter asset description")).toHaveValue(
            "Test Description",
        );
        expect(getByText("Save Changes")).toBeInTheDocument();
    });

    test("should call closeEditForm function on close button click", () => {
        const { getByAltText } = render(<EditAssetForm {...props} />);

        const closeButton = getByAltText("Close icon");
        fireEvent.click(closeButton);

        expect(closeEditFormMock).toHaveBeenCalledTimes(1);
    });

    test("should call update the asset when 'Save Changes' is clicked", async () => {
        mockPut.mockResolvedValueOnce({ ...mockAsset, name: "CNC Machine" });

        const newAssetName = "CNC Machine";
        const newAssetDescription = "This is a CNC machine";

        const { getByText, getByPlaceholderText } = render(
            <EditAssetForm {...props} />,
        );

        fireEvent.change(getByPlaceholderText("Enter asset name"), {
            target: { value: newAssetName },
        });
        fireEvent.change(getByPlaceholderText("Enter asset description"), {
            target: { value: newAssetDescription },
        });

        const saveButton = getByText("Save Changes");
        fireEvent.click(saveButton);

        const fetchExpected = {
            resource: "assets",
            payload: {
                ...mockAsset,
                name: newAssetName,
                description: newAssetDescription,
                factoryId: "XXXXXXXXXX",
                modelId: "XXXXXXXXXX",
                modelUrl: "XXXXXXXXXX",
                assetId: "XXXXXXXXXX",
                floorplanCords:{x:0,y:0},
                imageData:" uma is my queen"
            },
            },
        };

        await waitFor(() => {
            expect(mockPut).toHaveBeenCalledWith(fetchExpected);
            expect(closeEditFormMock).toHaveBeenCalledTimes(1);
        });
    });

    test("should log error when asset update fails", async () => {
        mockPut.mockRejectedValueOnce(new Error("404"));

        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        const { getByText, getByPlaceholderText } = render(
            <EditAssetForm {...props} />,
        );

        fireEvent.change(getByPlaceholderText("Enter asset name"), {
            target: { value: "CNC Machine" },
        });
        fireEvent.change(getByPlaceholderText("Enter asset description"), {
            target: { value: "This is a CNC machine" },
        });

        const saveButton = getByText("Save Changes");
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Failed to update asset:",
                new Error("404"),
            );
        });
    });

    test("should handle empty asset name and description ", () => {
        const newProps = {
            ...props,
            asset: {
                ...mockAsset,
                name: "",
                description: "",
                factoryId: "XXXXXXXXXX",
                modelId: "XXXXXXXXXX",
                modelUrl: "XXXXXXXXXX",
                assetId: "XXXXXXXXXX",
                floorplanCords:{x:0,y:0},
                imageData:" uma is my queen"
            },
        };

        const { getByPlaceholderText } = render(
            <EditAssetForm {...newProps} />,
        );

        expect(getByPlaceholderText("Enter asset name")).toHaveValue("");
        expect(getByPlaceholderText("Enter asset description")).toHaveValue("");
    });
});
