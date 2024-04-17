import React, { useState, useEffect, useContext } from "react";
import { Asset,Property,Attribute } from "@/app/api/_utils/types";
import { BackendConnector, GetConfig } from "@/app/api/_utils/connector";
import { Context } from "../CreateModelForm";

interface Context {
    factoryId: string;
    modelId: string;
    asset: Asset;
    setAsset: React.Dispatch<React.SetStateAction<Asset | undefined>>;
    attributes: Attribute[];
    setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
    properties: Property[];
    setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
    nextPage: () => void;
}

const AssetField = ({ factoryId }: { factoryId: string }) => {
    const { asset, setAsset } = useContext(Context) as Context;  // Use setAsset to update the context

    const [assets, setAssets] = useState<Asset[]>([]);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const config: GetConfig = {
                    resource: "assets",
                    params: { factoryId },
                };
                const newAssets = await BackendConnector.get<Asset[]>(config);
                setAssets(newAssets);
            } catch (error) {
                console.error("Failed to fetch assets:", error);
            }
        };

        if (factoryId) {
            fetchAssets();
        }
    }, [factoryId]);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const assetId = event.target.value;
        const selectedAsset = assets.find(a => a.assetId === assetId);  
        setAsset(selectedAsset);  
    };

    return (
        <div className="">
            <h1 className="text-2xl font-semibold text-gray-900">Select Asset to model</h1>
            <div className="flex flex-col gap-y-0.5">
                <div className="flex flex-row gap-x-1">
                   <select value={asset?.assetId || ""} onChange={handleSelectChange} className="form-select bg-gray-200 p-3 rounded-lg placeholder-gray-400 text-[#494949] w-full">
                   <option value="" disabled>Select</option>
                        {assets.map((asset) => (
                            <option key={asset.assetId} value={asset.assetId}>
                                {asset.name}
                            </option>
                        ))}
                   </select>
                </div>
            </div>
        </div>
    );
};

export default AssetField;
