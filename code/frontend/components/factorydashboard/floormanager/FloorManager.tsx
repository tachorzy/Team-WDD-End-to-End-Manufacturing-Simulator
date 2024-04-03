import React, { useState } from "react";
import { Asset } from "@/app/types/types";
import Image from "next/image";
import AssetInventory from "./AssetInventory";
import AddAssetForm from "./assetform/AddAssetForm";
import InventoryNavBar from "./InventoryNavBar";
import AssetBio from "./AssetBio";
import AssetMarker from "../floorplan/blueprint/AssetMarker";

interface FloorManagerProps {
    setAssetMarkers: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
}

const FloorManager: React.FC<FloorManagerProps> = (props) => {
    const { setAssetMarkers } = props;

    // State to manage list of assets
    const [assets, setAssets] = useState<Asset[]>([]);
    const [showAddAssetForm, setShowAddAssetForm] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    // Function to add new asset to the list
    const handleAddAsset = (newAsset: Asset) => {
        setAssets((prevAssets) => [...prevAssets, newAsset]);
    };

    return (
        <div className="floor-manager items-center w-[37.5%] min-h-[32rem] flex flex-col gap-y-1 py-6 text-black bg-white rounded-xl p-1 px-3 shadow-sm ring-2 ring-inset ring-gray-300">
            <div className="flex items-center justify-center gap-x-3 align-bottom">
                <Image
                    src="/icons/floorplan/blueprintIcon.svg"
                    width={30}
                    height={30}
                    alt="brand"
                    className=""
                />
                <h2 className="text-xl font-semibold">Floor Manager</h2>
            </div>
            <InventoryNavBar />
            {!showAddAssetForm && (
                <AssetInventory
                    assets={assets}
                    setSelectedAsset={setSelectedAsset}
                    selectedAsset={selectedAsset}
                />
            )}

            {showAddAssetForm && (
                <AddAssetForm
                    onAdd={handleAddAsset}
                    onClose={() => setShowAddAssetForm(false)}
                />
            )}
            <div className="flex flex-row border-b-2 border-gray-100 w-full self-start gap-x-4">
                <button
                    type="button"
                    className="w-32 h-8 flex-row self-start my-1.5 items-center rounded-xl bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => setShowAddAssetForm(true)}
                >
                    Add Asset
                </button>
                {selectedAsset && (
                    <button
                        type="button"
                        className="w-32 h-8 flex-row self-start my-1.5 items-center rounded-xl bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() => {
                            setAssetMarkers((prevMarkers: JSX.Element[]) => [
                                ...prevMarkers,
                                <AssetMarker asset={selectedAsset} />,
                            ]);
                        }}
                    >
                        Place Asset
                    </button>
                )}
            </div>
            <AssetBio asset={selectedAsset as Asset} />
        </div>
    );
};

export default FloorManager;