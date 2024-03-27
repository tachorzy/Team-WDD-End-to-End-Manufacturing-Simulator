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
});