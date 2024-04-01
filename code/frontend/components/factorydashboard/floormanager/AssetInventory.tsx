import React, { useState } from "react";
import AssetItem from "./AssetItem";
import AddAssetForm from "./AddAssetForm";

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
    const [showAddAssetForm, setShowAddAssetForm] = useState(false);

    const handleAddAsset = (newAsset: Asset) => {
        setAssetList([...assetList, newAsset]);
    };

    return (
        <div className="asset-inventory bg-blue-500 text-white p-4 rounded-md text-lg w-2/3 ">
            <h2 className="">Asset Inventory</h2>
            {assetList.length > 0 ? (
                assetList.map((asset) => (
                    <AssetItem key={asset.id} asset={asset} />
                ))
            ) : (
                <p>No assets available</p>
            )}
            {showAddAssetForm && (
                <AddAssetForm
                    onAdd={handleAddAsset}
                    onClose={() => setShowAddAssetForm(false)}
                />
            )}
            <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => setShowAddAssetForm(true)}
            >
                Create Asset
            </button>
        </div>
    );
};

export default AssetInventory;
