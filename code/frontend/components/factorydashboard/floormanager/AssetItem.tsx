import React from "react";
import Image from "next/image";
import { Asset } from "@/app/types/types";

interface AssetItemProps {
    asset?: Asset | undefined;
    setSelectedAsset: React.Dispatch<React.SetStateAction<Asset | null>>;
}

const AssetItem: React.FC<AssetItemProps> = ({ asset, setSelectedAsset }) => (
    <button 
        type="button"
        onClick={() => setSelectedAsset(asset as Asset)}
        className="asset-item w-[5.25rem] h-[5.25rem] cursor-pointer items-center justify-center py-5 bg-[#F5F5F5] border-2 border-[#DDDDD] border-solid text-white p-2 rounded-sm m-2 text-[#494949]"
    >
        {asset ? (
            <>
                {/* <p className="text-xs text-[#494949] font-semibold  break-words">
                    Name: {asset.name}
                </p>
                <p className="mt-2 text-[#494949] text-xs break-words">
                    Description: {asset.description}
                </p> */}
                <Image
                    src={asset.image as string}
                    width={90}
                    height={90}
                    alt="Asset Image"
                    className="self-center"
                />
            </>
        ) : (
            <p>No asset data available</p>
        )}
    </button>
);

export default AssetItem;
