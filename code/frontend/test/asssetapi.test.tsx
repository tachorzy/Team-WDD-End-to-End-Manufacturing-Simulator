/**
 * @jest-environment jsdom
 */

import { createAsset,getAssetsForFactory } from "../app/api/assets/assetAPI";
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('assetAPI', () => {
  const BASE_URL = process.env.NEXT_PUBLIC_AWS_ENDPOINT;

  describe('createAsset', () => {
    it('should successfully create an asset', async () => {
      const mockAsset = {
        name: 'Test Asset',
        description: 'Test Description',
        factoryId: 'factory123',
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockAsset));

      const result = await createAsset(mockAsset);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/assets`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(mockAsset),
      });
      expect(result).toEqual(mockAsset);
    });
  });

  describe('getAssetsForFactory', () => {
    it('should fetch assets for a given factory ID', async () => {
      const factoryId = 'factory123';
      const mockAssets = [
        { assetId: '1', name: 'Asset 1', factoryId },
        { assetId: '2', name: 'Asset 2', factoryId },
      ];

      fetchMock.mockResponseOnce(JSON.stringify(mockAssets));

      const result = await getAssetsForFactory(factoryId);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/assets?factoryId=${factoryId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockAssets);
    });
  });
});
