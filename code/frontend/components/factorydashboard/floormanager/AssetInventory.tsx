import React from "react";
import { Asset } from "@/app/types/types";
import AssetItem from "./AssetItem";

interface AssetInventoryProps {
    assets?: Asset[];
    setSelectedAsset: React.Dispatch<React.SetStateAction<Asset | null>>;
    selectedAsset: Asset | null;
}

const AssetInventory: React.FC<AssetInventoryProps> = ({
    assets = [],
    setSelectedAsset,
    selectedAsset,
}) => (
    <div className="asset-inventory relative z-10 w-full h-[55%] overflow-y-scroll text-white text-lg flex flex-row flex-wrap border-2 border-[#D7D9DF] border-solid">
        {assets.length > 0 ? (
            assets.map((asset) => (
                <AssetItem
                    key={asset.assetId}
                    asset={asset}
                    setSelectedAsset={setSelectedAsset}
                    selectedAsset={selectedAsset}
                />
            ))
        ) : (
            <p className="col-span-3 text-black opacity-[25%] p-2 pl-2.5">
                No assets found.
            </p>
        )}
    </div>
);
export default AssetInventory;
