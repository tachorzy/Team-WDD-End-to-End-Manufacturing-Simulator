import React from 'react';
import AssetItem from './AssetItem';

interface Asset {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface AssetInventoryProps {
  assets: Asset[];
}

const AssetInventory: React.FC<AssetInventoryProps> = ({ assets }) => {
  return (
    <div className="asset-inventory bg-blue-500 text-white p-4 rounded-md">
      <h2>Asset Inventory</h2>
      {assets.length > 0 ? (
        assets.map(asset => (
          <AssetItem key={asset.id} asset={asset} />
        ))
      ) : (
        <p>No assets available</p>
      )}
    </div>
  );
};

export default AssetInventory;