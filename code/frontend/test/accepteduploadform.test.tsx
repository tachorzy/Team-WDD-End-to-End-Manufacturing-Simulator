/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import AcceptedUploadForm from "../components/factorydashboard/floorplan/uploadcontainer/AcceptedUploadForm";

const mockUsePathname = jest.fn(() => {return ""});
const mockCreateFloorplan = jest.fn(() => {return Promise.resolve("success")});

jest.mock("next/navigation", () => ({
    usePathname(): string {
        return mockUsePathname();
    },
}));

jest.mock("@/app/api/floorplan/floorplanAPI", () => ({
    createFloorplan(): Promise<string> {
        return mockCreateFloorplan();
    },
}));

const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

const mockSetUploadedFile = jest.fn();
const mockSetFloorPlanFile = jest.fn();
const mockReaderResult = jest.spyOn(
    global.FileReader.prototype,
    "result",
    "get",
);

const props = {
    uploadedFile: new File(["blobpart"], "image.jpg", { type: "image.jpg" }),
    setUploadedFile: mockSetUploadedFile,
    acceptedFileItems: [<li key="image.jpg">image.jpg - 8 bytes</li>],
    fileRejectionItems: [
        <li key="image.jpg">
            image.jpg - 8 bytes
            <ul>
                <li key="error-code">File Error Message 404</li>
            </ul>
        </li>,
    ],
    setFloorPlanFile: mockSetFloorPlanFile,
};

describe("AcceptedUploadForm", () => {
    beforeEach(() => {
        (global.URL.createObjectURL as jest.Mock) = jest.fn(
            () => "/mock-object-url",
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should render with no errors", () => {
        const { getByAltText, getByTestId, getByText } = render(
            <AcceptedUploadForm {...props} />,
        );

        expect(getByAltText("close icon")).toBeInTheDocument();
        expect(getByAltText("Uploaded content")).toBeInTheDocument();
        expect(getByTestId("upload-result-tray")).toBeInTheDocument();
        expect(getByText("Accept")).toBeInTheDocument();
        expect(getByText("Deny")).toBeInTheDocument();
    });

    test("should close the modal when close icon is clicked", () => {
        const { getByAltText, getByTestId, getByText } = render(
            <AcceptedUploadForm {...props} />,
        );

        const closeIcon = getByAltText("close icon");
        const uploadContent = getByAltText("Uploaded content");
        const uploadResultTray = getByTestId("upload-result-tray");
        const accept = getByText("Accept");
        const deny = getByText("Deny");

        act(() => {
            closeIcon.click();
        });

        expect(closeIcon).not.toBeInTheDocument();
        expect(uploadContent).not.toBeInTheDocument();
        expect(uploadResultTray).not.toBeInTheDocument();
        expect(accept).not.toBeInTheDocument();
        expect(deny).not.toBeInTheDocument();
        expect(mockSetUploadedFile).toHaveBeenCalledWith(null);
    });

    test("should call createFloorplan when Accept button is clicked", async () => {
        mockCreateFloorplan.mockResolvedValue("success");
        mockUsePathname.mockReturnValueOnce("some-path/some-path/1");
        mockReaderResult.mockImplementationOnce(() => "some-data,base64Image");
        const { getByText } = render(<AcceptedUploadForm {...props} />);

        act(() => {
            getByText("Accept").click();
            expect(mockSetUploadedFile).toHaveBeenCalledWith(null);
        });

        await waitFor(() => {
            expect(mockCreateFloorplan).toHaveBeenCalledTimes(1);
            expect(mockSetUploadedFile).toHaveBeenCalledWith(null);
        });
    });

    test("should call not createFloorplan when Deny button is clicked", () => {
        const { getByText } = render(<AcceptedUploadForm {...props} />);

        act(() => {
            getByText("Deny").click();
        });

        expect(mockCreateFloorplan).not.toHaveBeenCalled();
        expect(mockSetUploadedFile).toHaveBeenCalledWith(null);
    });

    test("should log error when factoryID is missing", async () => {
        mockUsePathname.mockReturnValueOnce("some-path/some-path");
        const { getByText } = render(<AcceptedUploadForm {...props} />);

        act(() => {
            getByText("Accept").click();
        });

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                "File or Factory ID is missing.",
            );
        });
    });

    test("should log error when base64image is missing", async () => {
        mockUsePathname.mockReturnValueOnce("some-path/some-path/1");
        mockReaderResult.mockImplementationOnce(() => null);
        const { getByText } = render(<AcceptedUploadForm {...props} />);

        act(() => {
            getByText("Accept").click();
            expect(mockSetUploadedFile).toHaveBeenCalledWith(null);
        });

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                "Failed to convert the file to base64.",
            );
        });
    });

    test("should log error when createFloorplan fails", async () => {
        mockUsePathname.mockReturnValueOnce("some-path/some-path/1");
        mockReaderResult.mockImplementationOnce(() => "some-data,base64Image");
        mockCreateFloorplan.mockRejectedValueOnce(new Error("404"));
        const { getByText } = render(<AcceptedUploadForm {...props} />);

        act(() => {
            getByText("Accept").click();
            expect(mockSetUploadedFile).toHaveBeenCalledWith(null);
        });

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                "Error uploading floor plan:",
                new Error("404"),
            );
        });
    });
});
