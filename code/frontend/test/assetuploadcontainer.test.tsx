/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, renderHook, waitFor, act} from "@testing-library/react";
import  FileUploadContainer from "../components/factorydashboard/floormanager/assetform/AssetUploadContainer"
import { Asset } from "@/app/api/_utils/types";

const consoleErrorMock = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

const mocksetAssetImageFile = jest.fn();
const mocksetFormData = jest.fn().mockImplementation();

const props = {
    setAssetImageFile: mocksetAssetImageFile,
    setFormData: mocksetFormData,
}

describe("AssetUploadContainer", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should render without errors", () => {
        const { getByTestId, getByAltText, getByText } = render(<FileUploadContainer {...props}/>)

        expect(getByTestId("dropzone")).toBeInTheDocument();
        expect(getByTestId("drop-input")).toBeInTheDocument();
        expect(getByAltText("upload icon")).toBeInTheDocument();
        expect(getByText("Click or drop your asset image here to upload.")).toBeInTheDocument();
    });

    test.each([
        ["jpeg", "jpeg"],
        ["png", "png"],
        ["svg", "svg+xml"],
    ])("should handle %s file drop", async (filename, filetype) => {
        jest.spyOn(
            global.FileReader.prototype,
            "result",
            "get",
        )
        .mockImplementationOnce(() => "some-data,base64String");
        
        const { getByTestId } = render(<FileUploadContainer {...props}/>);

        const file = new File(["blob"], `floorplan.${filename}`, { type: `image/${filetype}` });

        const dropInput = getByTestId("drop-input");
        Object.defineProperty(dropInput, "files", {
            value: [file],
        });
        fireEvent.drop(dropInput);  
        
        await waitFor(() => {
            const updateFunction = mocksetFormData.mock.calls[0][0];
            const prevData = { imageData: "" };
            const newData = updateFunction(prevData);
            expect(newData.imageData).toBe("base64String");
            expect(mocksetAssetImageFile).toHaveBeenCalledWith(file);
            expect(mocksetFormData).toHaveBeenCalledWith(expect.any(Function));
        });
    });

    test("should not accept files other than jpeg, png, svg", async () => {
        const { getByTestId } = render(<FileUploadContainer {...props}/>);

        const file = new File(["blob"], "floorplan.pdf", { type: "application/pdf" });

        const dropInput = getByTestId("drop-input");
        Object.defineProperty(dropInput, "files", {
            value: [file],
        });
        fireEvent.drop(dropInput);
        
        await waitFor(() => {
            expect(mocksetAssetImageFile).toHaveBeenCalledWith(undefined);
            expect(mocksetFormData).not.toHaveBeenCalled();
            expect(consoleErrorMock).toHaveBeenCalled();
        });
    });

    test("should not accept files larger than 8MB", async () => {
        const { getByTestId } = render(<FileUploadContainer {...props}/>);

        const file = new File([new ArrayBuffer(8000001)], "floorplan.jpeg", { type: "image/jpeg" });

        const dropInput = getByTestId("drop-input");
        Object.defineProperty(dropInput, "files", {
            value: [file],
        });
        fireEvent.drop(dropInput);
        
        await waitFor(() => {
            expect(mocksetAssetImageFile).toHaveBeenCalledWith(undefined);
            expect(mocksetFormData).not.toHaveBeenCalled();
            expect(consoleErrorMock).toHaveBeenCalled();
        });
    });

    test("should handle file reader result being null", async () => {
        jest.spyOn(
                global.FileReader.prototype,
                "result",
                "get",
            )
            .mockImplementationOnce(() => null);

        const { getByTestId } = render(<FileUploadContainer {...props}/>);

        const file = new File(["blob"], "floorplan.png", { type: "image/png" });

        const dropInput = getByTestId("drop-input");
        Object.defineProperty(dropInput, "files", {
            value: [file],
        });
        fireEvent.drop(dropInput);
        
        await waitFor(() => {
            expect(mocksetAssetImageFile).toHaveBeenCalledWith(file);
            expect(mocksetFormData).toHaveBeenCalledWith(expect.any(Function));
        });
    });
});

