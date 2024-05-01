"use client";

import { useEffect, useState } from "react";
import FactoryPageNavbar from "@/components/Navbar/FactoryPageNavbar";
import Bento from "@/components/assetdashboard/Bento";
import { BackendConnector, GetConfig } from "@/app/api/_utils/connector";
import { Asset } from "@/app/types/types";
import ChartColumn from "@/components/assetdashboard/charts/ChartColumn";

export default function Page({
    params,
}: {
    params: { factoryId: string; assetId: string };
}) {
    const { factoryId, assetId } = params;

    const [assets, setAssets] = useState<Asset[]>([]);

    console.log(`assetId: ${assetId}`);

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
            <div className="flex flex-col px-32 my-2 -mt-[35rem]">
                <Bento  asset={inspectedAsset as Asset} />
                <ChartColumn />
            </div>
        </main>
    );
}
