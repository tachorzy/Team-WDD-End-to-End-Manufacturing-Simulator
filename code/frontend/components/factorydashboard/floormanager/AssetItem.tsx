import React from "react";
import Image from "next/image";
import { Asset } from "@/app/types/types";

interface AssetItemProps {
    asset?: Asset | undefined;
}

const AssetItem: React.FC<AssetItemProps> = ({ asset }) => (
    <div className="asset-item bg-blue-400 text-white p-4 rounded-md m-2">
        {asset ? (
            <>
                <p className="text-lg font-semibold  break-words">
                    Name: {asset.name}
                </p>
                <p className="mt-2  break-words">
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
