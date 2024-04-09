/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { createEvent, fireEvent, render, act} from "@testing-library/react"; // Import screen here
import {
    useDropzone,
    DropzoneRootProps,
    DropzoneInputProps,
} from "react-dropzone";
import  FileUploadContainer from "../components/factorydashboard/floormanager/assetform/AssetUploadContainer"

jest.mock('react-dropzone', () => ({
    useDropzone: jest.fn(),
  }));


describe("AssetUploadContainer", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should handle no file being dropped", () => {
        (useDropzone as jest.Mock).mockReturnValue({
            getRootProps: () => ({}),
            getInputProps: () => ({}),
            acceptedFiles: [],
            fileRejections: [],
        });
        const { getByText } = render(
            <FileUploadContainer setAssetImageFile={jest.fn()} setFormData={jest.fn()}/>,
        );

        const input = getByText(
            /Click or drop your asset image here to upload./,
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
        const setAssetImageFile = jest.fn();

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
            <FileUploadContainer setAssetImageFile={jest.fn()} setFormData={jest.fn()}/>,
        );

        

        setTimeout(() => {
           
            expect(setAssetImageFile).toHaveBeenCalledWith(
                expect.any(File),
            );
        }, 0);
    });
    
/*
    test('handles file drop', () => {
        const setAssetImageFileMock = jest.fn();
        const setFormDataMock = jest.fn();
        const mockDropzone = { getRootProps: jest.fn(), getInputProps: jest.fn(), open: jest.fn() };
        (useDropzone as jest.Mock).mockReturnValue(mockDropzone);
      
        render(<FileUploadContainer setAssetImageFile={setAssetImageFileMock} setFormData={setFormDataMock}/>);
      
        const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
        const dataTransfer = {
          files: [file],
          items: [
            {
              kind: 'file',
              type: file.type,
              getAsFile: () => file,
            },
          ],
          types: ['Files'],
        };
      
        act(() => {
          fireEvent.drop(window, new DragEvent('drop', { dataTransfer }));
        });
      
        expect(useDropzone).toHaveBeenCalled();
        expect(setAssetImageFileMock).toHaveBeenCalledWith(file);
      });*/
});

