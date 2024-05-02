import React from 'react';
import { render, act, screen} from '@testing-library/react';
import ModelField from '../components/factorydashboard/floormanager/assetform/ModelField';
import { BackendConnector } from "@/app/api/_utils/connector";
import "@testing-library/jest-dom";

jest.mock("@/app/api/_utils/connector", () => ({
    BackendConnector: {
        get: jest.fn(),
    },
    GetConfig: {}, // Mock GetConfig if needed
}));

const mockedBackendConnector = BackendConnector as jest.Mocked<
    typeof BackendConnector
>;

describe('ModelField', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    test('fetches models when factoryId changes', async () => {
        const factoryId = 'someFactoryId';
        const setModelId = jest.fn();
        const setFormData = jest.fn();
        const mockModels = [ {
            modelId: "model-1",
            attributes: [{ name: "attr1", value: "value1" }],
            properties: [{ name: "prop1", unit: "unit1" }],
            factoryId: "someFactoryId",
        },];
        mockedBackendConnector.get.mockResolvedValueOnce(mockModels);
        // eslint-disable-next-line @typescript-eslint/require-await    
        await act(async () => {
            render(
                <ModelField
                    factoryId={factoryId}
                    setModelId={setModelId}
                    setFormData={setFormData}
                />
            );
        });

        const selectElement = screen.getByTestId('model-select');
        expect(selectElement).toBeInTheDocument();

        const optionElement = screen.getByTestId('model-option-model-1');
        expect(optionElement).toBeInTheDocument();
    });

    test('logs error message when fetching models fails', async () => {
        const factoryId = 'someFactoryId';
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

     
        mockedBackendConnector.get.mockRejectedValueOnce(new Error('Failed to fetch models'));
        // eslint-disable-next-line @typescript-eslint/require-await
        await act(async () => {
            render(
                <ModelField
                    factoryId={factoryId}
                    setModelId={() => {}}
                    setFormData={() => {}}
                />
            );
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch models:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });

    
});
