import React, { useState } from "react";
import { Asset } from "@/app/types/types";
import Image from "next/image";
import AssetInventory from "./AssetInventory";
import AddAssetForm from "./AddAssetForm";
import InventoryNavBar from "./InventoryNavBar";

const FloorManager: React.FC = () => {
    // State to manage list of assets
    const [assets, setAssets] = useState<Asset[]>([]);
    const [showAddAssetForm, setShowAddAssetForm] = useState(false);
    // Function to add new asset to the list
    const handleAddAsset = (newAsset: Asset) => {
        setAssets((prevAssets) => [...prevAssets, newAsset]);
    };

    return (
        <div className="floor-manager items-center w-[37.5%] min-h-[30rem] flex flex-col gap-y-1 py-6 text-black bg-white rounded-xl p-1 px-3 m-2 shadow-sm ring-2 ring-inset ring-gray-300">
            <div className="flex items-center justify-center gap-x-3 align-bottom">
                <Image
                    src="/icons/floorplan/blueprintIcon.svg"
                    width={30}
                    height={30}
                    alt="brand"
                    className=""
                />
                <h2 className="text-xl font-semibold">Floor Manager</h2>
                <button
                    type="button"
                    className="w-24 h-8 flex-row items-center rounded-xl bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => setShowAddAssetForm(true)}
                >
                    Add Asset
                </button>
            </div>
            <InventoryNavBar />
            {!showAddAssetForm && <AssetInventory assets={assets} />}

            {showAddAssetForm && (
                <AddAssetForm
                    onAdd={handleAddAsset}
                    onClose={() => setShowAddAssetForm(false)}
                />
            )}
        </div>
    );
};

export default FloorManager;
