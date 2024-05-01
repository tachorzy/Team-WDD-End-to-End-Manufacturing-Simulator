import { Asset, Model } from "@/app/api/_utils/types";
import { BackendConnector, GetConfig } from "@/app/api/_utils/connector";
import React, { useEffect, useState } from "react";

const AssetOverview = (props: { asset: Asset }) => {
    const { asset } = props;
    
    const [models, setModels] = useState<Model[]>([]);


    const assetName = asset?.name;
    const assetModelId = asset?.modelId;
    const assetDescription = asset?.description;


    const factoryId = asset?.factoryId;

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const config: GetConfig = {
                    resource: "models",
                    params: { factoryId },
                };
                const newModels = await BackendConnector.get<Model[]>(config);

                // Check if newModels is defined and has at least one element
                if (newModels && newModels.length > 0) {
                    setModels(newModels);
                } else {
                    // Handle the case when newModels is undefined or an empty array
                    console.error("No models returned from backend");
                }
            } catch (error) {
                console.error("Failed to fetch models:", error);
            }
        };

        if (factoryId) {
            fetchModels();
        }
    }, [factoryId]);

    const assetModel = models.filter((model) => model.modelId === assetModelId)[0];


    return (
        <div className="flex flex-col items-center gap-x-2 mb-3 gap-y-2 border-2 border-[#E2E4EA] bg-[#FAFAFA] rounded-lg pt-4 w-80 h-64 overflow-y-scroll">
            <h1 className="text-[#494949] text-lg font-medium">
                Asset Overview
            </h1>
            <div className="mt-2 gap-y-2 px-2 ">
                <h1 className="font-medium text-xs text-[#494949] leading-relaxed">
                    <span className="font-semibold">Asset Name:</span> {assetName}
                </h1>
                <div className="font-medium text-xs text-[#494949] leading-relaxed">
                    <span className="font-semibold">Asset Model:</span> {assetModel?.attributes[0].value}
                    {assetModel?.attributes.map((attribute, index) => {
                        if (index === 0) return;

                        return (
                            <div> 
                                <span className="font-semibold">{attribute.name}</span>
                                {attribute.value}
                            </div>
                        );
                    })}
                    <details className="font-bold text-xs text-[#494949] leading-relaxed">
                        <summary className="font-bold underline">Asset Properties:</summary>
                        {assetModel?.properties.map((property) => (
                            <ul>
                                <li className="font-semibold list-disc list-inside pl-3">{`${property.name} (${property.unit})`}</li>
                            </ul>
                        ))}
                    </details>                    
                </div>

            </div>
        </div>
    );
};
export default AssetOverview;
