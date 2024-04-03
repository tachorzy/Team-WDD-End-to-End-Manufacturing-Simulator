"use client";

import { useEffect, useState } from "react";
import FactoryBio from "@/components/factorydashboard/FactoryBio";
import FactoryPageNavbar from "@/components/Navbar/FactoryPageNavbar";
import FileUploadContainer from "@/components/factorydashboard/floorplan/uploadcontainer/FileUploadContainer";
import AssetInventory from "@/components/factorydashboard/floormanager/AssetInventory";
import { usePathname } from "next/navigation";
import Blueprint from "@/components/factorydashboard/floorplan/blueprint/Blueprint";
import AssetMarker from "@/components/factorydashboard/floorplan/blueprint/AssetMarker";
import FloorManager from "@/components/factorydashboard/floormanager/FloorManager";
import { getFloorplan } from "@/app/api/floorplan/floorplanAPI";

export default function FactoryDashboard() {
    const [floorPlanFile, setFloorPlanFile] = useState<File | null>(null);
    const navigation = usePathname();
    const factoryId = navigation.split("/")[2];

    useEffect(() => {
        const fetchFloorplan = async () => {
            const floorplan = await getFloorplan(factoryId);
            if (floorplan && floorplan.imageData) {
                const response = await fetch(floorplan.imageData);
                const blob = await response.blob();
                const file = new File([blob], "floorplan", { type: blob.type });
                setFloorPlanFile(file);
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
                        <div className="flex flex-row  gap-0">
                            {floorPlanFile !== null ? (
                                <Blueprint imageFile={floorPlanFile} />
                            ) : (
                                <FileUploadContainer
                                    setFloorPlanFile={setFloorPlanFile}
                                />
                            )}
                            <FloorManager />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
