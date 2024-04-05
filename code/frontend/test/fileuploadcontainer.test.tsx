/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import {
    createEvent,
    fireEvent,
    render,
    waitFor,
} from "@testing-library/react"; // Import screen here
import {
    useDropzone,
    DropzoneRootProps,
    DropzoneInputProps,
} from "react-dropzone";
import FileUploadContainer from "../components/factorydashboard/floorplan/uploadcontainer/FileUploadContainer";
import AcceptedUploadForm from "../components/factorydashboard/floorplan/uploadcontainer/AcceptedUploadForm";

jest.mock("react-dropzone", () => ({
    useDropzone: jest.fn(),
}));

jest.mock(
    "../components/factorydashboard/floorplan/uploadcontainer/AcceptedUploadForm",
    () => jest.fn(() => null),
);

describe("FileUploadContainer", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("FileUploadContainer ", () => {
        test("should handle no file being dropped", () => {
            (useDropzone as jest.Mock).mockReturnValue({
                getRootProps: () => ({}),
                getInputProps: () => ({}),
                acceptedFiles: [],
                fileRejections: [],
            });

            const { getByText } = render(
                <FileUploadContainer setFloorPlanFile={jest.fn()} />,
            );

            const input = getByText(
                /Click or drop your floor plan file here to upload./,
            ).parentElement;
            const dropEvent = createEvent.drop(input as Element);
            Object.defineProperty(dropEvent, "dataTransfer", {
                value: {
                    files: [],
                },
            });
            fireEvent(input as Element, dropEvent);

            expect(useDropzone).toHaveBeenCalled();
            expect(input).not.toBeNull();
        });

        test("should handle file being accepted", () => {
            const setFloorPlanFileMock = jest.fn();

            (useDropzone as jest.Mock).mockReturnValue({
                getRootProps: jest.fn() as jest.Mock<DropzoneRootProps>,
                getInputProps: jest.fn() as jest.Mock<DropzoneInputProps>,
                acceptedFiles: [
                    new File(["test content"], "test.png", {
                        type: "image/png",
                    }),
                ],
                fileRejections: [],
            });

            render(
                <FileUploadContainer setFloorPlanFile={setFloorPlanFileMock} />,
            );

            expect(AcceptedUploadForm).not.toHaveBeenCalled();

            setTimeout(() => {
                expect(AcceptedUploadForm).toHaveBeenCalled();
                expect(setFloorPlanFileMock).toHaveBeenCalledWith(
                    expect.any(File),
                );
            }, 0);
        });

        test("should handle file being declined", () => {
            const setFloorPlanFileMock = jest.fn();

            (useDropzone as jest.Mock).mockReturnValue({
                getRootProps: jest.fn() as jest.Mock<DropzoneRootProps>,
                getInputProps: jest.fn() as jest.Mock<DropzoneInputProps>,
                acceptedFiles: [],
                fileRejections: [
                    {
                        file: new File(["test content"], "test.txt", {
                            type: "text/plain",
                        }),
                        errors: [
                            {
                                code: "file-invalid-type",
                                message: "Invalid file type",
                            },
                        ],
                    },
                ],
            });

            const { getByText } = render(
                <FileUploadContainer setFloorPlanFile={setFloorPlanFileMock} />,
            );

            expect(AcceptedUploadForm).not.toHaveBeenCalled();
            expect(setFloorPlanFileMock).not.toHaveBeenCalled();
        });
    });
});
