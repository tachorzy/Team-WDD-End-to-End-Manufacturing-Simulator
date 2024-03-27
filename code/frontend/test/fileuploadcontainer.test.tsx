import React from "react";
import { createEvent, fireEvent, render } from "@testing-library/react";
import { useDropzone } from 'react-dropzone';
import FileUploadContainer from '../components/factorydashboard/floorplan/uploadcontainer/FileUploadContainer';
  
jest.mock('react-dropzone');

describe('FileUploadContainer', () => {
    
    const fileTypes = ['jpg', 'png', 'svg'];

    test.each(fileTypes)('should accept valid files', (fileType) => {
        const mockAcceptedFiles = [{
            path: `image.${fileType}`,
            size: 5000,
            type: `image/${fileType}`,
        }];
        
        (useDropzone as jest.Mock).mockReturnValue({
            getRootProps: () => ({}),
            getInputProps: () => ({}),
            acceptedFiles: mockAcceptedFiles,
            fileRejections: [],
        });

        const { getByText } = render(<FileUploadContainer />);
        const input = getByText(/Click or drop your floor plan file here to upload./).parentElement;
        const dropEvent = createEvent.drop(input as Element);
        Object.defineProperty(dropEvent, 'dataTransfer', {
          value: {
            files: mockAcceptedFiles,
          },
        });
        fireEvent(input as Element, dropEvent);
    
        expect(useDropzone).toHaveBeenCalled();
        expect(getByText(new RegExp(`image.${fileType} - 5000 bytes`))).not.toBeNull();
    });

    test('should reject invalid files', () => {
        const mockRejectedFiles = [{
            file: {
                path: 'invalidfile.txt',
                size: 5000,
                type: 'text/plain',
            },
            errors: [{
                code: 'file-invalid-type',
                message: 'File type must be image/jpeg, image/png, or image/svg+xml',
            }],
        }];

        (useDropzone as jest.Mock).mockReturnValue({
            getRootProps: () => ({}),
            getInputProps: () => ({}),
            acceptedFiles: [],
            fileRejections: mockRejectedFiles,
        });

        const { getByText } = render(<FileUploadContainer />);
        const input = getByText(/Click or drop your floor plan file here to upload./).parentElement;
        const dropEvent = createEvent.drop(input as Element);
        Object.defineProperty(dropEvent, 'dataTransfer', {
          value: {
            files: mockRejectedFiles,
          },
        });
        fireEvent(input as Element, dropEvent);

        expect(useDropzone).toHaveBeenCalled();
        expect(getByText(/invalidfile.txt - 5000 bytes/)).not.toBeNull();
    });

    test('should not accept multiple files', () => {
        const mockAcceptedFiles = [{
            path: 'image.jpg',
            size: 5000,
            type: 'image/jpeg',
        }];
    
        const mockRejectedFiles = [{
        file: {
            path: 'image.png',
            size: 5000,
            type: 'image/png',
        },
        errors: [{
                code: 'too-many-files',
                message: 'You can only upload one file',
            }],
        }];

        (useDropzone as jest.Mock).mockReturnValue({
            getRootProps: () => ({}),
            getInputProps: () => ({}),
            acceptedFiles: mockAcceptedFiles,
            fileRejections: mockRejectedFiles,
        });

        const { getByText } = render(<FileUploadContainer />);
        const input = getByText(/Click or drop your floor plan file here to upload./).parentElement;
        const dropEvent = createEvent.drop(input as Element);
        Object.defineProperty(dropEvent, 'dataTransfer', {
            value: {
              files: [...mockAcceptedFiles, ...mockRejectedFiles.map(rejection => rejection.file)],
            },
        });
        fireEvent(input as Element, dropEvent);

        expect(useDropzone).toHaveBeenCalled();
        expect(getByText(/image.jpg - 5000 bytes/)).not.toBeNull();
        expect(getByText(/image.png - 5000 bytes/)).not.toBeNull();
        expect(getByText(/You can only upload one file/)).not.toBeNull();

    })



});