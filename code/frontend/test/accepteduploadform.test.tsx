import React from "react";
import { render } from "@testing-library/react";
import AcceptedUploadForm from "../components/factorydashboard/floorplan/uploadcontainer/AcceptedUploadForm";

jest.mock("react-dropzone");

describe("AcceptedUploadForm", () => {
    const fileTypes = ["jpg", "png", "svg"];

    beforeEach(() => {
        (global.URL.createObjectURL as jest.Mock) = jest.fn(
            () => "/mock-object-url",
        );
    });

    afterEach(() => {
        (global.URL.createObjectURL as jest.Mock).mockReset();
    });

    test.each(fileTypes)("should accept valid files", (fileType) => {
        const mockUploadedFile = new File(["foo"], `image.${fileType}`, {
            type: `image/${fileType}`,
        });
        const setUploadedFile = jest.fn();
        const acceptedFileItems: React.JSX.Element[] = [
            <li
                key={mockUploadedFile.name}
            >{`${mockUploadedFile.name} - ${mockUploadedFile.size} bytes`}</li>,
        ];
        const fileRejectionItems: React.JSX.Element[] = [];

        const { getByText } = render(
            <AcceptedUploadForm
                uploadedFile={mockUploadedFile}
                setUploadedFile={setUploadedFile}
                acceptedFileItems={acceptedFileItems}
                fileRejectionItems={fileRejectionItems}
                setFloorPlanFile={jest.fn()}
            />,
        );

        expect(
            getByText(
                new RegExp(
                    `${mockUploadedFile.name} - ${mockUploadedFile.size} bytes`,
                ),
            ),
        ).not.toBeNull();
    });

    test("should reject invalid files", () => {
        const mockInvalidUploadedFile = new File(
            ["(⌐□_□)"],
            "invalidfile.txt",
            { type: "text/plain" },
        );
        const setUploadedFile = jest.fn();
        const acceptedFileItems: React.JSX.Element[] = [];
        const fileRejectionItems: React.JSX.Element[] = [
            <li
                key={mockInvalidUploadedFile.name}
            >{`${mockInvalidUploadedFile.name} - ${mockInvalidUploadedFile.size} bytes`}</li>,
        ];

        const { getByText } = render(
            <AcceptedUploadForm
                uploadedFile={mockInvalidUploadedFile}
                setUploadedFile={setUploadedFile}
                acceptedFileItems={acceptedFileItems}
                fileRejectionItems={fileRejectionItems}
                setFloorPlanFile={jest.fn()}
            />,
        );

        expect(getByText(/Rejected files:/)).not.toBeNull();
        expect(
            getByText(
                new RegExp(
                    `${mockInvalidUploadedFile.name} - ${mockInvalidUploadedFile.size} bytes`,
                ),
            ),
        ).not.toBeNull();
    });
});
