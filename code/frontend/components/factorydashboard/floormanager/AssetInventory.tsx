import React, { useState } from "react";
import AssetItem from "./AssetItem";
import AddAsset from "./AddAsset";

interface Asset {
    id: string;
    name: string;
    description: string;
    image: string;
}

interface AssetInventoryProps {
    assets?: Asset[];
}

const AssetInventory: React.FC<AssetInventoryProps> = ({ assets }) => {
    const [assetList, setAssetList] = useState<Asset[]>(assets || []); // Initialize with empty array if assets prop is undefined

    const handleAddAsset = (newAsset: Asset) => {
        setAssetList([...assetList, newAsset]);
    };

    return (
        <div className="asset-inventory bg-blue-400 text-white p-4 rounded-md text-lg">
            <h2>Asset Inventory</h2>
            {assetList.length > 0 ? (
                assetList.map((asset) => (
                    <AssetItem key={asset.id} asset={asset} />
                ))
            ) : (
                <p>No assets available</p>
            )}
            <AddAsset onAdd={handleAddAsset} />
        </div>
    );
};

export default AssetInventory;
