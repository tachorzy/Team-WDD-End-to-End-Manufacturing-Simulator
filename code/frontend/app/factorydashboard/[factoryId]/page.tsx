"use client";

import React, { useEffect, useState } from "react";
import FactoryBio from "@/components/factorydashboard/FactoryBio";
import FactoryPageNavbar from "@/components/Navbar/FactoryPageNavbar";
import FileUploadContainer from "@/components/factorydashboard/floorplan/uploadcontainer/FileUploadContainer";
import Blueprint from "@/components/factorydashboard/floorplan/blueprint/Blueprint";
import FloorManager from "@/components/factorydashboard/floormanager/FloorManager";
import { GetConfig, NextServerConnector } from "@/app/api/_utils/connector";
import { Floorplan } from "@/app/api/_utils/types";

export const Context = React.createContext({});

export default function FactoryDashboard({
    params,
}: {
    params: { factoryId: string };
}) {
    const [floorPlanFile, setFloorPlanFile] = useState<File | null>(null);
    const [assetMarkers, setAssetMarkers] = useState<JSX.Element[]>([]);
    const { factoryId } = params;

    useEffect(() => {
        const fetchFloorplan = async () => {
            if (factoryId) {
                try {
                    const config: GetConfig = {
                        resource: "floorplan",
                        params: {
                            id: factoryId,
                        },
                    };

                    const data = await NextServerConnector.get(config);
                    const floorplan = data as Floorplan;

                    if (floorplan && floorplan.imageData) {
                        const blob = await fetch(floorplan.imageData).then(
                            (res) => res.blob(),
                        );
                        const file = new File([blob], "floorplan", {
                            type: blob.type,
                        });
                        setFloorPlanFile(file);
                    }
                } catch (error) {
                    console.error("Error fetching floorplan:", error);
                }
            }
        };

        fetchFloorplan();
    }, [factoryId]);

    return (
        <main className="flex flex-col bg-[#FAFAFA] min-h-screen mx-auto smooth-scroll">
            <div className="flex flex-col bg-[url('/background/Grid.svg')] min-h-screen rounded-3xl bg-opacity-[15%]">
                <FactoryPageNavbar
                    pageId="Factory Floor"
                    factoryId={factoryId}
                />
                <div className="px-32">
                    <div className="flex flex-col gap-y-5 mt-8 mx-auto overflow-hidden max-h-screen">
                        <FactoryBio factoryId={factoryId} />
                        <div className="flex flex-row  gap-x-12">
                            {floorPlanFile !== null ? (
                                <Blueprint
                                    imageFile={floorPlanFile}
                                    assetMarkers={assetMarkers}
                                />
                            ) : (
                                <FileUploadContainer
                                    setFloorPlanFile={setFloorPlanFile}
                                />
                            )}
                            <FloorManager
                                setAssetMarkers={setAssetMarkers}
                                factoryId={factoryId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
