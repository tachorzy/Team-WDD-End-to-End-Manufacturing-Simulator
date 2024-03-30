import React from "react";
import { createEvent, fireEvent, getByTestId, render, within } from "@testing-library/react";
import { useDropzone } from "react-dropzone";
import AcceptedUploadForm from "../components/factorydashboard/floorplan/uploadcontainer/AcceptedUploadForm"; 
import UploadResultTray from "../components/factorydashboard/floorplan/uploadcontainer/UploadResultTray";
import FileUploadContainer from "../components/factorydashboard/floorplan/uploadcontainer/FileUploadContainer";

jest.mock("react-dropzone");

describe("AcceptedUploadForm", () => {
    const fileTypes = ['jpg', 'png', 'svg'];
    
    beforeEach(() => {
        (global.URL as any).createObjectURL = jest.fn(() => '/mock-object-url');
    });
      
    afterEach(() => {
        (global.URL as any).createObjectURL.mockReset();
    });

    test.each(fileTypes)('should accept valid files', (fileType) => {
        const mockUploadedFile = new File(['foo'], `image.${fileType}`, { type: `image/${fileType}` });
        const setUploadedFile = jest.fn();
        const acceptedFileItems: React.JSX.Element[] = [
            <li key={mockUploadedFile.name}>{`${mockUploadedFile.name} - ${mockUploadedFile.size} bytes`}</li>
        ];
        const fileRejectionItems: React.JSX.Element[] = [];

        const { getByText } = render(
            <AcceptedUploadForm 
                uploadedFile={mockUploadedFile} 
                setUploadedFile={setUploadedFile} 
                acceptedFileItems={acceptedFileItems} 
                fileRejectionItems={fileRejectionItems} 
            />
          );
    
        expect(getByText(new RegExp(`${mockUploadedFile.name} - ${mockUploadedFile.size} bytes`))).not.toBeNull();
    });

    test('should reject invalid files', () => {
        const mockInvalidUploadedFile = new File(['(⌐□_□)'], 'invalidfile.txt', { type: 'text/plain' });
        const setUploadedFile = jest.fn();
        const acceptedFileItems: React.JSX.Element[] = [];
        const fileRejectionItems: React.JSX.Element[] = [
            <li key={mockInvalidUploadedFile.name}>{`${mockInvalidUploadedFile.name} - ${mockInvalidUploadedFile.size} bytes`}</li>
        ];
        
        const { getByText } = render(
            <AcceptedUploadForm 
                uploadedFile={mockInvalidUploadedFile} 
                setUploadedFile={setUploadedFile} 
                acceptedFileItems={acceptedFileItems} 
                fileRejectionItems={fileRejectionItems} 
            />
        );

        expect(getByText(/Rejected files:/)).not.toBeNull();
        expect(getByText(new RegExp(`${mockInvalidUploadedFile.name} - ${mockInvalidUploadedFile.size} bytes`))).not.toBeNull();
    });

    // test('should reject files that exceed the maximum size', () => {
    //     const content = new Array(5000).fill('there are 2 bytes per character!').join('');
    //     const mockInvalidUploadedFile = new File([content], 'invalidfile.txt', { type: 'text/plain' });
    //     const setUploadedFile = jest.fn();
    //     const acceptedFileItems: React.JSX.Element[] = [];
    //     const fileRejectionItems: React.JSX.Element[] = [
    //         <li key={mockInvalidUploadedFile.name}>{`${mockInvalidUploadedFile.name} - ${mockInvalidUploadedFile.size} bytes`}</li>
    //     ];

    //     const { getByText } = render(
    //         <AcceptedUploadForm 
    //             uploadedFile={mockInvalidUploadedFile} 
    //             setUploadedFile={setUploadedFile} 
    //             acceptedFileItems={acceptedFileItems} 
    //             fileRejectionItems={fileRejectionItems} 
    //         />
    //     );

    //     expect(getByText(/Rejected files:/)).not.toBeNull();
    //     expect(getByText(new RegExp(`${mockInvalidUploadedFile.name} - ${mockInvalidUploadedFile.size} bytes`))).not.toBeNull();
    // });

});
