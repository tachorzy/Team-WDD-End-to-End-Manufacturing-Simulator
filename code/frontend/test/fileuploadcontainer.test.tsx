import React from "react";
import { createEvent, fireEvent, render } from "@testing-library/react";
import { useDropzone } from 'react-dropzone';
import FileUploadContainer from '../components/factorydashboard/floorplan/uploadcontainer/FileUploadContainer';
  
jest.mock('react-dropzone');

describe('FileUploadContainer', () => {  
    test('should accept valid files', () => {
        const mockAcceptedFiles = [{
            path: 'image.jpg',
            size: 5000,
            type: 'image/jpeg',
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
        expect(getByText(/image.jpg - 5000 bytes/)).not.toBeNull();
    });
});