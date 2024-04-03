import React, { useState } from "react";
import { Asset } from "@/app/types/types";
import AssetItem from "./AssetItem";

interface AssetInventoryProps {
    assets?: Asset[];
}

const AssetInventory: React.FC<AssetInventoryProps> = ({ assets = []}) => {

    return (
        <div className="asset-inventory  text-white p-4 rounded-md text-lg grid grid-cols-2 gap-4">
            <h2 className="col-span-2 text-black">
                Asset Inventory{" "}
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-MainBlue" />
            </h2>

            {assets.length > 0 ? (
                assets.map((asset) => (
                    <AssetItem key={asset.id} asset={asset} />
                ))
            ) : (
                <p className="col-span-3 text-black">No assets available</p>
            )}
        </div>
    );
};

export default AssetInventory;
