/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, waitFor } from "@testing-library/react";
import FileUploadContainer from "../components/factorydashboard/floorplan/uploadcontainer/FileUploadContainer";

interface MockAcceptedUploadFormProps {
    acceptedFileItems: React.JSX.Element[];
    fileRejectionItems: React.JSX.Element[];
}

const mockAcceptedUploadForm = jest.fn();
jest.mock(
    "../components/factorydashboard/floorplan/uploadcontainer/AcceptedUploadForm",
    () => {
        const MockAcceptedUploadForm = (props: MockAcceptedUploadFormProps) => {
            mockAcceptedUploadForm(props);

            const { acceptedFileItems, fileRejectionItems } = props;

            return (
                <div>
                    <div data-testid="accpetedfiles">
                        <h1>Accepted files:</h1>
                        <ul>{acceptedFileItems}</ul>
                    </div>
                    <div data-testid="rejectedfiles">
                        <h1>Rejected files:</h1>
                        <ul>{fileRejectionItems}</ul>
                    </div>
                </div>
            );
        };
        MockAcceptedUploadForm.displayName = "AcceptedUploadForm";
        return MockAcceptedUploadForm;
    },
);

describe("FileUploadContainer", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should render without error", () => {
        const { getByTestId, getByText } = render(
            <FileUploadContainer setFloorPlanFile={jest.fn()} />,
        );

        expect(getByTestId("dropzone")).toBeInTheDocument();
        expect(getByTestId("drop-input")).toBeInTheDocument();
        expect(
            getByText("Click or drop your floor plan file here to upload."),
        ).toBeInTheDocument();
    });

    test.each([
        ["jpeg", "jpeg"],
        ["png", "png"],
        ["svg", "svg+xml"],
    ])("should handle %s file drop", async (filename, filetype) => {
        const { getByTestId } = render(
            <FileUploadContainer setFloorPlanFile={jest.fn()} />,
        );

        const file = new File([new ArrayBuffer(69)], `floorplan.${filename}`, {
            type: `image/${filetype}`,
        });

        const dropInput = getByTestId("drop-input");
        Object.defineProperty(dropInput, "files", {
            value: [file],
        });
        fireEvent.drop(dropInput);

        await waitFor(() => {
            expect(getByTestId("accpetedfiles")).toHaveTextContent(
                `Accepted files:${file.name} - ${file.size} bytes`,
            );
        });
    });

    test("should handle no accpedted file uploaded", async () => {
        const { getByTestId } = render(
            <FileUploadContainer setFloorPlanFile={jest.fn()} />,
        );

        const file = new File([new ArrayBuffer(69)], "floorplan.txt", {
            type: "text/plain",
        });

        const dropInput = getByTestId("drop-input");
        Object.defineProperty(dropInput, "files", {
            value: [file],
        });
        fireEvent.drop(dropInput);

        await waitFor(() => {
            expect(mockAcceptedUploadForm).not.toHaveBeenCalled();
        });
    });

    test("should handle file being declined", async () => {
        const { getByTestId } = render(
            <FileUploadContainer setFloorPlanFile={jest.fn()} />,
        );

        const accpedtedFile = new File([new ArrayBuffer(69)], "floorplan.png", {
            type: "image/png",
        });
        const rejectedFile = new File([new ArrayBuffer(69)], "floorplan.txt", {
            type: "text/plain",
        });

        const dropInput = getByTestId("drop-input");
        Object.defineProperty(dropInput, "files", {
            value: [accpedtedFile, rejectedFile],
        });
        fireEvent.drop(dropInput);

        await waitFor(() => {
            expect(getByTestId("accpetedfiles")).toHaveTextContent(
                "Accepted files:floorplan.png - 69 bytes",
            );
            expect(getByTestId("rejectedfiles")).toHaveTextContent(
                "Rejected files:floorplan.txt - 69 bytes",
            );
        });
    });
});
