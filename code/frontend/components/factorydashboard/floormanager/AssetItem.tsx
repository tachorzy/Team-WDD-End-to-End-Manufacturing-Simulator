import React from "react";
import Image from "next/image";
import { Asset } from "@/app/types/types";

interface AssetItemProps {
    asset?: Asset | undefined;
    setSelectedAsset: React.Dispatch<React.SetStateAction<Asset | null>>;
    selectedAsset: Asset | null;
}

const AssetItem: React.FC<AssetItemProps> = ({
    asset,
    setSelectedAsset,
    selectedAsset,
}) => (
    <button
        type="button"
        onClick={() => setSelectedAsset(asset as Asset)}
        className={`${asset === selectedAsset ? "border-blue-200" : "border-[#DDDDD]"} w-[5.25rem] h-[5.25rem] cursor-pointer items-center justify-center py-5 bg-[#F5F5F5] border-2 border-solid text-white p-2 rounded-sm m-2 text-[#494949]`}
    >
        {asset ? (
            <Image
                src={
                    asset.image
                        ? asset.image
                        : "/icons/floorplan/placeholder-asset.svg"
                }
                width={90}
                height={90}
                alt={`${asset.name} Asset Image`}
                className="self-center justify-center"
            />
        ) : (
            <p>No asset data available</p>
        )}
    </button>
);

export default AssetItem;
