/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NextServerConnector, PostConfig } from "@/app/api/_utils/connector";
import { Floorplan } from "@/app/api/_utils/types";
import AcceptedUploadForm from "../components/factorydashboard/floorplan/uploadcontainer/AcceptedUploadForm";

const mockUsePathname = jest.fn(() => "");

jest.mock("next/navigation", () => ({
    usePathname: () => mockUsePathname(),
}));

jest.mock("@/app/api/_utils/connector", () => ({
    NextServerConnector: {
        post: jest.fn(),
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

// meow :3
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
        jest.clearAllMocks();
        (global.URL.createObjectURL as jest.Mock) = jest.fn(
            () => "/mock-object-url",
        );
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2024-01-01"));
    });

    afterAll(() => {
        jest.useRealTimers();
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
        mockUsePathname.mockReturnValueOnce("some-path/some-path/1");
        mockReaderResult.mockImplementationOnce(() => "some-data,base64Image");
        const mockPost = (
            NextServerConnector.post as jest.Mock
        ).mockResolvedValue({});

        const mockConfig: PostConfig<Floorplan> = {
            resource: "floorplan",
            payload: {
                factoryId: "1",
                dateCreated: "2024-01-01T00:00:00.100Z",
                floorplanId: "1",
                imageData: "base64Image",
            },
        };

        const { getByText } = render(<AcceptedUploadForm {...props} />);

        act(() => {
            getByText("Accept").click();
            expect(mockSetUploadedFile).toHaveBeenCalledWith(null);
        });

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith(mockConfig);
            expect(mockSetUploadedFile).toHaveBeenCalledWith(null);
        });
    });

    test("should not call createFloorplan when Deny button is clicked", () => {
        const mockPost = (
            NextServerConnector.post as jest.Mock
        ).mockResolvedValue({});

        const { getByText } = render(<AcceptedUploadForm {...props} />);

        act(() => {
            getByText("Deny").click();
            expect(mockSetUploadedFile).toHaveBeenCalledWith(null);
        });

        expect(mockPost).not.toHaveBeenCalled();
        expect(mockSetUploadedFile).toHaveBeenCalledWith(null);
    });

    test("should log error when factoryID or File is missing", async () => {
        mockUsePathname.mockReturnValueOnce("some-path/some-path");
        const { getByText } = render(<AcceptedUploadForm {...props} />);

        act(() => {
            getByText("Accept").click();
            expect(mockSetUploadedFile).toHaveBeenCalledWith(null);
        });

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                "File or Factory ID is missing.",
            );
        });
    });

    test("should log error when failed to convert file to base64", async () => {
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
        (NextServerConnector.post as jest.Mock).mockRejectedValueOnce(
            new Error("Fetch error: 404"),
        );

        const { getByText } = render(<AcceptedUploadForm {...props} />);

        act(() => {
            getByText("Accept").click();
            expect(mockSetUploadedFile).toHaveBeenCalledWith(null);
        });

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                "Error uploading floor plan:",
                new Error("Fetch error: 404"),
            );
        });
    });

    test("should log error when there is an error reading the file", async () => {
        mockUsePathname.mockReturnValueOnce("some-path/some-path/1");
        mockReaderResult.mockImplementationOnce(() => "some-data,base64Image");

        interface MockFileReader {
            readAsDataURL: () => void;
            onerror: (error: Error) => void;
        }

        window.FileReader = jest.fn().mockImplementation(() => {
            const mockFileReader: MockFileReader = {
                readAsDataURL() {
                    setTimeout(
                        () => mockFileReader.onerror(new Error("Mock error")),
                        0,
                    );
                },
                onerror: () => {},
            };
            return mockFileReader;
        }) as unknown as typeof FileReader;

        const { getByText } = render(<AcceptedUploadForm {...props} />);

        act(() => {
            getByText("Accept").click();
            expect(mockSetUploadedFile).toHaveBeenCalledWith(null);
        });

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                "There was an error reading the file",
            );
        });
    });
});
