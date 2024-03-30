import React, { useState } from "react";
import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import { useDropzone } from 'react-dropzone';
import FileUploadContainer from '../components/factorydashboard/floorplan/uploadcontainer/FileUploadContainer';

jest.mock('react-dropzone');

describe('FileUploadContainer', () => {
    
    test('should handle no file being dropped', () => {
        (useDropzone as jest.Mock).mockReturnValue({
          getRootProps: () => ({}),
          getInputProps: () => ({}),
          acceptedFiles: [],
          fileRejections: [],
        });
      
        const { getByText } = render(
            <FileUploadContainer/>
        );

        const input = getByText(/Click or drop your floor plan file here to upload./).parentElement;
        const dropEvent = createEvent.drop(input as Element);
        Object.defineProperty(dropEvent, 'dataTransfer', {
          value: {
            files: [],
          },
        });
        fireEvent(input as Element, dropEvent);
      
        expect(useDropzone).toHaveBeenCalled();
        expect(input).not.toBeNull();
    });
});