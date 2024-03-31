import React from "react";

interface Asset {
    id: string;
    name: string;
    description: string;
    image: string;
}

interface AssetItemProps {
    asset?: Asset | undefined;
}

const AssetItem: React.FC<AssetItemProps> = ({ asset }) => (
    <div className="asset-item bg-blue-500 text-white p-4 rounded-md">
        {asset ? (
            <>
                <p className="text-lg font-semibold">Name: {asset.name}</p>
                <p className="mt-2">Description: {asset.description}</p>
                <img
                    src={asset.image}
                    alt={asset.name}
                    className="mt-4 rounded-md"
                />
            </>
        ) : (
            <p>No asset data available</p>
        )}
    </div>
);

export default AssetItem;
