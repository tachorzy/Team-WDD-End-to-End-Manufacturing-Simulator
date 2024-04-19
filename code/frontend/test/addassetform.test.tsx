/**
 * @jest-environment jsdom
 */
import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Asset } from "@/app/api/_utils/types";
import { BackendConnector } from "@/app/api/_utils/connector";
import AddAssetForm, {
    AddAssetFormProps,
} from "../components/factorydashboard/floormanager/assetform/AddAssetForm";

const mockPost = jest.fn();
BackendConnector.post = mockPost;

global.URL.createObjectURL = jest
    .fn()
    .mockReturnValue("http://example.com/test.png ");

const mockAssetUploadContainer = jest.fn();
jest.mock(
    "../components/factorydashboard/floormanager/assetform/AssetUploadContainer",
    () => {
        const MockAssetUploadContainer = (props: any) => {
            mockAssetUploadContainer(props);
            return <div data-testid="asset-upload-container" />;
        };
        MockAssetUploadContainer.displayName = "AssetUploadContainer";
        return MockAssetUploadContainer;
    },
);

const mockOnClose = jest.fn();
const mockOnAdd = jest.fn();
const props: AddAssetFormProps = {
    onClose: mockOnClose,
    onAdd: mockOnAdd,
    factoryId: "1",
};

describe("AddAssetForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    test("should render without error", () => {
        const { getByAltText, getByText, getByPlaceholderText, getByTestId } =
            render(<AddAssetForm {...props} />);

        expect(getByAltText("Close icon")).toBeInTheDocument();
        expect(getByText("Create Asset Form")).toBeInTheDocument();
        expect(getByPlaceholderText("Name")).toBeInTheDocument();
        expect(getByPlaceholderText("Name")).toHaveValue("");
        expect(getByPlaceholderText("Description")).toBeInTheDocument();
        expect(getByPlaceholderText("Description")).toHaveValue("");
        expect(getByTestId("asset-upload-container")).toBeInTheDocument();
        expect(getByText("Asset Image Preview:")).toBeInTheDocument();
        expect(getByText("Create Asset")).toBeInTheDocument();
        expect(getByText("Cancel")).toBeInTheDocument();
    });

    test("should call createAsset and onAdd when Create Asset button is clicked", async () => {
        const mockAsset: Asset = {
            assetId:"mockasset1",
            name: "Asset Mock",
            description: "Asset Mock Description",
            factoryId: "1",
            imageData: "http://example.com/test.png",
            floorplanCords: {x:0,y:0},
             modelId: "XXXXXXXXXX",
             modelUrl: "http://example.com/test.glb",
             

        };
        mockPost.mockResolvedValue(mockAsset);

        const mockFormData = {
            ...mockAsset,
            assetId: "",
        };

        const { getByText, getByPlaceholderText } = render(
            <AddAssetForm {...props} />,
        );

        fireEvent.change(getByPlaceholderText("Name"), {
            target: { value: "Asset Mock" },
        });
        fireEvent.change(getByPlaceholderText("Description"), {
            target: { value: "Asset Mock Description" },
        });

        await waitFor(() => {
            const setFormDataMockCall = mockAssetUploadContainer.mock
                .calls[0] as [
                { setFormData: (callback: (prevData: Asset) => Asset) => void },
            ];
            setFormDataMockCall[0].setFormData((prevData) => ({
                ...prevData,
                imageData: "http://example.com/test.png",
            }));
            fireEvent.click(getByText("Create Asset"));

            const fetchExpected = {
                resource: "assets",
                payload: mockFormData,
            };

            expect(mockPost).toHaveBeenCalledWith(fetchExpected);
            expect(mockOnAdd).toHaveBeenCalledWith(mockAsset);
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    test("should log failuer on creating asset", async () => {
        const error = new Error("Failed to add asset");
        mockPost.mockRejectedValue(error);

        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        const { getByText, getByPlaceholderText } = render(
            <AddAssetForm {...props} />,
        );

        fireEvent.change(getByPlaceholderText("Name"), {
            target: { value: "Asset Mock" },
        });
        fireEvent.change(getByPlaceholderText("Description"), {
            target: { value: "Asset Mock Description" },
        });
        fireEvent.click(getByText("Create Asset"));

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Failed to add asset",
                error,
            );
            expect(mockOnAdd).not.toHaveBeenCalled();
            expect(mockOnClose).not.toHaveBeenCalled();
        });

        consoleErrorSpy.mockRestore();
    });

    test("should update render image preview", async () => {
        const { getByAltText } = render(<AddAssetForm {...props} />);

        await waitFor(() => {
            const setAssetImageFileMockCall = mockAssetUploadContainer.mock
                .calls[0] as [{ setAssetImageFile: (file: File) => void }];
            setAssetImageFileMockCall[0].setAssetImageFile(
                new File(["data"], "test.png", { type: "image/png" }),
            );

            expect(getByAltText("Asset")).toBeInTheDocument();
        });
    });

    test("should call onClose when close button is clicked", () => {
        const { getByAltText } = render(<AddAssetForm {...props} />);

        getByAltText("Close icon").click();

        expect(mockOnClose).toHaveBeenCalled();
    });

    test("should call onClose when Cancel button is clicked", () => {
        const { getByText } = render(<AddAssetForm {...props} />);

        getByText("Cancel").click();

        expect(mockOnClose).toHaveBeenCalled();
    });
});
