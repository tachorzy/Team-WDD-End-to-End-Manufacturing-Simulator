import React from "react";
import Image from "next/image";
import { Asset } from "@/app/types/types";

interface AssetItemProps {
    asset?: Asset | undefined;
}

const AssetItem: React.FC<AssetItemProps> = ({ asset }) => (
    <div className="asset-item w-[5.25rem] h-[5.25rem] cursor-pointer bg-[#D9D9D9] opacity-[25%] border-2 border-[#767676] border-solid text-white p-0.5 rounded-sm m-2 text-[#494949]">
        {asset ? (
            <>
                <p className="text-xs text-[#494949] font-semibold  break-words">
                    Name: {asset.name}
                </p>
                <p className="mt-2 text-[#494949] text-xs break-words">
                    Description: {asset.description}
                </p>
                {/* <img
                    src={asset.image}
                    alt={asset.name}
                    className="mt-4 rounded-md"
                /> */}
            </>
        ) : (
            <p>No asset data available</p>
        )}
    </div>
);

export default AssetItem;
