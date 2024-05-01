"use client";

import { useEffect, useState } from "react";
import FactoryPageNavbar from "@/components/Navbar/FactoryPageNavbar";
import Bento from "@/components/assetdashboard/Bento";
import { BackendConnector, GetConfig } from "@/app/api/_utils/connector";
import { Asset } from "@/app/types/types";
import ChartColumn from "@/components/assetdashboard/charts/ChartColumn";
import AssetTable from "@/components/factorydashboard/floormanager/AssetTable";

export default function Page({
    params,
}: {
    params: { factoryId: string; assetId: string };
}) {
    const { factoryId, assetId } = params;

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

    const inspectedAsset = assets.find((asset) => asset.assetId === assetId);

    return (
        <main className="flex flex-col bg-[#FAFAFA] min-h-screen mx-auto smooth-scroll">
            <div className="flex flex-col bg-[url('/background/Grid.svg')] min-h-screen rounded-3xl bg-opacity-[15%]">
                <FactoryPageNavbar pageId="Dashboard" factoryId={factoryId} />
            </div>
            {inspectedAsset === undefined ? 
                ( 
                    <div className="flex flex-col px-32 my-2 -mt-[40rem]">
                    <h2 className="text-3xl ml-4 font-bold leading-7 text-gray-900 sm:truncate sm:text-2xl sm:tracking-tight">
                        {"Asset Table"}
                    </h2>
                    <h2 className="text-xs ml-4 font-medium leading-7 text-[#494949] sm:truncate sm:text-lg sm:tracking-tight">
                        {"Click on an asset below to inspect its dashboard."}
                    </h2>                                  
                    <AssetTable factoryId={factoryId}/>
                    </div>
                )
                : 
                (
                    <div className="flex flex-col px-32 my-2 -mt-[35rem]">
                        <Bento asset={inspectedAsset as Asset} />
                        <ChartColumn />
                    </div>
                )
            }

            <div className="flex flex-col px-32 my-2 -mt-[35rem]">
                <Bento asset={inspectedAsset as Asset} />
                <ChartColumn />
            </div>
        </main>
    );
}
