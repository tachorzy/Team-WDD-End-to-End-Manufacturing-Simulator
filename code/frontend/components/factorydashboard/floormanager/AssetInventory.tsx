import React, { useState } from "react";
import { Asset } from "@/app/types/types";
import AssetItem from "./AssetItem";

interface AssetInventoryProps {
    assets?: Asset[];
}

const AssetInventory: React.FC<AssetInventoryProps> = ({ assets }) => {
    const [assetList] = useState<Asset[]>(assets || []);

    return (
        <div className="asset-inventory relative z-10 w-full h-[55%] overflow-y-scroll text-white text-lg flex flex-row flex-wrap border-2 border-[#D7D9DF] border-solid">
            {assetList.length > 0 ? (
                assetList.map((asset) => (
                    <AssetItem key={asset.id} asset={asset} />
                ))
            ) : (
                <p className="col-span-3 text-black opacity-[25%] p-2 pl-2.5">
                    No assets found.
                </p>
            )}
        </div>
    );
};

export default AssetInventory;
